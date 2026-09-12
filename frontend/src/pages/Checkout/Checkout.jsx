import { useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { useStore } from '../../context/StoreContext.jsx';

const stores = ['Loja Centro', 'Loja Jardim', 'Loja Aeroporto'];
const paymentOptions = ['PIX', 'Dinheiro', 'Cartão'];

function Checkout() {
  const { items, total, clearCart } = useCart();
  const { addOrder } = useStore();
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [store, setStore] = useState('');
  const [payment, setPayment] = useState('');
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  const validate = () => {
    const nextErrors = {};
    if (!customerName.trim()) nextErrors.customerName = 'Informe seu nome.';
    if (!phone.trim()) nextErrors.phone = 'Informe seu telefone.';
    if (!store) nextErrors.store = 'Selecione uma loja.';
    if (!payment) nextErrors.payment = 'Selecione a forma de pagamento.';
    if (!items.length) nextErrors.cart = 'Seu carrinho está vazio.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;
    addOrder({ items, total, store, payment, customerName, phone });
    clearCart();
    setSubmitted(true);
  };

  if (submitted)
    return (
      <main className="main container">
        <div className="empty">
          <h1>Pedido confirmado</h1>
          <p>Recebemos seu pedido para retirada em {store}. Em breve nossa equipe vai confirmar os detalhes.</p>
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
    <main className="main container checkout-page">
      <div className="checkout-header">
        <Link className="back-link" to="/">
          <ArrowLeft size={16} /> Voltar para início
        </Link>
        <span className="eyebrow">Última etapa</span>
        <h1>Finalizar compra</h1>
      </div>

      <form className="checkout-form" onSubmit={handleSubmit} noValidate>
        <div className="checkout-column">
          <section className="checkout-panel">
            <h2>Dados do cliente</h2>
            <div className="field-group">
              <label htmlFor="customer-name">Nome</label>
              <input
                id="customer-name"
                type="text"
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                placeholder="Seu nome completo"
              />
              {errors.customerName && <small className="field-error">{errors.customerName}</small>}
            </div>
            <div className="field-group">
              <label htmlFor="customer-phone">Telefone</label>
              <input id="customer-phone" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="(00) 00000-0000" />
              {errors.phone && <small className="field-error">{errors.phone}</small>}
            </div>
          </section>

          <section className="checkout-panel">
            <h2>Loja</h2>
            <div className="store-grid" role="radiogroup" aria-label="Seleção de loja">
              {stores.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`store-option ${store === option ? 'is-selected' : ''}`}
                  aria-pressed={store === option}
                  onClick={() => setStore(option)}
                >
                  {option}
                </button>
              ))}
            </div>
            {errors.store && <small className="field-error">{errors.store}</small>}
          </section>

          <section className="checkout-panel">
            <h2>Forma de pagamento</h2>
            <div className="payment-grid" role="radiogroup" aria-label="Forma de pagamento">
              {paymentOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`payment-option ${payment === option ? 'is-selected' : ''}`}
                  aria-pressed={payment === option}
                  onClick={() => setPayment(option)}
                >
                  {option}
                </button>
              ))}
            </div>
            {errors.payment && <small className="field-error">{errors.payment}</small>}
          </section>
        </div>

        <aside className="checkout-summary">
          <h2>Resumo do pedido</h2>
          <div className="checkout-summary__list">
            {items.map((item) => (
              <div className="checkout-item" key={item.id}>
                <div className="checkout-item__thumb" aria-hidden="true">
                  {item.image ? <img src={item.image} alt={item.name} /> : null}
                </div>
                <div className="checkout-item__meta">
                  <strong>{item.name}</strong>
                  <span>{item.quantity}x</span>
                </div>
                <strong className="checkout-item__price">{formatCurrency((item.promotionalPrice ?? item.price) * item.quantity)}</strong>
              </div>
            ))}
          </div>

          <div className="checkout-summary__total">
            <span>Total</span>
            <strong>R$ {total.toFixed(2).replace('.', ',')}</strong>
          </div>

          <div className="checkout-summary__meta">
            <span>{itemCount} itens</span>
            <span>{store || 'Selecione a loja'}</span>
          </div>

          <button className="button button--full" type="submit">
            Confirmar pedido
          </button>
        </aside>
      </form>
    </main>
  );
}
export default Checkout;
