import React, { useEffect, useState } from "react";
import { collection, doc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

  useEffect(() => {
    const fetchInventory = () => {
      const productsRef = collection(db, "products");
      const unsubscribe = onSnapshot(productsRef, (querySnapshot) => {
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

      return () => unsubscribe();
    };

    fetchInventory();
  }, []);

  const handleRestock = async () => {
    if (selectedProduct && newStockLevel) {
      const productRef = doc(db, "products", selectedProduct.id);
      const currentStockLevel = selectedProduct.stockLevel;
      const updatedStockLevel = currentStockLevel + Number(newStockLevel);

      try {
        await updateDoc(productRef, { stockLevel: updatedStockLevel });
        toast.success("Stock level updated successfully!");
        closeModal();
      } catch (error) {
        toast.error("Failed to update stock level.");
      }
    } else {
      toast.error("Please enter a valid stock level.");
    }
  };

  const handlePriceUpdate = async () => {
    if (selectedProduct && newPrice) {
      const productRef = doc(db, "products", selectedProduct.id);
      try {
        await updateDoc(productRef, { price: parseFloat(newPrice) });
        toast.success("Price updated successfully!");
        closeModal();
      } catch (error) {
        toast.error("Failed to update the price.");
      }
    } else {
      toast.error("Please enter a valid price.");
    }
  };

  const handleDeleteProduct = async () => {
    if (selectedProduct) {
      const productRef = doc(db, "products", selectedProduct.id);
      try {
        await deleteDoc(productRef);
        toast.success("Product deleted successfully!");
        closeModal();
      } catch (error) {
        toast.error("Failed to delete the product.");
      }
    }
  };

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

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <div className="p-4 sm:ml-64 bg-gray-100 min-h-screen">
      <div className="p-6 border-2 border-gray-300 bg-white rounded-lg dark:border-gray-700 shadow-lg mt-14">
        <section className="py-8">
          <h1 className="text-3xl font-bold mb-4 text-green-600">Inventory Management</h1>
          <div className="flex gap-4 mb-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded ${
                  selectedCategory === category
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                  <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
                  <p className="text-sm text-gray-600">Category: {product.category}</p>
                  <p className="text-sm text-gray-600">Price: ${product.price.toFixed(2)}</p>
                  <p
                    className={`text-sm font-semibold mt-2 ${
                      product.stockLevel === 0
                        ? "text-red-600"
                        : product.stockLevel < 10
                        ? "text-orange-500"
                        : "text-green-600"
                    }`}
                  >
                    Stock Level: {product.stockLevel}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => openModal(product, "restock")}
                      className="py-2 px-4 bg-green-600 text-white font-medium rounded-md hover:bg-green-700"
                    >
                      Restock
                    </button>
                    <button
                      onClick={() => openModal(product, "price")}
                      className="py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
                    >
                      Change Price
                    </button>
                    <button
                      onClick={() => openModal(product, "delete")}
                      className="py-2 px-4 bg-red-600 text-white font-medium rounded-md hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedProduct && modalType && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-96 transform transition-all">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
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
                    placeholder="Enter stock to add"
                    className="border-2 border-gray-300 p-2 rounded w-full mb-4"
                  />
                )}
                {modalType === "price" && (
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="Enter new price"
                    className="border-2 border-gray-300 p-2 rounded w-full mb-4"
                  />
                )}
                {modalType === "delete" && (
                  <p className="text-red-600 mb-4">
                    Are you sure you want to delete this product?
                  </p>
                )}
                <div className="flex justify-end">
                  <button
                    onClick={closeModal}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
                  >
                    Cancel
                  </button>
                  {modalType === "restock" && (
                    <button
                      onClick={handleRestock}
                      className="bg-green-600 text-white px-4 py-2 rounded-md"
                    >
                      Update Stock
                    </button>
                  )}
                  {modalType === "price" && (
                    <button
                      onClick={handlePriceUpdate}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md"
                    >
                      Update Price
                    </button>
                  )}
                  {modalType === "delete" && (
                    <button
                      onClick={handleDeleteProduct}
                      className="bg-red-600 text-white px-4 py-2 rounded-md"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Inventory;
