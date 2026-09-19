import { useId, useState } from 'react';
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

function ProductForm({ mode, categories, initialValues, onClose, onSubmit }) {
  const [form, setForm] = useState(initialValues || defaultValues);
  const [imageFeedback, setImageFeedback] = useState('');
  const fieldId = useId();

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

  const handleImageFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setImageFeedback('Escolha um arquivo de imagem válido.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setImageFeedback('A imagem deve ter no máximo 2 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({ ...current, image: reader.result }));
      setImageFeedback('Imagem carregada.');
    };
    reader.onerror = () => setImageFeedback('Não foi possível carregar a imagem.');
    reader.readAsDataURL(file);
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
              <span>Use um link ou escolha um arquivo do dispositivo.</span>
            </div>
          </div>
          <div className="admin-modal__image-options">
            <label htmlFor={`${fieldId}-image`}>Link da imagem</label>
            <input
              id={`${fieldId}-image`}
              type="url"
              name="image"
              value={typeof form.image === 'string' && !form.image.startsWith('data:') ? form.image : ''}
              onChange={(event) => {
                setImageFeedback('');
                handleChange(event);
              }}
              placeholder="https://exemplo.com/imagem.jpg"
            />
            <label htmlFor={`${fieldId}-image-file`}>Ou escolha um arquivo</label>
            <input id={`${fieldId}-image-file`} type="file" accept="image/*" onChange={handleImageFile} />
            {imageFeedback && (
              <small className="admin-modal__image-feedback" role="status">
                {imageFeedback}
              </small>
            )}
          </div>
        </div>

        <div className="admin-modal__field">
          <label htmlFor={`${fieldId}-name`}>Nome</label>
          <input id={`${fieldId}-name`} name="name" value={form.name || ''} onChange={handleChange} placeholder="Digite o nome do produto" required />
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
      </div>
    </Modal>
  );
}

function ProductModal({ open, mode = 'create', ...props }) {
  if (!open) return null;

  return <ProductForm key={props.initialValues?.id || mode} mode={mode} {...props} />;
}

export default ProductModal;
