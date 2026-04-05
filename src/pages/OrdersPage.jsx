import { useEffect, useState } from 'react';
import { apiUrl } from '../lib/api';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');

    fetch(apiUrl('/orders'), { credentials: 'include' })
      .then(async (response) => {
        if (!response.ok) throw new Error('No se pudieron cargar las órdenes');
        return response.json();
      })
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message || 'Error cargando órdenes'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="store-panel">
      <h2>Órdenes registradas</h2>
      {loading && <p className="store-feedback">Cargando órdenes...</p>}
      {error && <p className="store-feedback store-feedback-error">{error}</p>}
      {!loading && !error && orders.length === 0 && (
        <p className="store-feedback">No hay órdenes registradas aún.</p>
      )}
      {!loading && !error && orders.length > 0 && (
        <div className="store-grid">
          {orders.map((order) => (
            <article key={order._id} className="store-product-card">
              <div className="store-product-body">
                <h3>Orden #{String(order._id).slice(-6).toUpperCase()}</h3>
                <p className="store-product-meta">Cliente: {order.customer?.nombre || 'Desconocido'}</p>
                <p className="store-product-meta">Fecha: {new Date(order.createdAt).toLocaleDateString()}</p>
                <p className="store-product-meta">Total: {Number(order.total).toFixed(2)} €</p>
                <p className="store-product-meta">Estado: {order.estado}</p>
                <div className="store-product-meta">
                  <strong>Productos:</strong>
                  <ul>
                    {Array.isArray(order.items) && order.items.map((item, index) => (
                      <li key={index}>{item.nombre} x {item.quantity}</li>
                    ))}
                  </ul>
                </div>
                <p className="store-product-meta">Dirección: {order.customer?.direccion || 'No definida'}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
