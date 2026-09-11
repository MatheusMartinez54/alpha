import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
function Cart() {
  const { items, total, removeItem } = useCart();
  return (
    <main className="main container">
      <span className="eyebrow">Sua seleção</span>
      <h1>Carrinho</h1>
      {items.length === 0 ? (
        <div className="empty">
          <p>Seu carrinho está esperando por uma boa escolha.</p>
          <Link className="button" to="/produtos">
            Explorar produtos
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div>
            {items.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="cart-swatch" style={{ background: item.color }}>
                  {item.short}
                </div>
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.quantity} unidade(s)</p>
                </div>
                <strong>R$ {((item.promotionalPrice ?? item.price) * item.quantity).toFixed(2).replace('.', ',')}</strong>
                <button aria-label={`Remover ${item.name}`} onClick={() => removeItem(item.id)}>
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
          </div>
          <aside className="summary">
            <span>Total</span>
            <strong>R$ {total.toFixed(2).replace('.', ',')}</strong>
            <Link className="button" to="/checkout">
              Continuar
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}
export default Cart;
