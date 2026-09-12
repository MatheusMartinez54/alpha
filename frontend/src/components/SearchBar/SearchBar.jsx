import { useState } from 'react';
import { Search } from 'lucide-react';
function SearchBar({ onSearch }) {
  const [search, setSearch] = useState('');
  return (
    <search aria-label="Busca de produtos">
    <form className="header-search" onSubmit={(event) => { event.preventDefault(); onSearch(search); }}>
      <button type="submit" aria-label="Pesquisar produtos"><Search size={18} aria-hidden="true" /></button>
      <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar" aria-label="Buscar produtos" />
    </form>
    </search>
  );
}
export default SearchBar;
