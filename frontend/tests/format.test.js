import test from 'node:test';
import assert from 'node:assert/strict';
import { formatCurrency, getProductPrice, normalizeSearch } from '../src/utils/format.js';

test('preços regulares, promocionais e zero mantêm os valores do catálogo', () => {
  assert.equal(getProductPrice({ price: 100 }), 100);
  assert.equal(getProductPrice({ price: 100, promotionalPrice: null }), 100);
  assert.equal(getProductPrice({ price: 100, promotionalPrice: 75.5 }), 75.5);
  assert.equal(getProductPrice({ price: 100, promotionalPrice: 0 }), 0);
  assert.equal(formatCurrency(1234.5).replace(/\s/g, ' '), 'R$ 1.234,50');
});

test('busca normaliza espaços, letras e acentos em português', () => {
  assert.equal(normalizeSearch('  CAFÉ E AÇÃO '), 'cafe e acao');
  assert.equal(normalizeSearch(), '');
});
