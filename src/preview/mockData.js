// ==========================================
// נתוני דמה לתצוגה המקדימה — כל הערכים הם ממלאי מקום בלבד
// (לפי כללי התוכן: אין שמות אמיתיים, מותגים או תוכן מהותי)
// שמות הקטגוריות הם שמות המינים בלבד — מוצרים, ספקים ומחירים הם ממלאי מקום.
// ==========================================

export const CATEGORIES = [
  {
    id: "cat1",
    name: "אתרוג",
    children: [
      { id: "sub11", name: "תת-קטגוריה 1.1" },
      { id: "sub12", name: "תת-קטגוריה 1.2" },
    ],
  },
  {
    id: "cat2",
    name: "לולב",
    children: [
      { id: "sub21", name: "תת-קטגוריה 2.1" },
      { id: "sub22", name: "תת-קטגוריה 2.2" },
    ],
  },
  {
    id: "cat3",
    name: "הדס",
    children: [
      { id: "sub31", name: "תת-קטגוריה 3.1" },
      { id: "sub32", name: "תת-קטגוריה 3.2" },
    ],
  },
  {
    id: "cat4",
    name: "ערבה",
    children: [
      { id: "sub41", name: "תת-קטגוריה 4.1" },
      { id: "sub42", name: "תת-קטגוריה 4.2" },
    ],
  },
  {
    id: "cat5",
    name: "סט מלא",
    children: [
      { id: "sub51", name: "תת-קטגוריה 5.1" },
      { id: "sub52", name: "תת-קטגוריה 5.2" },
      { id: "sub53", name: "תת-קטגוריה 5.3" },
    ],
  },
  {
    id: "cat6",
    name: "אביזרים",
    children: [
      { id: "sub61", name: "תת-קטגוריה 6.1" },
      { id: "sub62", name: "תת-קטגוריה 6.2" },
    ],
  },
];

// מוצרים לדוגמה — שמות ממלאי מקום בלבד
export const PRODUCTS = [
  { id: "p1", name: "מוצר 1", sub: "sub11", supplier: "ספק 1", prices: [{ id: "a", label: "מחיר 1", amount: 120 }, { id: "b", label: "מחיר 2", amount: 145 }], defaultPriceId: "a", stock: 20, discountPercent: 0 },
  { id: "p2", name: "מוצר 2", sub: "sub11", supplier: "ספק 1", prices: [{ id: "a", label: "מחיר 1", amount: 80 }, { id: "b", label: "מחיר 2", amount: 95 }], defaultPriceId: "a", stock: 4, discountPercent: 10 },
  { id: "p3", name: "מוצר 3", sub: "sub12", supplier: "ספק 2", prices: [{ id: "a", label: "מחיר 1", amount: 220 }, { id: "b", label: "מחיר 2", amount: 250 }], defaultPriceId: "a", stock: 30, discountPercent: 0 },
  { id: "p4", name: "מוצר 4", sub: "sub12", supplier: "ספק 2", prices: [{ id: "a", label: "מחיר 1", amount: 65 }], defaultPriceId: "a", stock: 60, discountPercent: 0 },
  { id: "p5", name: "מוצר 5", sub: "sub21", supplier: "ספק 3", prices: [{ id: "a", label: "מחיר 1", amount: 60 }, { id: "b", label: "מחיר 2", amount: 75 }], defaultPriceId: "a", stock: 12, discountPercent: 0 },
  { id: "p6", name: "מוצר 6", sub: "sub21", supplier: "ספק 3", prices: [{ id: "a", label: "מחיר 1", amount: 40 }], defaultPriceId: "a", stock: 25, discountPercent: 0 },
  { id: "p7", name: "מוצר 7", sub: "sub22", supplier: "ספק 1", prices: [{ id: "a", label: "מחיר 1", amount: 55 }, { id: "b", label: "מחיר 2", amount: 65 }], defaultPriceId: "a", stock: 0, discountPercent: 0 },
  { id: "p8", name: "מוצר 8", sub: "sub31", supplier: "ספק 2", prices: [{ id: "a", label: "מחיר 1", amount: 18 }], defaultPriceId: "a", stock: 80, discountPercent: 5 },
  { id: "p9", name: "מוצר 9", sub: "sub31", supplier: "ספק 4", prices: [{ id: "a", label: "מחיר 1", amount: 25 }], defaultPriceId: "a", stock: 6, discountPercent: 0 },
  { id: "p10", name: "מוצר 10", sub: "sub32", supplier: "ספק 4", prices: [{ id: "a", label: "מחיר 1", amount: 30 }], defaultPriceId: "a", stock: 45, discountPercent: 0 },
  { id: "p11", name: "מוצר 11", sub: "sub41", supplier: "ספק 5", prices: [{ id: "a", label: "מחיר 1", amount: 15 }, { id: "b", label: "מחיר 2", amount: 20 }], defaultPriceId: "a", stock: 90, discountPercent: 0 },
  { id: "p12", name: "מוצר 12", sub: "sub42", supplier: "ספק 5", prices: [{ id: "a", label: "מחיר 1", amount: 12 }], defaultPriceId: "a", stock: 70, discountPercent: 0 },
  { id: "p13", name: "מוצר 13", sub: "sub51", supplier: "ספק 6", prices: [{ id: "a", label: "מחיר 1", amount: 320 }, { id: "b", label: "מחיר 2", amount: 380 }], defaultPriceId: "a", stock: 18, discountPercent: 0 },
  { id: "p14", name: "מוצר 14", sub: "sub52", supplier: "ספק 6", prices: [{ id: "a", label: "מחיר 1", amount: 450 }], defaultPriceId: "a", stock: 9, discountPercent: 0 },
  { id: "p15", name: "מוצר 15", sub: "sub53", supplier: "ספק 1", prices: [{ id: "a", label: "מחיר 1", amount: 260 }], defaultPriceId: "a", stock: 3, discountPercent: 0 },
  { id: "p16", name: "מוצר 16", sub: "sub61", supplier: "ספק 3", prices: [{ id: "a", label: "מחיר 1", amount: 8 }], defaultPriceId: "a", stock: 100, discountPercent: 0 },
  { id: "p17", name: "מוצר 17", sub: "sub61", supplier: "ספק 4", prices: [{ id: "a", label: "מחיר 1", amount: 35 }], defaultPriceId: "a", stock: 24, discountPercent: 0 },
  { id: "p18", name: "מוצר 18", sub: "sub62", supplier: "ספק 2", prices: [{ id: "a", label: "מחיר 1", amount: 50 }], defaultPriceId: "a", stock: 14, discountPercent: 0 },
];

export const EMPLOYEES = ["שם מלא 1", "שם מלא 2", "שם מלא 3"];

export const CUSTOMER_TYPES = [
  { id: "regular", name: "לקוח רגיל", discountPercent: 0 },
  { id: "type1", name: "סוג לקוח 1", discountPercent: 5 },
  { id: "type2", name: "סוג לקוח 2", discountPercent: 10 },
];

export const SETTINGS = {
  customerRequired: false,
  creditEnabled: true,
  cashierMayOverrideStock: true,
  managerApprovalForStock: false,
};

// התראות מלאי — טקסט ממלא מקום
export const STOCK_ALERTS = [
  { id: "al1", productName: "מוצר 2", available: 4, requested: 6, employee: "שם מלא 1", time: "09:12" },
  { id: "al2", productName: "מוצר 7", available: 0, requested: 1, employee: "שם מלא 2", time: "10:40" },
];
