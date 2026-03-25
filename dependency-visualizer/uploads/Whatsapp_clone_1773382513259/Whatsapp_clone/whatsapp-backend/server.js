require('dotenv').config();
const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const chatRoutes = require('./routes/chats');
const messageRoutes = require('./routes/messages');

const initSocket = require('./socket');

const app = express();
const server = http.createServer(app);

// connect DB
connectDB();

// middlewares
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// CORS fixed (uses .env FRONTEND URL)
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// health check
app.get('/', (req, res) => res.send('WhatsApp clone backend is running 🚀'));

// socket.io
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.set("io", io);

initSocket(io);

// start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
