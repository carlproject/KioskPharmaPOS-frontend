import React, { useEffect, useState } from "react";
import { collection, doc, updateDoc, deleteDoc, onSnapshot, addDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DataTable from "react-data-table-component";
import LoadingSpinner from "../LoadingSpinner";

function Inventory() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalType, setModalType] = useState(""); // 'restock', 'price', 'delete'
  const [newStockLevel, setNewStockLevel] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]); // Stores the general history logs

  useEffect(() => {
    // Fetch products and categories
    const fetchInventory = () => {
      const productsRef = collection(db, "products");
      const unsubscribeProducts = onSnapshot(productsRef, (querySnapshot) => {
        const productsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsData);

        const uniqueCategories = [
          ...new Set(productsData.map((product) => product.category)),
        ];
        setCategories(["All", ...uniqueCategories]);

        setLoading(false);
      });

      return () => unsubscribeProducts();
    };

    // Fetch history logs
    const fetchHistory = () => {
      const historyRef = collection(db, "history");
      const unsubscribeHistory = onSnapshot(historyRef, (querySnapshot) => {
        const historyData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHistory(historyData);
      });

      return () => unsubscribeHistory();
    };

    fetchInventory();
    fetchHistory();
  }, []);

  const openModal = (product, type) => {
    setSelectedProduct(product);
    setModalType(type);
    setNewStockLevel("");
    setNewPrice("");
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setModalType("");
    setNewStockLevel("");
    setNewPrice("");
  };

  // Add a new entry to the history collection
  const addHistoryLog = async (action, productName, details) => {
    const historyRef = collection(db, "history");
    await addDoc(historyRef, {
      action,
      productName,
      details,
      timestamp: new Date(),
    });
  };

  const handleRestock = async () => {
    if (selectedProduct && newStockLevel) {
      const productRef = doc(db, "products", selectedProduct.id);
      try {
        const addedStock = Number(newStockLevel);
        await updateDoc(productRef, {
          stockLevel: selectedProduct.stockLevel + addedStock,
        });
        await addHistoryLog(
          "Inbound",
          selectedProduct.name,
          `Added ${addedStock} units.`
        );
        toast.success("Stock updated successfully!");
        closeModal();
      } catch {
        toast.error("Failed to update stock.");
      }
    } else {
      toast.error("Enter a valid stock level.");
    }
  };
  

  const handlePriceUpdate = async () => {
    if (selectedProduct && newPrice) {
      const productRef = doc(db, "products", selectedProduct.id);
      try {
        await updateDoc(productRef, { price: parseFloat(newPrice) });
        await addHistoryLog(
          "Price Update",
          selectedProduct.name,
          `Changed price to ₱${newPrice}.`
        );
        toast.success("Price updated successfully!");
        closeModal();
      } catch {
        toast.error("Failed to update price.");
      }
    } else {
      toast.error("Enter a valid price.");
    }
  };

  const handleDeleteProduct = async () => {
    if (selectedProduct) {
      const productRef = doc(db, "products", selectedProduct.id);
      try {
        await deleteDoc(productRef);
        await addHistoryLog(
          "Delete",
          selectedProduct.name,
          "Product was deleted."
        );
        toast.success("Product deleted successfully!");
        closeModal();
      } catch {
        toast.error("Failed to delete product.");
      }
    }
  };

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const columns = [
    {
      name: "Product Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row.category,
      sortable: true,
    },
    {
      name: "Price",
      selector: (row) => `₱${row.price.toFixed(2)}`,
      sortable: true,
    },
    {
      name: "Stock Level",
      selector: (row) => row.stockLevel,
      sortable: true,
      cell: (row) => (
        <span
          className={`font-bold ${
            row.stockLevel === 0
              ? "text-red-500"
              : row.stockLevel < 10
              ? "text-yellow-500"
              : "text-green-600"
          }`}
        >
          {row.stockLevel}
        </span>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => openModal(row, "restock")}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Restock
          </button>
          <button
            onClick={() => openModal(row, "price")}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Price
          </button>
          <button
            onClick={() => openModal(row, "delete")}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 sm:ml-64">
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
        <h1 className="text-2xl font-bold text-green-700 mb-4">
          Inventory Management
        </h1>

        <div className="mb-4 flex gap-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded ${
                selectedCategory === category
                  ? "bg-green-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <DataTable
            columns={columns}
            data={filteredProducts}
            pagination
            highlightOnHover
            striped
          />
        )}

        {/* History Section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Product History Logs</h2>
          <div className="border rounded p-4 max-h-80 overflow-y-auto">
            {history.length > 0 ? (
              history
                .sort((a, b) => b.timestamp.toDate() - a.timestamp.toDate())
                .map((log) => (
                  <div key={log.id} className="mb-2">
                    <p>
                      <span className="font-bold">{log.productName}</span> -{" "}
                      {log.action}: {log.details}
                    </p>
                    <small className="text-gray-500">
                      {log.timestamp.toDate().toLocaleString()}
                    </small>
                  </div>
                ))
            ) : (
              <p>No history logs available.</p>
            )}
          </div>
        </div>

        {/* Modal */}
        {modalType && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow w-96">
              <h2 className="text-xl font-bold">
                {modalType === "restock"
                  ? "Restock Product"
                  : modalType === "price"
                  ? "Update Price"
                  : "Delete Product"}
              </h2>

              {modalType === "restock" && (
                <input
                  type="number"
                  value={newStockLevel}
                  onChange={(e) => setNewStockLevel(e.target.value)}
                  className="mt-4 w-full p-2 border rounded"
                  placeholder="Enter stock to add"
                />
              )}

              {modalType === "price" && (
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="mt-4 w-full p-2 border rounded"
                  placeholder="Enter new price"
                />
              )}

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                {modalType === "restock" && (
                  <button
                    onClick={handleRestock}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Confirm
                  </button>
                )}
                {modalType === "price" && (
                  <button
                    onClick={handlePriceUpdate}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Confirm
                  </button>
                )}
                {modalType === "delete" && (
                  <button
                    onClick={handleDeleteProduct}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Confirm
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default Inventory;
