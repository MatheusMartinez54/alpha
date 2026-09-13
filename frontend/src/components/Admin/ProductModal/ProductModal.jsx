import { useId, useRef, useState } from 'react';
import Modal from '../Modal/Modal.jsx';
import ProductThumbnail from '../ProductThumbnail/ProductThumbnail.jsx';

const defaultValues = {
  image: '',
  name: '',
  description: '',
  categoryId: '',
  price: '',
  promotionalPrice: '',
  active: true,
  stock: 0,
};

function ProductForm({ mode, categories, initialValues, onClose, onSubmit, onStockUpdate }) {
  const [form, setForm] = useState(initialValues || defaultValues);
  const [stockFeedback, setStockFeedback] = useState(null);
  const stockRef = useRef(null);
  const fieldId = useId();

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (name === 'stock') setStockFeedback(null);
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  const handleStockUpdate = () => {
    const stock = Number(form.stock);
    if (form.stock === '' || !Number.isInteger(stock) || stock < 0) {
      setStockFeedback({ error: true, message: 'Informe uma quantidade inteira igual ou maior que zero.' });
      stockRef.current?.focus();
      return;
    }
    if (onStockUpdate) {
      onStockUpdate(stock);
      setStockFeedback({ error: false, message: `Estoque atualizado: ${stock} ${stock === 1 ? 'unidade' : 'unidades'}.` });
    }
  };

  return (
    <Modal
      title={mode === 'edit' ? 'Editar produto' : 'Cadastrar produto'}
      onClose={onClose}
      onSubmit={handleSubmit}
      footer={
        <>
          <button type="button" className="button secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="button">
            {mode === 'edit' ? 'Salvar alterações' : 'Cadastrar produto'}
          </button>
        </>
      }
    >
      <div className="admin-modal__form">
        <div className="admin-modal__field admin-modal__field--full">
          <label htmlFor={`${fieldId}-image`}>Imagem do produto</label>
          <div className="admin-modal__image-box">
            <ProductThumbnail src={form.image} alt={form.name ? `Prévia de ${form.name}` : 'Prévia do produto'} />
            <div className="admin-modal__image-copy">
              <strong>Prévia da imagem</strong>
              <span>Informe o endereço da imagem no campo abaixo.</span>
            </div>
          </div>
          <input
            id={`${fieldId}-image`}
            type="url"
            name="image"
            value={form.image || ''}
            onChange={handleChange}
            placeholder="https://exemplo.com/imagem.jpg"
          />
        </div>

        <div className="admin-modal__field">
          <label htmlFor={`${fieldId}-name`}>Nome</label>
          <input
            id={`${fieldId}-name`}
            name="name"
            value={form.name || ''}
            onChange={handleChange}
            placeholder="Digite o nome do produto"
            required
          />
        </div>

        <div className="admin-modal__field">
          <label htmlFor={`${fieldId}-category`}>Categoria</label>
          <select id={`${fieldId}-category`} name="categoryId" value={form.categoryId || ''} onChange={handleChange} required>
            <option value="">Selecionar categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-modal__field admin-modal__field--full">
          <label htmlFor={`${fieldId}-description`}>Descrição</label>
          <textarea
            id={`${fieldId}-description`}
            name="description"
            value={form.description || ''}
            onChange={handleChange}
            placeholder="Descreva o produto"
            rows={3}
            required
          />
        </div>

        <div className="admin-modal__field">
          <label htmlFor={`${fieldId}-price`}>Preço</label>
          <input
            id={`${fieldId}-price`}
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price ?? ''}
            onChange={handleChange}
            placeholder="R$ 0,00"
            required
          />
        </div>

        <div className="admin-modal__field">
          <label htmlFor={`${fieldId}-promotional-price`}>Preço promocional</label>
          <input
            id={`${fieldId}-promotional-price`}
            name="promotionalPrice"
            type="number"
            min="0"
            step="0.01"
            value={form.promotionalPrice ?? ''}
            onChange={handleChange}
            placeholder="R$ 0,00"
          />
        </div>

        <div className="admin-modal__field admin-modal__field--checkbox admin-modal__field--full">
          <label className="admin-checkbox">
            <input type="checkbox" name="active" checked={Boolean(form.active)} onChange={handleChange} />
            <span>Produto ativo</span>
          </label>
        </div>

        {mode === 'edit' && (
          <div className="admin-modal__stock admin-modal__field--full">
            <div className="admin-modal__stock-header">
              <h4>Estoque</h4>
            </div>

            <div className="admin-modal__stock-row">
              <div className="admin-modal__field admin-modal__field--grow">
                <label htmlFor={`${fieldId}-stock`}>Quantidade atual</label>
                <input
                  ref={stockRef}
                  id={`${fieldId}-stock`}
                  name="stock"
                  type="number"
                  min="0"
                  step="1"
                  inputMode="numeric"
                  required
                  value={form.stock ?? 0}
                  onChange={handleChange}
                  aria-invalid={stockFeedback?.error || undefined}
                  aria-describedby={stockFeedback ? `${fieldId}-stock-feedback` : undefined}
                />
              </div>
              <button type="button" className="button secondary" onClick={handleStockUpdate}>
                Atualizar estoque
              </button>
            </div>
            <p
              id={`${fieldId}-stock-feedback`}
              className={`admin-stock-feedback${stockFeedback?.error ? ' admin-stock-feedback--error' : ''}`}
              role="status"
            >
              {stockFeedback?.message}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}

function ProductModal({ open, mode = 'create', ...props }) {
  if (!open) return null;

  return <ProductForm key={props.initialValues?.id || mode} mode={mode} {...props} />;
}

export default ProductModal;
