import { React, useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { doc, setDoc, getDoc, collection } from "firebase/firestore";
import { db } from "../../config/firebase";
import { format } from 'date-fns';
import { IoIosArrowRoundBack } from "react-icons/io";

function OrderSummary() {
  const location = useLocation();
  const { orderId, transactionData } = location.state || {};
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [notificationSent, setNotificationSent] = useState(false); // Track if notifications are sent
  const notificationSentRef = useRef(false); // Using useRef to prevent re-sending

  const displayName = user.displayName;
  if (!transactionData) {
    return <p>Loading...</p>;
  }

  const getAdminFCMTokens = async () => {
    try {
      const adminRef = doc(db, "admin", "checachio@gmail.com");
      const adminDoc = await getDoc(adminRef);

      if (adminDoc.exists()) {
        const data = adminDoc.data();
        const fcmTokens = data.fcmTokens || [];

        if (fcmTokens.length > 0) {
          return fcmTokens;
        } else {
          console.warn("No FCM tokens found for the admin.");
          return null;
        }
      } else {
        console.error("Admin document does not exist.");
        return null;
      }
    } catch (error) {
      console.error("Error retrieving admin FCM token:", error);
      return null;
    }
  };

  const sendAdminNotification = async () => {
    try {
      const adminFCMTokens = await getAdminFCMTokens();

      if (adminFCMTokens && adminFCMTokens.length > 0) {
        await fetch("http://localhost:5000/user/send-notification/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: "New Order",
            message: "A new order has been placed.",
            orderId: orderId,
            fcmTokens: adminFCMTokens,
          }),
        });
      } else {
        console.log("No FCM token found for the admin");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  const getUserFCMToken = async (userId) => {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const fcmToken = userData.fcmTokens || null;
        return fcmToken;
      } else {
        console.log(`User document with ID ${userId} does not exist`);
        return null;
      }
    } catch (error) {
      console.error('Error retrieving FCM token:', error);
      return null;
    }
  };

  useEffect(() => {
    const handleEWalletNotifications = async () => {
      if (
        transactionData.isNewOrder &&
        transactionData.paymentMethod === "E-wallet" &&
        !notificationSentRef.current // Only send notification if not already sent
      ) {
        try {
          const recipientToken = await getUserFCMToken(user.uid);
          await setDoc(doc(collection(db, 'transactions'), orderId), transactionData);
          console.log('Transaction saved successfully:', orderId);

          if (recipientToken) {
            await fetch("http://localhost:5000/user/send-notification", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                title: "Transaction Confirmed",
                body: "Your order has been successfully confirmed.",
                recipientToken,
              }),
            });
          } else {
            console.log("No valid recipient token found");
          }

          await sendAdminNotification();
          setNotificationSent(true); // Set the state to true to prevent future notifications
          notificationSentRef.current = true; // Ensure notification is sent only once
        } catch (error) {
          console.error("Error handling E-wallet notifications:", error);
        }
      }
    };

    handleEWalletNotifications();
  }, [transactionData, orderId, user.uid, notificationSent]);

    let displayDate = format(new Date(), 'MMMM do yyyy');
    let pesoSign = '₱';
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
            columnStyles: { 4: { halign: "left" } }
        });

        let finalY = doc.previousAutoTable.finalY + 10;

        doc.setTextColor(secondaryColor);
        doc.setFontSize(12);
        
        const subtotal = transactionData.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const totalDiscount = transactionData.discountAmount || 0;
        const totalTax = transactionData.tax || 0;

        doc.text(`Subtotal: ${pesoSign}${subtotal.toFixed(2)}`, 10, finalY);
        doc.text(`Discount: ₱${totalDiscount.toFixed(2)}`, 10, finalY + 10);
        doc.text(`Taxes: ₱${totalTax.toFixed(2)}`, 10, finalY + 20);

        doc.setTextColor(primaryColor);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(`Total: ₱${transactionData.total.toFixed(2)}`, 10, finalY + 35);

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
                        <h6 className="font-semibold font-manrope text-2xl leading-9 text-black">{displayDate}</h6>
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
                            <p className="font-semibold text-xl leading-8 text-gray-900">₱{transactionData.subTotal }</p>
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
                            <p className="font-semibold text-2xl leading-9 text-black">₱{((transactionData.total.toFixed(2) ))}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default OrderSummary;
