import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import userRoutes from './routes/user.js';
import companyRoutes from './routes/company.js';
import jobRoutes from './routes/job.js';
import applicationRoutes from './routes/application.js';
import messageRoute from './routes/message.js'
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';
import socketManager from './sockets/socketManager.js'; // ✅ socket manager import

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
const httpServer = createServer(app); // ✅ HTTP server created for Socket.IO

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:3001', // frontend port
  credentials: true
}));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/company', companyRoutes);
app.use('/api/v1/job', jobRoutes);
app.use('/api/v1/application', applicationRoutes);
app.use('/api/v1/message', messageRoute);


// Default route
app.get('/', (req, res) => {
  res.send('🚀 Job Portal API is running...');
});

// Database and Server start
connectDB().then(() => {
  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:3001',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // ✅ Call socketManager to handle socket events
  socketManager(io);

  httpServer.listen(PORT, () => {
    console.log(`🚀 Server with Socket.IO running on: http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error("❌ Database connection failed:", err);
});
