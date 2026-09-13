import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { formatCurrency, getProductPrice } from '../../utils/format.js';
import ProductImage from '../ProductImage/ProductImage.jsx';
import QuantitySelector from '../QuantitySelector/QuantitySelector.jsx';

function CartItem({ item, onNavigate }) {
  const { updateQuantity, removeItem } = useCart();
  return (
    <article className="cart-item">
      <Link to={`/produto/${item.id}`} onClick={onNavigate} aria-label={`Ver ${item.name}`}>
        <ProductImage product={item} />
      </Link>
      <div className="cart-item__content">
        <h3>
          <Link to={`/produto/${item.id}`} onClick={onNavigate}>
            {item.name}
          </Link>
        </h3>
        <span className="cart-item__unit">{formatCurrency(getProductPrice(item))} / un.</span>
        <strong>{formatCurrency(getProductPrice(item) * item.quantity)}</strong>
        <div className="cart-item__controls">
          <QuantitySelector
            value={item.quantity}
            min={0}
            max={item.stock}
            label={item.name}
            onChange={(value) => updateQuantity(item.id, value - item.quantity)}
          />
          <button className="text-button" type="button" aria-label={`Remover ${item.name}`} onClick={() => removeItem(item.id)}>
            Remover
          </button>
        </div>
      </div>
    </article>
  );
}
export default CartItem;
