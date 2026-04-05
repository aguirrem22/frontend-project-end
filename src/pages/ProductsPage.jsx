import { useEffect, useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { apiUrl } from '../lib/api';

const CATEGORIES = ['Todos', 'Camisetas', 'Pantalones', 'Zapatos', 'Accesorios'];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('Todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');

    fetch(apiUrl('/'), { credentials: 'include' })
      .then(async (response) => {
        if (!response.ok) throw new Error('No se pudieron cargar los productos');
        return response.json();
      })
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message || 'Error cargando productos'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (category === 'Todos') return products;
    return products.filter((product) => product.categoria === category);
  }, [products, category]);

  return (
    <>
      <section className="store-hero">
        <div className="store-hero-copy">
          <p className="store-eyebrow">Colección 2026</p>
          <h1>Tu estilo, tu identidad</h1>
          <p className="store-muted">Descubre prendas y accesorios para cada entreno y combate oss</p>
          <div className="store-hero-chip-row">
            {CATEGORIES.map((item) => (
              <button key={item} className="store-chip" onClick={() => setCategory(item)}>
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="store-hero-panel">
          <span className="store-hero-icon">🛍️</span>
          <p className="store-eyebrow">Envío gratis a partir de 50€</p>
          <p className="store-muted">{products.length} productos disponibles</p>
        </div>
      </section>

      {/* <section className="store-filter-panel">
        <h2>Catálogo {category !== 'Todos' ? `· ${category}` : ''}</h2>
        <label className="store-filter-label">
          Categoría
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
      </section> */}

      {loading && <p className="store-feedback">Cargando productos...</p>}
      {error && <p className="store-feedback store-feedback-error">{error}</p>}
      {!loading && !error && filtered.length === 0 && (
        <p className="store-feedback">No hay productos para esta categoría.</p>
      )}

      {!loading && !error && filtered.length > 0 && (
        <section className="store-grid">
          {filtered.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </section>
      )}

      <footer className="store-footer">© 2026 Tienda Online - Deportes de Contacto</footer>
    </>
  );
}
