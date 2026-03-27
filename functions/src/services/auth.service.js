const https = require('https');

class AuthService {
  constructor({ auth, db, seederService, apiKey }) {
    this.auth = auth;
    this.db = db;
    this.seederService = seederService;
    this.apiKey = apiKey;
  }

  async register(payload) {
    const userRecord = await this.auth.createUser({
      email: payload.email,
      password: payload.password,
      displayName: payload.ownerName,
      disabled: false
    });

    const shopRef = this.db.collection('shops').doc();
    const shopId = shopRef.id;
    const shopCode = await this.generateShopCode();
    const createdDate = new Date().toISOString();

    await shopRef.set({
      shopId,
      shopCode,
      shopName: payload.shopName,
      ownerName: payload.ownerName,
      phone: payload.phone,
      city: payload.city,
      address: payload.address,
      createdDate,
      status: 'active'
    });

    await this.db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      name: payload.ownerName,
      email: payload.email,
      role: 'Admin',
      shopId,
      shopCode,
      status: 'active',
      createdDate
    });

    await this.seederService.initializeShop(shopId, {
      shopName: payload.shopName,
      phone: payload.phone,
      address: payload.address,
      shopCode
    });

    return { uid: userRecord.uid, shopId };
  }

  async login(email, password) {
    if (!this.apiKey) {
      throw new Error('FIREBASE_API_KEY is missing in backend environment');
    }

    const signInResponse = await this.signInWithPassword(email, password);
    const decoded = await this.auth.verifyIdToken(signInResponse.idToken);
    const userDoc = await this.db.collection('users').doc(decoded.uid).get();

    if (!userDoc.exists) {
      throw new Error('User profile not found');
    }

    const user = await this.enrichUserProfile(userDoc.data());
    return {
      token: signInResponse.idToken,
      refreshToken: signInResponse.refreshToken,
      expiresIn: Number(signInResponse.expiresIn || 3600),
      user
    };
  }

  async profile(uid) {
    const userDoc = await this.db.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      throw new Error('User profile not found');
    }
    return this.enrichUserProfile(userDoc.data());
  }

  async updateProfile(uid, payload) {
    const userDocRef = this.db.collection('users').doc(uid);
    const userDoc = await userDocRef.get();
    if (!userDoc.exists) {
      throw new Error('User profile not found');
    }

    const next = {
      name: payload.name || userDoc.data().name || '',
      updatedAt: new Date().toISOString()
    };
    await userDocRef.set(next, { merge: true });

    await this.auth.updateUser(uid, { displayName: next.name });
    const updatedDoc = await userDocRef.get();
    return this.enrichUserProfile(updatedDoc.data());
  }

  async enrichUserProfile(user) {
    const shopDoc = await this.db.collection('shops').doc(String(user.shopId)).get();
    const shopData = shopDoc.exists ? shopDoc.data() : {};
    return {
      ...user,
      shopName: shopData.shopName || '',
      shopCode: shopData.shopCode || user.shopCode || ''
    };
  }

  async generateShopCode() {
    const snap = await this.db.collection('shops').count().get();
    const total = Number(snap.data().count || 0) + 1;
    return `SHOP${String(total).padStart(3, '0')}`;
  }

  signInWithPassword(email, password) {
    const body = JSON.stringify({
      email,
      password,
      returnSecureToken: true
    });

    const options = {
      hostname: 'identitytoolkit.googleapis.com',
      path: `/v1/accounts:signInWithPassword?key=${this.apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let raw = '';
        res.on('data', (chunk) => { raw += chunk; });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(raw || '{}');
            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
              resolve(parsed);
              return;
            }
            reject(new Error(parsed?.error?.message || 'Login failed'));
          } catch (error) {
            reject(error);
          }
        });
      });
      req.on('error', reject);
      req.write(body);
      req.end();
    });
  }
}

module.exports = AuthService;
