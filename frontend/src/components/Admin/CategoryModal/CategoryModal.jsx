import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const defaultValues = {
  name: '',
  active: true,
};

function CategoryModal({ open, mode = 'create', initialValues, onClose, onSubmit }) {
  const [form, setForm] = useState(initialValues || defaultValues);

  useEffect(() => {
    setForm(initialValues || defaultValues);
  }, [initialValues, open]);

  if (!open) return null;

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal admin-modal--compact" onClick={(event) => event.stopPropagation()}>
        <div className="admin-modal__header">
          <h3>{mode === 'edit' ? 'Editar categoria' : 'Nova categoria'}</h3>
          <button type="button" className="admin-modal__close" aria-label="Fechar modal" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form className="admin-modal__form" onSubmit={handleSubmit}>
          <div className="admin-modal__field admin-modal__field--full">
            <label htmlFor="category-name">Nome da categoria</label>
            <input id="category-name" name="name" value={form.name || ''} onChange={handleChange} placeholder="Digite o nome da categoria" required />
          </div>

          <div className="admin-modal__field admin-modal__field--checkbox admin-modal__field--full">
            <label className="admin-checkbox">
              <input type="checkbox" name="active" checked={Boolean(form.active)} onChange={handleChange} />
              <span>Categoria ativa</span>
            </label>
          </div>

          <div className="admin-modal__actions admin-modal__field--full">
            <button type="button" className="button secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="button">
              {mode === 'edit' ? 'Salvar categoria' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CategoryModal;
