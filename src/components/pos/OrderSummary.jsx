import { React, useState } from "react";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable"; 

function OrderSummary() {
    const location = useLocation();
    const { orderId, transactionData } = location.state || {};

  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const displayName = user.displayName;
    if (!transactionData) {
        return <p>Loading...</p>;
    }

    const handleDownloadInvoice = () => {
        const doc = new jsPDF();
    
        // Define Colors and Styles
        const primaryColor = "#2F855A"; // Green color for Checacio
        const secondaryColor = "#4A5568"; // Gray for section separators
    
        // Invoice Header
        doc.setFontSize(22);
        doc.setTextColor(primaryColor);
        doc.text("Checacio Pharmacy", 10, 20);
        
        doc.setFontSize(14);
        doc.setTextColor("#000000");
        doc.text(`Order Confirmation`, 10, 30);
        doc.setFontSize(12);
        doc.setTextColor(secondaryColor);
        doc.text(`Order for: ${displayName}`, 10, 40);
        doc.text(`Order ID: ${orderId}`, 10, 50);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 10, 60);
        doc.text(`Payment Method: ${transactionData.paymentMethod}`, 10, 70);
    
        // Draw a separator line
        doc.setDrawColor(200, 200, 200);
        doc.line(10, 75, 200, 75); // x1, y1, x2, y2
    
        // Order Summary Header
        doc.setFontSize(16);
        doc.setTextColor(primaryColor);
        doc.text("Order Summary", 10, 85);
    
        // Table Columns: Item Name, Dosage, Quantity, Price, Total
        const itemRows = transactionData.items.map(item => ([
            item.name,
            item.dosage || "N/A",
            item.quantity,
            `$${item.price.toFixed(2)}`,
            `$${(item.price * item.quantity).toFixed(2)}`
        ]));
    
        doc.autoTable({
            startY: 90,
            head: [["Item Name", "Dosage", "Quantity", "Price", "Total"]],
            body: itemRows,
            theme: "striped",
            headStyles: {
                fillColor: [47, 133, 90],
                textColor: 255,
                fontSize: 12,
                fontStyle: "bold"
            },
            styles: { cellPadding: 4, fontSize: 10 },
            columnStyles: { 4: { halign: "right" } }
        });
    
        // Calculate Final Y position after Table
        let finalY = doc.previousAutoTable.finalY + 10;
    
        // Cost Breakdown Section
        doc.setTextColor(secondaryColor);
        doc.setFontSize(12);
        const subtotal = transactionData.total.toFixed(2) - 100;
        const deliveryCharge = 50.00;
        const tax = 50.00;
        const totalAmount = parseFloat(transactionData.total).toFixed(2);
    
        doc.text(`Subtotal: ₱${subtotal.toFixed(2)}`, 140, finalY);
        doc.text(`Delivery Charge: ₱${deliveryCharge.toFixed(2)}`, 140, finalY + 10);
        doc.text(`Taxes: ₱${tax.toFixed(2)}`, 140, finalY + 20);
    
        // Total Amount
        doc.setTextColor(primaryColor);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(`Total: ₱${totalAmount}`, 140, finalY + 35);
    
        // Add Footer Notes
        doc.setTextColor(secondaryColor);
        doc.setFontSize(10);
        doc.text("Thank you for your purchase!", 10, finalY + 50);
        doc.text("For questions, contact Checacio Pharmacy customer support.", 10, finalY + 55);
    
        // Save the PDF
        doc.save(`Checacio_Invoice_${orderId}.pdf`);
    };
    

    return (
        <section className="py-24 relative">
            <div className="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto">
                <h2 className="font-manrope font-bold text-3xl sm:text-4xl leading-10 text-black mb-11">
                    Your Order Confirmed
                </h2>
                <h6 className="font-medium text-xl leading-8 text-black mb-3">Hello, {displayName}</h6>
                <p className="font-normal text-lg leading-8 text-gray-500 mb-11">
                    Your order has been completed and will be delivered in only two days.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8 py-6 border-y border-gray-100 mb-6">
                    <div className="box group">
                        <p className="font-normal text-base leading-7 text-gray-500 mb-3 transition-all duration-500 group-hover:text-gray-700">Delivery Date</p>
                        <h6 className="font-semibold font-manrope text-2xl leading-9 text-black">Dec 01, 2023</h6>
                    </div>
                    <div className="box group">
                        <p className="font-normal text-base leading-7 text-gray-500 mb-3 transition-all duration-500 group-hover:text-gray-700">Order</p>
                        <h6 className="font-semibold font-manrope text-2xl leading-9 text-black">{orderId}</h6>
                    </div>
                    <div className="box group">
                        <p className="font-normal text-base leading-7 text-gray-500 mb-3 transition-all duration-500 group-hover:text-gray-700">Payment Method</p>
                        <h6 className="font-semibold font-manrope text-2xl leading-9 text-black">{transactionData.paymentMethod}</h6>
                    </div>
                    <div className="box group">
                        <p className="font-normal text-base leading-7 text-gray-500 mb-3 transition-all duration-500 group-hover:text-gray-700">Print Invoice/Receipt</p>
                        <button onClick={handleDownloadInvoice} className="font-semibold border-2 border-green-500 p-2 rounded-lg bg-green-600 text-white font-manrope text-2xl leading-9 text-black">Download</button>
                    </div>
                </div>

                {transactionData.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-7 w-full pb-6 border-b border-gray-100">
                        <div className="col-span-7 min-[500px]:col-span-2 md:col-span-1">
                            <img src={item.imageUrl} alt={item.name} className="w-full rounded-xl object-cover h-[200px]" />
                        </div>
                        <div className="col-span-7 min-[500px]:col-span-5 md:col-span-6 min-[500px]:pl-5 max-sm:mt-5 flex flex-col justify-center">
                            <div className="flex flex-col min-[500px]:flex-row min-[500px]:items-center justify-between">
                                <div>
                                    <h5 className="font-manrope font-semibold text-2xl leading-9 text-black mb-6">{item.name}</h5>
                                    <p className="font-normal text-xl leading-8 text-gray-500">Quantity : <span className="text-black font-semibold">{item.quantity}</span></p>
                                </div>
                                <h5 className="font-manrope font-semibold text-3xl leading-10 text-black sm:text-right mt-3">₱{item.price}</h5>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="flex items-center justify-center sm:justify-end w-full my-6">
                    <div className="w-full">
                        <div className="flex items-center justify-between mb-6">
                            <p className="font-normal text-xl leading-8 text-gray-500">Subtotal</p>
                            <p className="font-semibold text-xl leading-8 text-gray-900">₱{transactionData.total - 100}</p>
                        </div>
                        <div className="flex items-center justify-between mb-6">
                            <p className="font-normal text-xl leading-8 text-gray-500">Delivery Charge</p>
                            <p className="font-semibold text-xl leading-8 text-gray-900">₱50.00</p>
                        </div>
                        <div className="flex items-center justify-between mb-6">
                            <p className="font-normal text-xl leading-8 text-gray-500">Taxes</p>
                            <p className="font-semibold text-xl leading-8 text-gray-900">₱50.00</p>
                        </div>
                        <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                            <p className="font-semibold text-2xl leading-9 text-black">Total</p>
                            <p className="font-semibold text-2xl leading-9 text-black">₱{transactionData.total}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default OrderSummary;
