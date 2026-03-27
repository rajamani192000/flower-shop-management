require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { db, auth, storage } = require('./config/firebase');
const authMiddleware = require('./middlewares/auth.middleware');
const errorMiddleware = require('./middlewares/error.middleware');

const SeederService = require('./services/seeder.service');
const AuthService = require('./services/auth.service');
const CommonService = require('./services/common.service');
const StockService = require('./services/stock.service');
const UploadService = require('./services/upload.service');
const TransactionService = require('./services/transaction.service');
const DashboardService = require('./services/dashboard.service');

const authControllerFactory = require('./controllers/auth.controller');
const commonControllerFactory = require('./controllers/common.controller');
const adminControllerFactory = require('./controllers/admin.controller');
const inventoryControllerFactory = require('./controllers/inventory.controller');
const uploadControllerFactory = require('./controllers/upload.controller');
const transactionControllerFactory = require('./controllers/transaction.controller');
const dashboardControllerFactory = require('./controllers/dashboard.controller');
const mastersControllerFactory = require('./controllers/masters.controller');

const authRoutes = require('./routes/auth.routes');
const commonRoutes = require('./routes/common.routes');
const adminRoutes = require('./routes/admin.routes');
const inventoryRoutes = require('./routes/inventory.routes');
const uploadRoutes = require('./routes/upload.routes');
const transactionRoutes = require('./routes/transaction.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const mastersRoutes = require('./routes/masters.routes');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const seederService = new SeederService(db);
const commonService = new CommonService(db);
const authService = new AuthService({
  auth,
  db,
  seederService,
  apiKey: process.env.FIREBASE_API_KEY
});
const stockService = new StockService(db);
const uploadService = new UploadService(storage);
const transactionService = new TransactionService(db, commonService);
const dashboardService = new DashboardService(db);

const authController = authControllerFactory(authService);
const commonController = commonControllerFactory(commonService);
const adminController = adminControllerFactory(seederService);
const inventoryController = inventoryControllerFactory(stockService);
const uploadController = uploadControllerFactory(uploadService);
const transactionController = transactionControllerFactory(transactionService);
const dashboardController = dashboardControllerFactory(dashboardService);
const mastersController = mastersControllerFactory(commonService);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes(authController, authMiddleware));
app.use('/api/common', commonRoutes(commonController, authMiddleware));
app.use('/api/admin', adminRoutes(adminController, authMiddleware));
app.use('/api/stock', inventoryRoutes(inventoryController, authMiddleware));
app.use('/api/upload', uploadRoutes(uploadController, authMiddleware));
app.use('/api', transactionRoutes(transactionController, authMiddleware));
app.use('/api/dashboard', dashboardRoutes(dashboardController, authMiddleware));
app.use('/api', mastersRoutes(mastersController, authMiddleware));

app.use(errorMiddleware);

const port = Number(process.env.PORT || 5000);
app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
