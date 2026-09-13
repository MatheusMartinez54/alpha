import { formatCurrency, getProductPrice } from '../../utils/format.js';

function Price({ product, className = '' }) {
  const value = getProductPrice(product);
  return (
    <div className={`prices ${className}`}>
      <strong>
        <span className="sr-only">Preço: </span>
        {formatCurrency(value)}
      </strong>
      {value < product.price && (
        <del>
          <span className="sr-only">Preço anterior: </span>
          {formatCurrency(product.price)}
        </del>
      )}
    </div>
  );
}
export default Price;
