import { CheckCircle2 } from 'lucide-react';

function CartToast({ message, visible }) {
  if (!visible || !message) return null;

  return (
    <div className="cart-toast" role="status" aria-live="polite" aria-atomic="true">
      <CheckCircle2 size={18} aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}

export default CartToast;
