import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, Search, ShoppingBag, X } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../../context/CartContext.jsx';

function Header() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const close = () => setOpen(false);
  const submitSearch = (event) => {
    event.preventDefault();
    navigate(`/produtos?busca=${encodeURIComponent(search)}`);
    close();
  };
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" to="/" onClick={close}>
          <span>ALPHA</span>
          <small>digital store</small>
        </Link>
        <button className="icon-button menu-button" aria-label={open ? 'Fechar menu' : 'Abrir menu'} onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
        <form className="header-search" onSubmit={submitSearch}>
          <Search size={17} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar" aria-label="Buscar produtos" />
        </form>
        <nav className={open ? 'nav open' : 'nav'}>
          <NavLink to="/" onClick={close}>
            Início
          </NavLink>
          <NavLink to="/produtos" onClick={close}>
            Produtos
          </NavLink>
          <NavLink to="/admin-login" onClick={close}>
            Admin
          </NavLink>
        </nav>
        <Link className="cart-link" to="/carrinho" aria-label="Abrir carrinho">
          <ShoppingBag size={20} />
          <b>{totalItems}</b>
        </Link>
      </div>
    </header>
  );
}
export default Header;
