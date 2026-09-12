import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import ProductImage from '../../components/ProductImage/ProductImage.jsx';
function Product() {
  const { products } = useStore();
  const { id } = useParams();
  const product = products.find((item) => item.id === id) || products[0];
  const { addItem } = useCart();
  return (
    <main className="main container product-detail">
      <Link className="back-link" to="/produtos">
        <ArrowLeft size={16} /> Voltar ao catálogo
      </Link>
      <div className="detail-layout">
        <ProductImage product={product} className="detail-art" loading="eager" />
        <div className="detail-copy">
          <span className="eyebrow">{product.categoryName}</span>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <strong className="price">
            R$ {product.promotionalPrice.toFixed(2).replace('.', ',')}{' '}
            {product.promotionalPrice < product.price && <del>R$ {product.price.toFixed(2).replace('.', ',')}</del>}
          </strong>
          {product.stock === 0 && <p className="out-of-stock">Produto sem estoque no momento.</p>}
          <button className="button" disabled={product.stock === 0} onClick={() => addItem(product)}>
            <Plus size={18} /> Adicionar ao carrinho
          </button>
        </div>
      </div>
    </main>
  );
}
export default Product;
