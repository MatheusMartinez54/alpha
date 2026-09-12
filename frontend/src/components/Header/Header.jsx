import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useCart } from '../../context/CartContext.jsx';
import Logo from '../Logo/Logo.jsx';
import SearchBar from '../SearchBar/SearchBar.jsx';

function Header() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const handleKey = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        menuRef.current?.focus();
      }
    };
    const handleOutside = (event) => {
      if (!headerRef.current?.contains(event.target)) setOpen(false);
    };
    const desktop = window.matchMedia('(min-width: 768px)');
    const handleResize = () => { if (desktop.matches) setOpen(false); };
    document.addEventListener('keydown', handleKey);
    document.addEventListener('pointerdown', handleOutside);
    desktop.addEventListener('change', handleResize);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('pointerdown', handleOutside);
      desktop.removeEventListener('change', handleResize);
    };
  }, [open]);

  return (
    <header className="site-header" ref={headerRef}>
      <div className="container header-inner">
        <Link className="brand" to="/" onClick={close} aria-label="Alpha Imports — início"><Logo /></Link>
        <div className={`header-navigation${open ? ' is-open' : ''}`} id="site-navigation">
          <SearchBar onSearch={(search) => { navigate(`/produtos?busca=${encodeURIComponent(search)}`); close(); }} />
          <nav className="nav" aria-label="Navegação principal">
            <NavLink to="/" end onClick={close}>Início</NavLink>
            <NavLink to="/produtos" onClick={close}>Produtos</NavLink>
            <NavLink to="/admin-login" onClick={close}>Admin</NavLink>
          </nav>
        </div>
        <div className="header-actions">
          <Link className="cart-link" to="/carrinho" onClick={close} aria-label={`Abrir carrinho, ${totalItems} ${totalItems === 1 ? 'item' : 'itens'}`}>
            <ShoppingBag size={21} aria-hidden="true" /><span className="cart-count" aria-hidden="true">{totalItems}</span>
          </Link>
          <button ref={menuRef} className="icon-button menu-button" type="button" aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={open} aria-controls="site-navigation" onClick={() => setOpen(!open)}>
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  );
}
export default Header;
