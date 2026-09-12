import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { mockCategories, mockProducts } from '../data/adminMocks.js';

const StoreContext = createContext(null);
const CATALOG_KEY = 'alpha-catalog';
const ORDERS_KEY = 'alpha-orders';

function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }) {
  const [categories, setCategories] = useState(() => readStorage(`${CATALOG_KEY}-categories`, mockCategories));
  const [products, setProducts] = useState(() => readStorage(`${CATALOG_KEY}-products`, mockProducts));
  const [orders, setOrders] = useState(() => readStorage(ORDERS_KEY, []));

  useEffect(() => localStorage.setItem(`${CATALOG_KEY}-categories`, JSON.stringify(categories)), [categories]);
  useEffect(() => localStorage.setItem(`${CATALOG_KEY}-products`, JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem(ORDERS_KEY, JSON.stringify(orders)), [orders]);
  useEffect(() => {
    const syncStore = (event) => {
      if (event.key === `${CATALOG_KEY}-categories`) setCategories(readStorage(`${CATALOG_KEY}-categories`, mockCategories));
      if (event.key === `${CATALOG_KEY}-products`) setProducts(readStorage(`${CATALOG_KEY}-products`, mockProducts));
      if (event.key === ORDERS_KEY) setOrders(readStorage(ORDERS_KEY, []));
    };
    window.addEventListener('storage', syncStore);
    return () => window.removeEventListener('storage', syncStore);
  }, []);

  const addOrder = (order) =>
    setOrders((current) => [{ ...order, id: `PED-${Date.now()}`, status: 'Aberto', createdAt: new Date().toISOString() }, ...current]);
  const updateOrderStatus = (orderId, status) =>
    setOrders((current) => current.map((order) => (order.id === orderId ? { ...order, status } : order)));
  const value = useMemo(
    () => ({ categories, setCategories, products, setProducts, orders, addOrder, updateOrderStatus }),
    [categories, products, orders],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  return useContext(StoreContext);
}
