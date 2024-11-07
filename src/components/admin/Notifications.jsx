import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db } from '../../config/firebase';
import { collection, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { onMessage } from "firebase/messaging";
import { messaging } from '../../config/firebase';

function Notifications() {
  const [orders, setOrders] = useState([]);
  const [loadingOrderId, setLoadingOrderId] = useState(null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  const userId = user.userId;

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'transactions'), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const orderData = { id: change.doc.id, ...change.doc.data() };

        if (change.type === 'modified' && orderData.checkoutStatus === 'Confirmed') {
          showOrderToast(orderData);
        }

        setOrders((prevOrders) => {
          const updatedOrders = [...prevOrders];
          const existingIndex = updatedOrders.findIndex((order) => order.id === orderData.id);

          if (existingIndex >= 0) {
            updatedOrders[existingIndex] = orderData;
          } else {
            updatedOrders.push(orderData);
          }

          return updatedOrders;
        });
      });
    });

    const requestNotificationPermission = async () => {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("Notification permission granted.");
      } else {
        console.warn("Notification permission denied.");
      }
    };

    requestNotificationPermission();

    const getUserFCMToken = async (userId) => {
      try {
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);
    
        if (userDoc.exists()) {
          const userData = userDoc.data();
          return userData.fcmTokens || null;
        } else {
          console.log(`User with ID ${userId} does not exist`);
          return null;
        }
      } catch (error) {
        console.error("Error retrieving FCM token:", error);
        return null;
      }
    };
    
    const updateOrderStatus = async (orderId, userId) => {
      setLoadingOrderId(orderId);
      try {
        const orderRef = doc(db, "transactions", orderId);
        await updateDoc(orderRef, { checkoutStatus: "Confirmed" });
    
        const recipientToken = await getUserFCMToken(userId);
    
        if (recipientToken) {
          await fetch("http://localhost:5000/user/send-notification", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: "Order Ready for Pickup",
              body: `Your order #${orderId} is ready at the counter.`,
              recipientToken,
            }),
          });
        }
    
        toast.success(`Order #${orderId} has been confirmed!`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } catch (error) {
        console.error("Error updating order status:", error);
        toast.error("Failed to confirm order. Please try again.");
      } finally {
        setLoadingOrderId(null);
      }
    };
    

    const onMessageListener = onMessage(messaging, (payload) => {
      console.log("Notification received:", payload); 
      if (payload.notification) {
        const { title, body } = payload.notification;
        const orderId = payload.data?.orderId;
        const currentOrder = orders.find(order => order.id === orderId);
    
        if (currentOrder) {
          toast.success(`${title}: ${body}`, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        } else {
          console.warn("Notification received, but no matching order found");
        }
      }
    });
    

    return () => {
      unsubscribe();
      onMessageListener();
    };
  }, []);

  const updateOrderStatus = async (orderId) => {
    setLoadingOrderId(orderId);
    try {
      const orderRef = doc(db, 'transactions', orderId);
      await updateDoc(orderRef, { checkoutStatus: 'Confirmed' });

      toast.success(`Order #${orderId} has been confirmed!`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to confirm order. Please try again.');
    } finally {
      setLoadingOrderId(null);
    }
  };

  const showOrderToast = (order) => {
    toast.success(`Order #${order.orderId} has been confirmed! Total: ₱${safeToFixed(order.total)}`, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const safeToFixed = (value) => {
    return value || value === 0 ? value.toFixed(2) : '0.00';
  };

  return (
    <div className="p-4 sm:ml-64">
      <ToastContainer />
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
        <section className="py-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">Order Confirmations</h2>
          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white shadow-md rounded-lg p-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <h3 className="text-lg font-bold">Order ID: {order.orderId}</h3>
                    <p className={`text-gray-600 ${order.checkoutStatus === 'Confirmed' ? 'text-green-600' : ''}`}>
                      Status: {order.checkoutStatus}
                    </p>
                    <p className="text-gray-600">Payment Method: {order.paymentMethod}</p>
                    <p className="text-gray-600">Discount: ₱{safeToFixed(order.discountAmount)}</p>
                    <p className="text-gray-600">Tax Rate: {safeToFixed(order.taxRate * 100)}%</p>
                    <p className="text-gray-800 font-semibold">Total: ₱{safeToFixed(order.total)}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Items:</h4>
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center border-b border-gray-200 py-1">
                        <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-cover rounded-md mr-3" />
                        <div className="flex-1">
                          <p className="text-gray-800">{item.name}</p>
                          <p className="text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-gray-800 font-semibold">₱{safeToFixed(item.price)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-center">
                  {order.checkoutStatus !== 'Confirmed' && (
                    <button
                      onClick={() => updateOrderStatus(order.orderId, userId)}
                      className={`${
                        loadingOrderId === order.id ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'
                      } text-white px-4 py-2 rounded-md transition duration-300`}
                      disabled={loadingOrderId === order.id}
                    >
                      {loadingOrderId === order.id ? 'Confirming...' : 'Confirm Order'}
                    </button>
                  )}

                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center">No orders to display.</p>
          )}
        </section>
      </div>
    </div>
  );
}

export default Notifications;
