import { Fragment, useEffect } from 'react';
import { Minus, Plus, ShoppingCart, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import ProductImage from '../ProductImage/ProductImage.jsx';

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function CartDrawer({ isOpen, onClose }) {
  const { items, total, addItem, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCheckout = () => {
    if (!items.length) return;
    onClose();
    navigate('/checkout');
  };

  return (
    <>
      <button type="button" className="cart-overlay" aria-label="Fechar carrinho" onClick={onClose} />
      <aside className="cart-drawer" aria-modal="true" role="dialog" aria-label="Seu carrinho">
        <header className="cart-drawer__header">
          <div>
            <span className="eyebrow">Seu pedido</span>
            <h2>Seu carrinho</h2>
          </div>
          <button type="button" className="icon-button" aria-label="Fechar carrinho" onClick={onClose}>
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="cart-drawer__empty">
            <ShoppingCart size={28} aria-hidden="true" />
            <h3>Seu carrinho está vazio</h3>
            <p>Adicione produtos para continuar sua compra.</p>
            <Link className="button" to="/produtos" onClick={onClose}>
              Ver produtos
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-drawer__list">
              {items.map((item) => {
                const unitPrice = item.promotionalPrice ?? item.price;
                return (
                  <Fragment key={item.id}>
                    <div className="cart-item cart-item--drawer">
                      <ProductImage product={item} className="cart-item__image" />
                      <div className="cart-item__content">
                        <div className="cart-item__title-row">
                          <h3>{item.name}</h3>
                          <strong>{formatCurrency(unitPrice * item.quantity)}</strong>
                        </div>
                        <div className="cart-item__controls">
                          <div className="quantity-stepper" aria-label={`Quantidade de ${item.name}`}>
                            <button type="button" aria-label={`Diminuir quantidade de ${item.name}`} onClick={() => updateQuantity(item.id, -1)}>
                              <Minus size={14} aria-hidden="true" />
                            </button>
                            <span>{item.quantity}</span>
                            <button type="button" aria-label={`Aumentar quantidade de ${item.name}`} onClick={() => addItem(item)}>
                              <Plus size={14} aria-hidden="true" />
                            </button>
                          </div>
                          <button type="button" className="cart-item__remove" onClick={() => removeItem(item.id)}>
                            Remover
                          </button>
                        </div>
                      </div>
                    </div>
                  </Fragment>
                );
              })}
            </div>

            <footer className="cart-drawer__footer">
              <div className="cart-drawer__total">
                <span>Total</span>
                <strong>{formatCurrency(total)}</strong>
              </div>
              <button type="button" className="button cart-drawer__checkout" onClick={handleCheckout}>
                Finalizar compra
              </button>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}

export default CartDrawer;
