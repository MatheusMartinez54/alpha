import { Menu } from 'lucide-react';

function AdminHeader({ title, subtitle, onToggleSidebar, toggleRef, isSidebarOpen }) {
  return (
    <header className="admin-header">
      <div className="admin-header__left">
        <button ref={toggleRef} type="button" className="admin-mobile-toggle" aria-label="Abrir menu administrativo" aria-expanded={isSidebarOpen} aria-controls="admin-navigation" onClick={onToggleSidebar}>
          <Menu size={20} aria-hidden="true" />
        </button>
        <div>
          <span className="admin-header__eyebrow">ALPHA</span>
          <strong className="admin-header__title">{title}</strong>
        </div>
      </div>

      <p className="admin-header__subtitle">{subtitle}</p>
    </header>
  );
}

export default AdminHeader;
