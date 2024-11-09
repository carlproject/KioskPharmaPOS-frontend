import React, { useState, useEffect } from "react";
import { db } from '../../config/firebase';
import { collection, query, where, getDocs } from "firebase/firestore";
import { debounce } from 'lodash';
import { AiOutlineMedicineBox, AiOutlineSafety, AiOutlineUser, AiOutlineShoppingCart } from 'react-icons/ai';
import { RiFirstAidKitFill } from 'react-icons/ri';
import { getAuth } from "firebase/auth";
import { MdMedicalInformation, MdOutlineMedication } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const categories = [
  { name: "Prescription Medication", icon: <AiOutlineMedicineBox /> },
  { name: "Over-the-Counter Medication", icon: <MdOutlineMedication /> },
  { name: "Vitamins & Supplements", icon: <AiOutlineSafety /> },
  { name: "First Aid", icon: <RiFirstAidKitFill /> },
  { name: "Personal Care", icon: <AiOutlineUser /> },
  { name: "Medical Equipment", icon: <MdMedicalInformation /> },
];

const Kiosk = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState(categories[0].name);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [cartCount, setCartCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false); // State to track prescription authentication
    const [prescriptionFile, setPrescriptionFile] = useState(null); // State for the uploaded file

    const fetchProducts = async (category, isPrescription = false) => {
        setLoading(true);
        const productsRef = collection(db, "products");
        let q;
        
        if (isPrescription) {
            q = query(productsRef, where("prescriptionNeeded", "==", true));
        } else {
            q = query(productsRef, where("category", "==", category));
        }
        
        const snapshot = await getDocs(q);
        const productData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProducts(productData);
        setLoading(false);
    };

    // Function to verify prescription
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        setPrescriptionFile(file);

        // You can display a preview of the uploaded file or do further validation
        if (file) {
            alert("File uploaded successfully!");
        }
    };

    const verifyPrescription = async () => {
        if (!prescriptionFile) {
            alert("Please upload a prescription file.");
            return;
        }

        const formData = new FormData();
        formData.append("prescription", prescriptionFile);

        try {
            // Send the prescription file to the backend for authentication
            const response = await axios.post('/api/authenticate-prescription', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.data.isValid) {
                setIsAuthenticated(true);
                alert("Prescription authenticated successfully!");
            } else {
                alert("Invalid prescription.");
            }
        } catch (error) {
            console.error("Error authenticating prescription:", error);
            alert("Failed to authenticate prescription.");
        }
    };

    useEffect(() => {
        fetchProducts(selectedCategory, selectedCategory === "Prescription Medication");
    }, [selectedCategory]);

    useEffect(() => {
        const fetchCartCount = async () => {
            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
                const cartsRef = collection(db, "carts");
                const cartQuery = query(cartsRef, where("userId", "==", user.uid));
                const cartSnapshot = await getDocs(cartQuery);
                setCartCount(cartSnapshot.docs.length);
            }
        };
        fetchCartCount();
    }, []);

    const handleCategoryChange = (category) => {
        setSearchTerm(""); 
        setSelectedCategory(category);
    };

    const handleSearchChange = debounce((e) => {
        setSearchTerm(e.target.value);
    }, 300);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const viewCart = () => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
            alert("You need to be logged in to view your cart.");
            return;
        }
        navigate(`/user/kiosk/cart/${user.uid}`);
    };

    const handleProductClick = (productId) => {
        if (selectedCategory === "Prescription Medication" && !isAuthenticated) {
            alert("You must authenticate your prescription before viewing this product.");
            return;
        }
        navigate(`/user/kiosk/View-Product/${productId}`);
    };

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-gray-50">
            <aside className={`transition-all duration-500 ease-in-out ${isSidebarOpen ? "w-74" : "w-20"} bg-green-700 text-white p-6`}>
                <button onClick={toggleSidebar} className="text-white mb-6 focus:outline-none">
                    {isSidebarOpen ? <RxHamburgerMenu /> : ">>"}
                </button>
                {isSidebarOpen && <h2 className="text-2xl font-semibold mb-6">Categories</h2>}
                <ul className="space-y-4">
                    {categories.map((category) => (
                        <li
                            key={category.name}
                            className={`flex items-center p-2 cursor-pointer rounded-md transition-all duration-300 ${selectedCategory === category.name ? "bg-green-800 text-white" : "hover:bg-green-600 text-gray-200"}`}
                            onClick={() => handleCategoryChange(category.name)}
                        >
                            <span className="text-xl mr-4">{category.icon}</span>
                            {isSidebarOpen && <span className="text-lg">{category.name}</span>}
                        </li>
                    ))}
                </ul>
            </aside>

            <main className="flex-grow p-6 transition-all duration-300">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-3xl font-bold text-gray-800">{selectedCategory}</h2>
                        <input
                            type="text"
                            placeholder="Search product..."
                            onChange={handleSearchChange}
                            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-green-500"
                        />
                    </div>
                    <div className="flex items-center space-x-4">
                        <button onClick={viewCart} className="relative">
                            <AiOutlineShoppingCart className="text-3xl text-green-600" />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs px-2 py-0.5">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                        {selectedCategory === "Prescription Medication" && (
                            <div className="flex items-center pl-8">
                                <input 
                                    type="file" 
                                    onChange={handleFileUpload}
                                    className="text-sm file:border-0 file:bg-blue-500 file:text-white file:py-1 file:px-3 file:rounded-md hover:file:bg-blue-600 focus:outline-none transition-colors"
                                />
                                {prescriptionFile && (
                                    <span className="text-sm text-gray-700">File Selected</span>
                                )}
                            </div>
                        )}

                    </div>
                </div>

                {loading ? (
                    <p className="text-gray-500 mt-4">Loading products...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <div
                            key={product.id}
                            onClick={() => handleProductClick(product.id)}
                            className="relative group bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transition-all hover:shadow-md"
                            >
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                            />

                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-green-600 transition-colors duration-300">
                                {product.name}
                                </h3>

                                <p className="text-sm text-gray-500 mt-2 line-clamp-2">{product.description}</p>

                                <p className="text-lg font-semibold text-gray-900 mt-4">₱{product.price}</p>
                            </div>

                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                            </div>
                        ))}
                        </div>


                )}
            </main>
        </div>
    );
};

export default Kiosk;
