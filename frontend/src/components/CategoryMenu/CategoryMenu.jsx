import { Link } from 'react-router-dom';
function CategoryMenu() {
  return (
    <div className="category-menu">
      <Link to="/produtos?categoria=novidades">Novidades</Link>
      <Link to="/produtos?categoria=essenciais">Essenciais</Link>
      <Link to="/produtos?categoria=colecoes">Coleções</Link>
      <Link to="/produtos?categoria=ofertas">Ofertas</Link>
    </div>
  );
}
export default CategoryMenu;
