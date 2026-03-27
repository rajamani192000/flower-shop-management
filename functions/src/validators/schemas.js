const { z } = require('zod');

const id = z.string().min(1);
const dateString = z.string().min(1);

const flowerCreateSchema = z.object({
  flowerName: z.string().min(2),
  unit: z.enum(['KG', 'Gram', 'Piece', 'Garland']).default('KG'),
  category: z.string().min(1).default('Loose Flower'),
  defaultPrice: z.number().nonnegative().default(0),
  status: z.union([z.string(), z.boolean()]).optional()
});

const customerCreateSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(6),
  address: z.string().optional().default(''),
  creditLimit: z.number().nonnegative().default(0),
  customerType: z.string().optional().default('Retail')
});

const supplierCreateSchema = z.object({
  supplierName: z.string().min(2),
  location: z.string().min(1),
  phone: z.string().optional().default(''),
  paymentType: z.string().optional().default('Cash')
});

const saleCreateSchema = z.object({
  flowerId: id,
  customerId: z.string().optional().transform(val => val || null),
  weight: z.number().positive(),
  unitPrice: z.number().nonnegative().optional(),
  totalAmount: z.number().nonnegative(),
  paymentType: z.enum(['Cash', 'UPI', 'Credit']),
  date: dateString
});

const purchaseCreateSchema = z.object({
  supplierId: id,
  flowerId: id.optional(),
  weight: z.number().positive().optional(),
  unitPrice: z.number().nonnegative().optional(),
  totalAmount: z.number().nonnegative().optional(),
  items: z.array(z.object({
    flowerId: id,
    weight: z.number().positive(),
    unitPrice: z.number().positive(),
    totalAmount: z.number().nonnegative()
  })).optional(),
  boxNumber: z.string().optional().default(''),
  paymentType: z.enum(['Cash', 'UPI', 'Credit']),
  date: dateString,
  billPhotoUrl: z.string().optional().default('')
}).superRefine((value, ctx) => {
  const hasSingle = value.flowerId && value.weight && value.totalAmount !== undefined;
  const hasItems = Array.isArray(value.items) && value.items.length > 0;
  if (!hasSingle && !hasItems) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Provide either single purchase fields or items[]',
      path: ['items']
    });
  }
});

const wasteCreateSchema = z.object({
  flowerId: id,
  weight: z.number().positive(),
  reason: z.string().min(1),
  date: dateString
});

const expenseCreateSchema = z.object({
  expenseType: z.string().min(1),
  amount: z.number().positive(),
  note: z.string().optional().default(''),
  date: dateString
});

const sortingCreateSchema = z.object({
  purchaseId: id,
  grossWeight: z.number().nonnegative(),
  wasteWeight: z.number().nonnegative(),
  date: dateString
});

const creditSaleCreateSchema = z.object({
  customerId: id,
  amount: z.number().positive(),
  date: dateString,
  status: z.enum(['Pending', 'Paid']).default('Pending')
});

const creditCollectionCreateSchema = z.object({
  customerId: id,
  amount: z.number().positive(),
  date: dateString
});

const priceHistoryCreateSchema = z.object({
  flowerId: id,
  date: dateString,
  purchasePrice: z.number().nonnegative(),
  salePrice: z.number().nonnegative()
});

const boxTrackingCreateSchema = z.object({
  boxNumber: z.string().min(1),
  flowerId: id,
  supplierId: id,
  grossWeight: z.number().nonnegative(),
  netWeight: z.number().nonnegative(),
  purchasePrice: z.number().nonnegative(),
  date: dateString
});

const settingsSchema = z.object({
  shopName: z.string().optional(),
  shopCode: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  logoUrl: z.string().optional(),
  gstNumber: z.string().optional(),
  location: z.string().optional(),
  lowStockThreshold: z.number().optional(),
  highCreditThreshold: z.number().optional(),
  currency: z.string().optional(),
  autoPrint: z.boolean().optional(),
  printerPaperSize: z.string().optional(),
  printerType: z.string().optional(),
  theme: z.string().optional(),
  taxEnabled: z.boolean().optional()
});

const registerSchema = z.object({
  shopName: z.string().min(2),
  ownerName: z.string().min(2),
  phone: z.string().min(6),
  email: z.string().email(),
  password: z.string().min(6),
  city: z.string().min(2),
  address: z.string().min(2)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

module.exports = {
  registerSchema,
  loginSchema,
  flowerCreateSchema,
  customerCreateSchema,
  supplierCreateSchema,
  saleCreateSchema,
  purchaseCreateSchema,
  wasteCreateSchema,
  expenseCreateSchema,
  sortingCreateSchema,
  creditSaleCreateSchema,
  creditCollectionCreateSchema,
  priceHistoryCreateSchema,
  boxTrackingCreateSchema,
  settingsSchema
};
