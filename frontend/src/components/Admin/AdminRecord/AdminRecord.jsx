function AdminRecord({ image, title, description, details, actions }) {
  return (
    <li className="admin-record">
      <div className="admin-record__identity">
        {image}
        <div className="admin-record__copy"><h2>{title}</h2>{description && <p>{description}</p>}</div>
      </div>
      <div className="admin-record__details">{details}</div>
      <div className="admin-record__actions">{actions}</div>
    </li>
  );
}
export function AdminRecordAction({ label, onClick, children }) {
  return <button type="button" className="admin-record__action" aria-label={label} title={label} onClick={onClick}>{children}</button>;
}
export default AdminRecord;
