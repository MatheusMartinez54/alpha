import { Route, Routes, useLocation } from 'react-router-dom';
import Header from '../components/Header/Header.jsx';
import Footer from '../components/Footer/Footer.jsx';
import Home from '../pages/Home/Home.jsx';
import Products from '../pages/Products/Products.jsx';
import Product from '../pages/Product/Product.jsx';
import Cart from '../pages/Cart/Cart.jsx';
import Checkout from '../pages/Checkout/Checkout.jsx';
import AdminRoutes from './AdminRoutes.jsx';
import AdminLogin from '../pages/Admin/Login/Login.jsx';

function AppRoutes() {
  const location = useLocation();
  const isAdminRoute = /^\/admin(?:\/|$)/.test(location.pathname);

  return (
    <>
      {!isAdminRoute && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produtos" element={<Products />} />
        <Route path="/produto/:id" element={<Product />} />
        <Route path="/carrinho" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
}
export default AppRoutes;
