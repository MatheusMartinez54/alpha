import { useRef, useState } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { useStore } from '../../context/StoreContext.jsx';
import { formatCurrency, getProductPrice } from '../../utils/format.js';
import FormField from '../../components/FormField/FormField.jsx';
import ProductImage from '../../components/ProductImage/ProductImage.jsx';
import OrderTotals from '../../components/OrderTotals/OrderTotals.jsx';
import EmptyState from '../../components/EmptyState/EmptyState.jsx';

const stores = ['Loja Centro', 'Loja Jardim', 'Loja Aeroporto'];
const paymentOptions = ['PIX', 'Dinheiro', 'Cartão'];

function Checkout() {
  const { items, total, totalItems, clearCart } = useCart();
  const { addOrder } = useStore();
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [store, setStore] = useState('');
  const [payment, setPayment] = useState('');
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const submitting = useRef(false);

  const updateField = (field, setValue, value) => {
    setValue(value);
    if (!value.trim()) return;
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (submitting.current) return;
    const nextErrors = {};
    if (!customerName.trim()) nextErrors.customerName = 'Informe seu nome.';
    if (!phone.trim()) nextErrors.phone = 'Informe seu telefone.';
    if (!store) nextErrors.store = 'Selecione uma loja.';
    if (!payment) nextErrors.payment = 'Selecione a forma de pagamento.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      const firstField = nextErrors.customerName
        ? '#customer-name'
        : nextErrors.phone
          ? '#customer-phone'
          : nextErrors.store
            ? '[name="store"]'
            : '[name="payment"]';
      event.currentTarget.querySelector(firstField)?.focus();
      return;
    }
    if (!items.length) return;
    submitting.current = true;
    addOrder({ items, total, store, payment, customerName, phone });
    clearCart();
    setSubmitted(true);
  };

  if (submitted)
    return (
      <main id="main-content" className="main container">
        <EmptyState
          heading="h1"
          announce
          icon={CheckCircle2}
          title="Pedido confirmado"
          description={`Recebemos seu pedido para retirada em ${store}. Em breve nossa equipe vai confirmar os detalhes.`}
          to="/produtos"
          action="Continuar comprando"
        />
      </main>
    );
  if (!items.length)
    return (
      <main id="main-content" className="main container">
        <EmptyState
          heading="h1"
          title="Carrinho vazio"
          description="Adicione produtos antes de finalizar."
          to="/produtos"
          action="Ver produtos"
        />
      </main>
    );

  return (
    <main id="main-content" className="main container checkout-page">
      <div className="commerce-heading">
        <Link className="back-link" to="/carrinho">
          <ArrowLeft size={16} aria-hidden="true" /> Voltar ao carrinho
        </Link>
        <span className="eyebrow">Última etapa</span>
        <h1>Finalizar compra</h1>
        <p>Informe seus dados e escolha onde retirar o pedido.</p>
      </div>
      <form className="checkout-form" onSubmit={handleSubmit} noValidate>
        <div className="checkout-column">
          {Object.keys(errors).length > 0 && (
            <p className="form-error" role="alert">
              Confira os campos indicados para confirmar seu pedido.
            </p>
          )}
          <section className="checkout-panel" aria-labelledby="customer-title">
            <h2 id="customer-title">
              <span className="step-number">1</span> Seus dados
            </h2>
            <FormField
              id="customer-name"
              name="name"
              label="Nome completo"
              type="text"
              autoComplete="name"
              required
              value={customerName}
              onChange={(event) => updateField('customerName', setCustomerName, event.target.value)}
              placeholder="Seu nome completo"
              error={errors.customerName}
            />
            <FormField
              id="customer-phone"
              name="tel"
              label="Telefone"
              type="tel"
              autoComplete="tel"
              required
              value={phone}
              onChange={(event) => updateField('phone', setPhone, event.target.value)}
              placeholder="(00) 00000-0000"
              error={errors.phone}
            />
          </section>
          <section className="checkout-panel">
            <h2>
              <span className="step-number">2</span> Retirada na loja
            </h2>
            <p>Selecione a loja onde deseja retirar seus produtos.</p>
            <fieldset className="choice-fieldset" aria-describedby={errors.store ? 'store-error' : undefined}>
              <legend className="sr-only">Loja de retirada</legend>
              <div className="choice-grid">
                {stores.map((option) => (
                  <label className="choice-option" key={option}>
                    <input
                      type="radio"
                      name="store"
                      value={option}
                      checked={store === option}
                      onChange={() => updateField('store', setStore, option)}
                      required
                      aria-invalid={Boolean(errors.store)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            {errors.store && (
              <small id="store-error" className="field-error">
                {errors.store}
              </small>
            )}
          </section>
          <section className="checkout-panel">
            <h2>
              <span className="step-number">3</span> Forma de pagamento
            </h2>
            <fieldset className="choice-fieldset" aria-describedby={errors.payment ? 'payment-error' : undefined}>
              <legend className="sr-only">Forma de pagamento</legend>
              <div className="choice-grid">
                {paymentOptions.map((option) => (
                  <label className="choice-option" key={option}>
                    <input
                      type="radio"
                      name="payment"
                      value={option}
                      checked={payment === option}
                      onChange={() => updateField('payment', setPayment, option)}
                      required
                      aria-invalid={Boolean(errors.payment)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            {errors.payment && (
              <small id="payment-error" className="field-error">
                {errors.payment}
              </small>
            )}
          </section>
        </div>
        <aside className="checkout-summary">
          <div className="summary-heading">
            <h2>Resumo do pedido</h2>
            <Link className="text-link" to="/carrinho">
              Editar
            </Link>
          </div>
          <div className="checkout-summary__list">
            {items.map((item) => (
              <div className="checkout-item" key={item.id}>
                <ProductImage product={item} />
                <div className="checkout-item__meta">
                  <strong>{item.name}</strong>
                  <span>
                    {item.quantity} × {formatCurrency(getProductPrice(item))}
                  </span>
                  <strong>{formatCurrency(getProductPrice(item) * item.quantity)}</strong>
                </div>
              </div>
            ))}
          </div>
          <OrderTotals total={total} count={totalItems} />
          <button className="button button--full" type="submit">
            Confirmar pedido
          </button>
        </aside>
      </form>
    </main>
  );
}
export default Checkout;
