import { createContext, useMemo, useState } from "react";

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
 const [cartItems, setCartItems] = useState([]);

 const addToCart = (product) => {
     setCartItems((prevItems) => [...prevItems, product]);
 };

  const removeFromCart = (productId) => {
     setCartItems((prevItems) => prevItems.filter(item => item.id !== productId));
 }

 const value = useMemo(() => ({ cartItems, addToCart, removeFromCart }), [cartItems]);

 return (
     <CartContext.Provider value={value}>
         {children}
     </CartContext.Provider>
 );
};