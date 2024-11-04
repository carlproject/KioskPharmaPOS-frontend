import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { doc, getDoc, updateDoc, writeBatch } from "firebase/firestore";
import { db } from "../../config/firebase";

const PaymentSuccess= () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = new URLSearchParams(location.search).get("orderId");

  const handlePurchaseAndUpdateStock = async (userId) => {
    const batch = writeBatch(db);
    try {
      const userCartRef = doc(db, 'carts', userId);
      const userCartSnapshot = await getDoc(userCartRef);
  
      if (!userCartSnapshot.exists()) {
        console.warn(`No cart found for userId: ${userId}`);
        return; 
      }
  
      const cartData = userCartSnapshot.data();
      const cartItems = cartData.items || [];
      console.log('Cart items retrieved:', cartItems);
  
      if (cartItems.length === 0) {
        console.warn('No items found in the cart for this user.');
        return;
      }
  
      for (let item of cartItems) {
        const productRef = doc(db, 'products', item.productId);
        const productSnapshot = await getDoc(productRef);
  
        if (productSnapshot.exists()) {
          const productData = productSnapshot.data();
          const currentStockLevel = productData.stockLevel;
          
          const newStockLevel = currentStockLevel - item.quantity;
          console.log(`Current stock level for ${item.name}: ${currentStockLevel}`);
          console.log(`Attempting to reduce stock by: ${item.quantity}`);
          console.log(`New stock level will be: ${newStockLevel}`);
  
          if (newStockLevel >= 0) {
            batch.update(productRef, { stockLevel: newStockLevel });
          } else {
            console.warn(`Insufficient stock for item: ${item.name}`);
          }
        } else {
          console.warn(`Product not found for productId: ${item.productId}`);
        }
      }
  
      await batch.commit();
      console.log('Batch commit successful: stock levels updated.');
    } catch (error) {
      console.error("Error updating stock levels:", error);
    }
  };

  useEffect(() => {
    const processOrder = async () => {
      if (!orderId) {
        console.error("Order ID not found in URL");
        return;
      }

      try {
        const orderRef = doc(db, "transactions", orderId);
        const orderSnap = await getDoc(orderRef);

        if (!orderSnap.exists()) {
          console.error("Order not found:", orderId);
          return;
        }

        const transactionData = orderSnap.data();

        // Update stock levels
        await handlePurchaseAndUpdateStock(transactionData.userId);

        // Update checkout status to 'success'
        await updateDoc(orderRef, { checkoutStatus: "success" });

        // Navigate to order summary page
        navigate("/user/kiosk/order-summary", { state: { orderId, transactionData } });
      } catch (error) {
        console.error("Error processing order:", error);
      }
    };

    processOrder();
  }, [orderId, navigate]);

  return <div>Processing your order...</div>;
};

export default PaymentSuccess;
