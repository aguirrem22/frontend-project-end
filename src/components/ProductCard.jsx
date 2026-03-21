import { Link } from 'react-router-dom';

const FALLBACK = 'https://placehold.co/420x520?text=Sin+Imagen';

export default function ProductCard({ product }) {
  return (
    <article className="store-product-card">
      <div className="store-product-image-wrap">
        <img
          className="store-product-image"
          src={product.imagen}
          alt={product.nombre}
          onError={(event) => { event.currentTarget.src = FALLBACK; }}
        />
      </div>
      <div className="store-product-body">
        <h3>{product.nombre}</h3>
        <p className="store-product-meta">{product.categoria} · Talla {product.talla}</p>
        <p className="store-price">{Number(product.precio).toFixed(2)} €</p>
        <Link to={`/products/${product._id}`}>
          <button className="store-button">Ver detalle</button>
        </Link>
      </div>
    </article>
  );
}
