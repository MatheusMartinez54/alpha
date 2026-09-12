import { Link } from 'react-router-dom';
import { Plus, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import ProductImage from '../ProductImage/ProductImage.jsx';

function ProductCard({ product, variant = 'card' }) {
  const { addItem } = useCart();
  const hasPromotion = product.promotionalPrice < product.price;

  return (
    <article className={`product-card${variant === 'list' ? ' product-card--list' : ''}`}>
      <Link className="product-card__image-link" to={`/produto/${product.id}`} aria-label={`Ver detalhes de ${product.name}`}>
        <ProductImage product={product} />
      </Link>
      <div className="product-info">
        <div className="product-info__copy">
          <small className="product-category">{product.categoryName}</small>
          <h3>
            <Link to={`/produto/${product.id}`}>{product.name}</Link>
          </h3>
          <div className="prices">
            <b>R$ {product.promotionalPrice.toFixed(2).replace('.', ',')}</b>
            {hasPromotion && <del>R$ {product.price.toFixed(2).replace('.', ',')}</del>}
          </div>
          {product.stock === 0 && <small className="stock-badge">Sem estoque</small>}
        </div>
        <button
          type="button"
          className="add-button"
          disabled={product.stock === 0}
          aria-label={product.stock === 0 ? `${product.name} sem estoque` : `Adicionar ${product.name} ao carrinho`}
          onClick={() => addItem(product)}
        >
          {product.stock === 0 ? (
            <span>Indisponível</span>
          ) : (
            <>
              <ShoppingCart size={16} aria-hidden="true" />
              <span>Adicionar</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
}
export default ProductCard;
