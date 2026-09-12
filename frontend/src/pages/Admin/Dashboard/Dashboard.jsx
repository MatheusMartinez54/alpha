import { ArrowUpRight, Boxes, Package, ShoppingCart, TrendingUp } from 'lucide-react';
import DashboardCard from '../../../components/Admin/DashboardCard/DashboardCard.jsx';
import LowStockProducts from '../../../components/Admin/LowStockProducts/LowStockProducts.jsx';

const stats = [
  { title: 'Produtos', value: '48', description: '+6 nesta semana', icon: Package },
  { title: 'Pedidos hoje', value: '12', description: '4 entregas em andamento', icon: ShoppingCart },
  { title: 'Vendas hoje', value: 'R$ 1.248,90', description: 'Lucro estimado de 22%', icon: TrendingUp },
  { title: 'Pedidos em aberto', value: '3', description: '1 precisa de atenção', icon: Boxes },
];

const lowStockProducts = [
  { name: 'Produto A', stock: 3 },
  { name: 'Produto B', stock: 2 },
  { name: 'Produto C', stock: 1 },
];

function Dashboard() {
  return (
    <div className="admin-page-content">
      <div className="admin-page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Visão geral da sua loja</p>
        </div>

        <button type="button" className="admin-page-header__button">
          <ArrowUpRight size={16} />
          Relatório
        </button>
      </div>

      <div className="dashboard-grid">
        {stats.map((stat) => (
          <DashboardCard key={stat.title} icon={stat.icon} title={stat.title} value={stat.value} description={stat.description} />
        ))}
      </div>

      <div className="dashboard-panel-wrapper">
        <LowStockProducts products={lowStockProducts} />
      </div>
    </div>
  );
}

export default Dashboard;
