import { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';
import './Modal.css';

function Modal({ title, compact = false, onClose, onSubmit, children, footer }) {
  const dialogRef = useRef(null);
  const titleId = useId();
  const Content = onSubmit ? 'form' : 'div';

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    dialog.showModal();

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    const handleBackdropClick = (event) => {
      if (event.target !== dialog) return;

      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
        onClose();
      }
    };

    dialog.addEventListener('click', handleBackdropClick);
    return () => dialog.removeEventListener('click', handleBackdropClick);
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      className={`admin-modal${compact ? ' admin-modal--compact' : ''}`}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
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
    </dialog>
  );
}

export default Modal;
