import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import ProductImage from '../../components/ProductImage/ProductImage.jsx';
function Cart() {
  const { items, total, removeItem } = useCart();
  return (
    <main className="main container">
      <div className="commerce-heading"><span className="eyebrow">Sua seleção</span><h1>Carrinho</h1></div>
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
                <ProductImage product={item} />
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
