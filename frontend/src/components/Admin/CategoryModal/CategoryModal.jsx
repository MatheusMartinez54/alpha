import { useId, useState } from 'react';
import Modal from '../Modal/Modal.jsx';

const defaultValues = {
  name: '',
  active: true,
};

function CategoryForm({ mode, initialValues, onClose, onSubmit }) {
  const [form, setForm] = useState(initialValues || defaultValues);
  const nameId = useId();

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
    <Modal
      title={mode === 'edit' ? 'Editar categoria' : 'Nova categoria'}
      compact
      onClose={onClose}
      onSubmit={handleSubmit}
      footer={
        <>
          <button type="button" className="button secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="button">
            {mode === 'edit' ? 'Salvar categoria' : 'Cadastrar'}
          </button>
        </>
      }
    >
      <div className="admin-modal__form">
        <div className="admin-modal__field admin-modal__field--full">
          <label htmlFor={nameId}>Nome da categoria</label>
          <input id={nameId} name="name" value={form.name || ''} onChange={handleChange} placeholder="Digite o nome da categoria" required />
        </div>

        <div className="admin-modal__field admin-modal__field--checkbox admin-modal__field--full">
          <label className="admin-checkbox">
            <input type="checkbox" name="active" checked={Boolean(form.active)} onChange={handleChange} />
            <span>Categoria ativa</span>
          </label>
        </div>
      </div>
    </Modal>
  );
}

function CategoryModal({ open, mode = 'create', ...props }) {
  if (!open) return null;

  return <CategoryForm key={props.initialValues?.id || mode} mode={mode} {...props} />;
}

export default CategoryModal;
