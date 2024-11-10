import React, { useState } from 'react';
import { db } from '../../config/firebase';
import { collection, addDoc } from 'firebase/firestore';

function PrescriptionManagement() {
  const [prescriptionName, setPrescriptionName] = useState('');
  const [dosages, setDosages] = useState(['']);
  const [instructions, setInstructions] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddPrescription = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!prescriptionName || !instructions || dosages.some(dosage => dosage === '')) {
      setErrorMessage('Please fill out all fields.');
      return;
    }

    try {
      const prescriptionsCollection = collection(db, 'prescriptions');
      await addDoc(prescriptionsCollection, {
        prescriptionName,
        dosages,
        instructions,
        createdAt: new Date()
      });
      setSuccessMessage('Prescription added successfully!');
      setPrescriptionName('');
      setDosages(['']);
      setInstructions('');
    } catch (error) {
      setErrorMessage('Error adding prescription. Please try again.');
      console.error("Error adding prescription:", error);
    }
  };

  const handleAddDosage = () => {
    setDosages([...dosages, '']);
  };

  const handleRemoveDosage = (index) => {
    setDosages(dosages.filter((_, i) => i !== index));
  };

  const handleDosageChange = (index, value) => {
    const updatedDosages = [...dosages];
    updatedDosages[index] = value;
    setDosages(updatedDosages);
  };

  return (
    <div className="p-6 sm:ml-64">
      <div className="p-6 border-2 border-gray-200 border-dashed rounded-lg shadow-lg mt-14 bg-gray-100">
        <h2 className="text-2xl font-semibold mb-4">Prescription Management</h2>
        
        <form onSubmit={handleAddPrescription} className="space-y-4">
          <div>
            <label className="block font-medium">Prescription Name:</label>
            <input
              type="text"
              value={prescriptionName}
              onChange={(e) => setPrescriptionName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block font-medium">Dosages:</label>
            {dosages.map((dosage, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={dosage}
                  onChange={(e) => handleDosageChange(index, e.target.value)}
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemoveDosage(index)}
                  className="px-2 py-1 bg-red-500 text-white rounded-md"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddDosage}
              className="px-4 py-2 bg-green-500 text-white rounded-md"
            >
              Add Dosage
            </button>
          </div>

          <div>
            <label className="block font-medium">Instructions:</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          {successMessage && <p className="text-green-500">{successMessage}</p>}
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}

          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-md"
          >
            Add Prescription
          </button>
        </form>
      </div>
    </div>
  );
}

export default PrescriptionManagement;
