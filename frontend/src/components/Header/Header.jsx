import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, ShoppingCart, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useCart } from '../../context/CartContext.jsx';
import { useStore } from '../../context/StoreContext.jsx';
import Logo from '../Logo/Logo.jsx';
import SearchBar from '../SearchBar/SearchBar.jsx';
import CartDrawer from '../CartDrawer/CartDrawer.jsx';

function Header() {
  const [open, setOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const { totalItems } = useCart();
  const { categories } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const close = () => setOpen(false);
  const visibleCategories = categories.filter((category) => category.active);
  const showSearch = location.pathname !== '/checkout';

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
    const handleResize = () => {
      if (desktop.matches) setOpen(false);
    };
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
    <>
      <header className="site-header" ref={headerRef}>
        <div className="container header-inner">
          <div className="mobile-topbar">
            <button
              ref={menuRef}
              className="icon-button menu-button"
              type="button"
              aria-label={open ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={open}
              aria-controls="category-drawer"
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
            </button>

            <Link className="brand" to="/" onClick={close} aria-label="Alpha Imports — início">
              <Logo />
              <span className="brand-text">ALPHA IMPORTES</span>
            </Link>

            <button
              type="button"
              className="cart-link"
              onClick={() => setIsCartOpen(true)}
              aria-label={`Abrir carrinho, ${totalItems} ${totalItems === 1 ? 'item' : 'itens'}`}
            >
              <ShoppingCart size={21} aria-hidden="true" />
              {totalItems > 0 && (
                <span className="cart-count" aria-hidden="true">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          <div className="header-panel">
            {showSearch && (
              <div className="header-search-wrap">
                <SearchBar
                  onSearch={(search) => {
                    navigate(`/produtos?busca=${encodeURIComponent(search)}`);
                    close();
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </header>

      {open && <button type="button" className="nav-overlay" aria-label="Fechar menu de categorias" onClick={close} />}
      <aside
        id="category-drawer"
        className={`category-drawer${open ? ' is-open' : ''}`}
        aria-modal="true"
        role="dialog"
        aria-label="Categorias da loja"
      >
        <header className="cart-drawer__header category-drawer__header">
          <div>
            <span className="eyebrow">Navegação</span>
            <h2>Categorias</h2>
          </div>
          <button type="button" className="icon-button" aria-label="Fechar menu" onClick={close}>
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <nav className="category-drawer__menu" aria-label="Menu de categorias">
          <Link to="/" onClick={close} className="category-drawer__item">
            Início
          </Link>
          <Link to="/produtos" onClick={close} className="category-drawer__item">
            Todos os produtos
          </Link>
          {visibleCategories.map((category) => (
            <Link key={category.id} to={`/produtos?categoria=${category.id}`} onClick={close} className="category-drawer__item">
              {category.name}
            </Link>
          ))}
        </nav>
      </aside>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
export default Header;
