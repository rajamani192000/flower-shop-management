class CommonService {
  constructor(db) {
    this.db = db;
  }

  async create(collectionName, payload, shopId) {
    const ref = this.db.collection(collectionName).doc();
    const now = new Date().toISOString();
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

  async list(collectionName, shopId) {
    const snap = await this.db.collection(collectionName).where('shopId', '==', shopId).get();
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  async update(collectionName, id, payload, shopId) {
    const ref = this.db.collection(collectionName).doc(id);
    const docSnap = await ref.get();
    if (!docSnap.exists) {
      throw new Error('Record not found');
    }

    const data = docSnap.data();
    if (data.shopId !== shopId) {
      throw new Error('Forbidden shop data access');
    }

    const next = {
      ...payload,
      updatedAt: new Date().toISOString(),
      shopId
    };

    await ref.set(next, { merge: true });
    return { id, ...data, ...next };
  }

  async remove(collectionName, id, shopId) {
    const ref = this.db.collection(collectionName).doc(id);
    const docSnap = await ref.get();
    if (!docSnap.exists) {
      return;
    }
    const data = docSnap.data();
    if (data.shopId !== shopId) {
      throw new Error('Forbidden shop data access');
    }
    await ref.delete();
  }
}

module.exports = CommonService;
