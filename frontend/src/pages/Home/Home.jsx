import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard.jsx';
import { useStore } from '../../context/StoreContext.jsx';

function Home() {
  const { products, categories } = useStore();
  const available = products.filter((product) => product.active);
  const categoryList = categories.filter((category) => category.active);

  return (
    <main className="main home-main">
      <section className="container hero-home" aria-labelledby="hero-title">
        <div className="hero-promo" aria-label="Banner promocional de tabacaria">
          <span className="promo-tag">Promoções do dia</span>
          <h1 id="hero-title">Alpha Imports</h1>
          <p>Seu ponto para tabacos, vapes, acessórios e itens premium do dia a dia.</p>
          <Link className="button" to="/produtos">
            Ver produtos <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {categoryList.map((category) => {
        const items = available.filter((product) => product.categoryId === category.id).slice(0, 3);
        if (!items.length) return null;

        return (
          <section key={category.id} className="container category-showcase" aria-label={`Produtos de ${category.name}`}>
            <div className="section-heading category-headline">
              <div>
                <span className="eyebrow">Categoria</span>
                <h2>{category.name}</h2>
              </div>
              <Link to={`/produtos?categoria=${category.id}`}>Ver mais produtos</Link>
            </div>

            <div className="category-product-grid">
              {items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
export default Home;
