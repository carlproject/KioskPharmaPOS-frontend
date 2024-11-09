import React, { useEffect, useState } from 'react';
import { db as firestore, messaging } from '../../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { getToken, onMessage } from 'firebase/messaging';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const productsSnapshot = await getDocs(collection(firestore, 'products'));
      const productsList = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsList);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const transactionsSnapshot = await getDocs(collection(firestore, 'transactions'));
      const transactionsList = transactionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTransactions(transactionsList);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const initMessaging = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.error('Notification permission denied.');
        return;
      }
      const token = await getToken(messaging, { vapidKey: import.meta.env.VITE_VAPID_PUBLIC_KEY });
      console.log('FCM Token:', token);

      onMessage(messaging, (payload) => {
        console.log('Message received:', payload);
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          payload.notification,
        ]);
      });
    } catch (error) {
      console.error('Error initializing messaging:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchTransactions();
    initMessaging();
  }, []);

  const renderTransactions = () =>
    transactions.map(transaction => (
      <div key={transaction.id} className="bg-white p-6 rounded-lg shadow-md mb-6 transition-transform duration-300 hover:scale-105">
        <h4 className="font-semibold text-blue-800 text-lg">Order ID: {transaction.orderId}</h4>
        <p className="text-gray-700">🛒 Checkout Status: {transaction.checkoutStatus}</p>
        <p className="text-gray-700">💳 Payment Method: {transaction.paymentMethod}</p>
        <p className="text-gray-700">Discount: ₱{transaction.discountAmount.toFixed(2)}</p>
        <p className="text-gray-700">Tax Rate: {transaction.tax}</p>
        <p className="font-bold text-blue-800">Total: ₱{transaction.total.toFixed(2)}</p>
        <div className="mt-3">
          <h5 className="font-semibold text-gray-700 mb-2">Items:</h5>
          {transaction.items.map((item, index) => (
            <div key={index} className="ml-4 text-sm text-gray-600">
              <p>📦 Product: {item.name}</p>
              <p>💊 Dosage: {item.dosage}</p>
              <p>💵 Price: ₱{item.price.toFixed(2)}</p>
              <p>🔢 Quantity: {item.quantity}</p>
            </div>
          ))}
        </div>
      </div>
    ));

  return (
    <div className="p-4 sm:ml-64">
      <div className="p-6 border border-gray-200 rounded-lg mt-14 bg-gray-50">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-700">Sales and Product Overview</h1>
          <p className="text-lg text-gray-500 mt-2">Your central hub for transactions and product details</p>
        </header>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">💳 Transactions</h2>
          {transactions.length === 0 ? (
            <p className="text-gray-600 italic">No transactions available.</p>
          ) : (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {renderTransactions()}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Product;
