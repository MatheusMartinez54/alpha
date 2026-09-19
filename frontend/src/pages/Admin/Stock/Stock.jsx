import { useMemo, useState } from 'react';
import { ArrowDownToLine, ArrowUpFromLine, History, Plus } from 'lucide-react';
import Modal from '../../../components/Admin/Modal/Modal.jsx';
import ProductThumbnail from '../../../components/Admin/ProductThumbnail/ProductThumbnail.jsx';
import EmptyState from '../../../components/Admin/EmptyState/EmptyState.jsx';
import { useStore } from '../../../context/StoreContext.jsx';

const movementLabels = {
  entrada: 'Entrada',
  saida: 'Saída',
};

function formatDate(value) {
  return new Date(value).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

function StockPage() {
  const { products, stockMovements, addStockMovement } = useStore();
  const [movementProduct, setMovementProduct] = useState(null);
  const [historyProduct, setHistoryProduct] = useState(null);
  const [movementType, setMovementType] = useState('entrada');
  const [quantity, setQuantity] = useState('');
  const [feedback, setFeedback] = useState('');

  const history = useMemo(
    () => (historyProduct ? stockMovements.filter((movement) => movement.productId === historyProduct.id) : []),
    [historyProduct, stockMovements],
  );

  const openMovement = (product) => {
    setMovementProduct(product);
    setMovementType('entrada');
    setQuantity('');
    setFeedback('');
  };

  const closeMovement = () => {
    setMovementProduct(null);
    setFeedback('');
  };

  const submitMovement = (event) => {
    event.preventDefault();
    const result = addStockMovement(movementProduct.id, movementType, quantity);
    if (!result.ok) {
      setFeedback(result.message);
      return;
    }
    closeMovement();
  };

  return (
    <div className="admin-page-content admin-stock">
      <div className="admin-page-header">
        <div>
          <h1>Estoque</h1>
          <p>Adicione entradas, registre saídas e acompanhe o histórico dos produtos.</p>
        </div>
      </div>

      {products.length === 0 ? (
        <EmptyState title="Nenhum produto cadastrado." description="Cadastre um produto para começar a controlar o estoque." />
      ) : (
        <ul className="admin-stock-list" aria-label="Produtos em estoque">
          {products.map((product) => (
            <li className="admin-stock-card" key={product.id}>
              <ProductThumbnail src={product.image} alt={product.name} />
              <div className="admin-stock-card__info">
                <strong>{product.name}</strong>
                <span>Quantidade atual</span>
                <b>{product.stock || 0} un.</b>
              </div>
              <div className="admin-stock-card__actions">
                <button type="button" className="button" onClick={() => openMovement(product)}>
                  <Plus size={17} aria-hidden="true" />
                  Adicionar
                </button>
                <button type="button" className="button secondary" onClick={() => setHistoryProduct(product)}>
                  <History size={17} aria-hidden="true" />
                  Ver histórico
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {movementProduct && (
        <Modal
          title={`Atualizar estoque: ${movementProduct.name}`}
          compact
          onClose={closeMovement}
          onSubmit={submitMovement}
          footer={
            <>
              <button type="button" className="button secondary" onClick={closeMovement}>
                Cancelar
              </button>
              <button type="submit" className="button">
                Registrar movimentação
              </button>
            </>
          }
        >
          <div className="admin-stock-form">
            <div className="admin-stock-form__current">
              <span>Estoque atual</span>
              <strong>{movementProduct.stock || 0} unidades</strong>
            </div>
            <fieldset>
              <legend>Tipo de movimentação</legend>
              <div className="admin-stock-types">
                <label className={`admin-stock-type${movementType === 'entrada' ? ' is-selected' : ''}`}>
                  <input
                    type="radio"
                    name="movement-type"
                    value="entrada"
                    checked={movementType === 'entrada'}
                    onChange={() => setMovementType('entrada')}
                  />
                  <ArrowDownToLine size={18} aria-hidden="true" />
                  <span>Entrada</span>
                </label>
                <label className={`admin-stock-type${movementType === 'saida' ? ' is-selected' : ''}`}>
                  <input
                    type="radio"
                    name="movement-type"
                    value="saida"
                    checked={movementType === 'saida'}
                    onChange={() => setMovementType('saida')}
                  />
                  <ArrowUpFromLine size={18} aria-hidden="true" />
                  <span>Saída</span>
                </label>
              </div>
            </fieldset>
            <label className="admin-stock-form__quantity">
              Quantidade
              <input
                type="number"
                min="1"
                step="1"
                inputMode="numeric"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                required
                autoFocus
              />
            </label>
            {feedback && <small className="field-error">{feedback}</small>}
          </div>
        </Modal>
      )}

      {historyProduct && (
        <Modal
          title={`Histórico: ${historyProduct.name}`}
          compact
          onClose={() => setHistoryProduct(null)}
          footer={
            <button type="button" className="button" onClick={() => setHistoryProduct(null)}>
              Fechar
            </button>
          }
        >
          {history.length === 0 ? (
            <p className="admin-stock-empty-history">Nenhuma movimentação registrada para este produto.</p>
          ) : (
            <ul className="admin-stock-history" aria-label={`Histórico de ${historyProduct.name}`}>
              {history.map((movement) => (
                <li key={movement.id} className={`admin-stock-history__item admin-stock-history__item--${movement.type}`}>
                  <span className="admin-stock-history__icon" aria-hidden="true">
                    {movement.type === 'entrada' ? <ArrowDownToLine size={18} /> : <ArrowUpFromLine size={18} />}
                  </span>
                  <div>
                    <strong>{movementLabels[movement.type]}</strong>
                    <time dateTime={movement.createdAt}>{formatDate(movement.createdAt)}</time>
                  </div>
                  <b>
                    {movement.type === 'entrada' ? '+' : '-'}
                    {movement.quantity} un.
                  </b>
                </li>
              ))}
            </ul>
          )}
        </Modal>
      )}
    </div>
  );
}

export default StockPage;
