import { Route, Routes, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import Header from '../components/Header/Header.jsx';
import Footer from '../components/Footer/Footer.jsx';
import CartToast from '../components/CartToast/CartToast.jsx';
import { useCart } from '../context/CartContext.jsx';
import Home from '../pages/Home/Home.jsx';
import Products from '../pages/Products/Products.jsx';
import Product from '../pages/Product/Product.jsx';
import Cart from '../pages/Cart/Cart.jsx';
import Checkout from '../pages/Checkout/Checkout.jsx';
import EmptyState from '../components/EmptyState/EmptyState.jsx';
import Loading from '../components/Loading/Loading.jsx';

const AdminRoutes = lazy(() => import('./AdminRoutes.jsx'));
const AdminLogin = lazy(() => import('../pages/Admin/Login/Login.jsx'));

function AppRoutes() {
  const location = useLocation();
  const isAdminRoute = /^\/admin(?:\/|$)/.test(location.pathname);
  const isCheckout = location.pathname === '/checkout';
  const { toast } = useCart();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Pular para o conteúdo
      </a>
      {!isAdminRoute && <Header key={location.key} />}
      <Suspense
        fallback={
          <main id="main-content">
            <Loading />
          </main>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produtos" element={<Products />} />
          <Route path="/produto/:id" element={<Product />} />
          <Route path="/carrinho" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route
            path="*"
            element={
              <main id="main-content" className="main container">
                <EmptyState
                  heading="h1"
                  title="Página não encontrada"
                  description="Este endereço não está disponível. Acesse o catálogo para continuar."
                  to="/produtos"
                  action="Ver produtos"
                />
              </main>
            }
          />
        </Routes>
      </Suspense>
      {!isAdminRoute && !isCheckout && <CartToast message={toast} visible={Boolean(toast)} />}
      {!isAdminRoute && <Footer compact={isCheckout} showFloatingContact={location.pathname === '/'} />}
    </>
  );
}
export default AppRoutes;
