import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { db  } from '../../config/firebase';
import { AiOutlineWarning, AiOutlineCheckCircle, AiOutlineReload } from 'react-icons/ai';

function Inventory() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchInventory = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsData);
    };

    fetchInventory();
  }, [db]);

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

                {product.purposes && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">Purposes: {product.purposes.join(', ')}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Inventory;
