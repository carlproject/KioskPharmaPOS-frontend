import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const RealCart = () => {
  const { userId } = useParams();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/user/kiosk/cart/${userId}`);
        
        if (response.data.success) {
          setCartItems(response.data.products || []);  // Ensure cartItems is an array
        } else {
          setError("Cart not found.");
        }
      } catch (error) {
        console.error("Failed to load cart data:", error);
        setError("Failed to load cart data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>User Cart</h1>
      <p>Cart for User ID: {userId}</p>
      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.productId} className="cart-item">
            <img src={item.imageUrl} alt={item.name} width="100" height="100" />
            <h2>{item.name}</h2>
            <p>Price: ${item.price}</p>
            <p>Quantity: {item.quantity}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RealCart;
