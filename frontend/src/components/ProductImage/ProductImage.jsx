import { useState } from 'react';
import { ImageOff } from 'lucide-react';
function ProductImage({ product, className = '', loading = 'lazy' }) {
  const [failedSource, setFailedSource] = useState(null);
  return (
    <div className={`product-image ${className}`}>
      {product.image && failedSource !== product.image ? (
        <img src={product.image} alt={product.name} loading={loading} decoding="async" onError={() => setFailedSource(product.image)} />
      ) : (
        <span className="product-image__fallback"><ImageOff size={24} aria-hidden="true" /><span className="sr-only">Imagem de {product.name} indisponível</span></span>
      )}
    </div>
  );
}
export default ProductImage;
