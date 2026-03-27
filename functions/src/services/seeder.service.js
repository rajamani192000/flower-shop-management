const {
  DEFAULT_FLOWERS,
  DEFAULT_UNITS,
  DEFAULT_EXPENSE_TYPES,
  DEFAULT_WASTE_REASONS,
  DEFAULT_CATEGORIES
} = require('../models/defaults');

class SeederService {
  constructor(db) {
    this.db = db;
  }

  async initializeShop(shopId, meta = {}) {
    const now = new Date().toISOString();
    const batch = this.db.batch();

    DEFAULT_FLOWERS.forEach((flowerName, index) => {
      const flowerId = `${shopId}-flower-${index + 1}`;
      batch.set(this.db.collection('flowers').doc(flowerId), {
        flowerId,
        flowerName,
        unit: 'KG',
        category: 'Loose Flower',
        defaultPrice: 0,
        status: 'active',
        shopId,
        createdDate: now
      }, { merge: true });

      batch.set(this.db.collection('stock').doc(`${shopId}-stock-${index + 1}`), {
        flowerId,
        openingStock: 0,
        purchases: 0,
        sales: 0,
        waste: 0,
        currentStock: 0,
        lowStockThreshold: 0,
        shopId,
        createdDate: now
      }, { merge: true });
    });

    DEFAULT_UNITS.forEach((name) => {
      batch.set(this.db.collection('units').doc(`${shopId}-unit-${name.toLowerCase()}`), {
        name,
        shopId,
        createdDate: now
      }, { merge: true });
    });

    DEFAULT_EXPENSE_TYPES.forEach((name) => {
      batch.set(this.db.collection('expenseTypes').doc(`${shopId}-expense-${name.toLowerCase()}`), {
        name,
        shopId,
        createdDate: now
      }, { merge: true });
    });

    DEFAULT_WASTE_REASONS.forEach((name) => {
      batch.set(this.db.collection('wasteReasons').doc(`${shopId}-waste-${name.toLowerCase()}`), {
        name,
        shopId,
        createdDate: now
      }, { merge: true });
    });

    DEFAULT_CATEGORIES.forEach((name) => {
      const key = name.toLowerCase().replace(/\s+/g, '-');
      batch.set(this.db.collection('flowerCategories').doc(`${shopId}-category-${key}`), {
        name,
        shopId,
        createdDate: now
      }, { merge: true });
    });

    batch.set(this.db.collection('suppliers').doc(`${shopId}-supplier-1`), {
      supplierName: 'Hosur Flower Market',
      location: 'Hosur',
      phone: '',
      paymentType: 'Cash',
      shopId,
      createdDate: now
    }, { merge: true });

    batch.set(this.db.collection('suppliers').doc(`${shopId}-supplier-2`), {
      supplierName: 'Local Vendor',
      location: 'Local',
      phone: '',
      paymentType: 'Cash',
      shopId,
      createdDate: now
    }, { merge: true });

    const sampleCustomers = [
      { name: 'Tea Shop Raju', phone: '9000000001', creditLimit: 1000, customerType: 'Tea Shop' },
      { name: 'Temple', phone: '9000000002', creditLimit: 2000, customerType: 'Temple' },
      { name: 'Flower Decorator', phone: '9000000003', creditLimit: 5000, customerType: 'Decorator' }
    ];

    sampleCustomers.forEach((customer, index) => {
      batch.set(this.db.collection('customers').doc(`${shopId}-customer-${index + 1}`), {
        ...customer,
        address: '',
        shopId,
        createdDate: now
      }, { merge: true });
    });

    batch.set(this.db.collection('settings').doc(`${shopId}-default`), {
      shopId,
      shopName: meta.shopName || '',
      shopCode: meta.shopCode || '',
      address: meta.address || '',
      phone: meta.phone || '',
      gstNumber: '',
      currency: 'INR',
      taxEnabled: false,
      lowStockAlert: true,
      autoPrint: false,
      printerPaperSize: '80mm',
      printerType: 'thermal',
      theme: 'default',
      createdDate: now
    }, { merge: true });

    await batch.commit();
  }
}

module.exports = SeederService;
