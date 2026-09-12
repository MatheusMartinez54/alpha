function LowStockProducts({ products }) {
  return (
    <section className="admin-panel">
      <div className="admin-panel__header">
        <h3>Estoque baixo</h3>
      </div>

      <div className="stock-list">
        {products.map((product) => (
          <div key={product.name} className="stock-item">
            <div>
              <strong>{product.name}</strong>
            </div>
            <span>Estoque: {product.stock} unidades</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default LowStockProducts;
