class SortingService {
  constructor(db, resourceService) {
    this.db = db;
    this.resourceService = resourceService;
  }

  async create(payload, shopId) {
    await this.ensurePurchase(payload.purchaseId, shopId);
    const grossWeight = Number(payload.grossWeight || 0);
    const wasteWeight = Number(payload.wasteWeight || 0);
    if (wasteWeight > grossWeight) {
      throw new Error('Waste weight cannot exceed gross weight');
    }
    return this.resourceService.create({
      ...payload,
      grossWeight,
      wasteWeight,
      netSellableWeight: grossWeight - wasteWeight
    }, shopId);
  }

  async update(id, payload, shopId) {
    if (payload.purchaseId) {
      await this.ensurePurchase(payload.purchaseId, shopId);
    }
    const grossWeight = Number(payload.grossWeight || 0);
    const wasteWeight = Number(payload.wasteWeight || 0);
    const next = { ...payload };
    if (Number.isFinite(grossWeight) && Number.isFinite(wasteWeight) && grossWeight >= 0) {
      if (wasteWeight > grossWeight) {
        throw new Error('Waste weight cannot exceed gross weight');
      }
      next.netSellableWeight = grossWeight - wasteWeight;
    }
    return this.resourceService.update(id, next, shopId);
  }

  async ensurePurchase(purchaseId, shopId) {
    const snap = await this.db.collection('purchases').doc(String(purchaseId)).get();
    if (!snap.exists || snap.data().shopId !== shopId) {
      throw new Error('Purchase not found');
    }
  }
}

module.exports = SortingService;
