import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import ProductImage from '../ProductImage/ProductImage.jsx';
import Price from '../Price/Price.jsx';

function ProductCard({ product }) {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const unavailable = product.stock <= 0;
  const handleBuy = () => {
    addItem(product);
    navigate('/checkout');
  };
  return (
    <article className="product-card">
      <Link className="product-card__image-link" to={`/produto/${product.id}`} aria-label={`Ver detalhes de ${product.name}`}>
        <ProductImage product={product} />
      </Link>
      <div className="product-info">
        <div className="product-info__copy">
          <small className="product-category">{product.categoryName}</small>
          <h3>
            <Link to={`/produto/${product.id}`}>{product.name}</Link>
          </h3>
          <Price product={product} />
        </div>
        <div className="product-card__actions">
          <button type="button" className="buy-button" disabled={unavailable} onClick={handleBuy}>
            {unavailable ? 'Sem estoque' : 'Comprar'}
          </button>
          <button
            type="button"
            className="cart-button"
            disabled={unavailable}
            aria-label={unavailable ? `${product.name} sem estoque` : `Adicionar ${product.name} ao carrinho`}
            title="Adicionar ao carrinho"
            onClick={() => addItem(product)}
          >
            <ShoppingCart size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
export default ProductCard;
