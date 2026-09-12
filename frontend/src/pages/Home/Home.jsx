import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import CategoryMenu from '../../components/CategoryMenu/CategoryMenu.jsx';
import ProductCard from '../../components/ProductCard/ProductCard.jsx';
import SectionHeader from '../../components/SectionHeader/SectionHeader.jsx';
import { useStore } from '../../context/StoreContext.jsx';

function Home() {
  const { products } = useStore();
  const available = products.filter((product) => product.active);
  const featured = available.filter((product) => product.featured);
  const selection = (featured.length ? featured : available).slice(0, 3);
  return (
    <main className="main home-main">
      <section className="container hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <span className="eyebrow">Seleção / 2026</span>
          <h1 id="hero-title">Objetos que<br />marcam presença.</h1>
          <p>Peças selecionadas para transformar<br className="desktop-break" /> o cotidiano em algo mais seu.</p>
          <Link className="button" to="/produtos">Explorar coleção <ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
      </section>
      <div className="container category-section"><CategoryMenu /></div>
      <section className="container featured" aria-label="Produtos em destaque">
        <SectionHeader label="Curadoria da semana" title="Escolhas em destaque" to="/produtos" />
        {selection.length ? <div className="product-grid">{selection.map((product) => <ProductCard key={product.id} product={product} />)}</div>
          : <div className="empty"><p>Nenhum produto disponível no momento.</p></div>}
      </section>
      <section className="container contact-section">
        <SectionHeader label="Fale com a loja" title="Contatos" />
        <div className="contact-links">
          <a href="https://wa.me/5565999990001" target="_blank" rel="noreferrer">WhatsApp Cuiabá <ArrowUpRight size={16} aria-hidden="true" /></a>
          <a href="https://wa.me/5565999990002" target="_blank" rel="noreferrer">WhatsApp VG <ArrowUpRight size={16} aria-hidden="true" /></a>
          <a href="https://instagram.com/alpha.lojas" target="_blank" rel="noreferrer">Instagram ALPHA <ArrowUpRight size={16} aria-hidden="true" /></a>
        </div>
      </section>
    </main>
  );
}
export default Home;
