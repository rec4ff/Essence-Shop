# Essence Shop

Proyecto base para una tienda de perfumes árabes, de diseñador y de nicho. Incluye un servidor Express con MongoDB y un cliente web básico responsivo.

## Requisitos

- Node.js 18+
- MongoDB
- Cuenta de [Mercado Pago](https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/landing) para obtener un `ACCESS_TOKEN`

## Configuración

1. Clonar el repositorio.
2. Crear un archivo `.env` (opcional) con las variables:
   ```bash
   MONGODB_URI=mongodb://localhost:27017/essence
   MERCADO_PAGO_ACCESS_TOKEN=TU_TOKEN
   ```
3. Instalar dependencias (requiere acceso a internet):
   ```bash
   npm install
   ```
4. Ejecutar el servidor:
   ```bash
   npm start
   ```

El sitio estará disponible en `http://localhost:3000`.

## Integración con Mercado Pago

La ruta `POST /api/payments` crea una **preferencia de pago** utilizando el SDK oficial. Para generar un botón de pago en el cliente:

```html
<button id="pagar">Pagar</button>
<script>
  document.getElementById('pagar').addEventListener('click', async () => {
    const res = await fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Perfume Arabian Oud',
        unit_price: 100,
        quantity: 1
      })
    });
    const { id } = await res.json();
    window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${id}`;
  });
</script>
```

Mercado Pago enviará al usuario de regreso a las URLs definidas en `back_urls` dependiendo del resultado del pago.

## Estructura

- `server.js`: servidor Express, conexión a MongoDB, API de productos y creación de preferencias de pago.
- `public/`: cliente estático (HTML/CSS/JS) responsivo en blanco y negro.

## Licencia

ISC
