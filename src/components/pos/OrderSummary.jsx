import { React, useState } from "react";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable"; 
import { IoIosArrowRoundBack } from "react-icons/io";
import logo from '../../assets/img/logo.png'

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
        
        const primaryColor = "#2F855A"; 
        const secondaryColor = "#4A5568"; 

        doc.addImage(logo, "PNG", 10, 10, 30, 30);
        doc.setFontSize(22);
        doc.setTextColor(primaryColor);
        doc.text("Checacio Pharmacy", 50, 20);

        doc.setFontSize(12);
        doc.setTextColor("#000000");
        doc.text(`Dose, Bayanan II, Calapan City, Oriental Mindoro, Philippines`, 50, 30);
        
        doc.setFontSize(12);
        doc.setTextColor(secondaryColor);
        doc.text(`Order for: ${displayName}`, 10, 50);
        doc.text(`Order ID: ${orderId}`, 10, 60);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 10, 70);
        doc.text(`Payment Method: ${transactionData.paymentMethod}`, 10, 80);
        
        doc.setDrawColor(200, 200, 200);
        doc.line(10, 85, 200, 85);

        doc.setFontSize(16);
        doc.setTextColor(primaryColor);
        doc.text("Order Summary", 10, 95);

        const itemRows = transactionData.items.map(item => ([
            item.name,
            item.dosage || "N/A",
            item.quantity,
            `₱${item.price.toFixed(2)}`,
            `₱${(item.price * item.quantity).toFixed(2)}`
        ]));
        
        doc.autoTable({
            startY: 100,
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

        let finalY = doc.previousAutoTable.finalY + 10;

        doc.setTextColor(secondaryColor);
        doc.setFontSize(12);
        
        const subtotal = transactionData.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const totalDiscount = transactionData.discountAmount || 0;
        const totalTax = transactionData.tax || 0;
        const totalAmount = (transactionData.total - transactionData.discountAmount) + transactionData.tax;

        doc.text(`Subtotal: ₱${subtotal.toFixed(2)}`, 10, finalY);
        doc.text(`Discount: ₱${totalDiscount.toFixed(2)}`, 10, finalY + 10);
        doc.text(`Taxes: ₱${totalTax.toFixed(2)}`, 10, finalY + 20);

        doc.setTextColor(primaryColor);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(`Total: ₱${totalAmount.toFixed(2)}`, 10, finalY + 35);

        doc.setTextColor(secondaryColor);
        doc.setFontSize(10);
        doc.text("Thank you for your purchase!", 10, finalY + 50);
        doc.text("For questions, contact Checacio Pharmacy customer support.", 10, finalY + 55);

        doc.save(`Checacio_Invoice_${orderId}.pdf`);
    };

    return (
        <section className="py-24 relative">
            <button onClick={() => window.location.href = "../../user/kiosk"} className="absolute flex items-center top-4 left-4 text-green-600 font-semibold border-b-2 hover:bg-border-600">
                <IoIosArrowRoundBack size={25}/>
                Back to Kiosk
            </button>
            <div className="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto">
                <h2 className="font-manrope font-bold text-3xl sm:text-4xl leading-10 text-black mb-11">
                    Your Order Confirmed
                </h2>
                <h6 className="font-medium text-xl leading-8 text-black mb-3">Hello, {displayName}</h6>
                <p className="font-normal text-lg leading-8 text-gray-500 mb-11">
                    Your order has been complete and please wait for the confirmation. We'll immediately notify you once it ready.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8 py-6 border-y border-gray-100 mb-6">
                    <div className="box group">
                        <p className="font-normal text-base leading-7 text-gray-500 mb-3 transition-all duration-500 group-hover:text-gray-700">Current Data</p>
                        <h6 className="font-semibold font-manrope text-2xl leading-9 text-black">11-9-2024</h6>
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
                            <p className="font-semibold text-xl leading-8 text-gray-900">₱{(transactionData.total).toFixed(2) }</p>
                        </div>
                        <div className="flex items-center justify-between mb-6">
                            <p className="font-normal text-xl leading-8 text-red-500">Savings</p>
                            <p className="font-semibold text-xl leading-8 text-red-500">₱{(transactionData.discountAmount).toFixed(2)}</p>
                        </div>
                        <div className="flex items-center justify-between mb-6">
                            <p className="font-normal text-xl leading-8 text-gray-500">Taxes</p>
                            <p className="font-semibold text-xl leading-8 text-gray-900">₱{transactionData.tax.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                            <p className="font-semibold text-2xl leading-9 text-black">Total</p>
                            <p className="font-semibold text-2xl leading-9 text-black">₱{((transactionData.total - transactionData.discountAmount) + transactionData.tax).toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default OrderSummary;
