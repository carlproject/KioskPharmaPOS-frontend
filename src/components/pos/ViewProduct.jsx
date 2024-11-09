import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import 'react-toastify/dist/ReactToastify.css';

function ViewProduct({ product }) {
    const navigate = useNavigate();
    const [selectedDosage, setSelectedDosage] = useState('');
    const [stockLevel, setStockLevel] = useState(product.stockLevel);

    useEffect(() => {
        const productRef = doc(db, 'products', product.id);
        const unsubscribe = onSnapshot(productRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                setStockLevel(docSnapshot.data().stockLevel);
            }
        });
        return () => unsubscribe();
    }, [product.id]);

    const handleDosageChange = (dosage) => {
        setSelectedDosage(dosage);
    };

    const SubmitToCart = async () => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;

            const cartItem = {
                productId: product.id,
                userId: user.uid,
                imageUrl: product.imageUrl,
                name: product.name,
                price: product.price,
                quantity: 1,
                ...(selectedDosage && { dosage: selectedDosage }),
            };

            const response = await axios.post('http://localhost:5000/user/kiosk/view-product/add', cartItem);
            toast.success(response.data);
        } catch (error) {
            const errorMessage = error.response?.data || 'Failed to add item to cart';
            toast.error(errorMessage);
        }
    };

    return (
        <section className="min-h-screen flex justify-center items-center bg-gray-50 p-6">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />

            <div className="w-full max-w-7xl bg-white shadow-lg rounded-lg overflow-hidden flex flex-col lg:flex-row">
                <div className="lg:w-1/2 flex justify-center items-center overflow-hidden">
                    <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="w-full h-full object-cover lg:rounded-l-lg transition-transform duration-300 hover:scale-105" 
                    />
                </div>

                <div className="lg:w-1/2 p-8 flex flex-col justify-between space-y-6">
                    <div>
                        <button 
                            onClick={() => navigate(-1)}
                            className="flex items-center text-gray-700 bg-gray-100 py-2 px-4 rounded-md hover:bg-gray-200 transition duration-200 mb-6"
                        >
                            <FaArrowLeft className="mr-2 text-green-600" />
                            Go Back
                        </button>
                        
                        <p className="text-xl font-medium text-indigo-600 mb-2">{product.category}</p>
                        <h2 className="font-bold text-4xl text-gray-900 capitalize mb-4">{product.name}</h2>

                        <div className="flex items-center space-x-6 mb-6">
                            <h6 className="text-3xl font-semibold text-gray-800">₱{product.price}</h6>
                            <span className="text-gray-500 text-sm">84 reviews</span>
                            <span className={`text-lg font-semibold ${stockLevel > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {stockLevel > 0 ? `In Stock: ${stockLevel}` : 'Out of Stock'}
                            </span>
                        </div>

                        <p className="text-gray-600 text-lg mb-8 leading-relaxed">{product.description}</p>

                        <p className="text-gray-900 font-medium text-lg mb-4">Dosages</p>
                        <div className="grid grid-cols-3 gap-4 mb-10">
                            {product.dosages.map((dosage, index) => (
                                <label key={index} className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="dosage"
                                        value={dosage}
                                        checked={selectedDosage === dosage}
                                        onChange={() => handleDosageChange(dosage)}
                                        className="hidden peer"
                                    />
                                    <span className="w-full py-3 text-center border border-gray-300 rounded-lg bg-white peer-checked:bg-indigo-600 peer-checked:text-white transition duration-200">
                                        {dosage}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                    
                    <button
                        onClick={SubmitToCart}
                        className={`w-full py-4 ${
                            stockLevel > 0 ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        } font-semibold rounded-full transition duration-300 text-lg`}
                        disabled={stockLevel <= 0}
                    >
                        {stockLevel > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                </div>
            </div>
        </section>
    );
}

export default ViewProduct;
