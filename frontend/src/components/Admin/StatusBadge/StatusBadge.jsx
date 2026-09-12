function StatusBadge({ active }) {
  return <span className={`status-badge ${active ? 'status-badge--active' : 'status-badge--inactive'}`}>{active ? 'Ativo' : 'Inativo'}</span>;
}

export default StatusBadge;
