import { Link } from 'react-router-dom';

function LowStockProducts({ products }) {
  return (
    <section className="admin-panel">
      <div className="admin-panel__header">
        <h2>Estoque baixo</h2>
        <Link className="back-link" to="/admin/produtos">
          Gerenciar produtos
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="admin-panel__empty">Nenhum produto ativo com estoque baixo.</p>
      ) : (
        <ul className="stock-list">
          {products.map((product) => (
            <li key={product.id} className="stock-item">
              <div>
                <strong>{product.name}</strong>
              </div>
              <span>{product.stock === 0 ? 'Sem estoque' : `${product.stock} ${product.stock === 1 ? 'unidade' : 'unidades'}`}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default LowStockProducts;
