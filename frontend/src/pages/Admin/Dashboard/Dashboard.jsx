import { ArrowUpRight, Boxes, Package, ShoppingCart, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardCard from '../../../components/Admin/DashboardCard/DashboardCard.jsx';
import LowStockProducts from '../../../components/Admin/LowStockProducts/LowStockProducts.jsx';
import RecentOrders from '../../../components/Admin/RecentOrders/RecentOrders.jsx';
import { useStore } from '../../../context/StoreContext.jsx';
import { formatCurrency } from '../../../utils/format.js';

function Dashboard() {
  const { products, orders } = useStore();
  const today = new Date().toDateString();
  const todaysOrders = orders.filter((order) => new Date(order.createdAt).toDateString() === today);
  const openOrders = orders.filter((order) => order.status === 'Aberto');
  const lowStockProducts = products.filter((product) => product.active && product.stock <= 5).sort((a, b) => a.stock - b.stock);
  const stats = [
    {
      title: 'Produtos',
      value: products.length,
      description: `${products.filter((product) => product.active).length} ativos no catálogo`,
      icon: Package,
    },
    { title: 'Pedidos hoje', value: todaysOrders.length, description: 'Pedidos recebidos hoje', icon: ShoppingCart },
    {
      title: 'Valor em pedidos hoje',
      value: formatCurrency(todaysOrders.reduce((sum, order) => sum + order.total, 0)),
      description: 'Total dos pedidos recebidos hoje',
      icon: TrendingUp,
    },
    { title: 'Pedidos em aberto', value: openOrders.length, description: 'Aguardando aceite da loja', icon: Boxes },
  ];

  return (
    <div className="admin-page-content">
      <div className="admin-page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Visão geral da sua loja</p>
        </div>

        <Link to="/admin/pedidos" className="admin-page-header__button">
          Ver pedidos
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>

      <div className="dashboard-grid">
        {stats.map((stat) => (
          <DashboardCard key={stat.title} icon={stat.icon} title={stat.title} value={stat.value} description={stat.description} />
        ))}
      </div>

      <div className="dashboard-panels">
        <RecentOrders orders={orders.slice(0, 5)} />
        <LowStockProducts products={lowStockProducts} />
      </div>
    </div>
  );
}

export default Dashboard;
