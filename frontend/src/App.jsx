import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { StoreProvider } from './context/StoreContext.jsx';
import AppRoutes from './routes/AppRoutes.jsx';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <StoreProvider>
          <CartProvider>
            <AppRoutes />
          </CartProvider>
        </StoreProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
