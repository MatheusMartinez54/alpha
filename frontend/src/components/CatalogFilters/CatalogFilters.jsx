import { useId } from 'react';

function CatalogFilters({ categories, category, inStock, onChange }) {
  const categoryId = useId();
  return (
    <div className="catalog-filters">
      <div className="field-group">
        <label htmlFor={categoryId}>Categoria</label>
        <select id={categoryId} value={category} onChange={(event) => onChange('categoria', event.target.value)}>
          <option value="">Todas as categorias</option>
          {category && !categories.some((item) => item.id === category) && <option value={category}>{category}</option>}
          {categories.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <label className="checkbox-field">
        <input type="checkbox" checked={inStock} onChange={(event) => onChange('estoque', event.target.checked ? 'disponivel' : '')} />{' '}
        Somente em estoque
      </label>
    </div>
  );
}
export default CatalogFilters;
