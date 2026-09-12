import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ArrowLeft, LayoutDashboard, LogOut, Package, Settings, ShoppingCart, Tags, X } from 'lucide-react';
import Logo from '../../Logo/Logo.jsx';

const menuItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/produtos', label: 'Produtos', icon: Package },
  { to: '/admin/pedidos', label: 'Pedidos', icon: ShoppingCart },
  { to: '/admin/categorias', label: 'Categorias', icon: Tags },
];

function AdminSidebar({ isOpen, onClose, ref }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/admin-login');
    if (onClose) onClose();
  };

  return (
    <aside ref={ref} id="admin-navigation" aria-label="Navegação administrativa" className={`admin-sidebar ${isOpen ? 'is-open' : ''}`}>
      <div className="admin-sidebar__brand">
        <Link to="/" onClick={onClose} aria-label="Alpha Imports — voltar à loja"><Logo className="admin-sidebar__logo" /></Link>
        <button type="button" className="admin-sidebar__close" aria-label="Fechar menu administrativo" onClick={onClose}><X size={20} aria-hidden="true" /></button>
      </div>

      <nav className="admin-sidebar__nav" aria-label="Menu administrativo">
        {menuItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `admin-sidebar__item ${isActive ? 'active' : ''}`} onClick={onClose}>
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="admin-sidebar__section">
        <span className="admin-sidebar__label">Configurações</span>
        <NavLink to="/admin/configuracoes" className={({ isActive }) => `admin-sidebar__item ${isActive ? 'active' : ''}`} onClick={onClose}>
          <Settings size={18} />
          <span>Configurações</span>
        </NavLink>
      </div>

      <div className="admin-sidebar__footer">
        <Link to="/" className="admin-sidebar__footer-link" onClick={onClose}>
          <ArrowLeft size={16} />
          <span>Voltar para loja</span>
        </Link>

        <div className="admin-sidebar__profile">
          <div className="admin-sidebar__avatar">A</div>
          <div className="admin-sidebar__profile-text">
            <strong>Administrador</strong>
            <button type="button" className="admin-sidebar__logout" onClick={handleLogout}>
              <LogOut size={15} />
              Sair
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;
