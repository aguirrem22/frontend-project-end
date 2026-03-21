import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import Navbar from './Navbar';
import { apiUrl } from '../lib/api';
import ProductsPage from '../pages/ProductsPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import LoginPage from '../pages/LoginPage';
import AdminDashboard from '../pages/AdminDashboard';
import ProductFormPage from '../pages/ProductFormPage';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
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

  if (authLoading) {
    return (
      <div className="store-app-shell">
        <p className="store-feedback">Cargando sesión...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authValue}>
      <BrowserRouter>
        <Navbar />
        <main className="store-app-shell">
          <Routes>
            <Route path="/" element={<Navigate to="/products" replace />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
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
          </Routes>
        </main>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}
