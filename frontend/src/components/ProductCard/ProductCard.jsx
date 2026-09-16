import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import ProductImage from '../ProductImage/ProductImage.jsx';
import Price from '../Price/Price.jsx';

function ProductCard({ product }) {
  const { addItem } = useCart();
  const unavailable = product.stock <= 0;
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
          disabled={unavailable}
          aria-label={unavailable ? `${product.name} sem estoque` : `Adicionar ${product.name} ao carrinho`}
          onClick={() => addItem(product)}
        >
          {!unavailable && <ShoppingCart size={16} aria-hidden="true" />}
          <span>{unavailable ? 'Sem estoque' : 'Adicionar'}</span>
        </button>
      </div>
    </article>
  );
}
export default ProductCard;
