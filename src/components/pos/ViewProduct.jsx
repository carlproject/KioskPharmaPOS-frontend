import { React, useState } from 'react';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa'; 

function ViewProduct({ product }) {
    const navigate = useNavigate();
    const [selectedDosage, setSelectedDosage] = useState(''); // Change to singular since it's one selected dosage

    const handleDosageChange = (dosage) => {
        setSelectedDosage(dosage); // Set the selected dosage
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
                dosage: selectedDosage,
            };

            const response = await axios.post('http://localhost:5000/user/kiosk/view-product/add', cartItem);
            alert(response.data);
        } catch (error) {
            console.error('Error adding item to cart:', error);
            alert('Failed to add item to cart');
        }
    };

    return (
        <section className="relative">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mx-auto max-md:px-2">
                    <div className="img">
                        <div className="img-box h-full mr-6 max-lg:mx-auto">
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="max-lg:mx-auto lg:ml-auto h-full object-cover"
                            />
                        </div>
                    </div>
                    
                    <div className="data w-full lg:pr-8 pr-0 xl:justify-start justify-center flex items-center max-lg:pb-10 xl:my-2 lg:my-5 my-0">
                        <div className="data w-full max-w-xl">
                        <button 
                            onClick={() => navigate(-1)}
                            className="flex items-center text-gray-900 bg-gray-200 p-2 rounded hover:bg-gray-300 transition duration-200"
                        >
                            <FaArrowLeft className="mr-2 text-green-600" />
                            Go Back
                        </button>
                            <p className="text-lg font-medium leading-8 text-indigo-600 mb-4">
                                {product.category}
                            </p>
                            <h2 className="font-manrope font-bold text-3xl leading-10 text-gray-900 mb-2 capitalize">
                                {product.name} 
                            </h2>
                            <div className="flex flex-col sm:flex-row sm:items-center mb-6">
                                <h6 className="font-manrope font-semibold text-2xl leading-9 text-gray-900 pr-5 sm:border-r border-gray-200 mr-5">
                                    ₱{product.price}
                                </h6>
                                <div className="flex items-center gap-2">
                                    <span className="pl-2 font-normal leading-7 text-gray-500 text-sm">1624 reviews</span>
                                </div>
                            </div>
                            <p className="text-gray-500 text-base font-normal mb-5">
                                {product.description} 
                            </p>
                            <p className="text-gray-900 text-lg leading-8 font-medium mb-4">Dosages</p>
                            <div className="w-full pb-8 border-b border-gray-100">
                                <div className="grid gap-3">
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
                                            <span className="flex items-center justify-center w-full py-2 border border-gray-300 rounded-lg bg-white peer-checked:bg-indigo-600 peer-checked:text-white transition-all duration-300">
                                                {dosage}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <p className="text-gray-900 text-lg leading-8 font-medium mb-4">Purposes</p>
                            <div className="w-full pb-8 border-b border-gray-100 flex-wrap">
                                <div className="grid grid-cols-3 min-[400px]:grid-cols-5 gap-3 max-w-md">
                                    {product.purposes.map((purpose, index) => (
                                        <label key={index} className="flex items-center">
                                            {purpose} 
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-3 justify-between flex-col sm:flex-row mt-10">
                                <button
                                    onClick={SubmitToCart}
                                    className="w-full flex items-center justify-center bg-gray-900 text-white font-semibold text-base leading-6 h-12 rounded-full transition-all duration-300 hover:bg-gray-800"
                                    disabled={!selectedDosage} 
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ViewProduct;
