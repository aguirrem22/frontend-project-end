import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../components/StoreApp';
import { apiUrl } from '../lib/api';

const FALLBACK = 'https://placehold.co/720x820?text=Sin+Imagen';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setLoading(true);
    setError('');

    fetch(apiUrl(`/id/${id}`), { credentials: 'include' })
      .then(async (response) => {
        if (!response.ok) throw new Error('No se encontró el producto');
        return response.json();
      })
      .then((data) => setProduct(data))
      .catch((err) => setError(err.message || 'Error al cargar el producto'))
      .finally(() => setLoading(false));
  }, [id]);

  async function onDelete() {
    if (!window.confirm('¿Eliminar este producto?')) return;

    const response = await fetch(apiUrl(`/id/${id}`), {
      method: 'DELETE',
      credentials: 'include',
    });

    if (response.ok) {
      navigate('/admin');
    }
  }

  function incrementQuantity() {
    if (quantity < (product?.stock || 0)) {
      setQuantity(quantity + 1);
    }
  }

  function decrementQuantity() {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  }

  function addToCart() {
    alert(`Agregado ${quantity} unidad(es) de ${product.nombre} al carrito.`);
    // Aquí se podría implementar lógica real de carrito
  }

  if (loading) return <p className="store-feedback">Cargando producto...</p>;
  if (error || !product) return <p className="store-feedback store-feedback-error">{error || 'Producto no encontrado'}</p>;

  return (
    <article className="store-detail-card">
      <div className="store-detail-media">
        <img src={product.imagen} alt={product.nombre} onError={(event) => { event.currentTarget.src = FALLBACK; }} />
      </div>
      <div className="store-detail-copy">
        <p className="store-eyebrow">{product.categoria}</p>
        <h2>{product.nombre}</h2>
        <p className="store-muted">{product.descripcion}</p>
        <p className="store-muted">Talla: <strong>{product.talla}</strong></p>
        <p className="store-price">{Number(product.precio).toFixed(2)} €</p>
        <p className="store-muted">Stock disponible: <strong>{product.stock || 0}</strong></p>
        {!isAdmin && (
          <div className="store-quantity-selector">
            <label>Cantidad:</label>
            <div className="store-quantity-controls">
              <button onClick={decrementQuantity} disabled={quantity <= 1}>-</button>
              <span>{quantity}</span>
              <button onClick={incrementQuantity} disabled={quantity >= (product.stock || 0)}>+</button>
            </div>
            <button className="store-button" onClick={addToCart} disabled={product.stock === 0}>Agregar al carrito</button>
          </div>
        )}
        <div className="store-actions-row">
          <Link to="/products"><button className="store-button store-button-secondary">Volver</button></Link>
          {isAdmin && (
            <>
              <Link to={`/admin/edit/${id}`}><button className="store-button">Editar</button></Link>
              <button className="store-button store-button-danger" onClick={onDelete}>Eliminar</button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
