import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from '../components/Admin/AdminLayout/AdminLayout.jsx';
import Dashboard from '../pages/Admin/Dashboard/Dashboard.jsx';
import ProductsPage from '../pages/Admin/Products/Products.jsx';
import CategoriesPage from '../pages/Admin/Categories/Categories.jsx';
import OrdersPage from '../pages/Admin/Orders/Orders.jsx';

function AdminPage({ title, description }) {
  return (
    <div className="admin-empty-state">
      <div className="admin-empty-state__content">
        <span className="eyebrow">Painel ALPHA</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}

function AdminRoutes() {
  return (
    <Routes>
      <Route
        index
        element={
          <AdminLayout title="Dashboard" subtitle="Visão geral da sua loja">
            <Dashboard />
          </AdminLayout>
        }
      />

      <Route
        path="produtos"
        element={
          <AdminLayout title="Produtos" subtitle="Gerencie os produtos da sua loja">
            <ProductsPage />
          </AdminLayout>
        }
      />

      <Route
        path="pedidos"
        element={
          <AdminLayout title="Pedidos" subtitle="Acompanhe o fluxo de vendas">
            <OrdersPage />
          </AdminLayout>
        }
      />

      <Route
        path="categorias"
        element={
          <AdminLayout title="Categorias" subtitle="Organize os produtos da sua loja">
            <CategoriesPage />
          </AdminLayout>
        }
      />

      <Route
        path="configuracoes"
        element={
          <AdminLayout title="Configurações" subtitle="Ajustes gerais da loja">
            <AdminPage title="Configurações" description="As configurações da loja e do painel serão disponibilizadas futuramente." />
          </AdminLayout>
        }
      />

      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}

export default AdminRoutes;
