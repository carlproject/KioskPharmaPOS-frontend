import React, { useState, useEffect } from "react";
import { db } from '../../config/firebase';
import { collection, query, where, getDocs } from "firebase/firestore";
import { debounce } from 'lodash';
import { AiOutlineMedicineBox, AiOutlineHeart, AiOutlineSafety, AiOutlineUser, AiOutlineTool } from 'react-icons/ai';
import { getAuth } from "firebase/auth";
import axios from 'axios';
import { Navigate, useNavigate } from "react-router-dom";

const categories = [
  { name: "Prescription Medication", icon: <AiOutlineMedicineBox /> },
  { name: "Over-the-Counter Medication", icon: <AiOutlineHeart /> },
  { name: "Vitamins & Supplements", icon: <AiOutlineSafety /> },
  { name: "First Aid", icon: <AiOutlineTool /> },
  { name: "Personal Care", icon: <AiOutlineUser /> },
  { name: "Medical Equipment", icon: <AiOutlineTool /> },
];

const Kiosk = () => {
    const navigate = useNavigate();

    const [selectedCategory, setSelectedCategory] = useState(categories[0].name);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const productsRef = collection(db, "products");
      const q = query(productsRef, where("category", "==", selectedCategory));
      const snapshot = await getDocs(q);
      setProducts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };

    fetchProducts();
  }, [selectedCategory]);

  const handleCategoryChange = debounce((category) => {
    setSelectedCategory(category);
  }, 300);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

 const viewCart = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        alert("You need to be logged in to add items to your cart.");
        return;
    }

    const userId = user.uid;
    navigate(`/user/kiosk/cart/${userId}`); 
 }

const addToCart = async (product) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        alert("You need to be logged in to add items to your cart.");
        return;
    }

    const userId = user.uid;
    

    const requestBody = {
        userId,
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: 1,
    };

    try {
        const response = await axios.post('http://localhost:5000/user/kiosk/cart/add', requestBody, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.data.success) {
            alert(response.data.message); // Show success message
        } else {
            console.error("Error adding to cart:", response.data.message);
            alert(response.data.message);
        }
    } catch (error) {
        console.error("Error adding to cart:", error);
        alert("There was an error adding to your cart. Please try again.");
    }
};

  return (
    <div className={`flex h-screen ${isFullScreen ? "flex-col" : "flex-row"}`}>
      {/* Sidebar */}
      <aside className={`transition-transform duration-300 ${isFullScreen ? "hidden" : "block"} w-1/4 bg-green-600 text-white p-6`}>
        <h2 className="text-xl font-semibold mb-4">Categories</h2>
        <ul>
          {categories.map((category) => (
            <li
              key={category.name}
              className={`flex items-center p-2 cursor-pointer rounded transition-all duration-300 ${
                selectedCategory === category.name ? "bg-green-800 text-white" : "hover:bg-green-700 text-gray-300"
              }`}
              onClick={() => handleCategoryChange(category.name)}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main content */}
      <main className={`flex-grow p-6 ${isFullScreen ? "w-full" : "w-3/4"} transition-all duration-300`}>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{selectedCategory}</h2>
          <button
            onClick={toggleFullScreen}
            className="bg-green-500 text-white py-1 px-4 rounded focus:outline-none hover:bg-green-700 transition-colors"
          >
            {isFullScreen ? "Exit Full Screen" : "Full Screen"}
          </button>
          <button onClick={viewCart}>View Cart</button>
        </div>

        {loading ? (
          <p className="mt-4">Loading products...</p>
        ) : (
          <div className={`grid ${isFullScreen ? "grid-cols-2 md:grid-cols-4" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"} gap-6 mt-4`}>
            {products.map((product) => (
              <div key={product.id} className="border rounded-lg p-4 shadow-md bg-white hover:shadow-lg transition-shadow duration-300">
                <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover mb-2 rounded" />
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-600">Price: ${product.price}</p>
                <p className="text-sm">{product.description}</p>
                <p className="text-sm">
                  {product.prescriptionNeeded ? "Prescription Required" : "No Prescription Needed"}
                </p>
                <button onClick={() => addToCart(product)} className="mt-4 bg-green-500 text-white py-1 px-4 rounded hover:bg-green-700 transition-colors">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Kiosk;
