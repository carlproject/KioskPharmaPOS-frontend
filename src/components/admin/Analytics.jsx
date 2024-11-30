import React, { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import "chart.js/auto";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function Analytics() {
  const [salesData, setSalesData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [summaryData, setSummaryData] = useState({
    totalSales: 0,
    totalQuantity: 0,
    averageOrderValue: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [endDate, setEndDate] = useState(new Date());
  const fetchAndProcessData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "transactions"));
      const transactions = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        timestamp: new Date(doc.data().timestamp.seconds * 1000),
      }));

      const filteredData = filterTransactionsByDate(transactions);
      updateDashboard(filteredData);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const filterTransactionsByDate = (transactions) =>
    transactions.filter(
      (tx) => tx.timestamp >= startDate && tx.timestamp <= endDate
    );

  const updateDashboard = (filteredData) => {
    calculateSummary(filteredData);
    generateChartData(filteredData);
    setSalesData(filteredData);
  };

  const calculateSummary = (transactions) => {
    const totalSales = transactions.reduce((sum, tx) => sum + (tx.total || 0), 0);
    const totalQuantity = transactions.reduce(
      (sum, tx) =>
        sum +
        (tx.items
          ? tx.items.reduce((itemSum, item) => itemSum + (item.quantity || 0), 0)
          : 0),
      0
    );
    const averageOrderValue = totalSales / (transactions.length || 1);

    setSummaryData({ totalSales, totalQuantity, averageOrderValue });
  };

  const generateChartData = (transactions) => {
    const labels = transactions.map((tx) => tx.timestamp.toLocaleDateString());
    const salesByProduct = {};

    transactions.forEach((tx) => {
      tx.items?.forEach((item) => {
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
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
            ],
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

  const exportToExcel = () => {
    try {
      const data = salesData.map((tx) => ({
        OrderID: tx.orderId || "N/A",
        UserID: tx.userId || "N/A",
        PaymentMethod: tx.paymentMethod || "N/A",
        Total: tx.total?.toFixed(2) || "0.00",
        Tax: tx.tax?.toFixed(2) || "0.00",
        Discount: tx.discountAmount?.toFixed(2) || "0.00",
        CheckoutStatus: tx.checkoutStatus || "N/A",
        Timestamp: tx.timestamp.toLocaleString(),
        Items: tx.items
          ? tx.items
              .map(
                (item) =>
                  `${item.name} (Qty: ${item.quantity}, Price: ${item.price})`
              )
              .join("; ")
          : "No Items",
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      saveAs(
        new Blob([excelBuffer]),
        `Transactions_Report_${startDate.toLocaleDateString()}-${endDate.toLocaleDateString()}.xlsx`
      );
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    }
  };

  useEffect(() => {
    fetchAndProcessData();
  }, [startDate, endDate]);

  return (
    <div className="p-6 sm:ml-64">
      <div className="p-6 border-2 border-gray-200 rounded-lg shadow-lg bg-gray-100">
        <h1 className="text-3xl font-semibold mb-8">Analytics Dashboard</h1>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-medium">Current Date Range:</h2>
            <p>
              {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600"
              onClick={() => setIsModalOpen(true)}
            >
              Customize Date Range
            </button>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600"
              onClick={exportToExcel}
            >
              Export to Excel
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <SummaryCard
            title="Total Sales"
            value={`₱${summaryData.totalSales.toLocaleString()}`}
            color="blue"
          />
          <SummaryCard
            title="Total Quantity Sold"
            value={summaryData.totalQuantity.toLocaleString()}
            color="green"
          />
          <SummaryCard
            title="Average Order Value"
            value={`₱${summaryData.averageOrderValue.toFixed(2)}`}
            color="purple"
          />
        </div>

        {chartData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Sales by Product">
              <Doughnut data={chartData.pie} options={{ maintainAspectRatio: false }} />
            </ChartCard>
            <ChartCard title="Total Sales Over Time">
              <Line data={chartData.line} options={{ maintainAspectRatio: false }} />
            </ChartCard>
          </div>
        )}
      </div>

      {isModalOpen && (
        <DateRangeModal
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onClose={() => setIsModalOpen(false)}
          onApply={() => {
            fetchAndProcessData();
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

// Reusable Summary Card Component
const SummaryCard = ({ title, value, color }) => (
  <div
    className={`bg-${color}-500 text-white p-6 rounded-lg shadow-lg text-center`}
  >
    <h3 className="text-lg font-medium">{title}</h3>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

// Reusable Chart Card Component
const ChartCard = ({ title, children }) => (
  <div className="p-6 border-2 border-gray-200 rounded-lg shadow-lg bg-white">
    <h3 className="text-lg font-medium mb-4">{title}</h3>
    <div className="relative w-full h-64">{children}</div>
  </div>
);

// Date Range Modal Component
const DateRangeModal = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClose,
  onApply,
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-lg font-medium mb-4">Select Date Range</h2>
      <div className="flex flex-col space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={onStartDateChange}
            className="w-full border-2 border-gray-200 rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <DatePicker
            selected={endDate}
            onChange={onEndDateChange}
            className="w-full border-2 border-gray-200 rounded-lg px-4 py-2"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-4 mt-6">
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={onApply}
        >
          Apply
        </button>
      </div>
    </div>
  </div>
);

export default Analytics;
