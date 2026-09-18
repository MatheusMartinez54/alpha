import { formatCurrency } from '../../utils/format.js';

function OrderTotals({ total, count }) {
  return (
    <dl className="order-totals">
      <div>
        <dt>
          Subtotal ({count} {count === 1 ? 'item' : 'itens'})
        </dt>
        <dd>{formatCurrency(total)}</dd>
      </div>
      <div>
        <dt>Entrega</dt>
        <dd>A combinar</dd>
      </div>
      <div className="order-totals__total">
        <dt>Total</dt>
        <dd>{formatCurrency(total)}</dd>
      </div>
    </dl>
  );
}
export default OrderTotals;
