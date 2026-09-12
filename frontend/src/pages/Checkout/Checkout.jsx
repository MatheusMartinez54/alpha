import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { useStore } from '../../context/StoreContext.jsx';

function Checkout() {
  const { items, total, clearCart } = useCart();
  const { addOrder } = useStore();
  const [store, setStore] = useState('Cuiabá');
  const [payment, setPayment] = useState('Pix');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    addOrder({ items, total, store, payment });
    clearCart();
    setSubmitted(true);
  };

  if (submitted)
    return (
      <main className="main container">
        <div className="empty">
          <h1>Pedido recebido</h1>
          <p>Enviamos seu pedido para a loja {store}. Aguarde a confirmação.</p>
          <Link className="button" to="/produtos">
            Continuar comprando
          </Link>
        </div>
      </main>
    );
  if (items.length === 0)
    return (
      <main className="main container">
        <div className="empty">
          <h1>Carrinho vazio</h1>
          <p>Adicione produtos antes de finalizar.</p>
          <Link className="button" to="/produtos">
            Ver produtos
          </Link>
        </div>
      </main>
    );

  return (
    <main className="main container">
      <span className="eyebrow">Última etapa</span>
      <h1>Checkout</h1>
      <form className="checkout-form" onSubmit={handleSubmit}>
        <label>
          Qual loja você prefere?
          <select value={store} onChange={(event) => setStore(event.target.value)}>
            <option>Cuiabá</option>
            <option>VG</option>
          </select>
        </label>
        <label>
          Forma de pagamento
          <select value={payment} onChange={(event) => setPayment(event.target.value)}>
            <option>Pix</option>
            <option>Cartão na retirada</option>
            <option>Dinheiro na retirada</option>
          </select>
        </label>
        <div className="summary">
          <span>Total do pedido</span>
          <strong>R$ {total.toFixed(2).replace('.', ',')}</strong>
          <button className="button" type="submit">
            Confirmar pedido
          </button>
        </div>
      </form>
    </main>
  );
}
export default Checkout;
