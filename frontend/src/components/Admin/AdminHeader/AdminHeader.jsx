import { Menu } from 'lucide-react';

function AdminHeader({ title, subtitle, onToggleSidebar }) {
  return (
    <header className="admin-header">
      <div className="admin-header__left">
        <button type="button" className="admin-mobile-toggle" aria-label="Abrir menu administrativo" onClick={onToggleSidebar}>
          <Menu size={20} />
        </button>
        <div>
          <span className="admin-header__eyebrow">ALPHA</span>
          <h2>{title}</h2>
        </div>
      </div>

      <p className="admin-header__subtitle">{subtitle}</p>
    </header>
  );
}

export default AdminHeader;
