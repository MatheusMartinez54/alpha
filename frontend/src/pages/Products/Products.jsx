import { ArrowLeft, Search } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ProductGrid from '../../components/ProductGrid/ProductGrid.jsx';
import EmptyState from '../../components/EmptyState/EmptyState.jsx';
import { useStore } from '../../context/StoreContext.jsx';
import { getProductPrice, normalizeSearch } from '../../utils/format.js';

function Products() {
  const { products, categories } = useStore();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const query = params.get('busca') || '';
  const category = params.get('categoria') || '';
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
      (!query || normalizeSearch(`${product.name} ${product.description || ''} ${product.categoryName || ''}`).includes(normalizeSearch(query))) &&
      (!category || category === 'novidades' || product.categoryId === category),
  );
  if (sort === 'menor-preco') filteredProducts.sort((a, b) => getProductPrice(a) - getProductPrice(b));
  if (sort === 'maior-preco') filteredProducts.sort((a, b) => getProductPrice(b) - getProductPrice(a));
  if (sort === 'nome') filteredProducts.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  return (
    <main id="main-content" className="main container catalog-page">
      <button className="back-link back-button" type="button" onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}>
        <ArrowLeft size={16} aria-hidden="true" /> Voltar
      </button>
      <div className="commerce-heading">
        <span className="eyebrow">Catálogo Alpha</span>
        <h1>{query ? `Busca: ${query}` : categoryName || 'Produtos'}</h1>
      </div>
      <div className="catalog-toolbar">
        <span role="status">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
        </span>
        <div className="catalog-toolbar__actions">
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
      <div className="catalog-results">
        {filteredProducts.length ? (
          <ProductGrid products={filteredProducts} />
        ) : (
          <EmptyState
            icon={Search}
            title="Nenhum produto encontrado"
            description="Tente buscar por outro nome ou confira outra categoria."
            to="/produtos"
            action="Ver todos os produtos"
          />
        )}
      </div>
    </main>
  );
}
export default Products;
