import { useState } from 'react';
import { SlidersHorizontal, Search, X } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductGrid from '../../components/ProductGrid/ProductGrid.jsx';
import EmptyState from '../../components/EmptyState/EmptyState.jsx';
import CatalogFilters from '../../components/CatalogFilters/CatalogFilters.jsx';
import Dialog from '../../components/Dialog/Dialog.jsx';
import { useStore } from '../../context/StoreContext.jsx';
import { getProductPrice, normalizeSearch } from '../../utils/format.js';

function Products() {
  const { products, categories } = useStore();
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const query = params.get('busca') || '';
  const category = params.get('categoria') || '';
  const inStock = params.get('estoque') === 'disponivel';
  const sort = params.get('ordem') || '';
  const categoryName = categories.find((item) => item.id === category)?.name;
  const changeFilter = (name, value) =>
    setParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (value) next.set(name, value);
        else next.delete(name);
        return next;
      },
      { replace: true },
    );
  const filteredProducts = products.filter(
    (product) =>
      product.active &&
      (!query ||
        normalizeSearch(`${product.name} ${product.description || ''} ${product.categoryName || ''}`).includes(normalizeSearch(query))) &&
      (!category || category === 'novidades' || product.categoryId === category) &&
      (!inStock || product.stock > 0),
  );
  if (sort === 'menor-preco') filteredProducts.sort((a, b) => getProductPrice(a) - getProductPrice(b));
  if (sort === 'maior-preco') filteredProducts.sort((a, b) => getProductPrice(b) - getProductPrice(a));
  if (sort === 'nome') filteredProducts.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  const filterProps = { categories: categories.filter((item) => item.active), category, inStock, onChange: changeFilter };
  const activeFilters = Number(Boolean(category)) + Number(inStock);

  return (
    <main id="main-content" className="main container catalog-page">
      <div className="commerce-heading">
        <span className="eyebrow">Catálogo Alpha</span>
        <h1>{query ? `Busca: ${query}` : categoryName || 'Produtos'}</h1>
      </div>
      <div className="catalog-toolbar">
        <span role="status">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
        </span>
        <div className="catalog-toolbar__actions">
          <button className="button secondary filter-toggle" type="button" aria-haspopup="dialog" onClick={() => setFiltersOpen(true)}>
            <SlidersHorizontal size={16} aria-hidden="true" /> Filtros{activeFilters ? ` (${activeFilters})` : ''}
          </button>
          <label className="catalog-sort">
            <span className="sr-only">Ordenar produtos</span>
            <select aria-label="Ordenar produtos" value={sort} onChange={(event) => changeFilter('ordem', event.target.value)}>
              <option value="">Ordem padrão</option>
              <option value="menor-preco">Menor preço</option>
              <option value="maior-preco">Maior preço</option>
              <option value="nome">Nome: A–Z</option>
            </select>
          </label>
        </div>
      </div>
      {(query || activeFilters > 0) && (
        <div className="active-filters">
          {query && <span>Busca: {query}</span>}
          {category && <span>{categoryName || category}</span>}
          {inStock && <span>Em estoque</span>}
          <Link className="text-link" to="/produtos">
            Limpar filtros
          </Link>
        </div>
      )}
      <div className="catalog-layout">
        <aside className="catalog-sidebar" aria-label="Filtros do catálogo">
          <h2>Filtrar produtos</h2>
          <CatalogFilters {...filterProps} />
        </aside>
        <div className="catalog-results">
          {filteredProducts.length ? (
            <ProductGrid products={filteredProducts} />
          ) : (
            <EmptyState
              icon={Search}
              title="Nenhum produto encontrado"
              description="Tente outro nome ou remova os filtros para ver mais opções."
              to="/produtos"
              action="Limpar busca e filtros"
            />
          )}
        </div>
      </div>
      {filtersOpen && (
        <Dialog className="store-drawer" onClose={() => setFiltersOpen(false)} aria-labelledby="filter-title">
          <header className="drawer-header">
            <h2 id="filter-title">Filtrar produtos</h2>
            <button className="icon-button" type="button" aria-label="Fechar filtros" onClick={() => setFiltersOpen(false)}>
              <X size={20} aria-hidden="true" />
            </button>
          </header>
          <div className="drawer-body">
            <CatalogFilters {...filterProps} />
          </div>
          <footer className="drawer-footer">
            <button className="button" type="button" onClick={() => setFiltersOpen(false)}>
              Ver {filteredProducts.length} produtos
            </button>
          </footer>
        </Dialog>
      )}
    </main>
  );
}
export default Products;
