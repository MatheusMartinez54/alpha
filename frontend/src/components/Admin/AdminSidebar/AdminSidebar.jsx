import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Bike, ChevronLeft, ChevronRight, ClipboardList, LayoutDashboard, LogOut, Package, ShoppingCart, Tags, X } from 'lucide-react';
import Logo from '../../Logo/Logo.jsx';

const menuItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/produtos', label: 'Produtos', icon: Package },
  { to: '/admin/estoque', label: 'Estoque', icon: ClipboardList },
  { to: '/admin/pedidos', label: 'Pedidos', icon: ShoppingCart },
  { to: '/admin/entregadores', label: 'Entregadores', icon: Bike },
  { to: '/admin/categorias', label: 'Categorias', icon: Tags },
];

function AdminSidebar({ isOpen, isCollapsed, onToggleCollapse, onClose, ref }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/admin-login');
    if (onClose) onClose();
  };

  return (
    <aside
      ref={ref}
      id="admin-navigation"
      aria-label="Navegação administrativa"
      className={`admin-sidebar ${isOpen ? 'is-open' : ''} ${isCollapsed ? 'is-collapsed' : ''}`}
    >
      <div className="admin-sidebar__brand">
        <Link to="/" onClick={onClose} aria-label="Alpha Imports — voltar à loja">
          <Logo className="admin-sidebar__logo" />
        </Link>
        <button
          type="button"
          className="admin-sidebar__collapse"
          aria-label={isCollapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'}
          aria-pressed={isCollapsed}
          title={isCollapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'}
          onClick={onToggleCollapse}
        >
          {isCollapsed ? <ChevronRight size={18} aria-hidden="true" /> : <ChevronLeft size={18} aria-hidden="true" />}
        </button>
        <button type="button" className="admin-sidebar__close" aria-label="Fechar menu administrativo" onClick={onClose}>
          <X size={20} aria-hidden="true" />
        </button>
      </div>

      <nav className="admin-sidebar__nav" aria-label="Menu administrativo">
        {menuItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `admin-sidebar__item ${isActive ? 'active' : ''}`} onClick={onClose}>
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="admin-sidebar__footer">
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
