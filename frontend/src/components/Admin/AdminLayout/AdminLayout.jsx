import { useState } from 'react';
import AdminHeader from '../AdminHeader/AdminHeader.jsx';
import AdminSidebar from '../AdminSidebar/AdminSidebar.jsx';

function AdminLayout({ children, title, subtitle }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="admin-shell">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <button
        type="button"
        className={`admin-overlay ${isSidebarOpen ? 'is-visible' : ''}`}
        aria-label="Fechar menu administrativo"
        onClick={() => setIsSidebarOpen(false)}
      />

      <div className="admin-content">
        <AdminHeader title={title} subtitle={subtitle} onToggleSidebar={() => setIsSidebarOpen((current) => !current)} />

        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;
