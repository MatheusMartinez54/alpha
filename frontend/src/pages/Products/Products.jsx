import ProductCard from '../../components/ProductCard/ProductCard.jsx';
import CategoryMenu from '../../components/CategoryMenu/CategoryMenu.jsx';
import { useStore } from '../../context/StoreContext.jsx';
import Loading from '../../components/Loading/Loading.jsx';
import { ArrowLeft, Search } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
function Products() {
  const { products } = useStore();
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
    <main className="main container catalog-page">
      <div className="commerce-heading">
        {category && (
          <Link className="back-link" to="/">
            <ArrowLeft size={16} /> Voltar para início
          </Link>
        )}
        <span className="eyebrow">Catálogo completo</span>
        <h1>{query ? `Busca: ${params.get('busca')}` : 'Produtos'}</h1>
      </div>
      <CategoryMenu />
      {loading && <Loading />}
      {!loading && (
        <>
          <div className="catalog-toolbar">
            <span>{filteredProducts.length} produtos encontrados</span>
            <Search size={17} />
          </div>
          <div className="product-list">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} variant="list" />
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
