import ProductGrid from '../../components/ProductGrid/ProductGrid.jsx';
import CategoryMenu from '../../components/CategoryMenu/CategoryMenu.jsx';
import SectionHeader from '../../components/SectionHeader/SectionHeader.jsx';
import EmptyState from '../../components/EmptyState/EmptyState.jsx';
import { useStore } from '../../context/StoreContext.jsx';

function Home() {
  const { products, categories } = useStore();
  const available = products.filter((product) => product.active);
  const categoryList = categories.filter((category) => category.active);
  const featured = available.filter((product) => product.featured).slice(0, 4);
  const otherProducts = available.filter((product) => !categories.some((category) => category.id === product.categoryId));
  return (
    <main id="main-content" className="main home-main">
      <header className="container home-intro">
        <div className="home-intro__content">
          <h1>Alpha <span>Imports</span></h1>
          <p>Produtos e acessórios para o seu dia a dia.</p>
        </div>
      </header>
      <div className="container home-categories">
        <span className="eyebrow">Explore as categorias</span>
        <CategoryMenu />
      </div>
      {featured.length > 0 && (
        <section className="container category-showcase" aria-label="Produtos em destaque">
          <SectionHeader title="Destaques" to="/produtos" />
          <ProductGrid products={featured} />
        </section>
      )}
      {categoryList.map((category) => {
        const items = available.filter((product) => product.categoryId === category.id).slice(0, 4);
        if (!items.length) return null;
        return (
          <section key={category.id} className="container category-showcase" aria-label={`Produtos de ${category.name}`}>
            <SectionHeader title={category.name} to={`/produtos?categoria=${encodeURIComponent(category.id)}`} linkText="Ver todos" />
            <ProductGrid products={items} />
          </section>
        );
      })}
      {otherProducts.length > 0 && (
        <section className="container category-showcase" aria-label="Mais produtos">
          <SectionHeader title="Mais produtos" to="/produtos" />
          <ProductGrid products={otherProducts.slice(0, 4)} />
        </section>
      )}
      {!available.length && (
        <div className="container category-showcase">
          <EmptyState title="Nosso catálogo está sendo atualizado" description="Volte em breve para conferir os produtos disponíveis." />
        </div>
      )}
    </main>
  );
}
export default Home;
