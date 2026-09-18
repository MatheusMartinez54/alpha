import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';
function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const submit = (event) => {
    event.preventDefault();
    login(event.currentTarget.email.value);
    navigate('/admin');
  };
  return (
    <main id="main-content" className="main auth-page">
      <div className="auth-page__panel">
        <span className="eyebrow">Acesso restrito</span>
        <h1>Entrar no painel</h1>
        <form className="auth-form" onSubmit={submit}>
          <label>
            E-mail
            <input name="email" type="email" autoComplete="username" placeholder="voce@alpha.local" required />
          </label>
          <label>
            Senha
            <input name="password" type="password" autoComplete="current-password" placeholder="••••••••" required />
          </label>
          <button className="button">Entrar</button>
        </form>
        <Link className="back-link" to="/">
          Voltar para a loja
        </Link>
      </div>
    </main>
  );
}
export default AdminLogin;
