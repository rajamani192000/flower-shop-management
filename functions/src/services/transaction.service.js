class TransactionService {
  constructor(db, commonService) {
    this.db = db;
    this.commonService = commonService;
  }

  async list(collectionName, shopId) {
    const snap = await this.db.collection(collectionName).where('shopId', '==', shopId).get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  async createPurchase(payload, shopId) {
    await this.ensureExists('suppliers', payload.supplierId, shopId, 'Supplier not found');
    if (Array.isArray(payload.items) && payload.items.length > 0) {
      const billNo = payload.billNo || `PB-${Date.now()}`;
      const createdItems = [];
      let totalAmount = 0;

      for (const item of payload.items) {
        await this.ensureExists('flowers', item.flowerId, shopId, 'Flower not found');
        const itemPayload = {
          flowerId: item.flowerId,
          weight: Number(item.weight || 0),
          unitPrice: Number(item.unitPrice || 0),
          totalAmount: Number(item.totalAmount || (Number(item.weight || 0) * Number(item.unitPrice || 0))),
          supplierId: payload.supplierId,
          boxNumber: payload.boxNumber || '',
          paymentType: payload.paymentType,
          date: payload.date,
          billPhotoUrl: payload.billPhotoUrl || '',
          billNo
        };

        const row = await this.commonService.create('purchases', itemPayload, shopId);
        await this.adjustStock(itemPayload.flowerId, shopId, itemPayload.weight, 'add');
        createdItems.push(row);
        totalAmount += itemPayload.totalAmount;
      }

      return { billNo, totalAmount, items: createdItems };
    }

    await this.ensureExists('flowers', payload.flowerId, shopId, 'Flower not found');
    const data = await this.commonService.create('purchases', payload, shopId);
    await this.adjustStock(payload.flowerId, shopId, Number(payload.weight || 0), 'add');
    return data;
  }

  async updatePurchase(id, payload, shopId) {
    const existing = await this.ensureTransactionRecord('purchases', id, shopId);
    const nextFlowerId = payload.flowerId || existing.flowerId;
    const nextWeight = Number(payload.weight ?? existing.weight ?? 0);

    await this.adjustStock(existing.flowerId, shopId, Number(existing.weight || 0), 'subtractPurchase');
    await this.adjustStock(nextFlowerId, shopId, nextWeight, 'add');

    await this.db.collection('purchases').doc(id).set({ ...payload, updatedAt: new Date().toISOString() }, { merge: true });
    return { ...existing, ...payload, id };
  }

  async deletePurchase(id, shopId) {
    const existing = await this.ensureTransactionRecord('purchases', id, shopId);
    await this.adjustStock(existing.flowerId, shopId, Number(existing.weight || 0), 'subtractPurchase');
    await this.db.collection('purchases').doc(id).delete();
  }

  async createSale(payload, shopId) {
    await this.ensureExists('flowers', payload.flowerId, shopId, 'Flower not found');
    if (payload.customerId) {
      await this.ensureExists('customers', payload.customerId, shopId, 'Customer not found');
    }

    await this.adjustStock(payload.flowerId, shopId, Number(payload.weight || 0), 'sale');
    return this.commonService.create('sales', payload, shopId);
  }

  async updateSale(id, payload, shopId) {
    const existing = await this.ensureTransactionRecord('sales', id, shopId);
    const nextFlowerId = payload.flowerId || existing.flowerId;
    const nextWeight = Number(payload.weight ?? existing.weight ?? 0);

    await this.adjustStock(existing.flowerId, shopId, Number(existing.weight || 0), 'addBackSale');
    await this.adjustStock(nextFlowerId, shopId, nextWeight, 'sale');

    await this.db.collection('sales').doc(id).set({ ...payload, updatedAt: new Date().toISOString() }, { merge: true });
    return { ...existing, ...payload, id };
  }

  async deleteSale(id, shopId) {
    const existing = await this.ensureTransactionRecord('sales', id, shopId);
    await this.adjustStock(existing.flowerId, shopId, Number(existing.weight || 0), 'addBackSale');
    await this.db.collection('sales').doc(id).delete();
  }

  async createExpense(payload, shopId) {
    return this.commonService.create('expenses', payload, shopId);
  }

  async updateExpense(id, payload, shopId) {
    const existing = await this.ensureTransactionRecord('expenses', id, shopId);
    await this.db.collection('expenses').doc(id).set({ ...payload, updatedAt: new Date().toISOString() }, { merge: true });
    return { ...existing, ...payload, id };
  }

  async deleteExpense(id, shopId) {
    await this.ensureTransactionRecord('expenses', id, shopId);
    await this.db.collection('expenses').doc(id).delete();
  }

  async createWaste(payload, shopId) {
    await this.ensureExists('flowers', payload.flowerId, shopId, 'Flower not found');
    await this.adjustStock(payload.flowerId, shopId, Number(payload.weight || 0), 'waste');
    return this.commonService.create('waste', payload, shopId);
  }

  async updateWaste(id, payload, shopId) {
    const existing = await this.ensureTransactionRecord('waste', id, shopId);
    const nextFlowerId = payload.flowerId || existing.flowerId;
    const nextWeight = Number(payload.weight ?? existing.weight ?? 0);

    await this.adjustStock(existing.flowerId, shopId, Number(existing.weight || 0), 'addBackWaste');
    await this.adjustStock(nextFlowerId, shopId, nextWeight, 'waste');

    await this.db.collection('waste').doc(id).set({ ...payload, updatedAt: new Date().toISOString() }, { merge: true });
    return { ...existing, ...payload, id };
  }

  async deleteWaste(id, shopId) {
    const existing = await this.ensureTransactionRecord('waste', id, shopId);
    await this.adjustStock(existing.flowerId, shopId, Number(existing.weight || 0), 'addBackWaste');
    await this.db.collection('waste').doc(id).delete();
  }

  async adjustStock(flowerId, shopId, quantity, mode) {
    const stockId = `${shopId}_${flowerId}`;
    const ref = this.db.collection('stock').doc(stockId);

    await this.db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const current = snap.exists
        ? snap.data()
        : {
            flowerId,
            shopId,
            currentStock: 0,
            openingStock: 0,
            purchases: 0,
            sales: 0,
            waste: 0,
            createdDate: new Date().toISOString()
          };

      const qty = Number.isFinite(quantity) ? quantity : 0;
      const next = { ...current };

      if (mode === 'add') {
        next.purchases = Number(next.purchases || 0) + qty;
        next.currentStock = Number(next.currentStock || 0) + qty;
      } else if (mode === 'subtractPurchase') {
        next.purchases = Math.max(0, Number(next.purchases || 0) - qty);
        next.currentStock = Math.max(0, Number(next.currentStock || 0) - qty);
      } else if (mode === 'sale') {
        const currentStock = Number(next.currentStock || 0);
        if (qty > currentStock) {
          throw new Error('Insufficient stock for this flower');
        }
        next.currentStock = currentStock - qty;
        next.sales = Number(next.sales || 0) + qty;
      } else if (mode === 'addBackSale') {
        next.currentStock = Number(next.currentStock || 0) + qty;
        next.sales = Math.max(0, Number(next.sales || 0) - qty);
      } else if (mode === 'waste') {
        const currentStock = Number(next.currentStock || 0);
        if (qty > currentStock) {
          throw new Error('Insufficient stock for this flower');
        }
        next.currentStock = currentStock - qty;
        next.waste = Number(next.waste || 0) + qty;
      } else if (mode === 'addBackWaste') {
        next.currentStock = Number(next.currentStock || 0) + qty;
        next.waste = Math.max(0, Number(next.waste || 0) - qty);
      }

      next.updatedAt = new Date().toISOString();
      tx.set(ref, next, { merge: true });
    });
  }

  async ensureExists(collectionName, id, shopId, message) {
    if (!id) {
      throw new Error(message);
    }

    const docSnap = await this.db.collection(collectionName).doc(String(id)).get();
    if (!docSnap.exists || docSnap.data().shopId !== shopId) {
      throw new Error(message);
    }
  }

  async ensureTransactionRecord(collectionName, id, shopId) {
    const snap = await this.db.collection(collectionName).doc(String(id)).get();
    if (!snap.exists) {
      throw new Error('Record not found');
    }
    const data = snap.data();
    if (data.shopId !== shopId) {
      throw new Error('Forbidden shop data access');
    }
    return { id: snap.id, ...data };
  }
}

module.exports = TransactionService;
