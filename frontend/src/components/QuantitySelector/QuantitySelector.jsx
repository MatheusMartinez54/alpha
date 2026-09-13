import { Minus, Plus } from 'lucide-react';

function QuantitySelector({ value, onChange, label, min = 1, max = Infinity }) {
  return (
    <div className="quantity-stepper" role="group" aria-label={`Quantidade de ${label}`}>
      <button type="button" aria-label={`Diminuir quantidade de ${label}`} disabled={value <= min} onClick={() => onChange(value - 1)}>
        <Minus size={16} aria-hidden="true" />
      </button>
      <span aria-live="polite" aria-atomic="true">
        {value}
      </span>
      <button type="button" aria-label={`Aumentar quantidade de ${label}`} disabled={value >= max} onClick={() => onChange(value + 1)}>
        <Plus size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
export default QuantitySelector;
