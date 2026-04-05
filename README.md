# Frontend Tienda Online (React + Vite)

Frontend de la tienda que consume el backend API-only.

## Instalación
```bash
npm install
```

## Desarrollo
```bash
npm run dev
```

Por defecto se levanta en:

- http://localhost:5173

## Requisitos
- Tener el backend corriendo en `http://localhost:3000`
- Tener CORS habilitado en backend para `http://localhost:5173`

## Variables de entorno
En local puedes usar el backend en `http://localhost:3000/api`.

El carrito se guarda en `localStorage`, por lo que los productos seleccionados se mantienen al recargar el navegador.

## Funcionalidades nuevas
- Panel admin con contador de visitas
- Duplicar productos desde administración
- Página de órdenes para revisar compras realizadas
- Stock real por producto y cantidad seleccionable
- Checkout simulado con datos de cliente

Para despliegue en Netlify define:

```bash
VITE_API_BASE_URL=https://tienda-dp-contact.onrender.com/api
```

Si no defines esa variable, el frontend usa esa URL de Render como fallback en producción.

## Despliegue en Netlify
Configura estos valores en Netlify:

- Build command: `npm run build`
- Publish directory: `dist`
- Environment variable: `VITE_API_BASE_URL=https://tienda-dp-contact.onrender.com/api`

El backend debe estar desplegado por separado y permitir el dominio de Netlify en CORS.

## Funcionalidades
- Listado y detalle de productos
- Comprar productos "simulacion"
- Login admin por sesión
- Crear, editar y eliminar productos desde panel admin
