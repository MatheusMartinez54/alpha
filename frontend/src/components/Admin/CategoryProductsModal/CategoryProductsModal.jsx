import { useMemo, useState } from 'react';
import { X } from 'lucide-react';

function CategoryProductsModal({ open, category, products, availableProducts, onClose, onAddProducts }) {
  const [selectedProducts, setSelectedProducts] = useState([]);

  const currentProducts = useMemo(() => products || [], [products]);

  const handleToggle = (productId) => {
    setSelectedProducts((current) => (current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]));
  };

  const handleAdd = () => {
    if (selectedProducts.length > 0 && onAddProducts) {
      onAddProducts(selectedProducts);
      setSelectedProducts([]);
    }
  };

  if (!open || !category) return null;

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal admin-modal--compact" onClick={(event) => event.stopPropagation()}>
        <div className="admin-modal__header">
          <h3>{category.name}</h3>
          <button type="button" className="admin-modal__close" aria-label="Fechar modal" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="admin-category-products">
          <div className="admin-category-products__list">
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <div key={product.id} className="admin-category-products__item">
                  <div className="admin-category-products__image">
                    <img src={product.image || ''} alt={product.name} />
                  </div>
                  <div>
                    <strong>{product.name}</strong>
                    <span>{product.stock} un.</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="admin-empty-copy">Nenhum produto vinculado a esta categoria.</p>
            )}
          </div>

          {availableProducts && availableProducts.length > 0 && (
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

              <div className="admin-modal__actions">
                <button type="button" className="button secondary" onClick={onClose}>
                  Cancelar
                </button>
                <button type="button" className="button" onClick={handleAdd} disabled={selectedProducts.length === 0}>
                  Adicionar produtos
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoryProductsModal;
