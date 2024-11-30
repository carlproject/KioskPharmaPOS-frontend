import React, { useEffect, useState } from "react";
import { AiOutlineMedicineBox, AiOutlineSafety, AiOutlineUser } from "react-icons/ai";
import { MdOutlineMedication, MdMedicalInformation } from "react-icons/md";
import { RiFirstAidKitFill } from "react-icons/ri";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";

const categories = [
  { name: "Prescription Medication", icon: <AiOutlineMedicineBox /> },
  { name: "Over-the-Counter Medication", icon: <MdOutlineMedication /> },
  { name: "Vitamins & Supplements", icon: <AiOutlineSafety /> },
  { name: "First Aid", icon: <RiFirstAidKitFill /> },
  { name: "Personal Care", icon: <AiOutlineUser /> },
  { name: "Medical Equipment", icon: <MdMedicalInformation /> },
];

const OrderKiosk = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const fetchedProducts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(fetchedProducts);
    });
    return () => unsubscribe();
  }, [db]);

  const handleInbound = async (productId, quantity) => {
    const productRef = doc(db, "products", productId);
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const newStockLevel = product.stockLevel + quantity;
    await updateDoc(productRef, { stockLevel: newStockLevel });
    toast.success(`${product.name} stock updated to ${newStockLevel}!`);
  };

  // Handle stock decrease
  const handleOutbound = async (productId, quantity) => {
    const productRef = doc(db, "products", productId);
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const newStockLevel = product.stockLevel - quantity;
    if (newStockLevel < 0) {
      toast.error("Insufficient stock!");
      return;
    }

    await updateDoc(productRef, { stockLevel: newStockLevel });
    toast.success(`${product.name} stock reduced to ${newStockLevel}!`);
  };

  // Delete product
  const handleDelete = async (productId) => {
    try {
      await deleteDoc(doc(db, "products", productId));
      toast.success("Product deleted successfully!");
    } catch (error) {
      toast.error("Error deleting product.");
    }
  };

  // Filter products based on category and search query
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-4 sm:ml-64 min-h-screen bg-gray-50">
      <div className="p-6 border-2 border-gray-200 rounded-xl dark:border-gray-700 mt-14 bg-white shadow-lg transition duration-300 ease-in-out hover:shadow-2xl">
        <h1 className="text-2xl font-bold text-center mb-6">Pharmacy Admin Kiosk</h1>

        {/* Search Bar */}
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full max-w-md p-2 border rounded-lg focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Navigation */}
        <div className="flex justify-center gap-4 flex-wrap mb-6">
          <button
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
              selectedCategory === "All"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setSelectedCategory("All")}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition ${
                selectedCategory === cat.name
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setSelectedCategory(cat.name)}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Product Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="p-4 border rounded-lg shadow-md bg-white flex flex-col justify-between"
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-40 w-full object-contain mb-4"
              />
              <h2 className="text-lg font-bold mb-2">{product.name}</h2>
              <p className="text-gray-500 mb-1">{product.description}</p>
              <p className="text-gray-500 text-sm mb-1">
                Dosages: {product.dosages.join(", ")}
              </p>
              <p
                className={`text-sm mb-2 ${
                  product.prescriptionNeeded ? "text-red-500" : "text-green-500"
                }`}
              >
                {product.prescriptionNeeded
                  ? "Prescription Required"
                  : "No Prescription Needed"}
              </p>
              <p className="font-semibold mb-1">Price: ${product.price}</p>
              <p
                className={`font-semibold mb-2 ${
                  product.stockLevel === 0 ? "text-red-500" : "text-gray-700"
                }`}
              >
                {product.stockLevel > 0
                  ? `Stock: ${product.stockLevel}`
                  : "Out of Stock"}
              </p>
              {product.stockLevel > 0 && (
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700 transition"
                  onClick={() => handleOutbound(product.id, 1)}
                >
                  Reduce Stock
                </button>
              )}
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-lg w-full mt-2 hover:bg-green-700 transition"
                onClick={() => handleInbound(product.id, 1)}
              >
                Add to Stock
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-lg w-full mt-2 hover:bg-red-700 transition"
                onClick={() => handleDelete(product.id)}
              >
                Delete Product
              </button>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default OrderKiosk;
