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

  const getAdminFCMTokens = async () => {
    try {
      const adminRef = doc(db, "admin", "checachio@gmail.com"); 
  
      const adminDoc = await getDoc(adminRef);
  
      if (adminDoc.exists()) {
        const data = adminDoc.data();
        const fcmTokens = data.fcmTokens || [];
  
        if (fcmTokens.length > 0) {
          return fcmTokens[0];
        } else {
          console.warn("No FCM tokens found for the admin.");
          return null;
        }
      } else {
        console.error("Admin document does not exist.");
        return null;
      }
    } catch (error) {
      console.error("Error retrieving admin FCM token:", error);
      return null;
    }
  };
  
  
  const sendAdminNotification = async () => {
    try {
      const adminFCMToken = await getAdminFCMTokens();
  
      if (adminFCMToken) {
        await fetch("http://localhost:5000/admin/send-notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: "New Order",
            body: "A new order has been placed.",
            recipientToken: adminFCMToken,
          }),
        });
      } else {
        console.log("No FCM token found for the admin");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  
const getUserFCMToken = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);

    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const fcmToken = userData.fcmTokens || null;
      return fcmToken;
    } else {
      console.log(`User document with ID ${userId} does not exist`);
      return null;
    }
  } catch (error) {
    console.error('Error retrieving FCM token:', error);
    return null;
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
        const userId = transactionData.userId;

        await handlePurchaseAndUpdateStock(transactionData.userId);

        const recipientToken = await getUserFCMToken(userId);
          await fetch("http://localhost:5000/user/send-notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: "Transaction Confirmed",
            body: "Your order has been successfully confirmed.",
            recipientToken: recipientToken,
          }),
        });

        await sendAdminNotification();

        await updateDoc(orderRef, { checkoutStatus: "processing" });

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
