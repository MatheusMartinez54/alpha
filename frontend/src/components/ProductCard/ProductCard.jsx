import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';

function ProductCard({ product }) {
  const { addItem } = useCart();
  return (
    <article className="product-card">
      <Link to={`/produto/${product.id}`}>
        <div className="product-art" style={{ background: product.color, backgroundImage: `url(${product.image})` }}>
          <span>{product.tag}</span>
          {product.stock === 0 && <small className="stock-badge">Sem estoque</small>}
          <strong>{product.short}</strong>
        </div>
      </Link>
      <div className="product-info">
        <div>
          <small>{product.categoryName}</small>
          <h3>{product.name}</h3>
          <div className="prices">
            <b>R$ {product.promotionalPrice.toFixed(2).replace('.', ',')}</b>
            {product.promotionalPrice < product.price && <del>R$ {product.price.toFixed(2).replace('.', ',')}</del>}
          </div>
        </div>
        <button
          className="add-button"
          disabled={product.stock === 0}
          aria-label={product.stock === 0 ? `${product.name} sem estoque` : `Adicionar ${product.name}`}
          onClick={() => addItem(product)}
        >
          <Plus size={20} />
        </button>
      </div>
    </article>
  );
}
export default ProductCard;
