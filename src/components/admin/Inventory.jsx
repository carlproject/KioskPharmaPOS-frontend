import React, { useEffect, useState } from 'react';
import { collection, doc, updateDoc, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from '../LoadingSpinner';

function Inventory() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newStockLevel, setNewStockLevel] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = () => {
      const productsRef = collection(db, "products");
      const unsubscribe = onSnapshot(productsRef, (querySnapshot) => {
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          imageLoaded: false
        }));
        setProducts(productsData);
        setLoading(false);
      });

      return () => unsubscribe();
    };

    fetchInventory();
  }, []);

  const handleRestock = async () => {
    if (selectedProduct && newStockLevel) {
      const productRef = doc(db, "products", selectedProduct);
      const productSnapshot = await getDoc(productRef); 
      if (productSnapshot.exists()) {
        const currentStockLevel = productSnapshot.data().stockLevel;
        const updatedStockLevel = currentStockLevel + Number(newStockLevel);

        await updateDoc(productRef, { stockLevel: updatedStockLevel });
        toast.success("Stock level updated successfully!");

        setSelectedProduct(null);
        setNewStockLevel(""); 
      } else {
        toast.error("Product not found.");
      }
    } else {
      toast.error("Please enter a valid stock level.");
    }
  };

  const openModal = (productId) => {
    setSelectedProduct(productId);
    setNewStockLevel("");
  };

  const handleImageLoad = (index) => {
    const updatedProducts = [...products];
    updatedProducts[index].imageLoaded = true;
    setProducts(updatedProducts);

    if (updatedProducts.every(product => product.imageLoaded)) {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:ml-64 bg-gray-100 min-h-screen">
      <div className="p-6 border-2 border-gray-300 bg-white rounded-lg dark:border-gray-700 shadow-lg mt-14">
        <section className="py-8">
          <h1 className="text-3xl font-bold mb-4 text-green-600">Inventory Management</h1>
          <p className="text-gray-700 mb-6">Manage stock levels, track batches, and get real-time alerts for low inventory or upcoming expirations.</p>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <div key={product.id} className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-40 object-cover rounded-lg mb-4" 
                    onLoad={() => handleImageLoad(index)}
                  />
                  
                  <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
                  <p className="text-sm text-gray-600">Category: {product.category}</p>
                  <p className="text-sm text-gray-600">Price: ${product.price}</p>
                  <p className="text-sm text-gray-600">Prescription Needed: {product.prescriptionNeeded ? 'Yes' : 'No'}</p>
                  <p className="text-sm text-gray-600">Dosages: {product.dosages.join(', ')}</p>

                  <p className={`text-sm font-semibold mt-2 ${product.stockLevel === 0 ? 'text-red-600' : product.stockLevel < 10 ? 'text-orange-500' : 'text-green-600'}`}>
                    Stock Level: {product.stockLevel} {product.stockLevel === 0 ? '- Out of Stock!' : product.stockLevel < 10 ? ' - Low Stock!' : ''}
                  </p>

                  <button 
                    onClick={() => openModal(product.id)} 
                    className="mt-3 w-full py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
                  >
                    Restock
                  </button>

                  {product.purposes && (
                    <p className="text-sm text-gray-600 mt-2">Purposes: {product.purposes.join(', ')}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {selectedProduct && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-80 transform transition-all">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Restock Product</h2>
                <input
                  type="number"
                  value={newStockLevel}
                  onChange={(e) => setNewStockLevel(e.target.value)}
                  placeholder="Enter stock to add"
                  className="border-2 border-gray-300 p-2 rounded w-full mb-4 focus:outline-none focus:border-green-600"
                />
                <div className="flex justify-end">
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-red-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRestock}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Update Stock
                  </button>
                </div>
              </div>
            </div>
          )}

          <ToastContainer />
        </section>
      </div>
    </div>
  );
}

export default Inventory;
