class DashboardService {
  constructor(db) {
    this.db = db;
  }

  async getOverview(shopId, query = {}) {
    const { startDate, endDate } = this.getDateWindow(query);

    const [salesSnap, purchasesSnap, expensesSnap, stockSnap, flowersSnap] = await Promise.all([
      this.db.collection('sales').where('shopId', '==', shopId).get(),
      this.db.collection('purchases').where('shopId', '==', shopId).get(),
      this.db.collection('expenses').where('shopId', '==', shopId).get(),
      this.db.collection('stock').where('shopId', '==', shopId).get(),
      this.db.collection('flowers').where('shopId', '==', shopId).get()
    ]);

    const sales = salesSnap.docs.map((d) => d.data());
    const purchases = purchasesSnap.docs.map((d) => d.data());
    const expenses = expensesSnap.docs.map((d) => d.data());
    const stocks = stockSnap.docs.map((d) => d.data());
    const flowers = flowersSnap.docs.map((d) => d.data());

    const salesToday = sales
      .filter((x) => this.inRange(x.date, startDate, endDate))
      .reduce((sum, x) => sum + Number(x.totalAmount || x.price || 0), 0);

    const purchaseToday = purchases
      .filter((x) => this.inRange(x.date, startDate, endDate))
      .reduce((sum, x) => sum + Number(x.totalAmount || x.price || 0), 0);

    const expenseToday = expenses
      .filter((x) => this.inRange(x.date, startDate, endDate))
      .reduce((sum, x) => sum + Number(x.amount || 0), 0);

    const profitToday = salesToday - purchaseToday - expenseToday;

    const salesByFlower = {};
    sales.filter((sale) => this.inRange(sale.date, startDate, endDate)).forEach((sale) => {
      const flowerId = sale.flowerId || 'Unknown';
      salesByFlower[flowerId] = (salesByFlower[flowerId] || 0) + Number(sale.weight || 0);
    });

    const flowerNameById = {};
    flowers.forEach((f) => {
      const id = f.id || f.flowerId;
      flowerNameById[id] = f.flowerName || id;
    });

    const topSellingFlowers = Object.entries(salesByFlower)
      .map(([flowerId, totalWeight]) => ({
        flowerId,
        flowerName: flowerNameById[flowerId] || flowerId,
        totalWeight: Number(totalWeight)
      }))
      .sort((a, b) => b.totalWeight - a.totalWeight)
      .slice(0, 5);

    const lowStock = stocks
      .filter((s) => Number(s.currentStock || 0) <= Number(s.lowStockThreshold || 0))
      .map((s) => ({
        flowerId: s.flowerId,
        flowerName: flowerNameById[s.flowerId] || s.flowerId,
        currentStock: Number(s.currentStock || 0),
        lowStockThreshold: Number(s.lowStockThreshold || 0)
      }));

    const stockValue = stocks.reduce((sum, s) => {
      const unitPrice = 0;
      return sum + Number(s.currentStock || 0) * unitPrice;
    }, 0);

    const recentSales = sales
      .filter((sale) => this.inRange(sale.date, startDate, endDate))
      .sort((a, b) => String(b.createdDate || b.createdAt || '').localeCompare(String(a.createdDate || a.createdAt || '')))
      .slice(0, 10)
      .map((s) => ({
        ...s,
        flowerName: flowerNameById[s.flowerId] || s.flowerId
      }));

    return {
      salesToday,
      purchaseToday,
      expenseToday,
      profitToday,
      stockValue,
      topSellingFlowers,
      lowStock,
      recentSales
    };
  }

  getDateWindow(query) {
    const period = String(query.period || 'today').toLowerCase();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (period === 'weekly') {
      const start = new Date(today);
      start.setDate(today.getDate() - 6);
      return { startDate: this.iso(start), endDate: this.iso(today) };
    }

    if (period === 'monthly') {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      return { startDate: this.iso(start), endDate: this.iso(today) };
    }

    if (period === 'custom' && query.from && query.to) {
      return { startDate: String(query.from), endDate: String(query.to) };
    }

    return { startDate: this.iso(today), endDate: this.iso(today) };
  }

  iso(date) {
    return new Date(date).toISOString().slice(0, 10);
  }

  inRange(dateValue, startDate, endDate) {
    const date = String(dateValue || '').slice(0, 10);
    return date >= startDate && date <= endDate;
  }

  async globalSearch(shopId, rawQuery) {
    const query = String(rawQuery || '').trim().toLowerCase();
    if (!query) {
      return [];
    }

    const [flowersSnap, customersSnap, suppliersSnap, salesSnap, purchasesSnap] = await Promise.all([
      this.db.collection('flowers').where('shopId', '==', shopId).limit(50).get(),
      this.db.collection('customers').where('shopId', '==', shopId).limit(50).get(),
      this.db.collection('suppliers').where('shopId', '==', shopId).limit(50).get(),
      this.db.collection('sales').where('shopId', '==', shopId).limit(50).get(),
      this.db.collection('purchases').where('shopId', '==', shopId).limit(50).get()
    ]);

    const flowerNameById = new Map();
    flowersSnap.docs.forEach((doc) => {
      const data = doc.data();
      flowerNameById.set(doc.id, data.flowerName || doc.id);
    });

    const customerNameById = new Map();
    customersSnap.docs.forEach((doc) => {
      const data = doc.data();
      customerNameById.set(doc.id, data.name || doc.id);
    });

    const supplierNameById = new Map();
    suppliersSnap.docs.forEach((doc) => {
      const data = doc.data();
      supplierNameById.set(doc.id, data.supplierName || doc.id);
    });

    const results = [];

    flowersSnap.docs.forEach((doc) => {
      const row = doc.data();
      const name = String(row.flowerName || '').toLowerCase();
      if (name.includes(query)) {
        results.push({ type: 'flower', id: doc.id, label: row.flowerName, route: '/masters/flowers' });
      }
    });

    customersSnap.docs.forEach((doc) => {
      const row = doc.data();
      const name = String(row.name || '').toLowerCase();
      if (name.includes(query)) {
        results.push({ type: 'customer', id: doc.id, label: row.name, route: '/masters/customers' });
      }
    });

    suppliersSnap.docs.forEach((doc) => {
      const row = doc.data();
      const name = String(row.supplierName || '').toLowerCase();
      if (name.includes(query)) {
        results.push({ type: 'supplier', id: doc.id, label: row.supplierName, route: '/masters/suppliers' });
      }
    });

    salesSnap.docs.forEach((doc) => {
      const row = doc.data();
      const flowerName = flowerNameById.get(row.flowerId) || row.flowerId || 'Flower';
      const customerName = customerNameById.get(row.customerId) || 'Walk-in';
      const text = `${flowerName} ${customerName} ${row.date || ''}`.toLowerCase();
      if (text.includes(query)) {
        results.push({
          type: 'sale',
          id: doc.id,
          label: `${flowerName} - ${Number(row.totalAmount || row.price || 0).toFixed(2)}`,
          subLabel: customerName,
          route: '/sales'
        });
      }
    });

    purchasesSnap.docs.forEach((doc) => {
      const row = doc.data();
      const flowerName = flowerNameById.get(row.flowerId) || row.flowerId || 'Flower';
      const supplierName = supplierNameById.get(row.supplierId) || 'Supplier';
      const text = `${flowerName} ${supplierName} ${row.date || ''}`.toLowerCase();
      if (text.includes(query)) {
        results.push({
          type: 'purchase',
          id: doc.id,
          label: `${flowerName} - ${Number(row.totalAmount || row.price || 0).toFixed(2)}`,
          subLabel: supplierName,
          route: '/purchases'
        });
      }
    });

    return results.slice(0, 20);
  }
}

module.exports = DashboardService;
