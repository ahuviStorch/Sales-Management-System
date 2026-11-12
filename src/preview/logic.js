// ==========================================
// שכבת לוגיקה עסקית טהורה לתצוגה המקדימה
// אין כאן קריאות רשת או שמירה — פונקציות טהורות בלבד
// ==========================================

/** מוודא עיגול כספי אחיד (2 ספרות) בכל המערכת. */
export function roundMoney(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/** מפרסר קלט כספי עברי — ממיר פסיק לנקודה, מחזיר NaN אם לא תקין. */
export function parseMoney(value) {
  const raw = String(value ?? "").trim().replace(",", ".");
  if (raw === "") return NaN;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : NaN;
}

const moneyFormatter = new Intl.NumberFormat("he-IL", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatMoney(value) {
  return `${moneyFormatter.format(roundMoney(value))} ₪`;
}

/**
 * חישוב שורת עגלה לפי סדר ההנחות של האפיון (§5):
 * 1. מחיר ליחידה (ברירת מחדל / מחיר אחר / מחיר ידני — ידני הוא סופי).
 * 2. הנחת מוצר על הסכום.
 * 3. הנחת סוג לקוח על היתרה.
 * דוגמה: 100 → 5% → 95 → 10% → 85.50
 */
export function calcLine({ unitPrice, quantity, productDiscountPercent = 0, customerDiscountPercent = 0, manualPriceFinal = false }) {
  const gross = roundMoney(unitPrice * quantity);
  const afterProduct = manualPriceFinal
    ? gross
    : roundMoney(gross * (1 - productDiscountPercent / 100));
  const net = roundMoney(afterProduct * (1 - customerDiscountPercent / 100));
  return {
    gross,
    afterProduct,
    net,
    productDiscountAmount: roundMoney(gross - afterProduct),
    customerDiscountAmount: roundMoney(afterProduct - net),
  };
}

export function calcCart(cart, customerType) {
  let gross = 0;
  let net = 0;
  let productDiscount = 0;
  let customerDiscount = 0;
  let units = 0;

  for (const line of cart.items) {
    const r = calcLine({
      unitPrice: line.unitPrice,
      quantity: line.quantity,
      productDiscountPercent: line.productDiscountPercent,
      customerDiscountPercent: customerType?.discountPercent || 0,
      manualPriceFinal: line.manualPriceFinal,
    });
    gross += r.gross;
    net += r.net;
    productDiscount += r.productDiscountAmount;
    customerDiscount += r.customerDiscountAmount;
    units += line.quantity;
  }

  return {
    units,
    gross: roundMoney(gross),
    net: roundMoney(net),
    productDiscount: roundMoney(productDiscount),
    customerDiscount: roundMoney(customerDiscount),
  };
}

export function paidTotal(cart) {
  const paid = cart.payments.reduce((s, p) => s + p.amount, 0);
  const refunded = cart.refunds.reduce((s, r) => s + r.amount, 0);
  return roundMoney(paid - refunded);
}

export function makeCart(id, customerTypeId = "regular") {
  return {
    id,
    name: `עגלה ${id}`,
    items: [],
    customerTypeId,
    customerTypeSelected: false,
    customerName: "",
    customerPhone: "",
    payment: "cash",
    received: "",
    payments: [],
    refunds: [],
  };
}

/** מחזיר {available} של מוצר לפי מלאי פחות מה שכבר שמור בעגלות פתוחות. */
export function availableStock(product, carts) {
  const reserved = carts.reduce(
    (sum, cart) =>
      sum +
      cart.items
        .filter((i) => i.productId === product.id)
        .reduce((s, i) => s + i.quantity, 0),
    0
  );
  return Math.max(0, product.stock - reserved);
}
