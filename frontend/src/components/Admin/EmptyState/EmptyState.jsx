function EmptyState({ title, description }) {
  return (
    <div className="admin-empty-state">
      <div className="admin-empty-state__content">
        <span className="eyebrow">ALPHA</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default EmptyState;
