import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

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

function ProductModal({ open, mode = 'create', categories, initialValues, onClose, onSubmit, onStockUpdate }) {
  const [form, setForm] = useState(initialValues || defaultValues);

  useEffect(() => {
    setForm(initialValues || defaultValues);
  }, [initialValues, open]);

  if (!open) return null;

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
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
    if (onStockUpdate) {
      onStockUpdate(Number(form.stock));
    }
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal" onClick={(event) => event.stopPropagation()}>
        <div className="admin-modal__header">
          <h3>{mode === 'edit' ? 'Editar produto' : 'Cadastrar produto'}</h3>
          <button type="button" className="admin-modal__close" aria-label="Fechar modal" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form className="admin-modal__form" onSubmit={handleSubmit}>
          <div className="admin-modal__field admin-modal__field--full">
            <label>Imagem do produto</label>
            <div className="admin-modal__image-box">
              <span>+ Adicionar imagem</span>
            </div>
            <input type="url" name="image" value={form.image || ''} onChange={handleChange} placeholder="https://exemplo.com/imagem.jpg" />
          </div>

          <div className="admin-modal__field">
            <label htmlFor="name">Nome</label>
            <input id="name" name="name" value={form.name || ''} onChange={handleChange} placeholder="Digite o nome do produto" required />
          </div>

          <div className="admin-modal__field admin-modal__field--full">
            <label htmlFor="description">Descrição</label>
            <textarea
              id="description"
              name="description"
              value={form.description || ''}
              onChange={handleChange}
              placeholder="Descreva o produto"
              rows={4}
              required
            />
          </div>

          <div className="admin-modal__field">
            <label htmlFor="categoryId">Categoria</label>
            <select id="categoryId" name="categoryId" value={form.categoryId || ''} onChange={handleChange} required>
              <option value="">Selecionar categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-modal__field">
            <label htmlFor="price">Preço</label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={form.price || ''}
              onChange={handleChange}
              placeholder="R$ 0,00"
              required
            />
          </div>

          <div className="admin-modal__field">
            <label htmlFor="promotionalPrice">Preço promocional</label>
            <input
              id="promotionalPrice"
              name="promotionalPrice"
              type="number"
              min="0"
              step="0.01"
              value={form.promotionalPrice || ''}
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
                  <label htmlFor="stock">Quantidade atual</label>
                  <input id="stock" name="stock" type="number" min="0" value={form.stock ?? 0} onChange={handleChange} />
                </div>
                <button type="button" className="button secondary" onClick={handleStockUpdate}>
                  Atualizar estoque
                </button>
              </div>
            </div>
          )}

          <div className="admin-modal__actions admin-modal__field--full">
            <button type="button" className="button secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="button">
              {mode === 'edit' ? 'Salvar alterações' : 'Cadastrar produto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductModal;
