import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import CategoryMenu from '../../components/CategoryMenu/CategoryMenu.jsx';
import ProductCard from '../../components/ProductCard/ProductCard.jsx';
import { useStore } from '../../context/StoreContext.jsx';
function Home() {
  const { products } = useStore();
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
      <section className="container contact-section">
        <div>
          <span className="eyebrow">Fale com a loja</span>
          <h2>Contatos</h2>
        </div>
        <div className="contact-links">
          <a href="https://wa.me/5565999990001" target="_blank" rel="noreferrer">
            WhatsApp Cuiabá
          </a>
          <a href="https://wa.me/5565999990002" target="_blank" rel="noreferrer">
            WhatsApp VG
          </a>
          <a href="https://instagram.com/alpha.lojas" target="_blank" rel="noreferrer">
            Instagram ALPHA
          </a>
        </div>
      </section>
    </main>
  );
}
export default Home;
