import { useStore } from '../../../context/StoreContext.jsx';

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const statuses = ['Aberto', 'Aceito', 'Em rota', 'Finalizado'];

function OrdersPage() {
  const { orders, updateOrderStatus } = useStore();

  return (
    <div className="admin-page-content admin-catalog">
      <div className="admin-page-header">
        <div>
          <h1>Pedidos</h1>
          <p>Aceite e acompanhe os pedidos recebidos da loja.</p>
        </div>
      </div>
      {orders.length === 0 ? (
        <div className="empty">
          <p>Nenhum pedido recebido ainda.</p>
        </div>
      ) : (
        <div className="admin-table-wrapper" role="region" aria-label="Pedidos recebidos" tabIndex={0}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Itens</th>
                <th>Loja</th>
                <th>Pagamento</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <th scope="row">
                    <strong>{order.id}</strong>
                    <small>{new Date(order.createdAt).toLocaleString('pt-BR')}</small>
                  </th>
                  <td>{order.items.reduce((sum, item) => sum + item.quantity, 0)} item(ns)</td>
                  <td>{order.store}</td>
                  <td>{order.payment}</td>
                  <td>{currency.format(order.total)}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(event) => updateOrderStatus(order.id, event.target.value)}
                      aria-label={`Status do pedido ${order.id}`}
                    >
                      {statuses.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default OrdersPage;
