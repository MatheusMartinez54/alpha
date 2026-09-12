function DashboardCard({ icon: Icon, title, value, description, accent = false }) {
  return (
    <article className={`dashboard-card ${accent ? 'dashboard-card--accent' : ''}`}>
      <div className="dashboard-card__icon">
        <Icon size={18} />
      </div>

      <div className="dashboard-card__content">
        <span>{title}</span>
        <strong>{value}</strong>
        <small>{description}</small>
      </div>
    </article>
  );
}

export default DashboardCard;
