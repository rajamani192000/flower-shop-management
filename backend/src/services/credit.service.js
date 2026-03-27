class CreditService {
  constructor(db, creditSalesResource, creditCollectionsResource) {
    this.db = db;
    this.creditSalesResource = creditSalesResource;
    this.creditCollectionsResource = creditCollectionsResource;
  }

  async createCreditSale(payload, shopId) {
    await this.ensureCustomer(payload.customerId, shopId);
    return this.creditSalesResource.create({ ...payload, status: payload.status || 'Pending' }, shopId);
  }

  async createCreditCollection(payload, shopId) {
    await this.ensureCustomer(payload.customerId, shopId);
    const collectionRow = await this.creditCollectionsResource.create(payload, shopId);
    await this.applyCollectionToPendingSales(payload.customerId, Number(payload.amount || 0), shopId);
    return collectionRow;
  }

  async getOutstanding(shopId) {
    const snap = await this.db.collection('creditSales')
      .where('shopId', '==', shopId)
      .where('status', '==', 'Pending')
      .get();

    const totalOutstanding = snap.docs.reduce((sum, d) => sum + Number(d.data().amount || 0), 0);
    return {
      totalOutstanding,
      pendingCount: snap.size,
      rows: snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    };
  }

  async getCustomerSummaries(shopId) {
    const [customerSnap, pendingSnap] = await Promise.all([
      this.db.collection('customers').where('shopId', '==', shopId).get(),
      this.db.collection('creditSales').where('shopId', '==', shopId).where('status', '==', 'Pending').get()
    ]);

    const pendingByCustomer = {};
    const latestDateByCustomer = {};
    pendingSnap.docs.forEach((doc) => {
      const row = doc.data();
      const customerId = row.customerId;
      pendingByCustomer[customerId] = (pendingByCustomer[customerId] || 0) + Number(row.amount || 0);
      const dateValue = String(row.date || row.createdDate || '');
      if (!latestDateByCustomer[customerId] || dateValue > latestDateByCustomer[customerId]) {
        latestDateByCustomer[customerId] = dateValue;
      }
    });

    return customerSnap.docs.map((doc) => {
      const row = doc.data();
      return {
        id: doc.id,
        name: row.name,
        pendingAmount: Number(pendingByCustomer[doc.id] || 0),
        lastPurchaseDate: latestDateByCustomer[doc.id] || '-'
      };
    });
  }

  async getPendingByCustomer(customerId, shopId) {
    await this.ensureCustomer(customerId, shopId);
    const snap = await this.db.collection('creditSales')
      .where('shopId', '==', shopId)
      .where('customerId', '==', customerId)
      .where('status', '==', 'Pending')
      .get();

    return snap.docs
      .map((doc) => ({ id: doc.id, billNo: doc.data().billNo || `CR-${doc.id.slice(-6).toUpperCase()}`, ...doc.data() }))
      .sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')));
  }

  async applyCollectionToPendingSales(customerId, amount, shopId) {
    if (amount <= 0) {
      return;
    }

    const pendingSnap = await this.db.collection('creditSales')
      .where('shopId', '==', shopId)
      .where('customerId', '==', customerId)
      .where('status', '==', 'Pending')
      .get();

    let remaining = amount;

    for (const doc of pendingSnap.docs) {
      if (remaining <= 0) {
        break;
      }

      const row = doc.data();
      const rowAmount = Number(row.amount || 0);
      const nextAmount = Math.max(0, rowAmount - remaining);
      remaining = Math.max(0, remaining - rowAmount);

      await this.db.collection('creditSales').doc(doc.id).set({
        amount: nextAmount,
        status: nextAmount === 0 ? 'Paid' : 'Pending',
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }
  }

  async ensureCustomer(customerId, shopId) {
    const snap = await this.db.collection('customers').doc(String(customerId)).get();
    if (!snap.exists || snap.data().shopId !== shopId) {
      throw new Error('Customer not found');
    }
  }
}

module.exports = CreditService;
