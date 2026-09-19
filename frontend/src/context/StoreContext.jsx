import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { mockCategories, mockProducts } from '../data/adminMocks.js';

const StoreContext = createContext(null);
const CATALOG_KEY = 'alpha-catalog';
const ORDERS_KEY = 'alpha-orders';
const DELIVERY_PERSONS_KEY = 'alpha-delivery-persons';
const STOCK_MOVEMENTS_KEY = 'alpha-stock-movements';

function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function readCatalog(key, defaults) {
  const saved = readStorage(key, defaults);
  const savedIds = new Set(saved.map((item) => item.id));
  return [...saved, ...defaults.filter((item) => !savedIds.has(item.id))];
}

export function StoreProvider({ children }) {
  const [categories, setCategories] = useState(() => readCatalog(`${CATALOG_KEY}-categories`, mockCategories));
  const [products, setProducts] = useState(() => readCatalog(`${CATALOG_KEY}-products`, mockProducts));
  const [orders, setOrders] = useState(() => readStorage(ORDERS_KEY, []));
  const [deliveryPersons, setDeliveryPersons] = useState(() => readStorage(DELIVERY_PERSONS_KEY, []));
  const [stockMovements, setStockMovements] = useState(() => readStorage(STOCK_MOVEMENTS_KEY, []));

  useEffect(() => localStorage.setItem(`${CATALOG_KEY}-categories`, JSON.stringify(categories)), [categories]);
  useEffect(() => localStorage.setItem(`${CATALOG_KEY}-products`, JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem(ORDERS_KEY, JSON.stringify(orders)), [orders]);
  useEffect(() => localStorage.setItem(DELIVERY_PERSONS_KEY, JSON.stringify(deliveryPersons)), [deliveryPersons]);
  useEffect(() => localStorage.setItem(STOCK_MOVEMENTS_KEY, JSON.stringify(stockMovements)), [stockMovements]);
  useEffect(() => {
    const syncStore = (event) => {
      if (event.key === `${CATALOG_KEY}-categories`) setCategories(readStorage(`${CATALOG_KEY}-categories`, mockCategories));
      if (event.key === `${CATALOG_KEY}-products`) setProducts(readStorage(`${CATALOG_KEY}-products`, mockProducts));
      if (event.key === ORDERS_KEY) setOrders(readStorage(ORDERS_KEY, []));
      if (event.key === DELIVERY_PERSONS_KEY) setDeliveryPersons(readStorage(DELIVERY_PERSONS_KEY, []));
      if (event.key === STOCK_MOVEMENTS_KEY) setStockMovements(readStorage(STOCK_MOVEMENTS_KEY, []));
    };
    window.addEventListener('storage', syncStore);
    return () => window.removeEventListener('storage', syncStore);
  }, []);

  const addOrder = (order) =>
    setOrders((current) => [{ ...order, id: `PED-${Date.now()}`, status: 'Aberto', createdAt: new Date().toISOString() }, ...current]);
  const updateOrder = (orderId, changes) => setOrders((current) => current.map((order) => (order.id === orderId ? { ...order, ...changes } : order)));
  const updateOrderStatus = (orderId, status) => updateOrder(orderId, { status });
  const addStockMovement = useCallback(
    (productId, type, quantity) => {
      const amount = Number(quantity);
      if (!Number.isInteger(amount) || amount <= 0) return { ok: false, message: 'Informe uma quantidade inteira maior que zero.' };

      const product = products.find((item) => item.id === productId);
      if (!product) return { ok: false, message: 'Produto não encontrado.' };
      if (type === 'saida' && amount > Number(product.stock || 0)) {
        return { ok: false, message: 'A saída não pode ser maior que o estoque atual.' };
      }

      const nextStock = Number(product.stock || 0) + (type === 'entrada' ? amount : -amount);
      setProducts((current) => current.map((item) => (item.id === productId ? { ...item, stock: nextStock } : item)));
      setStockMovements((current) => [
        {
          id: `MOV-${Date.now()}`,
          productId,
          productName: product.name,
          type,
          quantity: amount,
          createdAt: new Date().toISOString(),
        },
        ...current,
      ]);
      return { ok: true };
    },
    [products],
  );
  const value = useMemo(
    () => ({
      categories,
      setCategories,
      products,
      setProducts,
      orders,
      addOrder,
      updateOrder,
      updateOrderStatus,
      deliveryPersons,
      setDeliveryPersons,
      stockMovements,
      addStockMovement,
    }),
    [categories, products, orders, deliveryPersons, stockMovements, addStockMovement],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  return useContext(StoreContext);
}
