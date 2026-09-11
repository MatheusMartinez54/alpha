import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import CategoryMenu from '../../components/CategoryMenu/CategoryMenu.jsx';
import ProductCard from '../../components/ProductCard/ProductCard.jsx';
import { products } from '../../data/products.js';
function Home() {
  return (
    <main className="main">
      <section className="container hero">
        <div className="hero-copy">
          <span className="eyebrow">Seleção / 2026</span>
          <h1>
            Objetos que
            <br />
            <em>marcam</em> presença.
          </h1>
          <p>Uma curadoria de peças para transformar o cotidiano em algo mais seu.</p>
          <Link className="button" to="/produtos">
            Explorar coleção <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="hero-shape">
          <span>
            ALPHA
            <br />
            /01
          </span>
        </div>
      </section>
      <section className="container category-section">
        <CategoryMenu />
      </section>
      <section className="container featured">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Curadoria da semana</span>
            <h2>Escolhas em destaque</h2>
          </div>
          <Link to="/produtos">
            Ver tudo <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="product-grid">
          {products
            .filter((product) => product.active && product.featured)
            .slice(0, 3)
            .map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </section>
    </main>
  );
}
export default Home;
