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
    dailyInflation: 0,
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
  
    const salesByDate = transactions.reduce((acc, tx) => {
      const date = tx.timestamp.toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + (tx.total || 0);
      return acc;
    }, {});
  
    const sortedDates = Object.keys(salesByDate).sort();
    const todaySales = salesByDate[sortedDates[sortedDates.length - 1]] || 0;
    const yesterdaySales =
      sortedDates.length > 1
        ? salesByDate[sortedDates[sortedDates.length - 2]]
        : 0;
  
    const dailyInflation = todaySales - yesterdaySales;
  
    setSummaryData({
      totalSales,
      totalQuantity,
      averageOrderValue,
      dailyInflation,
    });
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
    <div className="p-6 sm:ml-64 bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="p-6 border-2 border-gray-200 rounded-lg shadow-lg bg-white">
        <h1 className="text-4xl font-semibold mb-8 text-center">Analytics Dashboard</h1>

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
          <SummaryCard
            title="Daily Inflation"
            value={`₱${summaryData.dailyInflation.toLocaleString()}`}
            color={summaryData.dailyInflation >= 0 ? "green" : "red"}
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

const SummaryCard = ({ title, value, color }) => (
  <div
    className={`p-6 rounded-lg shadow-lg text-white bg-${color}-500`}
  >
    <h3 className="text-xl font-bold">{title}</h3>
    <p className="text-2xl mt-2">{value}</p>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="p-6 border-2 border-gray-200 rounded-lg shadow-lg bg-white">
    <h3 className="text-lg font-medium mb-4">{title}</h3>
    <div className="h-64">{children}</div>
  </div>
);

const DateRangeModal = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClose,
  onApply,
}) => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-medium mb-4">Customize Date Range</h3>
      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Start Date:</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => onStartDateChange(date)}
            className="w-full border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">End Date:</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => onEndDateChange(date)}
            className="w-full border border-gray-300 rounded-lg"
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end space-x-4">
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-lg hover:bg-gray-600"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600"
          onClick={onApply}
        >
          Apply
        </button>
      </div>
    </div>
  </div>
);

export default Analytics;
