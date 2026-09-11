import { NavLink, Route, Routes } from 'react-router-dom';
const sections = ['produtos', 'categorias', 'pedidos', 'clientes', 'configuracoes'];
function AdminPage({ title }) {
  return (
    <main className="main container">
      <span className="eyebrow">Painel ALPHA</span>
      <h1>{title}</h1>
      <div className="empty">
        <p>Área preparada para integração com Firebase e operações do catálogo.</p>
      </div>
    </main>
  );
}
function AdminRoutes() {
  return (
    <>
      <nav className="admin-nav container">
        {sections.map((section) => (
          <NavLink key={section} to={`/admin/${section}`}>
            {section}
          </NavLink>
        ))}
      </nav>
      <Routes>
        <Route index element={<AdminPage title="Visão geral" />} />
        {sections.map((section) => (
          <Route key={section} path={section} element={<AdminPage title={section[0].toUpperCase() + section.slice(1)} />} />
        ))}
      </Routes>
    </>
  );
}
export default AdminRoutes;
