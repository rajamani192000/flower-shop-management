const express = require('express');
const cors = require('cors');

const { db, auth, storage } = require('./config/firebase');
const authMiddleware = require('./middlewares/auth.middleware');
const errorMiddleware = require('./middlewares/error.middleware');
const responseMiddleware = require('./middlewares/response.middleware');
const roleMiddleware = require('./middlewares/role.middleware');
const validate = require('./middlewares/validate.middleware');
const schemas = require('./validators/schemas');

const SeederService = require('./services/seeder.service');
const AuthService = require('./services/auth.service');
const CommonService = require('./services/common.service');
const StockService = require('./services/stock.service');
const UploadService = require('./services/upload.service');
const TransactionService = require('./services/transaction.service');
const DashboardService = require('./services/dashboard.service');
const ResourceService = require('./services/resource.service');
const SortingService = require('./services/sorting.service');
const CreditService = require('./services/credit.service');

const authControllerFactory = require('./controllers/auth.controller');
const adminControllerFactory = require('./controllers/admin.controller');
const inventoryControllerFactory = require('./controllers/inventory.controller');
const uploadControllerFactory = require('./controllers/upload.controller');
const transactionControllerFactory = require('./controllers/transaction.controller');
const dashboardControllerFactory = require('./controllers/dashboard.controller');
const resourceControllerFactory = require('./controllers/resource.controller');
const sortingControllerFactory = require('./controllers/sorting.controller');
const creditControllerFactory = require('./controllers/credit.controller');

const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const inventoryRoutes = require('./routes/inventory.routes');
const uploadRoutes = require('./routes/upload.routes');
const transactionRoutes = require('./routes/transaction.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const resourceRoutes = require('./routes/resource.routes');
const sortingRoutes = require('./routes/sorting.routes');
const creditRoutes = require('./routes/credit.routes');

const app = express();

app.use(cors({ origin: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(responseMiddleware);

const seederService = new SeederService(db);
const commonService = new CommonService(db);
const authService = new AuthService({ auth, db, seederService, apiKey: process.env.FIREBASE_API_KEY });
const stockService = new StockService(db);
const uploadService = new UploadService(storage);
const transactionService = new TransactionService(db, commonService);
const dashboardService = new DashboardService(db);

const flowerService = new ResourceService(db, 'flowers');
const customerService = new ResourceService(db, 'customers');
const supplierService = new ResourceService(db, 'suppliers');
const unitService = new ResourceService(db, 'units');
const expenseTypeService = new ResourceService(db, 'expenseTypes');
const wasteReasonService = new ResourceService(db, 'wasteReasons');
const flowerCategoryService = new ResourceService(db, 'flowerCategories');
const settingsService = new ResourceService(db, 'settings');
const boxTrackingService = new ResourceService(db, 'boxTracking');
const priceHistoryService = new ResourceService(db, 'priceHistory');
const userService = new ResourceService(db, 'users');
const sortingResourceService = new ResourceService(db, 'sorting');
const creditSalesResource = new ResourceService(db, 'creditSales');
const creditCollectionsResource = new ResourceService(db, 'creditCollections');

const sortingService = new SortingService(db, sortingResourceService);
const creditService = new CreditService(db, creditSalesResource, creditCollectionsResource);

const authController = authControllerFactory(authService);
const adminController = adminControllerFactory(seederService);
const inventoryController = inventoryControllerFactory(stockService);
const uploadController = uploadControllerFactory(uploadService);
const transactionController = transactionControllerFactory(transactionService);
const dashboardController = dashboardControllerFactory(dashboardService);
const flowersController = resourceControllerFactory(flowerService);
const customersController = resourceControllerFactory(customerService);
const suppliersController = resourceControllerFactory(supplierService);
const unitsController = resourceControllerFactory(unitService);
const expenseTypesController = resourceControllerFactory(expenseTypeService);
const wasteReasonsController = resourceControllerFactory(wasteReasonService);
const flowerCategoriesController = resourceControllerFactory(flowerCategoryService);
const settingsController = resourceControllerFactory(settingsService);
const boxTrackingController = resourceControllerFactory(boxTrackingService);
const priceHistoryController = resourceControllerFactory(priceHistoryService);
const usersController = resourceControllerFactory(userService);
const sortingController = sortingControllerFactory(resourceControllerFactory(sortingResourceService), sortingService);
const creditController = creditControllerFactory(creditService, creditSalesResource, creditCollectionsResource);

app.get('/api/health', (req, res) => res.json({ success: true, message: 'ok', data: null }));

app.use('/api/auth', authRoutes(authController, authMiddleware, validate, schemas));
app.use('/api/admin', adminRoutes(adminController, authMiddleware, roleMiddleware));
app.use('/api/dashboard', dashboardRoutes(dashboardController, authMiddleware));
app.use('/api/stock', inventoryRoutes(inventoryController, authMiddleware));
app.use('/api/upload', uploadRoutes(uploadController, authMiddleware));
app.use('/api', transactionRoutes(transactionController, authMiddleware, validate, schemas));
app.use('/api/sorting', sortingRoutes(sortingController, authMiddleware, validate, schemas.sortingCreateSchema));
app.use('/api', creditRoutes(creditController, authMiddleware, validate, schemas));

app.use('/api/flowers', resourceRoutes(flowersController, authMiddleware, {
  validateCreate: validate(schemas.flowerCreateSchema),
  roles: ['Admin', 'Staff'],
  roleMiddleware
}));
app.use('/api/customers', resourceRoutes(customersController, authMiddleware, {
  validateCreate: validate(schemas.customerCreateSchema)
}));
app.use('/api/suppliers', resourceRoutes(suppliersController, authMiddleware, {
  validateCreate: validate(schemas.supplierCreateSchema)
}));
app.use('/api/units', resourceRoutes(unitsController, authMiddleware));
app.use('/api/expense-types', resourceRoutes(expenseTypesController, authMiddleware));
app.use('/api/waste-reasons', resourceRoutes(wasteReasonsController, authMiddleware));
app.use('/api/flower-categories', resourceRoutes(flowerCategoriesController, authMiddleware));
app.use('/api/settings', resourceRoutes(settingsController, authMiddleware, {
  validateCreate: validate(schemas.settingsSchema),
  validateUpdate: validate(schemas.settingsSchema),
  roles: ['Admin', 'Accountant'],
  roleMiddleware
}));
app.use('/api/box-tracking', resourceRoutes(boxTrackingController, authMiddleware, {
  validateCreate: validate(schemas.boxTrackingCreateSchema)
}));
app.use('/api/price-history', resourceRoutes(priceHistoryController, authMiddleware, {
  validateCreate: validate(schemas.priceHistoryCreateSchema)
}));
app.use('/api/users', resourceRoutes(usersController, authMiddleware, {
  roles: ['Admin'],
  roleMiddleware
}));

app.use(errorMiddleware);

module.exports = app;

