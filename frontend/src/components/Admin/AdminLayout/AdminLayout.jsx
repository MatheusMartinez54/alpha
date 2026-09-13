import { useCallback, useEffect, useRef, useState } from 'react';
import AdminHeader from '../AdminHeader/AdminHeader.jsx';
import AdminSidebar from '../AdminSidebar/AdminSidebar.jsx';

function AdminLayout({ children, title, subtitle }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
      <AdminSidebar ref={sidebarRef} isOpen={isSidebarOpen} onClose={closeSidebar} />
      <button
        type="button"
        className={`admin-overlay ${isSidebarOpen ? 'is-visible' : ''}`}
        aria-label="Fechar menu administrativo"
        tabIndex={-1}
        aria-hidden="true"
        onClick={closeSidebar}
      />
      <div className="admin-content" inert={isSidebarOpen ? true : undefined}>
        <AdminHeader
          title={title}
          subtitle={subtitle}
          toggleRef={toggleRef}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((current) => !current)}
        />
        <main id="main-content" className="admin-main">
          {children}
        </main>
      </div>
    </div>
  );
}
export default AdminLayout;
