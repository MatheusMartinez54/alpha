import ProductCard from '../../components/ProductCard/ProductCard.jsx';
import { products } from '../../data/products.js';
import Loading from '../../components/Loading/Loading.jsx';
import { Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
function Products() {
  const [loading, setLoading] = useState(true);
  const [params] = useSearchParams();
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);
  const query = (params.get('busca') || '').toLowerCase();
  const category = params.get('categoria');
  const filteredProducts = products.filter(
    (product) =>
      product.active &&
      (!query || `${product.name} ${product.description} ${product.categoryName}`.toLowerCase().includes(query)) &&
      (!category || category === 'novidades' || product.categoryId === category),
  );
  return (
    <main className="main container">
      <span className="eyebrow">Catálogo completo</span>
      <h1>{query ? `Busca: ${params.get('busca')}` : 'Produtos'}</h1>
      {loading && <Loading />}
      {!loading && (
        <>
          <div className="catalog-toolbar">
            <span>{filteredProducts.length} produtos encontrados</span>
            <Search size={17} />
          </div>
          <div className="product-grid all-products">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="empty no-results">
              <Search size={26} />
              <h2>Nenhum produto encontrado</h2>
              <p>Tente buscar por outro nome ou categoria.</p>
            </div>
          )}
        </>
      )}
    </main>
  );
}
export default Products;
