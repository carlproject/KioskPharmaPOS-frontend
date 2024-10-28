import { React, useState } from 'react';

function AddProduct() {
  const [purposes, setPurposes] = useState(['']);
  const [stockLevel, setStockLevel] = useState(0); 

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: null,
    prescriptionNeeded: '',
  });

  const addPurpose = () => {
    setPurposes([...purposes, '']);
  };

  const updatePurpose = (index, value) => {
    const updatedPurposes = [...purposes];
    updatedPurposes[index] = value;
    setPurposes(updatedPurposes);
  };

  const deletePurpose = (index) => {
    const updatedPurposes = purposes.filter((_, i) => i !== index);
    setPurposes(updatedPurposes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('description', formData.description);
    data.append('image', formData.image);
    data.append('stockLevel', stockLevel);
    data.append('prescriptionNeeded', formData.prescriptionNeeded);
    purposes.forEach((purpose) => data.append('purposes', purpose));

    try {
      const response = await fetch('http://localhost:5000/admin/add-product', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();
      if (response.ok) {
        alert('Product added successfully!');
        // Optionally reset the form
        setFormData({
          name: '',
          price: '',
          description: '',
          image: null,
          prescriptionNeeded: '',
        });
        setPurposes(['']);
        setStockLevel(0);
      } else {
        alert('Failed to add product: ' + result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while adding the product.');
    }
  };

  return (
    <div className="p-4 sm:ml-64">
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
        <section className="py-24 relative">
          <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
            <div className="w-full flex-col justify-start items-start lg:gap-14 md:gap-10 gap-8 inline-flex">
              <div className="w-full flex-col justify-center items-center gap-4 flex">
                <h2 className="text-center text-gray-900 text-4xl font-bold font-manrope leading-normal">Add New Product</h2>
                <p className="max-w-4xl text-center text-gray-500 text-base font-normal leading-relaxed">
                  Fill out the form below to add a new product/medicine to Checaio's Store Kiosk.
                </p>
              </div>
              <form
                action="/admin-add-product"
                method="POST"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                className="w-full flex-col justify-start items-start gap-6 flex"
              >
                <h4 className="text-gray-900 text-xl font-semibold leading-loose">Product Details</h4>
                <div className="w-full flex-col justify-start items-start gap-8 flex">
                  <div className="w-full justify-start items-start gap-8 flex sm:flex-row flex-col">
                    <div className="w-full flex-col justify-start items-start gap-1.5 flex">
                      <label htmlFor="productName" className="flex gap-1 items-center text-gray-600 text-base font-medium leading-relaxed">
                        Product Name
                        <svg xmlns="http://www.w3.org/2000/svg" width="7" height="7" viewBox="0 0 7 7" fill="none">
                          <path
                            d="M3.11222 6.04545L3.20668 3.94744L1.43679 5.08594L0.894886 4.14134L2.77415 3.18182L0.894886 2.2223L1.43679 1.2777L3.20668 2.41619L3.11222 0.318182H4.19105L4.09659 2.41619L5.86648 1.2777L6.40838 2.2223L4.52912 3.18182L6.40838 4.14134L5.86648 5.08594L4.09659 3.94744L4.19105 6.04545H3.11222Z"
                            fill="#EF4444"
                          />
                        </svg>
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="productName"
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full focus:outline-none text-gray-900 placeholder-gray-400 text-lg font-normal leading-relaxed px-5 py-3 rounded-lg shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] border border-gray-200 justify-start items-center gap-2 inline-flex"
                        placeholder="Enter product name"
                        required
                      />
                    </div>
                    <div className="w-full flex-col justify-start items-start gap-1.5 flex">
                      <label htmlFor="productPrice" className="flex gap-1 items-center text-gray-600 text-base font-medium leading-relaxed">
                        Price
                        <svg xmlns="http://www.w3.org/2000/svg" width="7" height="7" viewBox="0 0 7 7" fill="none">
                          <path
                            d="M3.11222 6.04545L3.20668 3.94744L1.43679 5.08594L0.894886 4.14134L2.77415 3.18182L0.894886 2.2223L1.43679 1.2777L3.20668 2.41619L3.11222 0.318182H4.19105L4.09659 2.41619L5.86648 1.2777L6.40838 2.2223L4.52912 3.18182L6.40838 4.14134L5.86648 5.08594L4.09659 3.94744L4.19105 6.04545H3.11222Z"
                            fill="#EF4444"
                          />
                        </svg>
                      </label>
                      <input
                        type="number"
                        name="price"
                        id="productPrice"
                        className="w-full focus:outline-none text-gray-900 placeholder-gray-400 text-lg font-normal leading-relaxed px-5 py-3 rounded-lg shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] border border-gray-200 justify-start items-center gap-2 inline-flex"
                        placeholder="Enter price"
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="w-full justify-start items-start gap-8 flex sm:flex-row flex-col">
                    <div className="w-full flex-col justify-start items-start gap-1.5 flex">
                      <label htmlFor="productDescription" className="flex gap-1 items-center text-gray-600 text-base font-medium leading-relaxed">
                        Description
                        <svg xmlns="http://www.w3.org/2000/svg" width="7" height="7" viewBox="0 0 7 7" fill="none">
                          <path
                            d="M3.11222 6.04545L3.20668 3.94744L1.43679 5.08594L0.894886 4.14134L2.77415 3.18182L0.894886 2.2223L1.43679 1.2777L3.20668 2.41619L3.11222 0.318182H4.19105L4.09659 2.41619L5.86648 1.2777L6.40838 2.2223L4.52912 3.18182L6.40838 4.14134L5.86648 5.08594L4.09659 3.94744L4.19105 6.04545H3.11222Z"
                            fill="#EF4444"
                          />
                        </svg>
                      </label>
                      <textarea
                        name="description"
                        id="productDescription"
                        className="w-full focus:outline-none text-gray-900 placeholder-gray-400 text-lg font-normal leading-relaxed px-5 py-3 rounded-lg shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] border border-gray-200 justify-start items-center gap-2 inline-flex"
                        placeholder="Enter product description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows="4"
                        required
                      ></textarea>
                    </div>
                  </div>
                  <div className="w-full justify-start items-start gap-8 flex sm:flex-row flex-col">
                    <div className="w-full flex-col justify-start items-start gap-1.5 flex">
                      <label htmlFor="productImage" className="flex gap-1 items-center text-gray-600 text-base font-medium leading-relaxed">
                        Product Image
                        <svg xmlns="http://www.w3.org/2000/svg" width="7" height="7" viewBox="0 0 7 7" fill="none">
                          <path
                            d="M3.11222 6.04545L3.20668 3.94744L1.43679 5.08594L0.894886 4.14134L2.77415 3.18182L0.894886 2.2223L1.43679 1.2777L3.20668 2.41619L3.11222 0.318182H4.19105L4.09659 2.41619L5.86648 1.2777L6.40838 2.2223L4.52912 3.18182L6.40838 4.14134L5.86648 5.08594L4.09659 3.94744L4.19105 6.04545H3.11222Z"
                            fill="#EF4444"
                          />
                        </svg>
                      </label>
                      <input
                        type="file"
                        name="image"
                        id="productImage"
                        onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                        className="w-full focus:outline-none text-gray-900 placeholder-gray-400 text-lg font-normal leading-relaxed px-5 py-3 rounded-lg shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] border border-gray-200 justify-start items-center gap-2 inline-flex"
                        required
                      />
                    </div>
                  </div>

                  <div className="w-full flex-col justify-start items-start gap-1.5 flex">
                    <label htmlFor="stockLevel" className="flex gap-1 items-center text-gray-600 text-base font-medium leading-relaxed">
                      Stock Level
                      <svg xmlns="http://www.w3.org/2000/svg" width="7" height="7" viewBox="0 0 7 7" fill="none">
                        <path
                          d="M3.11222 6.04545L3.20668 3.94744L1.43679 5.08594L0.894886 4.14134L2.77415 3.18182L0.894886 2.2223L1.43679 1.2777L3.20668 2.41619L3.11222 0.318182H4.19105L4.09659 2.41619L5.86648 1.2777L6.40838 2.2223L4.52912 3.18182L6.40838 4.14134L5.86648 5.08594L4.09659 3.94744L4.19105 6.04545H3.11222Z"
                          fill="#EF4444"
                        />
                      </svg>
                    </label>
                    <input
                      type="number"
                      name="stockLevel"
                      id="stockLevel"
                      min="0"
                      className="w-full focus:outline-none text-gray-900 placeholder-gray-400 text-lg font-normal leading-relaxed px-5 py-3 rounded-lg shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] border border-gray-200 justify-start items-center gap-2 inline-flex"
                      placeholder="Enter stock level"
                      required
                      value={stockLevel}
                      onChange={(e) => setStockLevel(Number(e.target.value))}
                    />
                  </div>

                  <div className="w-full flex-col justify-start items-start gap-1.5 flex">
                  <label htmlFor="prescriptionNeeded" className="flex gap-1 items-center text-gray-600 text-base font-medium leading-relaxed">
                    Prescription Needed
                  </label>
                  <select
                    name="prescriptionNeeded"
                    id="prescriptionNeeded"
                    value={formData.prescriptionNeeded}
                    onChange={(e) => setFormData({ ...formData, prescriptionNeeded: e.target.value })}
                    className="w-full h-10 text-gray-700 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select an option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                  <div className="w-full flex-col justify-start items-start gap-4 flex">
                    <h4 className="text-gray-900 text-lg font-semibold leading-loose">Purposes</h4>
                    {purposes.map((purpose, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={purpose}
                          onChange={(e) => updatePurpose(index, e.target.value)}
                          className="w-full focus:outline-none text-gray-900 placeholder-gray-400 text-lg font-normal leading-relaxed px-5 py-3 rounded-lg shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] border border-gray-200"
                          placeholder="Enter purpose"
                        />
                        <button
                          type="button"
                          onClick={() => deletePurpose(index)}
                          className="bg-red-600 text-white px-3 py-2 rounded-lg"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addPurpose}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                      Add Purpose
                    </button>
                  </div>
                </div>
                <div className="w-full flex justify-end items-center mt-6">
                  <button
                    type="submit"
                    className="bg-green-600 w-full text-white px-6 py-3 rounded-lg"
                  >
                    Add Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AddProduct;
