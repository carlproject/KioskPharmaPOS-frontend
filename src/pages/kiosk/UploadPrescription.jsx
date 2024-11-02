import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

function UploadPrescription() {
  const [image, setImage] = useState(null);
  const [extractedText, setExtractedText] = useState(null);
  const [medicationDetails, setMedicationDetails] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      
      // Extract text with Tesseract.js
      try {
        const ocrResult = await Tesseract.recognize(file, 'eng', {
          logger: (m) => console.log(m), // Log the progress of OCR
        });
        const text = ocrResult.data.text;
        setExtractedText(text);
        console.log("Extracted Text:", text); // Log for debugging

        // Extract medication details
        extractMedicationDetails(text);

      } catch (error) {
        console.error("OCR failed:", error);
        setExtractedText("Could not extract text from the image.");
      }
    }
  };

  const extractMedicationDetails = (text) => {
    const regex = /([A-Za-z\s]+)\s+\(No\s+Generics\)\s+disp:\s+(\w+)\s+(\d+mg\s+capsules)/; // Adjust regex
    const match = text.match(regex);
    if (match) {
      setMedicationDetails(`Medication: ${match[1]}, Quantity: ${match[2]} ${match[3]}`);
    } else {
      setMedicationDetails("Medication details not found.");
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" capture="camera" onChange={handleImageUpload} />
      {image && <img src={image} alt="Prescription Preview" />}
      {extractedText && (
        <div>
          <h3>Extracted Text:</h3>
          <p>{extractedText}</p>
        </div>
      )}
      {medicationDetails && (
        <div>
          <h3>Medication Details:</h3>
          <p>{medicationDetails}</p>
        </div>
      )}
    </div>
  );
}

export default UploadPrescription;
