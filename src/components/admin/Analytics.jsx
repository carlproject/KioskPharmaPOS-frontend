import React, { useEffect, useState } from 'react';
import { db } from '../../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';

function Analytics() {
  const [salesData, setSalesData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [summaryData, setSummaryData] = useState({
    totalSales: 0,
    totalQuantity: 0,
    averageOrderValue: 0,
  });

  const formatTimestamp = (timestamp) => {
    return timestamp && timestamp.seconds
      ? new Date(timestamp.seconds * 1000).toLocaleDateString()
      : 'N/A';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'transactions'));
        const transactions = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            timestamp: formatTimestamp(data.timestamp),
          };
        });

        setSalesData(transactions);
        generateChartData(transactions);
        calculateSummary(transactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchData();
  }, []);

  const calculateSummary = (transactions) => {
    const totalSales = transactions.reduce((sum, tx) => sum + (tx.total || 0), 0);
    const totalQuantity = transactions.reduce(
      (sum, tx) => 
        sum + (tx.items ? tx.items.reduce((itemSum, item) => itemSum + (item.quantity || 0), 0) : 0),
      0
    );
    const averageOrderValue = totalSales / (transactions.length || 1);
  
    setSummaryData({ totalSales, totalQuantity, averageOrderValue });
  };
  

  const generateChartData = (transactions) => {
    const labels = transactions.map((tx) => tx.timestamp);
  
    const salesByProduct = {};
    transactions.forEach((tx) => {
      if (tx.items && Array.isArray(tx.items)) { 
        tx.items.forEach((item) => {
          if (salesByProduct[item.name]) {
            salesByProduct[item.name] += item.quantity * item.price;
          } else {
            salesByProduct[item.name] = item.quantity * item.price;
          }
        });
      }
    });
  
    const productNames = Object.keys(salesByProduct);
    const productSales = Object.values(salesByProduct);
  
    setChartData({
      bar: {
        labels,
        datasets: [
          {
            label: 'Total Sales',
            data: transactions.map((tx) => tx.total || 0),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      line: {
        labels,
        datasets: [
          {
            label: 'Quantity Sold',
            data: transactions.map((tx) =>
              tx.items ? tx.items.reduce((sum, item) => sum + (item.quantity || 0), 0) : 0
            ),
            borderColor: 'rgba(153, 102, 255, 1)',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            fill: true,
            tension: 0.4,
          },
        ],
      },
      pie: {
        labels: productNames,
        datasets: [
          {
            label: 'Sales by Product',
            data: productSales,
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
            ],
          },
        ],
      },
    });
  };
  

  return (
    <div className="p-6 sm:ml-64">
      <div className="p-6 border-2 border-gray-200 border-dashed rounded-lg shadow-lg mt-14 bg-gray-100">
        <section className="py-18 relative">
          <h1 className="text-3xl font-semibold mb-8">Analytics Dashboard</h1>

          {/* Summary Data */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-500 text-white p-4 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold">Total Sales</h2>
              <p className="text-2xl">₱{summaryData.totalSales.toLocaleString()}</p>
            </div>
            <div className="bg-green-500 text-white p-4 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold">Total Quantity Sold</h2>
              <p className="text-2xl">{summaryData.totalQuantity.toLocaleString()}</p>
            </div>
            <div className="bg-purple-500 text-white p-4 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold">Average Order Value</h2>
              <p className="text-2xl">₱{summaryData.averageOrderValue.toFixed(2)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {chartData && (
              <>
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', height: '400px' }}>
                  <h2 className="text-lg font-semibold mb-4">Sales Over Time</h2>
                  <Bar data={chartData.bar} options={{ responsive: true, maintainAspectRatio: false }} height={400} />
                </div>
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', height: '400px' }}>
                  <h2 className="text-lg font-semibold mb-4">Quantity Sold Over Time</h2>
                  <Line data={chartData.line} options={{ responsive: true, maintainAspectRatio: false }} height={400} />
                </div>
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg col-span-1 lg:col-span-2" style={{ height: '400px' }}>
                  <h2 className="text-lg font-semibold text-white mb-4">Sales by Product</h2>
                  <Doughnut data={chartData.pie} options={{ responsive: true, maintainAspectRatio: false }} height={500} />
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Analytics;
