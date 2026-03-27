class UploadService {
  constructor(storageBucket) {
    this.storageBucket = storageBucket;
  }

  async uploadPurchaseBill({ file, shopId }) {
    if (!file) {
      throw new Error('File is required');
    }
    if (!shopId) {
      throw new Error('shopId is required');
    }

    const safeName = file.originalname.replace(/\s+/g, '-');
    const path = `purchase-bills/${shopId}/${Date.now()}-${safeName}`;
    const targetFile = this.storageBucket.file(path);

    await targetFile.save(file.buffer, {
      metadata: {
        contentType: file.mimetype
      },
      resumable: false
    });

    const [signedUrl] = await targetFile.getSignedUrl({
      action: 'read',
      expires: '2500-01-01'
    });

    return { url: signedUrl, path };
  }
}

module.exports = UploadService;
