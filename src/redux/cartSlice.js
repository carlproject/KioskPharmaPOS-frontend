// cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalAmount: 0,
  originalPrice: 0,
  deliveryFee: 0,
  tax: 0,
  savings: 0
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item.productId === action.payload.productId);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      state.totalAmount += action.payload.price;
      state.originalPrice += action.payload.price;
    },
    removeFromCart: (state, action) => {
      const itemIndex = state.items.findIndex(item => item.productId === action.payload);
      if (itemIndex >= 0) {
        const item = state.items[itemIndex];
        state.totalAmount -= item.price * item.quantity;
        state.originalPrice -= item.price * item.quantity;
        state.items.splice(itemIndex, 1);
      }
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const existingItem = state.items.find(item => item.productId === productId);
      if (existingItem) {
        state.totalAmount += (quantity - existingItem.quantity) * existingItem.price;
        existingItem.quantity = quantity;
      }
    },
    calculateTotals: (state) => {
      const deliveryFee = 49; // Example fee
      const taxRate = 0.05;
      
      state.deliveryFee = deliveryFee;
      state.tax = (state.totalAmount + deliveryFee) * taxRate;
      state.savings = state.originalPrice - state.totalAmount;
    }
  }
});

export const { addToCart, removeFromCart, updateQuantity, calculateTotals } = cartSlice.actions;

export default cartSlice.reducer;

