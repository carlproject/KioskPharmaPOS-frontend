import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db } from '../../config/firebase';
import { collection, onSnapshot, updateDoc, doc, getDoc } from 'firebase/firestore';
import { onMessage } from "firebase/messaging";
import { messaging } from '../../config/firebase';

function Notifications() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('Processing');
  const [loadingOrderId, setLoadingOrderId] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'transactions'), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const orderData = { id: change.doc.id, ...change.doc.data(), expanded: false }; 
        setOrders((prevOrders) => {
          const updatedOrders = [...prevOrders];
          const existingIndex = updatedOrders.findIndex((order) => order.id === orderData.id);
          if (existingIndex >= 0) updatedOrders[existingIndex] = orderData;
          else updatedOrders.push(orderData);
          return updatedOrders;
        });
      });
    });
    
  }, []);

  const updateOrderStatus = async (orderId) => {
    setLoadingOrderId(orderId);
    try {
      const orderRef = doc(db, 'transactions', orderId);
      await updateDoc(orderRef, { checkoutStatus: 'Confirmed' });

      const orderDoc = await getDoc(orderRef);
      const { userId } = orderDoc.data();

      await fetch('http://localhost:5000/admin/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          title: "Order Confirmed",
          message: `Your order #${orderId} has been confirmed!`,
          orderId: orderId,
        }),
      });

      toast.success(`Order #${orderId} has been confirmed!`, { position: 'top-right', autoClose: 5000 });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to confirm order. Please try again.');
    } finally {
      setLoadingOrderId(null);
    }
  };

  const filteredOrders = orders.filter(order => 
    activeTab === 'Processing' ? order.checkoutStatus !== 'Confirmed' : order.checkoutStatus === 'Confirmed'
  );

  return (
    <div className="p-4 sm:ml-64">
      <ToastContainer />
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
        <section className="py-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">Order Confirmations</h2>
          <div className="flex justify-center mb-6 gap-4">
            <button 
              className={`px-6 py-2 rounded-t-lg ${activeTab === 'Processing' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setActiveTab('Processing')}
            >
              Processing
            </button>
            <button 
              className={`px-6 py-2 rounded-t-lg ${activeTab === 'Confirmed' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setActiveTab('Confirmed')}
            >
              Confirmed
            </button>
          </div>
          {filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="bg-white shadow-md rounded-lg p-4">
                  <button
                    className="w-full text-left"
                    onClick={() => setOrders((prev) =>
                      prev.map((o) => (o.id === order.id ? { ...o, expanded: !o.expanded } : o))
                    )}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold">Order ID: {order.orderId}</h3>
                      <span
                        className={`text-sm px-2 py-1 rounded ${
                          order.checkoutStatus === 'Confirmed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                        }`}
                      >
                        {order.checkoutStatus}
                      </span>
                    </div>
                  </button>
                  {order.expanded && (
                    <div className="mt-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <p className="text-gray-600">Payment Method: {order.paymentMethod}</p>
                          <p className="text-red-500">Discount: ₱{order.discountAmount.toFixed(2)}</p>
                          <p className="text-gray-600">Tax Rate: {(order.tax).toFixed(2)}</p>
                          <p className="text-gray-800 font-semibold">Total: ₱{order.total.toFixed(2)}</p>
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
                              <p className="text-gray-800 font-semibold">₱{item.price.toFixed(2)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        {order.checkoutStatus !== 'Confirmed' && (
                          <button
                            onClick={() => updateOrderStatus(order.orderId)}
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
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center">No orders in {activeTab.toLowerCase()}.</p>
          )}
        </section>
      </div>
    </div>
  );
}

export default Notifications;
