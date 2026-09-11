import { getHealth } from './api.js';
export async function checkOrdersService() {
  return getHealth();
}
