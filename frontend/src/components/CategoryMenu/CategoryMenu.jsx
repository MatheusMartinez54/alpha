import { Link, useSearchParams } from 'react-router-dom';
import { useStore } from '../../context/StoreContext.jsx';
function CategoryMenu({ limit, onMore }) {
  const { categories } = useStore();
  const [params] = useSearchParams();
  const active = params.get('categoria') || '';
  const categoryLink = (id) => {
    const next = new URLSearchParams(params);
    if (id) next.set('categoria', id);
    else next.delete('categoria');
    return `/produtos${next.size ? `?${next}` : ''}`;
  };
  const activeCategories = categories.filter((category) => category.active);
  const visibleCategories = limit ? activeCategories.slice(0, limit) : activeCategories;
  const categoryLinks = [{ id: '', name: 'Todos' }, ...visibleCategories];

  return (
    <nav className="category-menu" aria-label="Categorias de produtos">
      {categoryLinks.map((category) => (
        <Link
          key={category.id}
          className={active === category.id ? 'is-active' : undefined}
          aria-current={active === category.id ? 'page' : undefined}
          to={categoryLink(category.id)}
        >
          {category.name}
        </Link>
      ))}
      {limit && onMore && (
        <button type="button" className="category-menu__more" onClick={onMore}>
          Ver mais
        </button>
      )}
    </nav>
  );
}
export default CategoryMenu;
