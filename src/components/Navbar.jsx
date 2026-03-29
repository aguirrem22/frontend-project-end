import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useCart } from './StoreApp';

export default function Navbar() {
  const { isAdmin, username, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  async function onLogout() {
    await logout();
    navigate('/products');
  }

  return (
    <header className="store-nav-wrap">
      <nav className="store-nav">
        <div><img src="/logo.png" alt="Deportes de Contacto" className="logo-banner" />
        </div>
        
        <div className="store-nav-actions">
          <Link to="/products" className="store-link-pill">Productos</Link>
          <Link to="/cart" className="store-link-pill">Carrito {totalItems > 0 && `(${totalItems})`}</Link>
          {isAdmin ? (
            <>
              <span className="store-user-label">{username}</span>
              <Link to="/admin" className="store-link-pill store-link-pill-dark">Dashboard</Link>
              <button className="store-button store-button-danger" onClick={onLogout}>Salir</button>
            </>
          ) : (
            <Link to="/login" className="store-link-pill store-link-pill-dark">Admin</Link>
          )}
        </div>
      </nav>
    </header>
  );
}
