import { products } from '../data/products.js';
export function listProducts() {
  return products;
}
export function getProduct(id) {
  return products.find((product) => product.id === id);
}
