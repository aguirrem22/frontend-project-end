import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../components/StoreApp';
import { apiUrl } from '../lib/api';

const FALLBACK = 'https://placehold.co/420x520?text=Sin+Imagen';

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateCartQuantity, clearCart, totalItems, totalPrice } = useCart();

  async function checkout() {
    if (cart.length === 0) return;
    navigate('/checkout');
  }

  if (cart.length === 0) {
    return (
      <section className="store-panel">
        <h2>Carrito de compras</h2>
        <p>Tu carrito está vacío.</p>
        <Link to="/products"><button className="store-button">Ver productos</button></Link>
      </section>
    );
  }

  return (
    <section className="store-panel">
      <h2>Carrito de compras ({totalItems} items)</h2>

      <div className="cart-items">
        {cart.map((item) => (
          <article key={item._id} className="cart-item">
            <img src={item.imagen} alt={item.nombre} onError={(event) => { event.currentTarget.src = FALLBACK; }} />
            <div className="cart-item-info">
              <h3>{item.nombre}</h3>
              <p>{item.categoria} · Talla {item.talla}</p>
              <p className="cart-price">{Number(item.precio).toFixed(2)} €</p>
            </div>
            <div className="cart-quantity">
              <button onClick={() => updateCartQuantity(item._id, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateCartQuantity(item._id, item.quantity + 1)}>+</button>
            </div>
            <div className="cart-total">
              {(item.precio * item.quantity).toFixed(2)} €
            </div>
            <button className="cart-remove" onClick={() => removeFromCart(item._id)}>×</button>
          </article>
        ))}
      </div>

      <div className="cart-summary">
        <p>Total: <strong>{totalPrice.toFixed(2)} €</strong></p>
        <div className="store-actions-row">
          <button className="store-button store-button-secondary" onClick={clearCart}>Vaciar carrito</button>
          <button className="store-button" onClick={checkout}>Comprar ahora</button>
        </div>
      </div>
    </section>
  );
}