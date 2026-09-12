import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import './ProductThumbnail.css';

function ProductThumbnail({ src, alt = '' }) {
  const [failedSource, setFailedSource] = useState(null);
  const source = src?.trim();
  const hasImage = source && source !== failedSource;

  return (
    <span
      className="admin-product-thumbnail"
      role={hasImage ? undefined : 'img'}
      aria-label={hasImage ? undefined : `${alt || 'Produto'}: imagem indisponível`}
    >
      {hasImage ? (
        <img src={source} alt={alt} width={56} height={56} onError={() => setFailedSource(source)} />
      ) : (
        <ImageOff size={20} strokeWidth={1.5} aria-hidden="true" />
      )}
    </span>
  );
}

export default ProductThumbnail;
