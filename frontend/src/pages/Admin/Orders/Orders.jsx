import { useState } from 'react';
import { useStore } from '../../../context/StoreContext.jsx';
import EmptyState from '../../../components/Admin/EmptyState/EmptyState.jsx';
import ProductThumbnail from '../../../components/Admin/ProductThumbnail/ProductThumbnail.jsx';
import { formatCurrency } from '../../../utils/format.js';

const statuses = ['Aberto', 'Aceito', 'Em rota', 'Finalizado'];

function OrdersPage() {
  const { orders, updateOrder, updateOrderStatus, deliveryPersons } = useStore();
  const [selectedDeliveryPersons, setSelectedDeliveryPersons] = useState({});

  const acceptOrder = (orderId, deliveryPersonId) => {
    if (!deliveryPersonId) return;
    updateOrder(orderId, { status: 'Aceito', deliveryPersonId });
  };

  const getDeliveryPerson = (deliveryPersonId) => deliveryPersons.find((deliveryPerson) => deliveryPerson.id === deliveryPersonId);

  return (
    <div className="admin-page-content admin-catalog">
      <div className="admin-page-header">
        <div>
          <h1>Pedidos</h1>
          <p>Aceite e acompanhe os pedidos recebidos da loja.</p>
        </div>
      </div>
      {orders.length === 0 ? (
        <EmptyState title="Nenhum pedido recebido ainda." description="Os pedidos confirmados na loja aparecerão aqui para acompanhamento." />
      ) : (
        <ul className="admin-order-list" aria-label="Pedidos recebidos">
          {orders.map((order) => (
            <li className="admin-order" key={order.id}>
              <div>
                <h2>{order.id}</h2>
                <time dateTime={order.createdAt}>{new Date(order.createdAt).toLocaleString('pt-BR')}</time>
                <dl>
                  <div>
                    <dt>Cliente</dt>
                    <dd>{order.customerName || 'Não informado'}</dd>
                  </div>
                  {order.phone && (
                    <div>
                      <dt>Telefone</dt>
                      <dd>
                        <a href={`tel:${order.phone.replace(/[^\d+]/g, '')}`}>{order.phone}</a>
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt>Entrega</dt>
                    <dd>{order.location || 'Localização não informada'}</dd>
                  </div>
                  {order.reference && (
                    <div>
                      <dt>Referência</dt>
                      <dd>{order.reference}</dd>
                    </div>
                  )}
                  <div>
                    <dt>Pagamento</dt>
                    <dd>{order.payment}</dd>
                  </div>
                  <div>
                    <dt>Total</dt>
                    <dd>{formatCurrency(order.total)}</dd>
                  </div>
                </dl>
                <details className="admin-order__details">
                  <summary>Ver itens ({order.items.reduce((sum, item) => sum + item.quantity, 0)})</summary>
                  <ul className="admin-order__items" aria-label={`Itens do pedido ${order.id}`}>
                    {order.items.map((item) => (
                      <li key={item.id}>
                        <ProductThumbnail src={item.image} alt={item.name} />
                        <div>
                          <strong>{item.name}</strong>
                          <span>
                            {item.quantity} × {formatCurrency(item.promotionalPrice ?? item.price)}
                          </span>
                        </div>
                        <strong className="admin-order__item-total">{formatCurrency((item.promotionalPrice ?? item.price) * item.quantity)}</strong>
                      </li>
                    ))}
                  </ul>
                </details>
              </div>
              {order.status === 'Aberto' ? (
                <div className="admin-order__accept">
                  <label>
                    Entregador
                    <select
                      value={selectedDeliveryPersons[order.id] || ''}
                      aria-label={`Entregador do pedido ${order.id}`}
                      onChange={(event) => setSelectedDeliveryPersons((current) => ({ ...current, [order.id]: event.target.value }))}
                    >
                      <option value="">Selecionar entregador</option>
                      {deliveryPersons.map((deliveryPerson) => (
                        <option key={deliveryPerson.id} value={deliveryPerson.id}>
                          {deliveryPerson.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    type="button"
                    className="button"
                    disabled={!selectedDeliveryPersons[order.id]}
                    onClick={() => acceptOrder(order.id, selectedDeliveryPersons[order.id])}
                  >
                    Aceitar pedido
                  </button>
                  {deliveryPersons.length === 0 && <small className="field-error">Cadastre um entregador antes de aceitar.</small>}
                </div>
              ) : (
                <label>
                  Status do pedido
                  <select
                    value={order.status}
                    onChange={(event) => updateOrderStatus(order.id, event.target.value)}
                    aria-label={`Status do pedido ${order.id}`}
                  >
                    {statuses.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                  {getDeliveryPerson(order.deliveryPersonId) && <small>Entregador: {getDeliveryPerson(order.deliveryPersonId).name}</small>}
                </label>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default OrdersPage;
