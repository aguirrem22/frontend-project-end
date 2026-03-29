import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../components/StoreApp';
import { apiUrl } from '../lib/api';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderCreated, setOrderCreated] = useState(null);

  const [form, setForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    codigoPostal: '',
    dni: '',
    metodoPago: 'tarjeta',
  });

  function onChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    // Validar que el carrito no esté vacío
    if (cart.length === 0) {
      setError('El carrito está vacío');
      setLoading(false);
      return;
    }

    // Validar campos
    if (!form.nombre || !form.email || !form.telefono || !form.direccion || !form.codigoPostal || !form.dni) {
      setError('Por favor completa todos los campos');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(apiUrl('/checkout'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          items: cart,
          customer: {
            nombre: form.nombre,
            email: form.email,
            telefono: form.telefono,
            direccion: form.direccion,
            codigoPostal: form.codigoPostal,
            dni: form.dni,
          },
          metodoPago: form.metodoPago,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar la compra');
      }

      setOrderCreated({
        orderId: data.orderId,
        total: data.total,
      });
      clearCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (orderCreated) {
    return (
      <section className="store-panel">
        <div className="checkout-success">
          <h2>¡Compra realizada exitosamente!</h2>
          <p>Número de orden: <strong>{orderCreated.orderId}</strong></p>
          <p>Total pagado: <strong>{orderCreated.total.toFixed(2)} €</strong></p>
          <p className="store-muted">Te hemos enviado un email de confirmación con los detalles de tu compra.</p>
          <div className="store-actions-row">
            <button className="store-button" onClick={() => navigate('/products')}>Seguir comprando</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="store-panel store-form-panel">
      <h2>Resumen de compra</h2>

      {/* Resumen del carrito */}
      <div className="checkout-summary">
        <h3>Tu carrito</h3>
        <div className="checkout-items">
          {cart.map((item) => (
            <div key={item._id} className="checkout-item">
              <span>{item.nombre} × {item.quantity}</span>
              <span>{(item.precio * item.quantity).toFixed(2)} €</span>
            </div>
          ))}
        </div>
        <div className="checkout-total">
          <strong>Total: {totalPrice.toFixed(2)} €</strong>
        </div>
      </div>

      {/* Formulario */}
      <form className="store-form" onSubmit={onSubmit}>
        <h3>Datos del cliente</h3>

        {error && <p className="store-feedback store-feedback-error">{error}</p>}

        <div className="store-form-grid">
          <label className="store-filter-label">
            Nombre completo
            <input name="nombre" value={form.nombre} onChange={onChange} required />
          </label>
          <label className="store-filter-label">
            Email
            <input name="email" type="email" value={form.email} onChange={onChange} required />
          </label>
        </div>

        <div className="store-form-grid">
          <label className="store-filter-label">
            Teléfono
            <input name="telefono" value={form.telefono} onChange={onChange} required />
          </label>
          <label className="store-filter-label">
            DNI/NIE
            <input name="dni" value={form.dni} onChange={onChange} required />
          </label>
        </div>

        <label className="store-filter-label">
          Dirección
          <input name="direccion" value={form.direccion} onChange={onChange} required />
        </label>

        <label className="store-filter-label">
          Código postal
          <input name="codigoPostal" value={form.codigoPostal} onChange={onChange} required />
        </label>

        <h3>Método de pago</h3>
        <div className="checkout-payment-methods">
          <label className="payment-method">
            <input
              type="radio"
              name="metodoPago"
              value="tarjeta"
              checked={form.metodoPago === 'tarjeta'}
              onChange={onChange}
            />
            <span>Tarjeta de crédito</span>
          </label>
          <label className="payment-method">
            <input
              type="radio"
              name="metodoPago"
              value="transferencia"
              checked={form.metodoPago === 'transferencia'}
              onChange={onChange}
            />
            <span>Transferencia bancaria</span>
          </label>
          <label className="payment-method">
            <input
              type="radio"
              name="metodoPago"
              value="efectivo"
              checked={form.metodoPago === 'efectivo'}
              onChange={onChange}
            />
            <span>Efectivo a la entrega</span>
          </label>
        </div>

        <div className="store-actions-row">
          <button type="button" className="store-button store-button-secondary" onClick={() => navigate('/cart')}>
            Volver al carrito
          </button>
          <button type="submit" className="store-button" disabled={loading}>
            {loading ? 'Procesando...' : 'Confirmar compra'}
          </button>
        </div>
      </form>
    </section>
  );
}
