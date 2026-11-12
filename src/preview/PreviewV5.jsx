import { useEffect, useMemo, useRef, useState } from "react";
import {
  CATEGORIES,
  PRODUCTS,
  EMPLOYEES,
  CUSTOMER_TYPES,
  STOCK_ALERTS,
} from "./mockData";
import {
  formatMoney,
  parseMoney,
  calcCart,
  calcLine,
  paidTotal,
  makeCart,
  availableStock,
} from "./logic";
import { NavIcon, BrandMark, CategoryArt, CartArt } from "./icons";

const NAV = [
  { id: "sales", label: "קופה", icon: "pos" },
  { id: "manage", label: "מוצרים ומלאי", icon: "stock", screen: "manage" },
  { id: "history", label: "היסטוריית מכירות", icon: "history" },
  { id: "cancel", label: "ביטול מוצר", icon: "cancel" },
  { id: "payment", label: "תשלום", icon: "payment" },
  { id: "cart", label: "עגלה", icon: "cart" },
];

const SPEC_POINTS = {
  sales: [
    "קטגוריות ראשיות קבועות — לחיצה אחת לכל קטגוריה, ללא גלילה.",
    "לחיצה על מוצר פותחת בחירת מחיר וכמות; ＋ מוסיף במחיר ברירת מחדל.",
    "כמות רק ב־＋ / − — אין שדה הקלדה, למניעת טעויות.",
  ],
  payment: [
    "סכום היתרה גדול בראש המסך — לצד כפתור האישור.",
    "פרטי לקוח מקופלים כברירת מחדל — לא מעכבים את התור.",
    "סכום שהתקבל הוא אופציונלי; מוצג עודף או חסר — ללא עודף שלילי.",
  ],
  cart: [
    "שורות זהות ממוזגות: 'נוסף עוד מוצר זהה'.",
    "הסרת שורה מציגה 'בטל' לחזרה מיידית.",
    "מחיר ידני הוא סופי כברירת מחדל ומתועד ביומן.",
  ],
  cancel: [
    "ביטול מוצר עצמאי — לא דרך עגלה קיימת.",
    "החזר נרשם רק לאחר שהכסף הוחזר בפועל.",
    "החזר באשראי נרשם כממתין לביצוע.",
  ],
  history: [
    "חיפוש לפי שם לקוח או מזהה עסקה.",
    "החזרת מוצר מהזמנה עם חישוב דמי ביטול.",
    "סכום לפני ניכוי, דמי ביטול, וסכום נטו — בשקיפות.",
  ],
  manage: [
    "הגדרות: דרישת לקוח, אשראי, אישור מנהל לחריגת מלאי.",
    "התראות מלאי: 'פער מלאי לבדיקה' עם מי אישר ומתי.",
    "יומן פעולות (Audit) לכל מחיר ידני וכל חריגה.",
  ],
};

// מוצר שייך לקטגוריה לפי תת-הקטגוריה שלו
function productCategoryId(product) {
  return CATEGORIES.find((c) => c.children.some((s) => s.id === product.sub))?.id || null;
}

export default function PreviewV5() {
  const [tab, setTab] = useState("sales");
  const [employee, setEmployee] = useState(EMPLOYEES[0]);
  const [carts, setCarts] = useState(() => {
    const first = makeCart(1);
    const second = makeCart(2);
    second.items = [
      { id: "seeded", productId: "p3", name: "מוצר 3", supplier: "ספק 2", unitPrice: 220, priceLabel: "מחיר 1", quantity: 2, productDiscountPercent: 0, manualPriceFinal: false },
    ];
    return [first, second];
  });
  const [activeCartId, setActiveCartId] = useState(1);
  const [nextCartId, setNextCartId] = useState(3);
  const [categoryId, setCategoryId] = useState(null);
  const [productQuery, setProductQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedPriceId, setSelectedPriceId] = useState("a");
  const [manualPrice, setManualPrice] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [notice, setNotice] = useState(null);
  const [undoLine, setUndoLine] = useState(null);
  const [modal, setModal] = useState(null);
  const [completedSale, setCompletedSale] = useState(null);
  const [alerts, setAlerts] = useState(STOCK_ALERTS);
  const [auditLog, setAuditLog] = useState([
    { id: 1, text: "מחיר ידני בעגלה 2 — מוצר 3 · 200 ₪", who: "שם מלא 1", time: "09:05" },
  ]);
  const [settings, setSettings] = useState({
    customerRequired: false,
    creditEnabled: true,
    managerApprovalForStock: false,
  });
  const [history, setHistory] = useState([
    { id: 101, customer: "שם מלא 1", total: 128.5, payment: "מזומן", time: "09:30", items: [{ name: "מוצר 3", quantity: 2, unitPrice: 22 }, { name: "מוצר 8", quantity: 1, unitPrice: 40 }] },
    { id: 102, customer: "לקוח רגיל", total: 54, payment: "אשראי", time: "10:12", items: [{ name: "מוצר 9", quantity: 1, unitPrice: 55 }] },
  ]);
  const [historySearch, setHistorySearch] = useState("");
  const [logProductFilter, setLogProductFilter] = useState("");
  const [refundInput, setRefundInput] = useState("");
  const [cancelItems, setCancelItems] = useState([]);
  const [cancelCategoryId, setCancelCategoryId] = useState(null);
  const [cancelSubId, setCancelSubId] = useState(null);
  const [returnDraft, setReturnDraft] = useState(null);
  const [returnQty, setReturnQty] = useState(1);
  const [returnMethod, setReturnMethod] = useState("cash");
  const cartTabsRef = useRef(null);
  const noticeTimer = useRef(null);

  const activeCart = carts.find((c) => c.id === activeCartId) || carts[0];
  const customerType = CUSTOMER_TYPES.find((t) => t.id === activeCart?.customerTypeId) || CUSTOMER_TYPES[0];
  const totals = useMemo(() => calcCart(activeCart || { items: [] }, customerType), [activeCart, customerType]);
  const paid = paidTotal(activeCart || { payments: [], refunds: [] });
  const due = Math.max(0, totals.net - paid);
  const overpaid = Math.max(0, paid - totals.net);

  useEffect(() => () => clearTimeout(noticeTimer.current), []);

  // מסך "המכירה נשמרה" נסגר לבד כעבור 4 שניות ומתחיל מכירה חדשה.
  useEffect(() => {
    if (modal?.type !== "cashReceived" || !completedSale) return undefined;
    const t = setTimeout(() => completeAndReset(), 4000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal?.type, completedSale?.orderId]);

  function notify(text, tone = "info", ms = 4000) {
    clearTimeout(noticeTimer.current);
    setNotice({ text, tone });
    if (ms > 0) {
      noticeTimer.current = setTimeout(() => setNotice(null), ms);
    }
  }

  function updateCart(fn) {
    setCarts((prev) => prev.map((c) => (c.id === activeCartId ? fn(c) : c)));
  }

  function scrollActiveTabIntoView() {
    requestAnimationFrame(() => {
      const el = cartTabsRef.current?.querySelector(`[data-cart="${activeCartId}"]`);
      el?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
    });
  }

  function goTo(id) {
    setTab(id);
    setNotice(null);
  }

  // ---------- מכירה ----------
  // רשימת מוצרים למסך המכירה: חיפוש חופשי בשם/ספק/קטגוריה, ואם לא הוקלד דבר — לפי הקטגוריה שנבחרה.
  const salesProducts = useMemo(() => {
    const q = productQuery.trim();
    if (!q) {
      if (!categoryId) return [];
      const subs = CATEGORIES.find((c) => c.id === categoryId)?.children.map((s) => s.id) || [];
      return PRODUCTS.filter((p) => subs.includes(p.sub));
    }
    const inCategory = (p) => {
      if (!categoryId) return true;
      const subs = CATEGORIES.find((c) => c.id === categoryId)?.children.map((s) => s.id) || [];
      return subs.includes(p.sub);
    };
    return PRODUCTS.filter(
      (p) =>
        inCategory(p) &&
        (p.name.includes(q) ||
          p.supplier.includes(q) ||
          CATEGORIES.find((c) => c.id === categoryId)?.name.includes(q))
    );
  }, [productQuery, categoryId]);

  function addDefaultPrice(product) {
    const price = product.prices.find((p) => p.id === product.defaultPriceId) || product.prices[0];
    addProductLine(product, price, 1, false);
  }

  function openProduct(product) {
    setSelectedProduct(product);
    setSelectedPriceId(product.defaultPriceId);
    setManualPrice("");
    setQuantity(1);
    setNotice(null);
  }

  function addToCart() {
    if (!selectedProduct) return;
    const manual = parseMoney(manualPrice);
    const chosenPrice = selectedProduct.prices.find((p) => p.id === selectedPriceId) || selectedProduct.prices[0];
    const manualFinal = Number.isFinite(manual);
    addProductLine(
      selectedProduct,
      {
        ...chosenPrice,
        amount: manualFinal ? manual : chosenPrice.amount,
        label: manualFinal ? "מחיר ידני" : chosenPrice.label,
      },
      quantity,
      manualFinal
    );
    setSelectedProduct(null);
  }

  // מוסיף שורה לעגלה: שורה זהה ממוזגת, הוספה כפולה מקבלת הודעה נפרדת,
  // וחריגת מלאי עוברת דרך אישור / תיעוד "פער מלאי לבדיקה".
  function addProductLine(price, chosenPrice, qty, manualFinal) {
    const line = {
      productId: price.id,
      name: price.name,
      supplier: price.supplier,
      unitPrice: chosenPrice.amount,
      priceLabel: chosenPrice.label,
      quantity: qty,
      productDiscountPercent: price.discountPercent,
      manualPriceFinal: manualFinal,
    };

    const available = availableStock(price, carts);
    const isDuplicate = activeCart.items.some(
      (i) =>
        i.productId === line.productId &&
        i.unitPrice === line.unitPrice &&
        i.priceLabel === line.priceLabel
    );

    const commit = () => {
      updateCart((cart) => {
        const existing = cart.items.find(
          (i) =>
            i.productId === line.productId &&
            i.unitPrice === line.unitPrice &&
            i.priceLabel === line.priceLabel
        );
        const items = existing
          ? cart.items.map((i) =>
              i.id === existing.id ? { ...i, quantity: i.quantity + line.quantity } : i
            )
          : [...cart.items, { ...line, id: `${line.productId}-${Date.now()}` }];
        return { ...cart, items };
      });
      if (line.manualPriceFinal) {
        setAuditLog((prev) => [
          {
            id: Date.now(),
            text: `מחיר ידני · ${line.name} · ${formatMoney(line.unitPrice)} · ${line.quantity} יח׳`,
            who: employee,
            time: "עכשיו",
          },
          ...prev,
        ]);
      }
      // נוסח ההודעה קבוע באפיון: הוספה כפולה מקבלת הודעה נפרדת.
      notify(isDuplicate ? "נוסף עוד מוצר זהה" : "המוצר נוסף לעגלה");
      setTab("sales");
    };

    if (line.quantity > available) {
      setModal({
        type: "stockOverride",
        line,
        available,
        needApproval: settings.managerApprovalForStock,
        onConfirm: (approver) => {
          setAlerts((prev) => [
            {
              id: Date.now(),
              productName: line.name,
              available,
              requested: line.quantity,
              employee: approver || employee,
              time: "עכשיו",
            },
            ...prev,
          ]);
          setAuditLog((prev) => [
            {
              id: Date.now() + 1,
              text: `פער מלאי לבדיקה · ${line.name} · זמין ${available} · נדרש ${line.quantity}`,
              who: approver || employee,
              time: "עכשיו",
            },
            ...prev,
          ]);
          setModal(null);
          commit();
        },
      });
      return;
    }

    commit();
  }

  function deleteLine(line) {
    updateCart((cart) => ({ ...cart, items: cart.items.filter((i) => i.id !== line.id) }));
    // "בטל" תקף רק להסרה האחרונה — כדי שלא יוחזר בטעות מוצר מעגלה אחרת.
    setUndoLine({ cartId: activeCartId, line, at: Date.now() });
    notify("המוצר הוסר · ניתן לבטל את ההסרה", "info", 6000);
  }

  function restoreLine() {
    if (!undoLine) return;
    setCarts((prev) =>
      prev.map((c) =>
        c.id === undoLine.cartId ? { ...c, items: [...c.items, undoLine.line] } : c
      )
    );
    setUndoLine(null);
    notify("המוצר הוחזר לעגלה");
  }

  // ---------- עגלות ----------
  function newCart() {
    const id = nextCartId;
    setNextCartId(id + 1);
    setCarts((prev) => [...prev, makeCart(id)]);
    setActiveCartId(id);
    setTab("sales");
    setCategoryId(null);
    setSelectedProduct(null);
    notify(`נפתחה עגלה ${id}`, "info", 2000);
    requestAnimationFrame(scrollActiveTabIntoView);
  }

  function requestRemoveCart(id) {
    const cart = carts.find((c) => c.id === id);
    if (!cart) return;
    const isLast = carts.length === 1;
    const hasMoney = cart.payments.length > 0 || cart.refunds.length > 0;
    if (hasMoney) {
      setRefundInput("");
      setModal({ type: "paidCancel", cartId: id, cartName: cart.name, isLast });
      return;
    }
    setModal({ type: "removeCart", cartId: id, cartName: cart.name, isLast, hasItems: cart.items.length > 0 });
  }

  function removeCart(id) {
    const cart = carts.find((c) => c.id === id);
    setCarts((prev) => {
      if (prev.length === 1) return [makeCart(cart.id)];
      return prev.filter((c) => c.id !== id);
    });
    if (id === activeCartId) {
      const next = carts.find((c) => c.id !== id);
      if (next) setActiveCartId(next.id);
    }
    setModal(null);
    notify(cart?.items.length ? "העגלה הוסרה" : "העגלה נסגרה", "info", 2500);
  }

  function finalizePaidCancel() {
    const cart = carts.find((c) => c.id === modal.cartId);
    const owed = paidTotal(cart);
    const refunded = parseMoney(refundInput);
    if (!Number.isFinite(refunded)) {
      notify("יש להזין סכום שהוחזר בפועל", "error", 3000);
      return;
    }
    if (refunded > owed) {
      notify("סכום ההחזר גדול מהסכום שהתקבל", "error", 3000);
      return;
    }
    if (refunded < owed) {
      notify(`נותר להחזיר ${formatMoney(owed - refunded)} — לא ניתן לסגור לפני הסדרת הכסף`, "error", 4000);
      return;
    }
    removeCart(modal.cartId);
    notify("ההחזר נרשם והעגלה נסגרה", "success", 4000);
  }

  // ---------- תשלום ----------
  function pay(amount, method) {
    if (!(amount > 0)) return false;
    if (amount > due) {
      notify("סכום התשלום גדול מהיתרה", "error", 3000);
      return false;
    }
    updateCart((cart) => ({
      ...cart,
      payments: [...cart.payments, { id: Date.now(), amount, method }],
    }));
    notify(`נרשם תקבול ${formatMoney(amount)}`, "success", 2500);
    return true;
  }

  // סיום מכירה: רושם תשלום אחד, ואם התשלום אינו מכסה את הסכום — נדרש שם לקוח
  // והיתרה נשמרת כחוב פתוח (בתצוגה זו). העודף מוצג לפני סגירה ומוחזר בעגלה.
  function finishSale() {
    if (!activeCart.items.length) {
      notify("העגלה ריקה", "error", 2500);
      return;
    }
    if (settings.customerRequired && !activeCart.customerTypeSelected) {
      notify("יש לבחור סוג לקוח לפני סיום", "error", 3000);
      return;
    }

    const method = activeCart.payment;
    const receivedRaw = String(activeCart.received ?? "").trim();
    const received = parseMoney(receivedRaw);
    const hasReceived = receivedRaw !== "" && Number.isFinite(received);

    // במזומן: הזנה של "התקבל" קטן מהסכום = תשלום חלקי.
    if (method === "cash" && hasReceived && received < due) {
      if (!activeCart.customerName.trim()) {
        notify("תשלום חלקי — חובה למלא שם לקוח", "error", 4000);
        return;
      }
      updateCart((cart) => ({
        ...cart,
        payments: [...cart.payments, { id: Date.now(), amount: received, method: "cash" }],
        received: "",
        partial: true,
      }));
      notify(
        `נשמרה יתרה פתוחה של ${formatMoney(due - received)} על שם ${activeCart.customerName}`,
        "info",
        5000
      );
      setTab("cart");
      return;
    }

    // רישום התשלום שנותר. העודף נרשם כהחזר בפועל — לא נסגרת עסקה עם עודף פתוח.
    if (due > 0) {
      if (!pay(due, method)) return;
    }
    if (method === "cash" && hasReceived && received > due) {
      updateCart((cart) => ({
        ...cart,
        refunds: [...cart.refunds, { id: Date.now(), amount: received - due }],
        received: "",
      }));
    }

    const total = totals.net;
    const exact = method === "cash" && hasReceived ? received : total;
    const change = method === "cash" && hasReceived ? Math.max(0, received - total) : 0;

    setCompletedSale({
      orderId: 103 + history.length,
      employee,
      total,
      payment: method === "cash" ? "מזומן" : "אשראי",
      received: exact,
      change,
      customer: activeCart.customerName || customerType.name,
    });
    setModal({ type: "cashReceived", amount: total });
  }

  function completeAndReset() {
    if (!completedSale) return;
    setHistory((prev) => [
      {
        id: completedSale.orderId,
        customer: completedSale.customer,
        total: completedSale.total,
        payment: completedSale.payment || "מזומן",
        time: "עכשיו",
        items: activeCart.items.map((i) => ({ name: i.name, quantity: i.quantity, unitPrice: i.unitPrice })),
      },
      ...prev,
    ]);
    // העגלה ששולמה מוחלפת בעגלה חדשה וריקה — מצב "מכירה חדשה" ללא אישור מנהל.
    // שומרים על אותו מזהה עגלה כדי שהניווט והמיקוד לא "יקפצו" לעגלה אחרת.
    setCarts((prev) => prev.map((c) => (c.id === activeCartId ? makeCart(activeCartId) : c)));
    setCompletedSale(null);
    setModal(null);
    setTab("sales");
    setCategoryId(null);
    setSelectedProduct(null);
    setUndoLine(null);
    notify("המכירה נשמרה · ניתן להתחיל מכירה חדשה", "success", 4000);
  }

  // ---------- ביטול מוצר עצמאי ----------
  // קטגוריה ראשית → תת-קטגוריות → מוצרים.
  const cancelSubs = useMemo(() => {
    const cat = CATEGORIES.find((c) => c.id === cancelCategoryId);
    return cat ? cat.children : [];
  }, [cancelCategoryId]);

  const cancelSubProducts = useMemo(() => {
    if (!cancelSubId) return [];
    return PRODUCTS.filter((p) => p.sub === cancelSubId);
  }, [cancelSubId]);

  function addCancelItem(product) {
    setCancelItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) => (i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { productId: product.id, name: product.name, unitPrice: product.prices[0].amount, quantity: 1 }];
    });
    notify(`נוסף לרשימת הביטול · ${product.name}`);
  }

  const cancelGross = cancelItems.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

  function confirmCancellation() {
    if (!cancelItems.length) return;
    if (returnMethod === "credit") {
      notify("החזר אשראי נרשם כממתין לביצוע", "info", 5000);
    } else {
      notify(`תועד החזר מזומן של ${formatMoney(cancelGross)}`, "success", 4000);
    }
    setAuditLog((prev) => [
      { id: Date.now(), text: `ביטול מוצר · ${cancelItems.length} שורות · ${formatMoney(cancelGross)}`, who: employee, time: "עכשיו" },
      ...prev,
    ]);
    setCancelItems([]);
    setCancelCategoryId(null);
    setCancelSubId(null);
  }

  // ---------- היסטוריה ----------
  const filteredHistory = useMemo(() => {
    const q = historySearch.trim();
    if (!q) return history;
    return history.filter(
      (o) => o.customer.includes(q) || String(o.id).includes(q)
    );
  }, [history, historySearch]);

  function openReturn(order, item) {
    setReturnDraft({ orderId: order.id, item });
    setReturnQty(1);
    setReturnMethod("cash");
  }

  function completeReturn() {
    if (!returnDraft) return;
    const gross = returnDraft.item.unitPrice * returnQty;
    const net = gross;
    setHistory((prev) =>
      prev.map((o) =>
        o.id === returnDraft.orderId ? { ...o, total: Math.max(0, o.total - net) } : o
      )
    );
    setAuditLog((prev) => [
      { id: Date.now(), text: `החזרת מוצר · ${returnDraft.item.name} × ${returnQty} · ${formatMoney(net)}`, who: employee, time: "עכשיו" },
      ...prev,
    ]);
    setReturnDraft(null);
    notify(
      returnMethod === "credit"
        ? "ההחזר נרשם כממתין לביצוע"
        : `הוחזר ${formatMoney(net)} במזומן`,
      "success",
      4000
    );
  }

  const auditShown = useMemo(() => {
    const q = logProductFilter.trim();
    if (!q) return auditLog;
    return auditLog.filter((a) => a.text.includes(q));
  }, [auditLog, logProductFilter]);

  // ---------- רינדור ----------
  const currentCategory = CATEGORIES.find((c) => c.id === categoryId);
  const currentCancelCategory = CATEGORIES.find((c) => c.id === cancelCategoryId);
  const currentCancelSub = currentCancelCategory?.children.find((s) => s.id === cancelSubId);
  const navScreen = NAV.find((n) => n.id === tab)?.screen || tab;

  const noticeBar = notice && (
    <div className={`pv-notice pv-notice-${notice.tone}`} role="status">
      {notice.text}
      <button onClick={() => setNotice(null)} aria-label="סגירת הודעה">×</button>
    </div>
  );

  // שורת פריט בעגלה — משמשת במסך המכירה ובמסך העגלה
  function renderLine(line, { editable = true } = {}) {
    const r = calcLine({
      unitPrice: line.unitPrice,
      quantity: line.quantity,
      productDiscountPercent: line.productDiscountPercent,
      customerDiscountPercent: customerType.discountPercent,
      manualPriceFinal: line.manualPriceFinal,
    });
    return (
      <div key={line.id} className="pv-line">
        <div className="pv-line-top">
          <div className="pv-line-info">
            <strong>{line.name}</strong>
            <small>
              {line.supplier} · {line.priceLabel}
              {line.manualPriceFinal ? " · מתועד" : ""} · {formatMoney(line.unitPrice)} ליח׳
            </small>
          </div>
          <b>{formatMoney(r.net)}</b>
          {editable ? (
            <button className="pv-del" onClick={() => deleteLine(line)} aria-label={`הסרת ${line.name}`}>×</button>
          ) : (
            <span />
          )}
        </div>
        <div className="pv-line-bottom">
          {editable ? (
            <div className="pv-qty pv-qty-sm">
              <button
                onClick={() =>
                  updateCart((cart) => ({
                    ...cart,
                    items: cart.items
                      .map((i) => (i.id === line.id ? { ...i, quantity: i.quantity - 1 } : i))
                      .filter((i) => i.quantity > 0),
                  }))
                }
                aria-label={`הפחתת כמות ${line.name}`}
              >
                −
              </button>
              <strong>{line.quantity}</strong>
              <button
                onClick={() =>
                  updateCart((cart) => ({
                    ...cart,
                    items: cart.items.map((i) =>
                      i.id === line.id ? { ...i, quantity: i.quantity + 1 } : i
                    ),
                  }))
                }
                aria-label={`הגדלת כמות ${line.name}`}
              >
                ＋
              </button>
            </div>
          ) : (
            <span className="pv-muted">{line.quantity} יח׳</span>
          )}
          {(r.productDiscountAmount > 0 || r.customerDiscountAmount > 0) && (
            <span className="pv-disc">
              הנחת מוצר −{formatMoney(r.productDiscountAmount)} · הנחת לקוח −{formatMoney(r.customerDiscountAmount)}
            </span>
          )}
        </div>
      </div>
    );
  }

  function renderPayMethods(current, onPick, extra = {}) {
    return (
      <div className="pv-pay-methods" role="group" aria-label="אמצעי תשלום">
        <button className={`pv-method ${current === "cash" ? "selected" : ""}`} onClick={() => onPick("cash")}>
          מזומן
        </button>
        <button
          className={`pv-method ${current === "credit" ? "selected" : ""}`}
          onClick={() => onPick("credit")}
          disabled={!settings.creditEnabled}
          {...extra}
        >
          אשראי
        </button>
      </div>
    );
  }

  return (
    <div className="pv-app" dir="rtl">
      <div className="pv-shell">
        {/* ================= סרגל צד ================= */}
        <aside className="pv-sidebar" aria-label="ניווט ראשי">
          <div className="pv-side-brand">
            <BrandMark />
            <div>
              <strong>כותרת</strong>
              <small>טקסט לדוגמה</small>
            </div>
          </div>

          <nav className="pv-side-nav">
            <button
              className={`pv-side-link primary ${tab === "sales" ? "active" : ""}`}
              aria-current={tab === "sales" ? "page" : undefined}
              onClick={() => goTo("sales")}
            >
              <span className="pv-side-ico"><NavIcon name="pos" /></span>
              קופה
              <span className="pv-side-count">{totals.units}</span>
            </button>
            {NAV.slice(1).map((n) => (
              <button
                key={n.id}
                className={`pv-side-link ${tab === n.id ? "active" : ""}`}
                aria-current={tab === n.id ? "page" : undefined}
                onClick={() => goTo(n.id)}
              >
                <span className="pv-side-ico"><NavIcon name={n.icon} /></span>
                {n.label}
                {n.id === "cancel" && cancelItems.length > 0 && (
                  <span className="pv-side-count">{cancelItems.length}</span>
                )}
              </button>
            ))}
          </nav>

          <div className="pv-side-footer">
            <span className="pv-side-mail">https://example.com</span>
            <div className="pv-side-seller">
              <span className="pv-avatar">{employee.slice(0, 1)}</span>
              <select value={employee} onChange={(e) => setEmployee(e.target.value)} aria-label="בחירת מוכר">
                {EMPLOYEES.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>
        </aside>

        <main className="pv-main">
          {noticeBar}

          {/* ================= מכירה ================= */}
          {tab === "sales" && (
            <>
              <div className="pv-page-head">
                <div>
                  <h1>קופה</h1>
                  <p>עגלה פעילה: {activeCart.name} · {totals.units} יחידות</p>
                </div>
                <div className="pv-head-actions">
                  <button className="pv-secondary" onClick={newCart}>＋ עגלה חדשה</button>
                </div>
              </div>

              {/* חיפוש וסינון קטגוריה — קבועים בראש המסך */}
              <div className="pv-searchbar">
                <div className="pv-search-input">
                  <span aria-hidden="true"><NavIcon name="stock" /></span>
                  <input
                    value={productQuery}
                    onChange={(e) => setProductQuery(e.target.value)}
                    placeholder="חיפוש מוצר, ספק או קטגוריה"
                    aria-label="חיפוש מוצר"
                  />
                </div>
                <div className="pv-catbar" role="tablist" aria-label="סינון לפי קטגוריה">
                  <button
                    role="tab"
                    aria-selected={!categoryId}
                    className={`pv-pill ${!categoryId ? "active" : ""}`}
                    onClick={() => setCategoryId(null)}
                  >
                    הכל
                  </button>
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.id}
                      role="tab"
                      aria-selected={categoryId === c.id}
                      className={`pv-pill ${categoryId === c.id ? "active" : ""}`}
                      onClick={() => setCategoryId(c.id)}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pv-pos">
                <div className="pv-pos-left">
                  {selectedProduct ? (
                    <div className="pv-detail">
                      <button className="pv-crumb" onClick={() => setSelectedProduct(null)}>
                        חזרה לרשימה ‹
                      </button>
                      <div className="pv-detail-head">
                        <div>
                          <h1>{selectedProduct.name}</h1>
                          <p>{selectedProduct.supplier}</p>
                        </div>
                        <span className="pv-stock">
                          מלאי זמין: <b>{availableStock(selectedProduct, carts)}</b>
                        </span>
                      </div>

                      <div className="pv-section-label"><span>מחיר</span></div>
                      <div className="pv-price-row">
                        {selectedProduct.prices.map((p) => (
                          <button
                            key={p.id}
                            className={`pv-price ${selectedPriceId === p.id && !manualPrice ? "selected" : ""}`}
                            onClick={() => {
                              setSelectedPriceId(p.id);
                              setManualPrice("");
                            }}
                          >
                            <span>{p.label}</span>
                            <strong>{formatMoney(p.amount)}</strong>
                            {p.id === selectedProduct.defaultPriceId && <small>ברירת מחדל</small>}
                          </button>
                        ))}
                        <label className={`pv-price pv-price-manual ${manualPrice ? "selected" : ""}`}>
                          <span>מחיר אחר</span>
                          <input
                            inputMode="decimal"
                            placeholder="0"
                            value={manualPrice}
                            onChange={(e) => setManualPrice(e.target.value)}
                            aria-label="מחיר אחר"
                          />
                          <small>סופי · מתועד</small>
                        </label>
                      </div>

                      <div className="pv-section-label"><span>כמות</span></div>
                      <div className="pv-qty">
                        <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="הפחתת כמות">−</button>
                        <strong>{quantity}</strong>
                        <button onClick={() => setQuantity((q) => q + 1)} aria-label="הגדלת כמות">＋</button>
                      </div>

                      <div className="pv-line-preview">
                        <span>
                          סה״כ שורה
                          {selectedProduct.discountPercent > 0 && !manualPrice && (
                            <small> · הנחת מוצר {selectedProduct.discountPercent}% תופעל בעגלה</small>
                          )}
                        </span>
                        <b>
                          {formatMoney(
                            (Number.isFinite(parseMoney(manualPrice))
                              ? parseMoney(manualPrice)
                              : selectedProduct.prices.find((p) => p.id === selectedPriceId)?.amount || 0) * quantity
                          )}
                        </b>
                      </div>

                      <button className="pv-gold pv-big" onClick={addToCart}>
                        ＋ הוספה ל{activeCart.name}
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="pv-section-label">
                        <span>
                          {productQuery.trim()
                            ? `${salesProducts.length} מוצרים תואמים`
                            : categoryId
                              ? `${currentCategory?.name} · ${salesProducts.length} מוצרים`
                              : "בחרו קטגוריה או חפשו מוצר"}
                        </span>
                      </div>
                      <div className="pv-grid">
                        {salesProducts.map((p) => {
                          const avail = availableStock(p, carts);
                          const def = p.prices.find((x) => x.id === p.defaultPriceId) || p.prices[0];
                          return (
                            <div key={p.id} className={`pv-item ${avail === 0 ? "out" : ""}`}>
                              <div className="pv-item-media" aria-hidden="true">
                                <CategoryArt id={productCategoryId(p)} />
                              </div>
                              <button className="pv-item-body" onClick={() => openProduct(p)}>
                                <strong>{p.name}</strong>
                                <small>{p.supplier} · {def.label}</small>
                                {(avail === 0 || avail <= 5 || p.discountPercent > 0) && (
                                  <span className="pv-item-tags">
                                    {avail === 0 && <span className="pv-tag pv-tag-danger">אין במלאי</span>}
                                    {avail > 0 && avail <= 5 && <span className="pv-tag pv-tag-warn">מלאי נמוך: {avail}</span>}
                                    {p.discountPercent > 0 && <span className="pv-tag pv-tag-good">{p.discountPercent}%−</span>}
                                  </span>
                                )}
                              </button>
                              <div className="pv-item-foot">
                                <b>{formatMoney(def.amount)}</b>
                                <button
                                  className="pv-tile-add"
                                  onClick={() => addDefaultPrice(p)}
                                  aria-label={`הוספת ${p.name} לעגלה במחיר ברירת מחדל`}
                                >
                                  ＋
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {salesProducts.length === 0 && (
                        <div className="pv-empty">
                          <CartArt />
                          <p>{productQuery.trim() ? "לא נמצאו מוצרים תואמים." : "בחרו קטגוריה כדי לראות מוצרים."}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* פאנל מכירה נוכחית */}
                <div className="pv-pos-right">
                  <div className="pv-sale">
                    <div className="pv-sale-head">
                      <h2>מכירה נוכחית</h2>
                      <small>{activeCart.name}</small>
                    </div>
                    <div className="pv-sale-body">
                      <div className="pv-lines">
                        {activeCart.items.length === 0 && (
                          <div className="pv-empty-line">העגלה ריקה — הוסיפו מוצר מהרשימה</div>
                        )}
                        {activeCart.items.map((line) => renderLine(line))}
                      </div>

                      <label className="pv-field">
                        <span>שם לקוח (לא חובה)</span>
                        <input
                          value={activeCart.customerName}
                          onChange={(e) => updateCart((c) => ({ ...c, customerName: e.target.value }))}
                          placeholder="שם לקוח"
                        />
                      </label>

                      <div className="pv-field">
                        <span>אמצעי תשלום</span>
                        {renderPayMethods(activeCart.payment, (m) =>
                          updateCart((c) => ({ ...c, payment: m, received: "" }))
                        )}
                      </div>

                      <div className="pv-sum">
                        <div><span>סה״כ לפני הנחות</span><b>{formatMoney(totals.gross)}</b></div>
                        {totals.productDiscount > 0 && (
                          <div><span>הנחת מוצר</span><b>− {formatMoney(totals.productDiscount)}</b></div>
                        )}
                        {totals.customerDiscount > 0 && (
                          <div>
                            <span>הנחת לקוח ({customerType.discountPercent}%)</span>
                            <b>− {formatMoney(totals.customerDiscount)}</b>
                          </div>
                        )}
                        <div className="total"><span>לתשלום</span><b>{formatMoney(totals.net)}</b></div>
                      </div>
                    </div>
                    <div className="pv-sale-foot">
                      <button
                        className="pv-gold pv-big"
                        onClick={finishSale}
                        disabled={!activeCart.items.length}
                      >
                        סיום מכירה · {formatMoney(totals.net)}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ================= תשלום ================= */}
          {tab === "payment" && (
            <>
              <div className="pv-page-head">
                <div>
                  <h1>תשלום</h1>
                  <p>{activeCart.name} · {totals.units} יחידות</p>
                </div>
                <div className="pv-head-actions">
                  <button className="pv-secondary" onClick={() => goTo("cart")}>לעגלה</button>
                </div>
              </div>

              <div className="pv-two-col">
                <div className="pv-cards">
                  <div className="pv-card">
                    <div className="pv-sale-head" style={{ padding: 0 }}>
                      <div>
                        <h2>{overpaid > 0 ? "עודף להחזרה" : "סה״כ לתשלום"}</h2>
                        <p className="pv-muted">
                          {overpaid > 0
                            ? `סה״כ ${formatMoney(totals.net)} · שולם ${formatMoney(paid)}`
                            : `${totals.units} יחידות · סה״כ ${formatMoney(totals.net)}`}
                        </p>
                      </div>
                    </div>
                    <div className="pv-modal-ok" style={{ padding: "4px 0" }}>
                      <strong className="pv-amount">{formatMoney(overpaid > 0 ? overpaid : due)}</strong>
                    </div>
                    <button
                      className="pv-gold pv-big"
                      onClick={finishSale}
                      disabled={!activeCart.items.length || overpaid > 0}
                    >
                      ✓ סיום מכירה
                    </button>
                    {overpaid > 0 && (
                      <div className="pv-box pv-box-danger">
                        <b>שולם יותר מהסכום.</b>
                        <p>יש לתעד החזר בפועל של {formatMoney(overpaid)} לפני סגירת העסקה.</p>
                        <button
                          className="pv-secondary"
                          onClick={() => {
                            setRefundInput("");
                            setModal({ type: "refundExcess" });
                          }}
                        >
                          תיעוד החזר עודף
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="pv-card">
                    <h2>אמצעי תשלום</h2>
                    {renderPayMethods(activeCart.payment, (m) =>
                      updateCart((c) => ({ ...c, payment: m, received: "" }))
                    )}

                    {activeCart.payment === "cash" && (
                      <>
                        <label className="pv-field">
                          <span>התקבל מהלקוח (לא חובה)</span>
                          <input
                            inputMode="decimal"
                            value={activeCart.received}
                            onChange={(e) => updateCart((c) => ({ ...c, received: e.target.value }))}
                            placeholder="סכום שהתקבל"
                          />
                        </label>
                        <div className="pv-quick">
                          {[20, 50, 100, 200, 500].map((v) => (
                            <button key={v} onClick={() => updateCart((c) => ({ ...c, received: String(v) }))}>
                              {v}
                            </button>
                          ))}
                        </div>
                        <div className="pv-quick" style={{ gridTemplateColumns: "1fr" }}>
                          <button onClick={() => updateCart((c) => ({ ...c, received: String(due) }))}>
                            סכום מדויק · {formatMoney(due)}
                          </button>
                        </div>
                        {String(activeCart.received ?? "").trim() !== "" &&
                          Number.isFinite(parseMoney(activeCart.received)) && (
                            <div className="pv-change">
                              {parseMoney(activeCart.received) > due ? (
                                <span className="pv-ok">עודף להחזרה: <b>{formatMoney(parseMoney(activeCart.received) - due)}</b></span>
                              ) : parseMoney(activeCart.received) === due ? (
                                <span className="pv-ok">סכום מדויק ✓</span>
                              ) : (
                                <span className="pv-err">
                                  חסר: <b>{formatMoney(due - parseMoney(activeCart.received))}</b>
                                  {parseMoney(activeCart.received) > 0 && " — תשלום חלקי יחייב שם לקוח"}
                                </span>
                              )}
                              <button
                                className="pv-secondary"
                                onClick={() => {
                                  const received = parseMoney(activeCart.received);
                                  if (received > due) {
                                    setRefundInput(String(received - due));
                                    setModal({ type: "refundExcess" });
                                  } else {
                                    pay(received, "cash");
                                  }
                                }}
                              >
                                רישום תקבול
                              </button>
                            </div>
                          )}
                      </>
                    )}

                    {activeCart.payment === "credit" && (
                      <div className="pv-box pv-box-warn">
                        בתצוגה זו האשראי נרשם כממתין לתשלום בפועל — אין סליקה.
                        <button className="pv-secondary" onClick={() => pay(due, "credit")} disabled={due <= 0}>
                          סימון כשולם באשראי
                        </button>
                      </div>
                    )}
                  </div>

                  <details className="pv-customer" open={paid > 0 ? true : undefined}>
                    <summary>פרטי לקוח – לא חובה</summary>
                    <label>
                      <span>שם הלקוח</span>
                      <input
                        value={activeCart.customerName}
                        onChange={(e) => updateCart((c) => ({ ...c, customerName: e.target.value }))}
                        placeholder="שם לקוח"
                      />
                    </label>
                    <label>
                      <span>טלפון</span>
                      <input
                        inputMode="tel"
                        value={activeCart.customerPhone}
                        onChange={(e) => updateCart((c) => ({ ...c, customerPhone: e.target.value }))}
                        placeholder="טלפון"
                      />
                    </label>
                    <div className="pv-type-row">
                      <span>סוג לקוח</span>
                      <select
                        value={activeCart.customerTypeId}
                        onChange={(e) =>
                          updateCart((c) => ({ ...c, customerTypeId: e.target.value, customerTypeSelected: true }))
                        }
                      >
                        {CUSTOMER_TYPES.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name} · {t.discountPercent}%
                          </option>
                        ))}
                      </select>
                    </div>
                  </details>
                </div>

                <div className="pv-card">
                  <h2>סיכום</h2>
                  <div className="pv-sum">
                    <div><span>סה״כ לפני הנחות</span><b>{formatMoney(totals.gross)}</b></div>
                    <div><span>הנחת מוצר</span><b>− {formatMoney(totals.productDiscount)}</b></div>
                    <div><span>הנחת לקוח ({customerType.discountPercent}%)</span><b>− {formatMoney(totals.customerDiscount)}</b></div>
                    <div className="total"><span>לתשלום</span><b>{formatMoney(totals.net)}</b></div>
                    {paid > 0 && <div><span>התקבל בפועל</span><b>{formatMoney(paid)}</b></div>}
                    {paid > 0 && due > 0 && <div><span>יתרה לתשלום</span><b>{formatMoney(due)}</b></div>}
                  </div>
                  {paid > 0 && (
                    <button className="pv-secondary" onClick={() => pay(due, "cash")} disabled={due <= 0}>
                      השלמת היתרה במזומן ({formatMoney(due)})
                    </button>
                  )}
                  <p className="pv-note">
                    תצוגה לדוגמה בלבד — אין סליקה ואין הרשאות אמיתיות.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* ================= עגלה ================= */}
          {tab === "cart" && (
            <>
              <div className="pv-page-head">
                <div>
                  <h1>{activeCart.name}</h1>
                  <p>{totals.units} יחידות · {customerType.name}</p>
                </div>
                <div className="pv-head-actions">
                  <button className="pv-primary" onClick={() => goTo("sales")}>＋ הוספת מוצרים</button>
                </div>
              </div>

              <div className="pv-two-col">
                {!activeCart.items.length ? (
                  <div className="pv-empty">
                    <CartArt />
                    <h2>העגלה ריקה</h2>
                    <button className="pv-primary" onClick={() => setTab("sales")}>למכירה</button>
                  </div>
                ) : (
                  <div className="pv-panel">
                    <div className="pv-panel-head">
                      <h2>פריטים</h2>
                      <small className="pv-muted">{activeCart.items.length} שורות</small>
                    </div>
                    <div className="pv-lines">{activeCart.items.map((line) => renderLine(line))}</div>
                    {undoLine && undoLine.cartId === activeCartId && (
                      <div className="pv-undo">
                        <span>הוסר: {undoLine.line.name}</span>
                        <button onClick={restoreLine}>↶ בטל</button>
                      </div>
                    )}
                  </div>
                )}

                <div className="pv-card">
                  <div className="pv-sum">
                    <div className="total"><span>סה״כ עגלה</span><b>{formatMoney(totals.net)}</b></div>
                    {paid > 0 && (
                      <>
                        <div><span>שולם</span><b>{formatMoney(paid)}</b></div>
                        <div><span>יתרה</span><b>{formatMoney(due)}</b></div>
                      </>
                    )}
                  </div>

                  {paid > 0 && !activeCart.customerName && (
                    <div className="pv-box pv-box-danger">
                      התקבל כסף בעגלה זו ולא הוזן שם לקוח — חובה לפני סיום, למקרה של צורך בהחזר.
                    </div>
                  )}

                  <button
                    className="pv-gold pv-big"
                    disabled={!activeCart.items.length}
                    onClick={() => setTab("payment")}
                  >
                    מעבר לתשלום · {formatMoney(totals.net)}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ================= ביטול מוצר ================= */}
          {tab === "cancel" && (
            <>
              <div className="pv-page-head">
                <div>
                  <h1>ביטול מוצר עצמאי</h1>
                  <p>מסלול נפרד מהעגלה — לתיעוד החזר על מוצר שנמכר.</p>
                </div>
              </div>

              <div className="pv-two-col">
                <div className="pv-cards">
                  {!cancelCategoryId && (
                    <div className="pv-grid-cats">
                      {CATEGORIES.map((c) => (
                        <button
                          key={c.id}
                          className="pv-card pv-cat"
                          onClick={() => {
                            setCancelCategoryId(c.id);
                            setCancelSubId(null);
                          }}
                        >
                          <span className="pv-emoji" aria-hidden="true"><CategoryArt id={c.id} /></span>
                          <strong>{c.name}</strong>
                          <small>{c.children.length} תת-קטגוריות</small>
                        </button>
                      ))}
                    </div>
                  )}

                  {cancelCategoryId && !cancelSubId && (
                    <>
                      <button className="pv-crumb" onClick={() => setCancelCategoryId(null)}>‹ כל הקטגוריות</button>
                      <h2>{currentCancelCategory.name}</h2>
                      <div className="pv-grid-subs">
                        {cancelSubs.map((s) => (
                          <button key={s.id} className="pv-card pv-cat" onClick={() => setCancelSubId(s.id)}>
                            <strong>{s.name}</strong>
                            <small>לבחירת מוצרים</small>
                          </button>
                        ))}
                      </div>
                    </>
                  )}

                  {cancelCategoryId && cancelSubId && (
                    <>
                      <button className="pv-crumb" onClick={() => setCancelSubId(null)}>‹ {currentCancelCategory.name}</button>
                      <h2>{currentCancelSub?.name}</h2>
                      <div className="pv-grid-products">
                        {cancelSubProducts.length === 0 && (
                          <p className="pv-muted">אין מוצרים בתת-קטגוריה זו.</p>
                        )}
                        {cancelSubProducts.map((p) => (
                          <button key={p.id} className="pv-card pv-prod" onClick={() => addCancelItem(p)}>
                            <strong>{p.name}</strong>
                            <small>{p.supplier}</small>
                            <b>{formatMoney(p.prices[0].amount)}</b>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="pv-panel">
                  <div className="pv-panel-head">
                    <h2>רשימת ההחזר</h2>
                    <small className="pv-muted">{cancelItems.length} שורות</small>
                  </div>
                  <div className="pv-lines">
                    {cancelItems.length === 0 && <div className="pv-empty-line">לא נבחרו מוצרים לביטול.</div>}
                    {cancelItems.map((i) => (
                      <div key={i.productId} className="pv-line">
                        <div className="pv-line-top">
                          <div className="pv-line-info">
                            <strong>{i.name}</strong>
                            <small>{formatMoney(i.unitPrice)} ליח׳</small>
                          </div>
                          <b>{formatMoney(i.unitPrice * i.quantity)}</b>
                          <button
                            className="pv-del"
                            onClick={() => setCancelItems((prev) => prev.filter((x) => x.productId !== i.productId))}
                            aria-label={`הסרת ${i.name}`}
                          >
                            ×
                          </button>
                        </div>
                        <div className="pv-line-bottom">
                          <div className="pv-qty pv-qty-sm">
                            <button
                              onClick={() =>
                                setCancelItems((prev) => prev.map((x) => (x.productId === i.productId ? { ...x, quantity: Math.max(1, x.quantity - 1) } : x)))
                              }
                              aria-label="הפחתת כמות"
                            >
                              −
                            </button>
                            <strong>{i.quantity}</strong>
                            <button
                              onClick={() =>
                                setCancelItems((prev) => prev.map((x) => (x.productId === i.productId ? { ...x, quantity: x.quantity + 1 } : x)))
                              }
                              aria-label="הגדלת כמות"
                            >
                              ＋
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {cancelItems.length > 0 && (
                    <>
                      {renderPayMethods(returnMethod, setReturnMethod)}
                      <div className="pv-sum">
                        <div className="total"><span>סכום להחזר</span><b>{formatMoney(cancelGross)}</b></div>
                      </div>
                      {returnMethod === "credit" && (
                        <div className="pv-box pv-box-warn">
                          החזר אשראי נרשם כממתין לביצוע — לא ניתן לסגור לפני שהכסף הוחזר בפועל.
                        </div>
                      )}
                      <button className="pv-primary pv-big" onClick={confirmCancellation}>תיעוד ההחזר</button>
                    </>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ================= היסטוריה ================= */}
          {tab === "history" && (
            <>
              <div className="pv-page-head">
                <div>
                  <h1>היסטוריית מכירות</h1>
                  <p>{history.length} עסקאות</p>
                </div>
              </div>

              <input
                className="pv-search"
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                placeholder="חיפוש לפי שם לקוח או מזהה עסקה"
                aria-label="חיפוש בעסקאות"
              />

              <div className="pv-cards">
                {filteredHistory.map((o) => (
                  <div key={o.id} className="pv-order">
                    <div className="pv-order-head">
                      <b>#{o.id}</b>
                      <strong>{formatMoney(o.total)}</strong>
                      <small>{o.customer} · {o.payment} · {o.time}</small>
                    </div>
                    <div className="pv-order-items">
                      {o.items.map((it, idx) => (
                        <button key={idx} className="pv-return" onClick={() => openReturn(o, it)}>
                          {it.name} × {it.quantity} <span>החזרה</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {filteredHistory.length === 0 && <p className="pv-muted">לא נמצאו תוצאות.</p>}
              </div>
            </>
          )}

          {/* ================= ניהול ================= */}
          {tab === "manage" && (
            <>
              <div className="pv-page-head">
                <div>
                  <h1>מוצרים ומלאי</h1>
                  <p>הגדרות, התראות מלאי ויומן פעולות</p>
                </div>
              </div>

              <div className="pv-card">
                <h2>הגדרות</h2>
                <div className="pv-settings">
                  <label className="pv-switch">
                    <span>דרישת בחירת סוג לקוח לפני מכירה</span>
                    <input
                      type="checkbox"
                      checked={settings.customerRequired}
                      onChange={(e) => setSettings((s) => ({ ...s, customerRequired: e.target.checked }))}
                    />
                  </label>
                  <label className="pv-switch">
                    <span>אשראי מופעל</span>
                    <input
                      type="checkbox"
                      checked={settings.creditEnabled}
                      onChange={(e) => setSettings((s) => ({ ...s, creditEnabled: e.target.checked }))}
                    />
                  </label>
                  <label className="pv-switch">
                    <span>נדרש אישור מנהל על חריגת מלאי</span>
                    <input
                      type="checkbox"
                      checked={settings.managerApprovalForStock}
                      onChange={(e) => setSettings((s) => ({ ...s, managerApprovalForStock: e.target.checked }))}
                    />
                  </label>
                </div>
              </div>

              <div className="pv-card">
                <h2>התראות מלאי — "פער מלאי לבדיקה"</h2>
                <div className="pv-table">
                  {alerts.length === 0 && <p className="pv-muted">אין התראות.</p>}
                  {alerts.map((a) => (
                    <div key={a.id} className="pv-row">
                      <b>{a.productName}</b>
                      <span>זמין {a.available} · נדרש {a.requested}</span>
                      <small>{a.employee} · {a.time}</small>
                      <button className="pv-secondary" onClick={() => setAlerts((prev) => prev.filter((x) => x.id !== a.id))}>
                        סגירה
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pv-card">
                <h2>יומן פעולות (Audit)</h2>
                <input
                  className="pv-search"
                  value={logProductFilter}
                  onChange={(e) => setLogProductFilter(e.target.value)}
                  placeholder="סינון לפי מוצר"
                  aria-label="סינון יומן פעולות"
                />
                <div className="pv-table">
                  {auditShown.map((a) => (
                    <div key={a.id} className="pv-row">
                      <span>{a.text}</span>
                      <small>{a.who} · {a.time}</small>
                    </div>
                  ))}
                  {auditShown.length === 0 && <p className="pv-muted">אין רשומות.</p>}
                </div>
              </div>
            </>
          )}

          {/* פאנל נקודות מהאפיון */}
          {navScreen === tab && tab !== "sales" ? (
            <aside className="pv-spec" aria-label="הסברים">
              <h3>מה מדגים המסך</h3>
              <ul>
                {SPEC_POINTS[tab]?.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </aside>
          ) : null}

          <aside className="pv-spec" aria-label="כללי האפיון">
            <h3>כללי גרסה 5</h3>
            <ul>
              <li>מכירה מעל המלאי מותרת למוכר כברירת מחדל — מתועדת כחריגה.</li>
              <li>הודעת הצלחה מוצגת 4 שניות בלבד.</li>
              <li>"מכירה חדשה" ללא אישור מנהל.</li>
              <li>מחיר ידני סופי — לא מוכפל בהנחות.</li>
              <li>החזר נרשם רק לאחר שהכסף הוחזר בפועל.</li>
            </ul>
            <p className="pv-note">תצוגה לדוגמה בלבד — אין שרת, אין סליקה, אין הרשאות אמיתיות. הנתונים הם ממלאי מקום.</p>
          </aside>
        </main>
      </div>

      {/* ================= סרגל עגלות תחתון ================= */}
      <nav className="pv-cartbar" aria-label="עגלות פתוחות">
        <div className="pv-cartbar-scroll" ref={cartTabsRef}>
          {carts.map((c) => {
            const ct = CUSTOMER_TYPES.find((t) => t.id === c.customerTypeId) || CUSTOMER_TYPES[0];
            const t = calcCart(c, ct);
            return (
              <div key={c.id} className={`pv-cartchip ${c.id === activeCartId ? "active" : ""}`} data-cart={c.id}>
                <button
                  className="pv-chip-main"
                  onClick={() => {
                    setActiveCartId(c.id);
                    setTab("cart");
                    requestAnimationFrame(scrollActiveTabIntoView);
                  }}
                >
                  <strong>{c.name}</strong>
                  <small>{t.units} יח׳ · {formatMoney(t.net)}</small>
                </button>
                <button className="pv-chip-x" onClick={() => requestRemoveCart(c.id)} aria-label={`סגירת ${c.name}`}>×</button>
              </div>
            );
          })}
        </div>
        <button className="pv-newcart" onClick={newCart} title="עגלה חדשה">
          <span aria-hidden="true">＋</span>
          <small>עגלה</small>
        </button>
      </nav>

      {/* ================= מודלים ================= */}
      {modal?.type === "stockOverride" && (
        <div className="pv-backdrop" onClick={() => setModal(null)}>
          <div className="pv-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <h2>פער בין הכמות למלאי הרשום</h2>
            <p>
              זמין במערכת: <b>{modal.available}</b> יחידות. נדרש בעגלה: <b>{modal.line.quantity}</b>.
            </p>
            <p className="pv-muted">ייתכן שהמלאי הפיזי עודכן. האם המוצר קיים בפועל?</p>
            {modal.needApproval && (
              <div className="pv-box pv-box-warn">מוגדר שנדרש אישור מנהל. בתצוגה זו אישור ההמשך מדגים את האישור.</div>
            )}
            <div className="pv-modal-actions">
              <button
                className="pv-primary"
                onClick={() => {
                  const target = modal;
                  setModal(null);
                  target.onConfirm(employee);
                }}
              >
                {modal.needApproval ? "המשך עם אישור" : "המוצר קיים — המשך"}
              </button>
              <button className="pv-secondary" onClick={() => setModal(null)}>חזרה ללא הוספה</button>
            </div>
          </div>
        </div>
      )}

      {modal?.type === "refundExcess" && (
        <div className="pv-backdrop" onClick={() => setModal(null)}>
          <div className="pv-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <h2>החזר עודף</h2>
            <p>עודף להסדרה: <b>{formatMoney(overpaid)}</b></p>
            <label className="pv-field">
              <span>סכום שהוחזר בפועל</span>
              <input inputMode="decimal" value={refundInput} onChange={(e) => setRefundInput(e.target.value)} placeholder="0" />
            </label>
            <div className="pv-modal-actions">
              <button
                className="pv-primary"
                onClick={() => {
                  const refunded = parseMoney(refundInput);
                  if (!Number.isFinite(refunded) || refunded <= 0 || refunded > overpaid) {
                    notify("סכום החזר לא תקין", "error", 3000);
                    return;
                  }
                  if (refunded < overpaid) {
                    notify(`נותר להחזיר ${formatMoney(overpaid - refunded)}`, "error", 4000);
                    return;
                  }
                  updateCart((c) => ({ ...c, refunds: [...c.refunds, { id: Date.now(), amount: refunded }] }));
                  setModal(null);
                  notify("ההחזר נרשם", "success", 3000);
                }}
              >
                רישום החזר
              </button>
              <button className="pv-secondary" onClick={() => setModal(null)}>ביטול</button>
            </div>
          </div>
        </div>
      )}

      {modal?.type === "paidCancel" && (
        <div className="pv-backdrop" onClick={() => setModal(null)}>
          <div className="pv-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <h2>סגירת עגלה שהתקבל בה כסף</h2>
            <p>
              {modal.cartName} — התקבל נטו <b>{formatMoney(paidTotal(carts.find((c) => c.id === modal.cartId)))}</b>.
            </p>
            <p className="pv-muted">לא ניתן לסגור עגלה לפני שהכסף הוחזר בפועל.</p>
            <label className="pv-field">
              <span>סכום שהוחזר בפועל</span>
              <input inputMode="decimal" value={refundInput} onChange={(e) => setRefundInput(e.target.value)} placeholder="0" />
            </label>
            <div className="pv-modal-actions">
              <button className="pv-ghost-danger" onClick={finalizePaidCancel}>אישור החזר וסגירת העגלה</button>
              <button className="pv-secondary" onClick={() => setModal(null)}>חזרה לעגלה</button>
            </div>
          </div>
        </div>
      )}

      {modal?.type === "removeCart" && (
        <div className="pv-backdrop" onClick={() => setModal(null)}>
          <div className="pv-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <h2>{modal.isLast ? "לנקות את העגלה?" : `לסגור את ${modal.cartName}?`}</h2>
            <p className="pv-muted">
              {modal.isLast
                ? "זו העגלה היחידה — תכולתה תימחק והיא תישאר ריקה."
                : modal.hasItems
                  ? "העגלה מכילה מוצרים. סגירתה תמחק את התכולה."
                  : "העגלה ריקה ותיסגר."}
            </p>
            <div className="pv-modal-actions">
              <button className="pv-ghost-danger" onClick={() => removeCart(modal.cartId)}>
                כן, {modal.isLast ? "לנקות" : "לסגור"}
              </button>
              <button className="pv-secondary" onClick={() => setModal(null)}>ביטול</button>
            </div>
          </div>
        </div>
      )}

      {modal?.type === "cashReceived" && (
        <div className="pv-backdrop">
          <div className="pv-modal pv-modal-ok" role="dialog" aria-modal="true">
            <span className="pv-tick" aria-hidden="true">✓</span>
            <h2>המכירה נשמרה</h2>
            <strong className="pv-amount">{formatMoney(completedSale?.total || 0)}</strong>
            <p>עסקה #{completedSale?.orderId} · {completedSale?.payment}</p>
            {completedSale?.change > 0 && (
              <p className="pv-ok">
                התקבל {formatMoney(completedSale.received)} · עודף שהושב {formatMoney(completedSale.change)}
              </p>
            )}
            <p className="pv-muted">{completedSale?.customer} · מוכר/ת: {completedSale?.employee}</p>
            <p className="pv-muted">ההודעה תיסגר בעוד 4 שניות</p>
            <div className="pv-modal-actions">
              <button className="pv-gold pv-big" onClick={completeAndReset}>
                התחלת מכירה חדשה
              </button>
              {carts.length > 1 && (
                <button
                  className="pv-secondary"
                  onClick={() => {
                    setCarts((prev) => prev.filter((c) => c.id !== activeCartId));
                    const next = carts.find((c) => c.id !== activeCartId);
                    setActiveCartId(next.id);
                    setCompletedSale(null);
                    setModal(null);
                    setTab("cart");
                  }}
                >
                  המשך בעגלה אחרת
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {returnDraft && (
        <div className="pv-backdrop" onClick={() => setReturnDraft(null)}>
          <div className="pv-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <h2>החזרת מוצר מהזמנה</h2>
            <p>{returnDraft.item.name} · עסקה #{returnDraft.orderId}</p>
            <div className="pv-qty">
              <button onClick={() => setReturnQty((q) => Math.max(1, q - 1))} aria-label="הפחתת כמות">−</button>
              <strong>{returnQty}</strong>
              <button onClick={() => setReturnQty((q) => Math.min(returnDraft.item.quantity, q + 1))} aria-label="הגדלת כמות">＋</button>
            </div>
            <div className="pv-sum">
              <div className="total"><span>לפני ניכוי</span><b>{formatMoney(returnDraft.item.unitPrice * returnQty)}</b></div>
            </div>
            {renderPayMethods(returnMethod, setReturnMethod)}
            <div className="pv-modal-actions">
              <button className="pv-primary" onClick={completeReturn}>אישור החזרה</button>
              <button className="pv-secondary" onClick={() => setReturnDraft(null)}>ביטול</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
