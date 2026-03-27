class StockService {
  constructor(db) {
    this.db = db;
  }

  async getStockStatus(shopId) {
    const [stockSnap, purchasesSnap, salesSnap, wasteSnap] = await Promise.all([
      this.db.collection('stock').where('shopId', '==', shopId).get(),
      this.db.collection('purchases').where('shopId', '==', shopId).get(),
      this.db.collection('sales').where('shopId', '==', shopId).get(),
      this.db.collection('waste').where('shopId', '==', shopId).get()
    ]);

    const stockRows = stockSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    const purchaseByFlower = {};
    purchasesSnap.docs.forEach((doc) => {
      const row = doc.data();
      const flowerId = row.flowerId || 'unknown';
      purchaseByFlower[flowerId] = (purchaseByFlower[flowerId] || 0) + Number(row.weight || 0);
    });

    const salesByFlower = {};
    salesSnap.docs.forEach((doc) => {
      const row = doc.data();
      const flowerId = row.flowerId || 'unknown';
      salesByFlower[flowerId] = (salesByFlower[flowerId] || 0) + Number(row.weight || 0);
    });

    const wasteByFlower = {};
    wasteSnap.docs.forEach((doc) => {
      const row = doc.data();
      const flowerId = row.flowerId || 'unknown';
      wasteByFlower[flowerId] = (wasteByFlower[flowerId] || 0) + Number(row.weight || 0);
    });

    return stockRows.map((row) => {
      const opening = Number(row.openingStock || 0);
      const purchases = purchaseByFlower[row.flowerId] ?? Number(row.purchases || 0);
      const sales = salesByFlower[row.flowerId] ?? Number(row.sales || 0);
      const waste = wasteByFlower[row.flowerId] ?? Number(row.waste || 0);
      const currentStock = opening + purchases - sales - waste;

      return {
        ...row,
        opening,
        purchases,
        sales,
        waste,
        currentStock,
        isLow: currentStock <= Number(row.lowStockThreshold || 0)
      };
    });
  }
}

module.exports = StockService;
