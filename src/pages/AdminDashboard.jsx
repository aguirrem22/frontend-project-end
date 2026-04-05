import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiUrl } from '../lib/api';

const FALLBACK = 'https://placehold.co/420x520?text=Sin+Imagen';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [visitCount, setVisitCount] = useState(0);

  const loadProducts = useCallback(() => {
    setLoading(true);
    setError('');

    fetch(apiUrl('/products'), { credentials: 'include' })
      .then(async (response) => {
        if (!response.ok) throw new Error('No se pudieron cargar los productos');
        return response.json();
      })
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message || 'Error cargando productos'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadProducts();
    // Cargar contador de visitas
    fetch(apiUrl('/visits'), { credentials: 'include' })
      .then(async (response) => {
        if (response.ok) {
          const data = await response.json();
          setVisitCount(data.count || 0);
        }
      })
      .catch(() => {});
  }, [loadProducts]);

  async function onDelete(id) {
    if (!window.confirm('¿Eliminar este producto?')) return;

    const response = await fetch(apiUrl(`/id/${id}`), {
      method: 'DELETE',
      credentials: 'include',
    });

    if (response.ok) {
      loadProducts();
    }
  }

  async function onDuplicate(product) {
    const duplicatedProduct = {
      ...product,
      nombre: `Copia de ${product.nombre}`,
    };
    delete duplicatedProduct._id;
    delete duplicatedProduct.createdAt;
    delete duplicatedProduct.updatedAt;

    const response = await fetch(apiUrl('/create'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(duplicatedProduct),
    });

    if (response.ok) {
      loadProducts();
    } else {
      alert('Error al duplicar el producto');
    }
  }

  return (
    <>
      <section className="store-filter-panel">
        <h2>Panel de administración</h2>
        <p>Visitas totales: {visitCount}</p>
        <div className="store-actions-row">
          <Link to="/admin/new"><button className="store-button">Nuevo producto</button></Link>
          <Link to="/admin/orders"><button className="store-button store-button-secondary">Órdenes</button></Link>
        </div>
      </section>

      {loading && <p className="store-feedback">Cargando...</p>}
      {error && <p className="store-feedback store-feedback-error">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <section className="store-panel"><p className="store-feedback">No hay productos.</p></section>
      )}

      {!loading && !error && products.length > 0 && (
        <section className="store-grid">
          {products.map((product) => (
            <article key={product._id} className="store-product-card">
              <div className="store-product-image-wrap">
                <img className="store-product-image" src={product.imagen} alt={product.nombre} onError={(event) => { event.currentTarget.src = FALLBACK; }} />
              </div>
              <div className="store-product-body">
                <h3>{product.nombre}</h3>
                <p className="store-product-meta">{product.categoria} · Talla {product.talla}</p>
                <p className="store-price">{Number(product.precio).toFixed(2)} €</p>
                <p className="store-product-meta">Stock: {product.stock || 0}</p>
                <div className="store-actions-row">
                  <Link to={`/products/${product._id}`}><button className="store-button store-button-secondary">Ver</button></Link>
                  <Link to={`/admin/edit/${product._id}`}><button className="store-button">Editar</button></Link>
                  <button className="store-button store-button-info" onClick={() => onDuplicate(product)}>Duplicar</button>
                  <button className="store-button store-button-danger" onClick={() => onDelete(product._id)}>Borrar</button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </>
  );
}
