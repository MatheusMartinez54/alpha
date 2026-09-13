import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import ProductImage from '../../components/ProductImage/ProductImage.jsx';
import Price from '../../components/Price/Price.jsx';
import QuantitySelector from '../../components/QuantitySelector/QuantitySelector.jsx';
import EmptyState from '../../components/EmptyState/EmptyState.jsx';

function ProductDetails({ product }) {
  const { items, addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const inCart = items.find((item) => item.id === product.id)?.quantity || 0;
  const remaining = Math.max(0, product.stock - inCart);
  const selectedQuantity = Math.max(1, Math.min(quantity, remaining));
  const buy = () => {
    addItem(product, selectedQuantity);
    navigate('/checkout');
  };
  return (
    <div className="detail-layout">
      <ProductImage product={product} className="detail-art" loading="eager" />
      <div className="detail-copy">
        <span className="eyebrow">{product.categoryName}</span>
        <h1>{product.name}</h1>
        <Price product={product} className="price--large" />
        <p className="detail-availability">
          {product.stock <= 0
            ? 'Produto sem estoque no momento.'
            : remaining === 0
              ? 'Você já adicionou o estoque disponível ao carrinho.'
              : 'Disponível para retirada na loja'}
        </p>
        <div className="detail-quantity">
          <span>Quantidade</span>
          <QuantitySelector label={product.name} value={selectedQuantity} max={remaining} onChange={setQuantity} />
        </div>
        <div className="detail-actions">
          <button className="button" disabled={remaining === 0} onClick={buy}>
            Comprar agora
          </button>
          <button className="button secondary" disabled={remaining === 0} onClick={() => addItem(product, selectedQuantity)}>
            <ShoppingCart size={18} aria-hidden="true" /> Adicionar ao carrinho
          </button>
        </div>
        <p className="detail-note">Selecione a loja de retirada e a forma de pagamento ao finalizar.</p>
        {product.description && (
          <section className="detail-description">
            <h2>Sobre o produto</h2>
            <p>{product.description}</p>
          </section>
        )}
      </div>
    </div>
  );
}
function Product() {
  const { products } = useStore();
  const { id } = useParams();
  const product = products.find((item) => item.id === id && item.active);
  return (
    <main id="main-content" className="main container product-detail">
      <Link className="back-link" to="/produtos">
        <ArrowLeft size={16} aria-hidden="true" /> Voltar ao catálogo
      </Link>
      {product ? (
        <ProductDetails key={product.id} product={product} />
      ) : (
        <EmptyState
          heading="h1"
          title="Produto não encontrado"
          description="Este produto não está disponível no catálogo. Confira os outros itens da loja."
          to="/produtos"
          action="Voltar ao catálogo"
        />
      )}
    </main>
  );
}
export default Product;
