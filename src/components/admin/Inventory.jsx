import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, doc, updateDoc, onSnapshot, getDoc } from 'firebase/firestore'; // make sure getDoc is imported
import { db } from '../../config/firebase';
import { AiOutlineWarning, AiOutlineCheckCircle, AiOutlineReload } from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Inventory() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newStockLevel, setNewStockLevel] = useState("");

  useEffect(() => {
    const fetchInventory = async () => {
      const productsRef = collection(db, "products");
      const unsubscribe = onSnapshot(productsRef, (querySnapshot) => {
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsData);
      });

      return () => unsubscribe();
    };

    fetchInventory();
  }, [db]);

  const handleRestock = async () => {
    if (selectedProduct && newStockLevel) {
      const productRef = doc(db, "products", selectedProduct);
      
      // Use getDoc to retrieve a single product's data
      const productSnapshot = await getDoc(productRef); 
      if (productSnapshot.exists()) {
        const currentStockLevel = productSnapshot.data().stockLevel;
        const updatedStockLevel = currentStockLevel + Number(newStockLevel);

        // Update the stock level in Firestore
        await updateDoc(productRef, { stockLevel: updatedStockLevel });
        toast.success("Stock level updated successfully!");

        // Reset states and close modal
        setSelectedProduct(null); // Close the modal
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
    setNewStockLevel(""); // Reset new stock level for the new entry
  };

  return (
    <div className="p-4 sm:ml-64">
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
        <section className="py-8 relative">
          <h1 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Inventory Management</h1>
          
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600 dark:text-gray-300">Manage your stock levels, track batches, and get real-time alerts for low inventory or upcoming expirations.</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition duration-200">
              <AiOutlineReload className="inline-block mr-2" /> Refresh Inventory
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
                <img src={product.imageUrl} alt={product.name} className="w-full h-32 object-cover rounded-lg mb-4" />
                
                <h2 className="text-lg font-bold text-gray-700 dark:text-gray-200">{product.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Category: {product.category}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Price: ${product.price}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Prescription Needed: {product.prescriptionNeeded ? 'Yes' : 'No'}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Dosages: {product.dosages.join(', ')}</p>

                <p className={`text-sm font-semibold mt-2 ${product.stockLevel < 10 ? 'text-red-500' : 'text-green-500'}`}>
                  Stock Level: {product.stockLevel} {product.stockLevel < 10 ? ' - Low Stock!' : ''}
                </p>

                <button 
                  onClick={() => openModal(product.id)} 
                  className="mt-2 w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
                >
                  Restock
                </button>

                {product.purposes && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">Purposes: {product.purposes.join(', ')}</p>
                )}
              </div>
            ))}
          </div>

          {/* Modal for Restocking */}
          {selectedProduct && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Restock Product</h2>
                <input
                  type="number"
                  value={newStockLevel}
                  onChange={(e) => setNewStockLevel(e.target.value)}
                  placeholder="Enter stock to add"
                  className="border p-2 rounded w-full mb-4"
                />
                <div className="flex justify-end">
                  <button
                    onClick={() => setSelectedProduct(null)} // Close modal
                    className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRestock}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
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
