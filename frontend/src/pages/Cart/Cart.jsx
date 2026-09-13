import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import CartItem from '../../components/CartItem/CartItem.jsx';
import OrderTotals from '../../components/OrderTotals/OrderTotals.jsx';
import EmptyState from '../../components/EmptyState/EmptyState.jsx';

function Cart() {
  const { items, total, totalItems } = useCart();
  return (
    <main id="main-content" className="main container">
      <div className="commerce-heading">
        <span className="eyebrow">Sua seleção</span>
        <h1>Carrinho</h1>
      </div>
      {items.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="Seu carrinho está vazio"
          description="Explore o catálogo e escolha os produtos que deseja levar."
          to="/produtos"
          action="Explorar produtos"
        />
      ) : (
        <div className="cart-layout">
          <div>
            <div className="cart-list">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
            <Link className="back-link" to="/produtos">
              Continuar comprando
            </Link>
          </div>
          <aside className="summary">
            <h2>Resumo da compra</h2>
            <OrderTotals total={total} count={totalItems} />
            <Link className="button" to="/checkout">
              Finalizar compra
            </Link>
            <p>Escolha a loja de retirada na próxima etapa.</p>
          </aside>
        </div>
      )}
    </main>
  );
}
export default Cart;
