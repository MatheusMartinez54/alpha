import { useId } from 'react';
import { X } from 'lucide-react';
import Dialog from '../../Dialog/Dialog.jsx';
import './Modal.css';

function Modal({ title, compact = false, onClose, onSubmit, children, footer }) {
  const titleId = useId();
  const Content = onSubmit ? 'form' : 'div';
  return (
    <Dialog className={`admin-modal${compact ? ' admin-modal--compact' : ''}`} aria-labelledby={titleId} onClose={onClose}>
      <header className="admin-modal__header">
        <h3 id={titleId}>{title}</h3>
        <button type="button" className="admin-modal__close" aria-label="Fechar modal" onClick={onClose}>
          <X size={20} aria-hidden="true" />
        </button>
      </header>
      <Content className="admin-modal__content" onSubmit={onSubmit}>
        <div className="admin-modal__body">{children}</div>
        <footer className="admin-modal__actions">{footer}</footer>
      </Content>
    </Dialog>
  );
}
export default Modal;
