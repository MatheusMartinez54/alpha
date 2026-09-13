import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import ProductImage from '../ProductImage/ProductImage.jsx';
import Price from '../Price/Price.jsx';

function ProductCard({ product }) {
  const { items, addItem } = useCart();
  const inCart = items.find((item) => item.id === product.id)?.quantity || 0;
  const unavailable = product.stock <= 0;
  const atLimit = inCart >= product.stock;
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
        <button
          type="button"
          className="add-button"
          disabled={unavailable || atLimit}
          aria-label={
            unavailable
              ? `${product.name} sem estoque`
              : atLimit
                ? `Estoque de ${product.name} já no carrinho`
                : `Adicionar ${product.name} ao carrinho`
          }
          onClick={() => addItem(product)}
        >
          {!unavailable && <ShoppingCart size={16} aria-hidden="true" />}
          <span>{unavailable ? 'Sem estoque' : atLimit ? 'Limite no carrinho' : 'Adicionar'}</span>
        </button>
      </div>
    </article>
  );
}
export default ProductCard;
