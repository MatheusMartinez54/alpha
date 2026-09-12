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
        <h3>Pedidos recentes</h3>
      </div>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-row">
            <div className="order-row__main">
              <strong>{order.id}</strong>
              <span>{order.customer}</span>
            </div>

            <div className="order-row__meta">
              <strong>{order.total}</strong>
              <span className={`order-status ${statusClassMap[order.status] || ''}`}>{order.status}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default RecentOrders;
