import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext.jsx';
function CategoryMenu() {
  const { categories } = useStore();
  return (
    <div className="category-menu">
      <Link to="/produtos">Todos</Link>
      {categories
        .filter((category) => category.active)
        .map((category) => (
          <Link key={category.id} to={`/produtos?categoria=${category.id}`}>
            {category.name}
          </Link>
        ))}
    </div>
  );
}
export default CategoryMenu;
