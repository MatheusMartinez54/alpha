import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import CartItem from '../CartItem/CartItem.jsx';
import Dialog from '../Dialog/Dialog.jsx';
import EmptyState from '../EmptyState/EmptyState.jsx';
import OrderTotals from '../OrderTotals/OrderTotals.jsx';

function CartDrawer({ onClose }) {
  const { items, total, totalItems } = useCart();
  return (
    <Dialog className="store-drawer" onClose={onClose} aria-labelledby="cart-drawer-title">
      <header className="drawer-header">
        <h2 id="cart-drawer-title">Seu carrinho ({totalItems})</h2>
        <button type="button" className="icon-button" aria-label="Fechar carrinho" onClick={onClose}>
          <X size={20} aria-hidden="true" />
        </button>
      </header>
      <div className="drawer-body">
        {items.length ? (
          items.map((item) => <CartItem key={item.id} item={item} onNavigate={onClose} />)
        ) : (
          <EmptyState
            title="Seu carrinho está vazio"
            description="Explore o catálogo para encontrar seus produtos."
            to="/produtos"
            action="Ver produtos"
          />
        )}
      </div>
      {items.length > 0 && (
        <footer className="drawer-footer">
          <OrderTotals total={total} count={totalItems} />
          <Link className="button button--full" to="/checkout" onClick={onClose}>
            Finalizar compra
          </Link>
          <Link className="text-link" to="/carrinho" onClick={onClose}>
            Ver carrinho completo
          </Link>
        </footer>
      )}
    </Dialog>
  );
}
export default CartDrawer;
