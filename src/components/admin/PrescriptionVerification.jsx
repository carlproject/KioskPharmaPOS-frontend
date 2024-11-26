import { React, useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function PrescriptionVerification() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch prescriptions and products from Firestore
  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const prescriptionRef = collection(db, 'prescriptions');
        const q = query(prescriptionRef, where('status', '==', 'Pending'));
        const querySnapshot = await getDocs(q);

        const fetchedPrescriptions = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPrescriptions(fetchedPrescriptions);
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const productRef = collection(db, 'products');
        const q = query(productRef, where('category', '==', 'Prescription Medication'));
        const querySnapshot = await getDocs(q);

        const fetchedProducts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchPrescriptions();
    fetchProducts();
    setLoading(false);
  }, []);

  const handleStatusUpdate = async (prescriptionId, newStatus, selectedProductIds) => {
    try {
      const prescriptionDocRef = doc(db, 'prescriptions', prescriptionId);
      await updateDoc(prescriptionDocRef, {
        status: newStatus,
        productsAccess: selectedProductIds, // Save selected product IDs to the prescription document
      });

      setPrescriptions((prevPrescriptions) =>
        prevPrescriptions.map((prescription) =>
          prescription.id === prescriptionId
            ? { ...prescription, status: newStatus, productsAccess: selectedProductIds }
            : prescription
        )
      );

      if (newStatus === 'Approved') {
        toast.success(`Prescription ID: ${prescriptionId} has been approved!`);
      } else if (newStatus === 'Rejected') {
        toast.error(`Prescription ID: ${prescriptionId} has been rejected!`);
      }
    } catch (error) {
      console.error('Error updating prescription status:', error);
      toast.error('Error updating prescription status.');
    }
  };

  if (loading) {
    return <div>Loading prescriptions...</div>;
  }

  return (
    <div className="p-4 sm:ml-64">
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Prescription Verification</h1>

        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase">User ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase">Prescription File</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase">Timestamp</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase">Actions</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase">Select Products</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((prescription) => (
                <tr key={prescription.id} className="border-b">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{prescription.userId}</td>
                  <td className="px-6 py-4 text-sm font-medium text-blue-500">
                    <a href={prescription.fileURL} target="_blank" rel="noopener noreferrer">
                      View Prescription
                    </a>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        prescription.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : prescription.status === 'Approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {prescription.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-700">
                    {new Date(prescription.timestamp.seconds * 1000).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-700 space-x-3">
                    {prescription.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(prescription.id, 'Approved', [])}
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(prescription.id, 'Rejected', [])}
                          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-700">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center space-x-2">
                        <input
                        type="checkbox"
                        onChange={(e) => {
                            const currentProductsAccess = prescription.productsAccess || [];
                            const productIds = e.target.checked
                            ? [...currentProductsAccess, product.id]
                            : currentProductsAccess.filter((id) => id !== product.id);
                            handleStatusUpdate(prescription.id, prescription.status, productIds);
                        }}
                        checked={prescription.productsAccess?.includes(product.id) || false}
                        />
                        <span>{product.name}</span>
                    </div>
                    ))}

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PrescriptionVerification;
