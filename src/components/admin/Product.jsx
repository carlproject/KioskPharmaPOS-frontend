import React, { useEffect, useState } from 'react';
import { db as firestore, messaging } from '../../config/firebase';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { getToken, onMessage } from 'firebase/messaging';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [salesReports, setSalesReports] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from Firestore
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

  // Fetch transactions from Firestore
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

  // Initialize Firebase Cloud Messaging for notifications
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
  // Render functions
  const renderNotifications = () =>
    notifications.map((notification, index) => (
      <div key={index} className="bg-blue-100 text-blue-700 p-3 rounded-lg shadow-sm mb-2">
        <h4 className="font-semibold">{notification.title}</h4>
        <p>{notification.body}</p>
      </div>
    ));

  const renderSalesReports = () =>
    salesReports.map(report => (
      <div key={report.id} className="bg-gray-100 text-gray-700 p-4 rounded-lg shadow mb-2">
        <h4 className="font-semibold">{report.title}</h4>
        <p>Date: {report.date}</p>
        <p>Revenue: ${report.revenue}</p>
      </div>
    ));

  const renderTransactions = () =>
    transactions.map(transaction => (
      <div key={transaction.id} className="bg-green-100 text-green-700 p-4 rounded-lg shadow mb-2">
        <h4 className="font-semibold">Order ID: {transaction.orderId}</h4>
        <p>Checkout Status: {transaction.checkoutStatus}</p>
        <p>Payment Method: {transaction.paymentMethod}</p>
        <p>Discount Amount: ${transaction.discountAmount}</p>
        <p>Tax Rate: {transaction.taxRate * 100}%</p>
        <p>Total: ${transaction.total}</p>
        <p>Timestamp: {transaction.timestamp.toDate().toLocaleString()}</p>
        <div>
          <h5 className="font-semibold mt-2">Items:</h5>
          {transaction.items.map((item, index) => (
            <div key={index} className="pl-4">
              <p>Product Name: {item.name}</p>
              <p>Dosage: {item.dosage}</p>
              <p>Price: ${item.price}</p>
              <p>Quantity: {item.quantity}</p>
            </div>
          ))}
        </div>
      </div>
    ));

  const renderProducts = () =>
    products.map(product => (
      <div key={product.id} className="bg-white p-4 rounded-lg shadow-lg">
        <img src={product.imageUrl} alt={product.name} className="w-full h-32 object-cover rounded-md mb-4" />
        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
        <p className="text-gray-700">Category: {product.category}</p>
        <p className="text-gray-700">Price: ${product.price}</p>
        <p className="text-gray-700">Stock Level: {product.stockLevel}</p>
        <p className="text-gray-700">Dosages Available: {product.dosages.join(', ')} mg</p>
        <button
          onClick={() => handleAddToCart(product)}
          className="mt-4 w-full py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-500 transition duration-200"
        >
          Add to Cart
        </button>
      </div>
    ));

  return (
    <div className="p-4 sm:ml-64">
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Sales and Products for Casting</h1>
        </header>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Notifications and Alerts</h2>
          {notifications.length === 0 ? <p className="text-gray-600">No notifications at the moment.</p> : <div>{renderNotifications()}</div>}
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Sales Reports</h2>
          <div>{renderSalesReports()}</div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Transactions</h2>
          {transactions.length === 0 ? <p className="text-gray-600">No transactions available.</p> : <div>{renderTransactions()}</div>}
        </section>
      </div>
    </div>
  );
};

export default Product;
