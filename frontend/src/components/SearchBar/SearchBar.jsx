import { useState } from 'react';
import { Search } from 'lucide-react';
function SearchBar({ onSearch, initialValue = '' }) {
  const [search, setSearch] = useState(initialValue);
  return (
    <search aria-label="Busca de produtos">
      <form
        className="header-search"
        onSubmit={(event) => {
          event.preventDefault();
          onSearch(search.trim());
        }}
      >
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="O que você procura?"
          aria-label="Buscar produtos"
        />
        <button type="submit" aria-label="Pesquisar produtos">
          <Search size={20} aria-hidden="true" />
        </button>
      </form>
    </search>
  );
}
export default SearchBar;
