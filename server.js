const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const mercadopago = require('mercadopago');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Configuración de Mercado Pago
// Debes definir la variable de entorno MERCADO_PAGO_ACCESS_TOKEN
const mpAccessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
if (mpAccessToken) {
  mercadopago.configure({ access_token: mpAccessToken });
} else {
  console.warn('MERCADO_PAGO_ACCESS_TOKEN no configurado');
}

// Conexión a MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/essence';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Error al conectar a MongoDB', err));

// Modelos
const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  stock: { type: Number, default: 0 }
});

const Product = mongoose.model('Product', ProductSchema);

const OrderSchema = new mongoose.Schema({
  products: [{ productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, quantity: Number }],
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', OrderSchema);

// Rutas
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.get('/api/orders', async (req, res) => {
  const orders = await Order.find().populate('products.productId');
  res.json(orders);
});

app.post('/api/orders', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: 'No se pudo crear el pedido' });
  }
});

// Genera preferencia de pago en Mercado Pago
app.post('/api/payments', async (req, res) => {
  try {
    const { title, unit_price, quantity } = req.body;
    const preference = {
      items: [
        {
          title,
          unit_price,
          quantity,
        }
      ],
      back_urls: {
        success: 'https://tu-sitio.com/success',
        failure: 'https://tu-sitio.com/failure',
        pending: 'https://tu-sitio.com/pending'
      },
      auto_return: 'approved'
    };

    const response = await mercadopago.preferences.create(preference);
    res.json({ id: response.body.id });
  } catch (error) {
    console.error('Error creando preferencia:', error);
    res.status(500).json({ error: 'No se pudo crear la preferencia' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
