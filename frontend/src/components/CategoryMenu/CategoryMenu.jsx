import { Link, useSearchParams } from 'react-router-dom';
import { useStore } from '../../context/StoreContext.jsx';
function CategoryMenu() {
  const { categories } = useStore();
  const [params] = useSearchParams();
  const active = params.get('categoria') || '';
  const categoryLink = (id) => {
    const next = new URLSearchParams(params);
    if (id) next.set('categoria', id);
    else next.delete('categoria');
    return `/produtos${next.size ? `?${next}` : ''}`;
  };
  return (
    <nav className="category-menu" aria-label="Categorias de produtos">
      {[{ id: '', name: 'Todos' }, ...categories.filter((category) => category.active)].map((category) => (
        <Link key={category.id} className={active === category.id ? 'is-active' : undefined}
          aria-current={active === category.id ? 'page' : undefined} to={categoryLink(category.id)}>{category.name}</Link>
      ))}
    </nav>
  );
}
export default CategoryMenu;
