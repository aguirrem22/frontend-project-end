import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiUrl } from '../lib/api';

const CATEGORIES = ['Camisetas', 'Pantalones', 'Zapatos', 'Accesorios'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '32', '34', '36', '38', '40', '42', '44', '46'];

const EMPTY_FORM = {
  nombre: '',
  descripcion: '',
  imagen: '',
  categoria: 'Camisetas',
  talla: 'M',
  precio: '',
};

export default function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEditing) return;

    fetch(apiUrl(`/id/${id}`), { credentials: 'include' })
      .then(async (response) => {
        if (!response.ok) throw new Error('No se pudo cargar el producto');
        return response.json();
      })
      .then((product) => {
        setForm({
          nombre: product.nombre,
          descripcion: product.descripcion,
          imagen: product.imagen,
          categoria: product.categoria,
          talla: product.talla,
          precio: String(product.precio),
        });
      })
      .catch((err) => setError(err.message || 'Error al cargar')); 
  }, [id, isEditing]);

  function onChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      ...form,
      precio: Number(form.precio),
    };

    const response = await fetch(isEditing ? apiUrl(`/id/${id}`) : apiUrl('/create'), {
      method: isEditing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (!response.ok) {
      setError('No se pudo guardar el producto');
      return;
    }

    navigate('/admin');
  }

  return (
    <section className="store-panel store-form-panel">
      <p className="store-eyebrow">{isEditing ? 'Editar producto' : 'Nuevo producto'}</p>
      <h2>{isEditing ? 'Actualiza el producto' : 'Crear producto'}</h2>

      {error && <p className="store-feedback store-feedback-error">{error}</p>}

      <form className="store-form" onSubmit={onSubmit}>
        <div className="store-form-grid">
          <label className="store-filter-label">
            Nombre
            <input name="nombre" value={form.nombre} onChange={onChange} required />
          </label>
          <label className="store-filter-label">
            Precio
            <input name="precio" type="number" step="0.01" min="0" value={form.precio} onChange={onChange} required />
          </label>
        </div>

        <label className="store-filter-label">
          Descripción
          <textarea name="descripcion" value={form.descripcion} onChange={onChange} required />
        </label>

        <label className="store-filter-label">
          Imagen (URL)
          <input name="imagen" value={form.imagen} onChange={onChange} required />
        </label>

        <div className="store-form-grid">
          <label className="store-filter-label">
            Categoría
            <select name="categoria" value={form.categoria} onChange={onChange}>
              {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </label>

          <label className="store-filter-label">
            Talla
            <select name="talla" value={form.talla} onChange={onChange}>
              {SIZES.map((size) => <option key={size} value={size}>{size}</option>)}
            </select>
          </label>
        </div>

        <div className="store-actions-row">
          <button type="button" className="store-button store-button-secondary" onClick={() => navigate('/admin')}>Cancelar</button>
          <button type="submit" className="store-button" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
        </div>
      </form>
    </section>
  );
}
