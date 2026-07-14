const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

dotenv.config();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: [FRONTEND_URL, 'http://localhost:5173'], methods: ['GET', 'POST', 'PUT', 'DELETE'] }
});

const prisma = new PrismaClient();

app.use(cors({ origin: [FRONTEND_URL, 'http://localhost:5173'] }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});
const upload = multer({ storage });

const { exec } = require('child_process');

// ========================
// DB INIT API (Run once at runtime)
// ========================
app.get('/api/init-db', (req, res) => {
  exec('npx prisma db push --accept-data-loss', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).json({ error: 'Failed to init DB', details: error.message, stderr });
    }
    res.json({ message: 'Database initialized successfully', stdout });
  });
});

// ========================
// PRODUCTS API
// ========================
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: 'desc' }
    });
    res.json(products);
  } catch (error) {
    console.error("Products GET Error:", error);
    res.status(500).json({ error: 'Failed to fetch products', details: error.message });
  }
});

app.post('/api/products', upload.single('image'), async (req, res) => {
  try {
    const { name, category, price, costPrice, stock, isBestSeller, isPromotion } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const product = await prisma.product.create({
      data: {
        name,
        category,
        price: parseFloat(price),
        costPrice: parseFloat(costPrice),
        stock: parseInt(stock, 10),
        imageUrl,
        isBestSeller: isBestSeller === 'true',
        isPromotion: isPromotion === 'true'
      }
    });
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

app.put('/api/products/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, costPrice, stock, isBestSeller, isPromotion } = req.body;
    
    const updateData = {
      name,
      category,
      price: parseFloat(price),
      costPrice: parseFloat(costPrice),
      stock: parseInt(stock, 10),
      isBestSeller: isBestSeller === 'true',
      isPromotion: isPromotion === 'true'
    };

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const product = await prisma.product.update({
      where: { id: parseInt(id, 10) },
      data: updateData
    });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id: parseInt(id, 10) }
    });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// ========================
// ORDERS API
// ========================
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    console.error("Orders GET Error:", error);
    res.status(500).json({ error: 'Failed to fetch orders', details: error.message });
  }
});

app.get('/api/orders/track', async (req, res) => {
  try {
    const { q } = req.query; // Search query (customerName or id)
    if (!q) return res.json([]);
    
    const isNumber = !isNaN(q);
    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { customerName: { contains: q } },
          ...(isNumber ? [{ id: parseInt(q, 10) }] : [])
        ]
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to track order' });
  }
});

app.post('/api/orders', upload.single('slipImage'), async (req, res) => {
  try {
    const { customerName, address, phone, email, specialRequest, paymentMethod, totalAmount, items } = req.body;
    const parsedItems = typeof items === 'string' ? JSON.parse(items) : items;
    const slipUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const order = await prisma.order.create({
      data: {
        customerName, address, phone, email, specialRequest, paymentMethod,
        slipImageUrl: slipUrl,
        totalAmount: parseFloat(totalAmount),
        status: 'PENDING',
        items: {
          create: parsedItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: { items: true }
    });

    // Deduct Stock
    for (const item of parsedItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      });
    }

    io.emit('new_order', order);
    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const order = await prisma.order.update({
      where: { id: parseInt(id, 10) },
      data: { status }
    });
    
    io.emit('order_status_updated', order);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// ========================
// DASHBOARD & FINANCE API
// ========================
app.get('/api/dashboard', async (req, res) => {
  try {
    // Basic stats for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = await prisma.order.count({
      where: { createdAt: { gte: today } }
    });

    const todaySalesData = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { createdAt: { gte: today }, status: { not: 'CANCELLED' } }
    });

    const pendingOrders = await prisma.order.count({
      where: { status: 'PENDING' }
    });

    const lowStockItems = await prisma.product.count({
      where: { stock: { lte: 10 } }
    });

    res.json({
      todayOrders,
      todaySales: todaySalesData._sum.totalAmount || 0,
      pendingOrders,
      lowStockItems
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

app.get('/api/finance/summary', async (req, res) => {
  try {
    const sales = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: { not: 'CANCELLED' } }
    });

    // Calculate total cost from order items
    const orders = await prisma.order.findMany({
      where: { status: { not: 'CANCELLED' } },
      include: { items: { include: { product: true } } }
    });

    let totalCost = 0;
    orders.forEach(o => {
      o.items.forEach(item => {
        if (item.product) {
          totalCost += (item.quantity * item.product.costPrice);
        }
      });
    });

    const waste = await prisma.lossRecord.aggregate({
      _sum: { costLoss: true }
    });

    res.json({
      totalSales: sales._sum.totalAmount || 0,
      totalCost,
      wasteCost: waste._sum.costLoss || 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch finance summary' });
  }
});

app.get('/api/finance/waste', async (req, res) => {
  try {
    const records = await prisma.lossRecord.findMany({
      include: { product: true },
      orderBy: { date: 'desc' }
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch waste records' });
  }
});

app.post('/api/finance/waste', async (req, res) => {
  try {
    const { productId, quantity, reason } = req.body;
    
    const product = await prisma.product.findUnique({ where: { id: parseInt(productId, 10) } });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const costLost = product.costPrice * quantity;

    // Deduct stock
    await prisma.product.update({
      where: { id: product.id },
      data: { stock: { decrement: parseInt(quantity, 10) } }
    });

    const record = await prisma.lossRecord.create({
      data: {
        productId: product.id,
        quantity: parseInt(quantity, 10),
        costLoss: costLost,
        reason
      },
      include: { product: true }
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create waste record' });
  }
});

// --- REVIEW API ---
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/reviews', async (req, res) => {
  const { customerName, comment, rating } = req.body;
  try {
    const review = await prisma.review.create({
      data: {
        customerName: customerName || 'ลูกค้าทั่วไป',
        comment,
        rating: rating || 5
      }
    });
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/reviews/:id/reply', async (req, res) => {
  const { id } = req.params;
  const { adminReply } = req.body;
  try {
    const review = await prisma.review.update({
      where: { id: parseInt(id) },
      data: { adminReply }
    });
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Socket.io Connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
