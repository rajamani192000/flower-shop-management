class ResourceService {
  constructor(db, collectionName) {
    this.db = db;
    this.collectionName = collectionName;
  }

  async list(shopId) {
    const snap = await this.db.collection(this.collectionName).where('shopId', '==', shopId).get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  async getById(id, shopId) {
    const docRef = this.db.collection(this.collectionName).doc(id);
    const snap = await docRef.get();
    if (!snap.exists) {
      throw new Error('Record not found');
    }
    const data = snap.data();
    if (data.shopId !== shopId) {
      throw new Error('Forbidden shop data access');
    }
    return { id: snap.id, ...data };
  }

  async create(payload, shopId) {
    const now = new Date().toISOString();
    const ref = this.db.collection(this.collectionName).doc();
    const data = {
      ...payload,
      id: ref.id,
      shopId,
      createdDate: now,
      createdAt: now,
      updatedAt: now
    };
    await ref.set(data);
    return data;
  }

  async update(id, payload, shopId) {
    const existing = await this.getById(id, shopId);
    const next = {
      ...payload,
      shopId,
      updatedAt: new Date().toISOString()
    };
    await this.db.collection(this.collectionName).doc(id).set(next, { merge: true });
    return { ...existing, ...next };
  }

  async remove(id, shopId) {
    await this.getById(id, shopId);
    await this.db.collection(this.collectionName).doc(id).delete();
  }
}

module.exports = ResourceService;
