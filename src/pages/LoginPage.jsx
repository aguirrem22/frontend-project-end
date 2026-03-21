import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/StoreApp';

export default function LoginPage() {
  const { isAdmin, login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (isAdmin) return <Navigate to="/admin" replace />;

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(username, password);
    setLoading(false);

    if (!result.ok) {
      setError(result.error || 'Credenciales inválidas');
      return;
    }

    navigate('/admin', { replace: true });
  }

  return (
    <section className="store-panel store-auth-panel">
      <p className="store-eyebrow">Área restringida</p>
      <h2>Iniciar sesión</h2>

      <form className="store-form" onSubmit={onSubmit}>
        <label className="store-filter-label">
          Usuario
          <input value={username} onChange={(event) => setUsername(event.target.value)} required />
        </label>

        <label className="store-filter-label">
          Contraseña
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </label>

        {error && <p className="store-feedback store-feedback-error">{error}</p>}

        <button className="store-button" type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </section>
  );
}
