import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import Modal from '../Modal/Modal.jsx';
import ProductThumbnail from '../ProductThumbnail/ProductThumbnail.jsx';

function CategoryProductsContent({ category, products, availableProducts, onClose, onAddProducts, onRemoveProduct }) {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const currentProducts = products || [];
  const hasAvailableProducts = availableProducts && availableProducts.length > 0;

  const handleToggle = (productId) => {
    setSelectedProducts((current) => (current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]));
  };

  const handleAdd = () => {
    if (selectedProducts.length > 0 && onAddProducts) {
      onAddProducts(selectedProducts);
      setSelectedProducts([]);
    }
  };

  return (
    <Modal
      title={category.name}
      compact
      onClose={onClose}
      footer={
        <>
          <button type="button" className="button secondary" onClick={onClose}>
            {hasAvailableProducts ? 'Cancelar' : 'Fechar'}
          </button>
          {hasAvailableProducts && (
            <button type="button" className="button" onClick={handleAdd} disabled={selectedProducts.length === 0}>
              Adicionar produtos
            </button>
          )}
        </>
      }
    >
      <div className="admin-category-products">
        <div className="admin-category-products__list">
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <div key={product.id} className="admin-category-products__item">
                <ProductThumbnail src={product.image} alt={product.name} />
                <div className="admin-category-products__copy">
                  <strong>{product.name}</strong>
                  <span>{product.stock} un.</span>
                </div>
                <button
                  type="button"
                  className="admin-record__action admin-category-products__remove"
                  aria-label={`Remover ${product.name} da categoria`}
                  title="Remover da categoria"
                  onClick={() => onRemoveProduct?.(product.id)}
                >
                  <Trash2 size={17} aria-hidden="true" />
                </button>
              </div>
            ))
          ) : (
            <p className="admin-empty-copy">Nenhum produto vinculado a esta categoria.</p>
          )}
        </div>

        {hasAvailableProducts && (
          <div className="admin-category-products__assign">
            <h4>Adicionar produtos</h4>
            <div className="admin-category-checkboxes">
              {availableProducts.map((product) => (
                <label key={product.id} className="admin-checkbox admin-checkbox--row">
                  <input type="checkbox" checked={selectedProducts.includes(product.id)} onChange={() => handleToggle(product.id)} />
                  <span>{product.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

function CategoryProductsModal({ open, category, ...props }) {
  if (!open || !category) return null;

  return <CategoryProductsContent key={category.id} category={category} {...props} />;
}

export default CategoryProductsModal;
