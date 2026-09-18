import { useCallback, useEffect, useRef, useState } from 'react';
import AdminSidebar from '../AdminSidebar/AdminSidebar.jsx';
import { Menu } from 'lucide-react';

function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => localStorage.getItem('alpha-admin-sidebar-collapsed') === 'true');
  const sidebarRef = useRef(null);
  const toggleRef = useRef(null);
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);

  useEffect(() => {
    if (!isSidebarOpen) return;
    const previousFocus = toggleRef.current;
    const previousOverflow = document.body.style.overflow;
    const sidebar = sidebarRef.current;
    const mobileQuery = window.matchMedia('(max-width: 1023px)');
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeSidebar();
      if (event.key !== 'Tab') return;
      const elements = [...sidebar.querySelectorAll('a[href], button:not(:disabled)')];
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    const onResize = () => {
      if (!mobileQuery.matches) closeSidebar();
    };
    document.body.style.overflow = 'hidden';
    sidebar.querySelector('button')?.focus();
    document.addEventListener('keydown', onKeyDown);
    mobileQuery.addEventListener('change', onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      mobileQuery.removeEventListener('change', onResize);
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [isSidebarOpen, closeSidebar]);

  return (
    <div className="admin-shell">
      <AdminSidebar
        ref={sidebarRef}
        isOpen={isSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => {
          setIsSidebarCollapsed((current) => {
            const next = !current;
            localStorage.setItem('alpha-admin-sidebar-collapsed', String(next));
            return next;
          });
        }}
        onClose={closeSidebar}
      />
      <button
        type="button"
        className={`admin-overlay ${isSidebarOpen ? 'is-visible' : ''}`}
        aria-label="Fechar menu administrativo"
        tabIndex={-1}
        aria-hidden="true"
        onClick={closeSidebar}
      />
      <div className="admin-content" inert={isSidebarOpen ? true : undefined}>
        <button
          ref={toggleRef}
          type="button"
          className="admin-mobile-toggle admin-mobile-toggle--floating"
          aria-label="Abrir menu administrativo"
          aria-expanded={isSidebarOpen}
          aria-controls="admin-navigation"
          onClick={() => setIsSidebarOpen((current) => !current)}
        >
          <Menu size={20} aria-hidden="true" />
        </button>
        <main id="main-content" className="admin-main">
          {children}
        </main>
      </div>
    </div>
  );
}
export default AdminLayout;
