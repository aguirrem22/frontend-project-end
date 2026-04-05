import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import Navbar from './Navbar';
import { apiUrl } from '../lib/api';
import ProductsPage from '../pages/ProductsPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import LoginPage from '../pages/LoginPage';
import AdminDashboard from '../pages/AdminDashboard';
import ProductFormPage from '../pages/ProductFormPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import OrdersPage from '../pages/OrdersPage';

const AuthContext = createContext(null);
const CartContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function useCart() {
  return useContext(CartContext);
}

function ProtectedRoute({ children }) {
  const { isAdmin } = useAuth();
  if (!isAdmin) return <Navigate to="/login" replace />;
  return children;
}

export default function StoreApp() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('thebridge-cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    fetch(apiUrl('/auth/me'), { credentials: 'include' })
      .then(async (response) => {
        if (!response.ok) return { isAdmin: false, username: null };
        return response.json();
      })
      .then((data) => {
        setIsAdmin(Boolean(data?.isAdmin));
        setUsername(data?.username || null);
      })
      .catch(() => {
        setIsAdmin(false);
        setUsername(null);
      })
      .finally(() => setAuthLoading(false));
  }, []);

  useEffect(() => {
    // Incrementar contador de visitas al cargar la app
    fetch(apiUrl('/visits'), {
      method: 'POST',
      credentials: 'include',
    }).catch(() => {}); // Ignorar errores
  }, []);

  async function login(usernameValue, passwordValue) {
    try {
      const response = await fetch(apiUrl('/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: usernameValue, password: passwordValue }),
      });

      const isJson = response.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await response.json() : null;

      if (!response.ok || !data?.success) {
        return { ok: false, error: data?.error || 'Error al iniciar sesión' };
      }

      setIsAdmin(true);
      setUsername(data.username || usernameValue);
      return { ok: true };
    } catch {
      return { ok: false, error: 'No se puede conectar con el servidor' };
    }
  }

  async function logout() {
    try {
      await fetch(apiUrl('/auth/logout'), {
        method: 'POST',
        credentials: 'include',
      });
    } catch {}

    setIsAdmin(false);
    setUsername(null);
  }

  const authValue = useMemo(() => ({ isAdmin, username, login, logout }), [isAdmin, username]);

  function addToCart(product, quantity) {
    setCart((prevCart) => {
      const existing = prevCart.find(item => item._id === product._id);
      if (existing) {
        return prevCart.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity }];
      }
    });
  }

  function removeFromCart(productId) {
    setCart((prevCart) => prevCart.filter(item => item._id !== productId));
  }

  function updateCartQuantity(productId, quantity) {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart((prevCart) =>
        prevCart.map(item =>
          item._id === productId ? { ...item, quantity } : item
        )
      );
    }
  }

  function clearCart() {
    setCart([]);
  }

  useEffect(() => {
    try {
      localStorage.setItem('thebridge-cart', JSON.stringify(cart));
    } catch {
      // localStorage puede fallar en entornos restringidos
    }
  }, [cart]);

  const cartValue = useMemo(() => ({
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    totalItems: cart.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: cart.reduce((sum, item) => sum + item.precio * item.quantity, 0)
  }), [cart]);

  if (authLoading) {
    return (
      <div className="store-app-shell">
        <p className="store-feedback">Cargando sesión...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authValue}>
      <CartContext.Provider value={cartValue}>
        <BrowserRouter>
          <Navbar />
          <main className="store-app-shell">
            <Routes>
              <Route path="/" element={<Navigate to="/products" replace />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/admin"
                element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}
              />
              <Route
                path="/admin/new"
                element={<ProtectedRoute><ProductFormPage /></ProtectedRoute>}
              />
              <Route
                path="/admin/edit/:id"
                element={<ProtectedRoute><ProductFormPage /></ProtectedRoute>}
              />
              <Route
                path="/admin/orders"
                element={<ProtectedRoute><OrdersPage /></ProtectedRoute>}
              />
            </Routes>
          </main>
        </BrowserRouter>
      </CartContext.Provider>
    </AuthContext.Provider>
  );
}
