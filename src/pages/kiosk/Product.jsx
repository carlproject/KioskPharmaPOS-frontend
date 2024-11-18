import { React, useState, useEffect } from 'react'
import ViewProduct from '../../components/pos/ViewProduct'
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { db } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import axios from 'axios';

function Product() {

  const navigate = useNavigate();
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
  
    useEffect(() => {
      const fetchProduct = async () => {
        try {
          const productRef = doc(db, 'products', productId); 
          const productDoc = await getDoc(productRef); 
          if (productDoc.exists()) {
            setProduct({ id: productDoc.id, ...productDoc.data() });
          } else {
            console.error("Product not found");
          }
        } catch (error) {
          console.error("Error fetching product: ", error);
        }
      };
  
      fetchProduct();
    }, [productId]);

    const addToCart = async (product) => {
      const firebaseUser = JSON.parse(localStorage.getItem('user'));
  
        const userId = firebaseUser.uid;
        
    
        const requestBody = {
            userId,
            productId: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            quantity: 1,
        };
    
        try {
            const response = await axios.post('http://localhost:5000/user/kiosk/cart/add', requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.data.success) {
                alert(response.data.message);
            } else {
                console.error("Error adding to cart:", response.data.message);
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("There was an error adding to your cart. Please try again.");
        }
    };
  
    if (!product) {
      return <div>Loading...</div>;
    }

  return (
    <>
        <ViewProduct SubmitToCart={addToCart} product={product} />
    </>
  )
}

export default Product