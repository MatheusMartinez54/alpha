import { createContext, useContext, useEffect, useMemo, useState } from 'react';
const CartContext = createContext(null);
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const addItem = (product) => {
    setItems((current) => {
      const found = current.find((item) => item.id === product.id);
      return found
        ? current.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
        : [...current, { ...product, quantity: 1 }];
    });
    setToast('✓ Produto adicionado ao carrinho');
  };

  const updateQuantity = (id, delta) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item)).filter((item) => item.quantity > 0),
    );
  };

  const removeItem = (id) => setItems((current) => current.filter((item) => item.id !== id));
  const clearCart = () => setItems([]);
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + (item.promotionalPrice ?? item.price) * item.quantity, 0);
  const value = useMemo(
    () => ({ items, addItem, updateQuantity, removeItem, clearCart, totalItems, total, toast }),
    [items, totalItems, total, toast],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() {
  return useContext(CartContext);
}
