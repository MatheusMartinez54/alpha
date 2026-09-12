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
        <ul className="admin-order-list" aria-label="Pedidos recebidos">
          {orders.map((order) => (
            <li className="admin-order" key={order.id}>
              <div>
                <h2>{order.id}</h2>
                <time dateTime={order.createdAt}>{new Date(order.createdAt).toLocaleString('pt-BR')}</time>
                <dl>
                  <div><dt>Itens</dt><dd>{order.items.reduce((sum, item) => sum + item.quantity, 0)} item(ns)</dd></div>
                  <div><dt>Loja</dt><dd>{order.store}</dd></div>
                  <div><dt>Pagamento</dt><dd>{order.payment}</dd></div>
                  <div><dt>Total</dt><dd>{currency.format(order.total)}</dd></div>
                </dl>
              </div>
              <label>Status do pedido
                <select value={order.status} onChange={(event) => updateOrderStatus(order.id, event.target.value)} aria-label={`Status do pedido ${order.id}`}>
                  {statuses.map((status) => <option key={status}>{status}</option>)}
                </select>
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default OrdersPage;
