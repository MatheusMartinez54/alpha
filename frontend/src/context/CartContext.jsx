import { createContext, useContext, useMemo, useState } from 'react';
const CartContext = createContext(null);
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const addItem = (product) =>
    setItems((current) => {
      const found = current.find((item) => item.id === product.id);
      return found
        ? current.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
        : [...current, { ...product, quantity: 1 }];
    });
  const removeItem = (id) => setItems((current) => current.filter((item) => item.id !== id));
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + (item.promotionalPrice ?? item.price) * item.quantity, 0);
  const value = useMemo(() => ({ items, addItem, removeItem, totalItems, total }), [items, totalItems, total]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() {
  return useContext(CartContext);
}
