import { Link } from 'react-router-dom';
import { formatCurrency } from '../../../utils/format.js';

const statusClassMap = {
  Aberto: 'status--open',
  Aceito: 'status--accepted',
  'Em rota': 'status--in-transit',
  Finalizado: 'status--completed',
};

function RecentOrders({ orders }) {
  return (
    <section className="admin-panel">
      <div className="admin-panel__header">
        <h2>Pedidos recentes</h2>
        <Link className="back-link" to="/admin/pedidos">
          Ver todos
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="admin-panel__empty">Os pedidos da loja aparecerão aqui.</p>
      ) : (
        <ul className="orders-list">
          {orders.map((order) => (
            <li key={order.id} className="order-row">
              <div className="order-row__main">
                <strong>{order.id}</strong>
                <span>{order.customerName || 'Cliente não informado'}</span>
              </div>

              <div className="order-row__meta">
                <strong>{formatCurrency(order.total)}</strong>
                <span className={`order-status ${statusClassMap[order.status] || ''}`}>{order.status}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default RecentOrders;
