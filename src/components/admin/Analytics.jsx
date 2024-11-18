import React, { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import "chart.js/auto";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Analytics() {
  const [salesData, setSalesData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [summaryData, setSummaryData] = useState({
    totalSales: 0,
    totalQuantity: 0,
    averageOrderValue: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [endDate, setEndDate] = useState(new Date()); 

  const fetchAndProcessData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "transactions"));
      const transactions = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          timestamp: new Date(data.timestamp.seconds * 1000),
        };
      });

      const filteredData = transactions.filter(
        (tx) => tx.timestamp >= startDate && tx.timestamp <= endDate
      );

      calculateSummary(filteredData);
      generateChartData(filteredData);
      setSalesData(filteredData);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchAndProcessData();
  }, [startDate, endDate]);

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
    const labels = transactions.map((tx) => tx.timestamp.toLocaleDateString());
    const salesByProduct = {};

    transactions.forEach((tx) => {
      tx.items &&
        tx.items.forEach((item) => {
          salesByProduct[item.name] =
            (salesByProduct[item.name] || 0) + item.quantity * item.price;
        });
    });

    setChartData({
      bar: {
        labels,
        datasets: [
          {
            label: "Total Sales",
            data: transactions.map((tx) => tx.total || 0),
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      pie: {
        labels: Object.keys(salesByProduct),
        datasets: [
          {
            label: "Sales by Product",
            data: Object.values(salesByProduct),
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
          },
        ],
      },
      line: {
        labels,
        datasets: [
          {
            label: "Total Sales Over Time",
            data: transactions.map((tx) => tx.total || 0),
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 2,
            fill: false,
          },
        ],
      },
    });
  };

  return (
    <div className="p-6 sm:ml-64">
      <div className="p-6 border-2 border-gray-200 border-dashed rounded-lg shadow-lg mt-14 bg-gray-100">
        <h1 className="text-3xl font-semibold mb-8">Analytics Dashboard</h1>

        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-medium">Current Date Range: </h2>
            <p>
              {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
            </p>
          </div>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600"
            onClick={() => setIsModalOpen(true)}
          >
            Customize Date Range
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
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

        {chartData && (
          <>
            <div className="mb-6 flex justify-evenly">
              <div className="w-64 h-64 mr-4">
                <Doughnut data={chartData.pie} />
              </div>

              <div className="w-92 h-92">
                <Line data={chartData.line} />
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Total Sales Over Time</h2>
              <Bar data={chartData.bar} />
            </div>
          </>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h2 className="text-xl font-semibold mb-4">Customize Date Range</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  className="mt-2 p-2 border rounded-lg w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  className="mt-2 p-2 border rounded-lg w-full"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                  onClick={() => {
                    setIsModalOpen(false);
                    fetchAndProcessData();
                  }}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Analytics;
