import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, ShoppingCart, X, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../../context/CartContext.jsx';
import { useStore } from '../../context/StoreContext.jsx';
import Logo from '../Logo/Logo.jsx';
import SearchBar from '../SearchBar/SearchBar.jsx';
import CartDrawer from '../CartDrawer/CartDrawer.jsx';
import Dialog from '../Dialog/Dialog.jsx';

function Header() {
  const [open, setOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { totalItems } = useCart();
  const { categories } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const checkout = location.pathname === '/checkout';
  const close = () => setOpen(false);
  const visibleCategories = categories.filter((category) => category.active);
  const query = new URLSearchParams(location.search).get('busca') || '';

  return (
    <>
      <header className={`site-header${checkout ? ' site-header--checkout' : ''}`}>
        <div className="container header-inner">
          {!checkout && (
            <button
              className="icon-button menu-button"
              type="button"
              aria-label="Abrir menu"
              aria-haspopup="dialog"
              onClick={() => setOpen(true)}
            >
              <Menu size={22} aria-hidden="true" />
            </button>
          )}
          <Link className="brand" to="/" aria-label="Alpha Imports — início">
            <Logo />
            <span className="brand-text">ALPHA IMPORTES</span>
          </Link>
          {checkout ? (
            <Link className="back-link header-back" to="/carrinho">
              <ArrowLeft size={16} aria-hidden="true" /> Carrinho
            </Link>
          ) : (
            <>
              <div className="header-search-wrap">
                <SearchBar
                  key={query}
                  initialValue={query}
                  onSearch={(search) => navigate(search ? `/produtos?busca=${encodeURIComponent(search)}` : '/produtos')}
                />
              </div>
              <button
                type="button"
                className="cart-link"
                onClick={() => setIsCartOpen(true)}
                aria-haspopup="dialog"
                aria-label={`Abrir carrinho, ${totalItems} ${totalItems === 1 ? 'item' : 'itens'}`}
              >
                <ShoppingCart size={21} aria-hidden="true" />
                <span className="cart-label">Carrinho</span>
                {totalItems > 0 && (
                  <span className="cart-count" aria-hidden="true">
                    {totalItems}
                  </span>
                )}
              </button>
            </>
          )}
        </div>
      </header>
      {open && (
        <Dialog className="store-drawer store-drawer--left" onClose={close} aria-labelledby="category-title">
          <header className="drawer-header">
            <h2 id="category-title">Categorias</h2>
            <button type="button" className="icon-button" aria-label="Fechar menu" onClick={close}>
              <X size={20} aria-hidden="true" />
            </button>
          </header>
          <nav className="category-drawer__menu drawer-body" aria-label="Menu de categorias">
            <Link to="/" onClick={close}>
              Início
            </Link>
            <Link to="/produtos" onClick={close}>
              Todos os produtos
            </Link>
            {visibleCategories.map((category) => (
              <Link key={category.id} to={`/produtos?categoria=${encodeURIComponent(category.id)}`} onClick={close}>
                {category.name}
              </Link>
            ))}
          </nav>
        </Dialog>
      )}
      {isCartOpen && <CartDrawer onClose={() => setIsCartOpen(false)} />}
    </>
  );
}
export default Header;
