
import { useEffect, useMemo, useRef, useState } from "react";

// קטלוג הדגמה
const catalog = [
  {
    id: "chocolate",
    name: "שוקולד",
    icon: "🍫",
    children: [
      {
        id: "elite",
        name: "עלית",
        icon: "🍫",
        products: [
          {
            id: "p1",
            name: "שוקולד מריר",
            supplier: "סוכן א",
            defaultQty: 1,
            defaultPriceId: "a",
            prices: [
              { id: "a", label: "מחיר רגיל", amount: 30 },
              { id: "b", label: "מחיר מוזל", amount: 25 },
              { id: "c", label: "מחיר מיוחד", amount: 20 }
            ]
          },
          {
            id: "p2",
            name: "שוקולד חלב",
            supplier: "סוכן א",
            defaultQty: 1,
            defaultPriceId: null,
            prices: [
              { id: "a", label: "מארז קטן", amount: 20 },
              { id: "b", label: "מארז גדול", amount: 35 }
            ]
          },
          {
            id: "p3",
            name: "שוקולד לבן",
            supplier: "סוכן ב",
            defaultQty: 1,
            defaultPriceId: "a",
            prices: [
              { id: "a", label: "מחיר רגיל", amount: 28 },
              { id: "b", label: "מחיר מיוחד", amount: 24 }
            ]
          }
        ]
      },
      {
        id: "belgian",
        name: "שוקולד בלגי",
        icon: "🍫",
        products: [
          {
            id: "p4",
            name: "מטבעות שוקולד",
            supplier: "סוכן ב",
            defaultQty: 1,
            defaultPriceId: "a",
            prices: [
              { id: "a", label: "מחיר רגיל", amount: 40 },
              { id: "b", label: "מחיר נוסף", amount: 35 }
            ]
          },
          {
            id: "p5",
            name: "שוקולד לציפוי",
            supplier: "סוכן ג",
            defaultQty: 1,
            defaultPriceId: null,
            prices: [
              { id: "a", label: "חבילה קטנה", amount: 32 },
              { id: "b", label: "חבילה גדולה", amount: 55 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "candies",
    name: "סוכריות",
    icon: "🍬",
    children: [
      {
        id: "color-candies",
        name: "סוכריות לפי סוג",
        icon: "🍬",
        products: [
          {
            id: "p6",
            name: "סוכריות צבעוניות",
            supplier: "סוכן א",
            defaultQty: 1,
            defaultPriceId: "a",
            prices: [
              { id: "a", label: "מחיר רגיל", amount: 15 },
              { id: "b", label: "מחיר גדול", amount: 25 }
            ]
          },
          {
            id: "p7",
            name: "סוכריות קטנות",
            supplier: "סוכן ב",
            defaultQty: 1,
            defaultPriceId: "a",
            prices: [
              { id: "a", label: "מחיר רגיל", amount: 12 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "syrup",
    name: "סירופ",
    icon: "🍯",
    children: [
      {
        id: "syrup-types",
        name: "סוגי סירופ",
        icon: "🍯",
        products: [
          {
            id: "p8",
            name: "סירופ שוקולד",
            supplier: "סוכן ג",
            defaultQty: 1,
            defaultPriceId: "a",
            prices: [
              { id: "a", label: "בקבוק רגיל", amount: 25 },
              { id: "b", label: "בקבוק גדול", amount: 40 }
            ]
          },
          {
            id: "p9",
            name: "סירופ תות",
            supplier: "סוכן ב",
            defaultQty: 1,
            defaultPriceId: null,
            prices: [
              { id: "a", label: "בקבוק קטן", amount: 20 },
              { id: "b", label: "בקבוק גדול", amount: 35 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "extras",
    name: "תוספות",
    icon: "✨",
    children: [
      {
        id: "sprinkles",
        name: "קישוטים",
        icon: "✨",
        products: [
          {
            id: "p10",
            name: "סוכריות לקישוט",
            supplier: "סוכן א",
            defaultQty: 1,
            defaultPriceId: "a",
            prices: [
              { id: "a", label: "מחיר רגיל", amount: 18 },
              { id: "b", label: "מחיר גדול", amount: 30 }
            ]
          },
          {
            id: "p11",
            name: "קישוטי שוקולד",
            supplier: "סוכן ג",
            defaultQty: 1,
            defaultPriceId: "a",
            prices: [
              { id: "a", label: "מחיר רגיל", amount: 22 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "other",
    name: "אחר",
    icon: "➕",
    manualEntry: true,
    children: []
  }
];

const employees = ["מוכר א", "מוכר ב", "מוכר ג"];

const defaultCustomerTypes = [
  {
    id: "regular",
    name: "לקוח רגיל",
    discountPercent: 0
  }
];

function findNode(path) {
  let current = { children: catalog };

  for (const id of path) {
    current = current.children?.find(item => item.id === id);

    if (!current) {
      return null;
    }
  }

  return current;
}

function parsePrice(value) {
  const parsed = Number(
    String(value ?? "").trim().replace(",", ".")
  );

  return Number.isFinite(parsed) ? parsed : NaN;
}

function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function formatMoney(value) {
  return new Intl.NumberFormat("he-IL", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value) + " ₪";
}

function makeCart(id, customerTypeId = "regular") {
  return {
    id,
    name: `עגלה ${id}`,
    items: [],
    customerTypeId,
    customerTypeSelected: false,
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    payment: "מזומן",
    received: "",
    payments: [],
    refunds: []
  };
}

function getPathLabel(path) {
  if (!path.length) {
    return "ללא קטגוריה";
  }

  return path
    .map((_, index) => {
      return findNode(path.slice(0, index + 1))?.name;
    })
    .filter(Boolean)
    .join(" › ");
}

function collectProducts(nodes) {
  return nodes.flatMap(node => {
    if (node.products) {
      return node.products.map(product => ({
        ...product,
        categoryPath: node.name
      }));
    }

    return collectProducts(node.children || []);
  });
}

export default function App() {
  const [screen, setScreen] = useState("employee");

  const [employee, setEmployee] = useState("");
  const [otherEmployee, setOtherEmployee] = useState("");

  const [path, setPath] = useState([]);

  const [carts, setCarts] = useState([makeCart(1)]);
  const [activeCartId, setActiveCartId] = useState(1);

  const cartTabsRef = useRef(null);

  const [flowMode, setFlowMode] = useState("sale");

  const [currentProduct, setCurrentProduct] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState("");
  const [manualPrice, setManualPrice] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [editingItem, setEditingItem] = useState(null);
  const [editPrice, setEditPrice] = useState("");
  const [editQuantity, setEditQuantity] = useState(1);

  const [manualName, setManualName] = useState("");
  const [manualSupplier, setManualSupplier] = useState("");
  const [manualProductPrice, setManualProductPrice] = useState("");
  const [manualProductQty, setManualProductQty] = useState(1);

  const [notice, setNotice] = useState("");
  const [modal, setModal] = useState(null);

  const [salesHistory, setSalesHistory] = useState([]);
  const [standaloneCancellations, setStandaloneCancellations] = useState([]);

  const [cancelItems, setCancelItems] = useState([]);
  const [cancelRefundMethod, setCancelRefundMethod] = useState("cash");

  const [completedSale, setCompletedSale] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const [historySearch, setHistorySearch] = useState("");
  const [historySearchField, setHistorySearchField] = useState("all");

  const [returnDraft, setReturnDraft] = useState(null);
  const [returnQuantity, setReturnQuantity] = useState(1);
  const [returnMethod, setReturnMethod] = useState("cash");

  const [customerTypes, setCustomerTypes] = useState(
    defaultCustomerTypes
  );

  const [newCustomerTypeName, setNewCustomerTypeName] = useState("");
  const [newCustomerTypeDiscount, setNewCustomerTypeDiscount] = useState("0");

  const [productDiscounts, setProductDiscounts] = useState({});

  const [settings, setSettings] = useState({
    customerRequired: false,
    creditEnabled: false,
    creditCancellationFeeEnabled: false,
    creditCancellationFeePercent: 0,
    manualPriceDiscounts: false
  });

  const [manageSection, setManageSection] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [stock, setStock] = useState(() => Object.fromEntries(collectProducts(catalog).map((p, i) => [p.id, 12 + (i * 7) % 24])));
  const [stockAlerts, setStockAlerts] = useState([]);
  const [adminRequiresStockApproval, setAdminRequiresStockApproval] = useState(false);
  const [undoLine, setUndoLine] = useState(null);
  const [dailyVerified, setDailyVerified] = useState({});
  const [supplierSettlements, setSupplierSettlements] = useState([]);
  const [supplierDraft, setSupplierDraft] = useState({ name: "", amount: "" });
  const [demoCatalog, setDemoCatalog] = useState(() => collectProducts(catalog));
  const [catalogDrafts, setCatalogDrafts] = useState({});
  const [adminProductSearch, setAdminProductSearch] = useState("");
  const [splitOpen, setSplitOpen] = useState(false);
  const [refundInput, setRefundInput] = useState("");
  const [demoEvents, setDemoEvents] = useState([]);

  function logDemo(message) {
    setDemoEvents(prev => [{ id: Date.now() + Math.random(), message, date: new Date().toISOString(), employee: displayEmployee || "מוכר" }, ...prev].slice(0, 80));
  }
  function stockReserved(productId) {
    return carts.reduce((sum, basket) => sum + basket.items.filter(line => line.productId === productId).reduce((n, line) => n + line.quantity, 0), 0);
  }
  function stockAvailable(productId) { return (stock[productId] ?? 0) - stockReserved(productId); }
  function paidTotal(basket) { return roundMoney((basket?.payments || []).reduce((n, p) => n + p.amount, 0) - (basket?.refunds || []).reduce((n, p) => n + p.amount, 0)); }
  function basketTotal(basket) { return roundMoney((basket?.items || []).reduce((n, line) => n + line.price * line.quantity, 0)); }
  function deleteCartLine(item) {
    updateActiveCart(current => ({ items: current.items.filter(line => line.id !== item.id) }));
    setUndoLine({ cartId: activeCartId, line: item });
    notify("המוצר הוסר · ניתן לבטל את ההסרה");
  }
  function restoreCartLine() {
    if (!undoLine) return;
    setCarts(prev => prev.map(b => b.id === undoLine.cartId ? { ...b, items: [...b.items, undoLine.line] } : b));
    setUndoLine(null);
    notify("המוצר הוחזר לעגלה");
  }
  function confirmAddProduct(line) {
    updateActiveCart(current => {
      const match = current.items.find(item => item.productId === line.productId && item.price === line.price && item.supplier === line.supplier && item.categoryPath === line.categoryPath && item.productDiscountPercent === line.productDiscountPercent && item.customerDiscountPercent === line.customerDiscountPercent);
      return { items: match ? current.items.map(item => item.id === match.id ? { ...item, quantity: item.quantity + line.quantity } : item) : [...current.items, line] };
    });
    setScreen("products");
    notify("נוסף עוד מוצר זהה / המוצר נוסף לעגלה");
  }
  function recordPayment() {
    const due = roundMoney(cartTotal - paidTotal(activeCart));
    if (due <= 0) { notify("היתרה כבר הוסדרה"); return; }
    const entered = String(activeCart.received || "").trim();
    const amount = entered ? parsePrice(entered) : due;
    if (!Number.isFinite(amount) || amount <= 0) { notify("יש להזין סכום תקין"); return; }
    if (amount > due && activeCart.payment !== "מזומן") { notify("הסכום גדול מהיתרה"); return; }
    const credited = Math.min(amount, due);
    if (amount < due && !activeCart.customerName.trim()) { notify("לתשלום חלקי יש להזין שם לקוח"); return; }
    updateActiveCart(current => ({ payments: [...(current.payments || []), { id: Date.now(), amount: credited, method: current.payment, date: new Date().toISOString() }], received: "" }));
    logDemo(`תקבול ${formatMoney(credited)} · ${activeCart.name}${amount > due ? ` · עודף ${formatMoney(amount - due)}` : ""}`);
    if (credited === due) {
      const order = { id: `sale-${Date.now()}`, date: new Date().toISOString(), employee: displayEmployee, customerTypeId: activeCart.customerTypeId || "regular", customerTypeName: selectedCustomerType?.name || "לקוח רגיל", customerName: activeCart.customerName || "", customerPhone: activeCart.customerPhone || "", customerEmail: activeCart.customerEmail || "", payment: activeCart.payment, total: cartTotal, receivedTotal: roundMoney(paidTotal(activeCart) + credited), itemCount: cartCount, items: cart.map(item => ({ ...item, returnedQuantity: 0 })), returns: [] };
      setStock(prev => { const next = { ...prev }; cart.forEach(line => { if (line.productId in next) next[line.productId] -= line.quantity; }); return next; });
      setSalesHistory(prev => [order, ...prev]); setCompletedSale(order); setScreen("success");
    } else { setScreen("cart"); notify(`נרשם תשלום חלקי. יתרה: ${formatMoney(due - credited)}`); }
  }
  function recordRefund() {
    const excess = roundMoney(paidTotal(activeCart) - cartTotal);
    const amount = parsePrice(refundInput);
    if (!Number.isFinite(amount) || amount <= 0 || amount > excess) { notify("הזיני סכום החזר שבוצע בפועל, עד גובה העודף"); return; }
    updateActiveCart(current => ({ refunds: [...(current.refunds || []), { id: Date.now(), amount, date: new Date().toISOString() }] }));
    logDemo(`החזר עודף ${formatMoney(amount)} · ${activeCart.name}`);
    setRefundInput(""); setModal(null);
  }
  function finalizePaidCartCancellation() {
    const basket = carts.find(b => b.id === modal?.cartId);
    if (!basket) return;
    const remaining = roundMoney(paidTotal(basket));
    const amount = parsePrice(refundInput);
    if (remaining > 0 && (!Number.isFinite(amount) || amount !== remaining)) { notify(`כדי לסגור יש לתעד החזר שבוצע בפועל בסך ${formatMoney(remaining)}`); return; }
    logDemo(`ביטול ${basket.name} · החזר ${formatMoney(remaining)}`);
    setStandaloneCancellations(prev => [{ id: `cart-cancel-${Date.now()}`, date: new Date().toISOString(), employee: displayEmployee, items: basket.items, grossAmount: basketTotal(basket), refundAmount: remaining, method: basket.payment, status: "החזר תועד בפועל", source: "ביטול עגלה עם תקבול" }, ...prev]);
    setRefundInput(""); removeCartById(basket.id);
  }
  const demoSuppliers = [...new Set(demoCatalog.map(p => p.supplier))];
  const paidToday = salesHistory.reduce((n, order) => n + (order.receivedTotal ?? order.total), 0) + carts.reduce((n, b) => n + paidTotal(b), 0);
  const openCarts = carts.filter(b => paidTotal(b) > 0 && paidTotal(b) < basketTotal(b));
  const lowStockProducts = demoCatalog.filter(p => stockAvailable(p.id) <= 5);
  const dailySections = ["תקבולים", "עסקאות", "חובות פתוחים", "מלאי", "ספקים"];


  const activeCart =
    carts.find(cart => cart.id === activeCartId) || carts[0];

  const cart = activeCart?.items || [];

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const cartTotal = roundMoney(
    cart.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    )
  );

  const currentNode = findNode(path);

  const currentProducts = currentNode?.products || [];

  const currentEntries =
    path.length === 0
      ? catalog
      : (currentNode?.children || []);

  const displayEmployee =
    employee === "אחר" ? otherEmployee : employee;

  const allProducts = useMemo(
    () => collectProducts(catalog),
    []
  );

  const showNavigation = ![
    "employee",
    "success",
    "customerSelect"
  ].includes(screen);

  const selectedCustomerType =
    customerTypes.find(
      type => type.id === activeCart?.customerTypeId
    ) || customerTypes[0];

  const orderInView = salesHistory.find(
    order => order.id === selectedOrderId
  );

  const cancelTotal = roundMoney(
    cancelItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    )
  );

  const standaloneFeePercent =
    cancelRefundMethod === "credit" &&
    settings.creditCancellationFeeEnabled
      ? Number(settings.creditCancellationFeePercent || 0)
      : 0;

  const standaloneFeeAmount = roundMoney(
    cancelTotal * standaloneFeePercent / 100
  );

  const standaloneRefundAmount = roundMoney(
    cancelTotal - standaloneFeeAmount
  );

  const historyReturnGross = returnDraft
    ? roundMoney(returnDraft.unitPrice * returnQuantity)
    : 0;

  const historyReturnFeePercent =
    returnMethod === "credit" &&
    settings.creditCancellationFeeEnabled
      ? Number(settings.creditCancellationFeePercent || 0)
      : 0;

  const historyReturnFeeAmount = roundMoney(
    historyReturnGross * historyReturnFeePercent / 100
  );

  const historyReturnNetAmount = roundMoney(
    historyReturnGross - historyReturnFeeAmount
  );

  function updateActiveCart(updater) {
    setCarts(previous =>
      previous.map(item => {
        if (item.id !== activeCartId) {
          return item;
        }

        const changes =
          typeof updater === "function"
            ? updater(item)
            : updater;

        return {
          ...item,
          ...changes
        };
      })
    );
  }

  function notify(message) {
    setNotice(message);
  }

  function clearNotice() {
    setNotice("");
  }

  function startAfterEmployee() {
    if (!employee) {
      notify("נא לבחור מוכר");
      return;
    }

    if (employee === "אחר" && !otherEmployee.trim()) {
      notify("נא להזין שם מוכר");
      return;
    }

    clearNotice();

    setScreen(
      settings.customerRequired
        ? "customerSelect"
        : "categories"
    );
  }

  function applyCustomerType(typeId) {
    const type =
      customerTypes.find(item => item.id === typeId) ||
      customerTypes[0];

    const customerPercent = Number(
      type?.discountPercent || 0
    );

    setCarts(previous =>
      previous.map(cartItem => {
        if (cartItem.id !== activeCartId) {
          return cartItem;
        }

        const items = cartItem.items.map(line => {
          const discountsAllowed =
            !line.manualPrice || settings.manualPriceDiscounts;

          const productPercent = discountsAllowed
            ? Number(
                productDiscounts[line.productId] ??
                line.productDiscountPercent ??
                0
              )
            : 0;

          const clientPercent = discountsAllowed
            ? customerPercent
            : 0;

          let price = Number(
            line.basePrice ?? line.price
          );

          // קודם הנחת מוצר
          if (productPercent) {
            price *= (1 - productPercent / 100);
          }

          // אחר כך הנחת לקוח
          if (clientPercent) {
            price *= (1 - clientPercent / 100);
          }

          return {
            ...line,
            price: roundMoney(price),
            productDiscountPercent: productPercent,
            customerDiscountPercent: clientPercent
          };
        });

        return {
          ...cartItem,
          customerTypeId: typeId,
          customerTypeSelected: true,
          items
        };
      })
    );
  }

  function chooseCustomerType(typeId) {
    applyCustomerType(typeId);
    setScreen("categories");
    clearNotice();
  }

  function openCategory(item) {
    clearNotice();

    if (item.manualEntry) {
      setManualName("");
      setManualSupplier("");
      setManualProductPrice("");
      setManualProductQty(1);
      setScreen("manualProduct");
      return;
    }

    setPath(previous => [...previous, item.id]);

    if (item.products) {
      setScreen(
        flowMode === "cancel"
          ? "cancelProducts"
          : "products"
      );
    } else {
      setScreen(
        flowMode === "cancel"
          ? "cancelCategories"
          : "categories"
      );
    }
  }

  function openProduct(product) {
    setCurrentProduct(product);
    setSelectedPrice(product.defaultPriceId || "");
    setManualPrice("");
    setQuantity(product.defaultQty || 1);
    clearNotice();

    setScreen(
      flowMode === "cancel"
        ? "cancelProduct"
        : "product"
    );
  }

  function performNavigation(destination) {
    clearNotice();
    setFlowMode("sale");

    if (destination === "categories") {
      setPath([]);
    }

    setScreen(destination);
  }

  function navigateWithCart(destination) {
    // מעבר לקטגוריות לא מוחק עגלה ולא דורש אישור.
    if (
      destination === "categories" &&
      settings.customerRequired &&
      !activeCart?.customerTypeSelected
    ) {
      setScreen("customerSelect");
      return;
    }

    performNavigation(destination);
  }

  function back() {
    clearNotice();

    if (modal) {
      setModal(null);
      return;
    }

    if (screen === "product" || screen === "cancelProduct") {
      setScreen(flowMode === "cancel" ? "cancelProducts" : "products");
      return;
    }

    if (screen === "manualProduct") {
      setScreen(
        flowMode === "cancel"
          ? (path.length ? "cancelProducts" : "cancelCategories")
          : (path.length ? "products" : "categories")
      );
      return;
    }

    if (screen === "cancelReview") {
      setScreen("cancelProducts");
      return;
    }

    if (screen === "cancelComplete") {
      setScreen("cancelReview");
      return;
    }

    if (
      ["products", "cancelProducts", "categories", "cancelCategories"]
        .includes(screen)
    ) {
      if (path.length > 0) {
        const next = path.slice(0, -1);
        setPath(next);

        const parent = findNode(next);
        const hasProducts = Boolean(parent?.products);

        setScreen(
          flowMode === "cancel"
            ? (hasProducts ? "cancelProducts" : "cancelCategories")
            : (hasProducts ? "products" : "categories")
        );
      } else if (flowMode === "cancel") {
        setFlowMode("sale");
        setCancelItems([]);
        setScreen("cart");
      }

      return;
    }

    if (screen === "cart") {
      setFlowMode("sale");
      setScreen("categories");
      return;
    }

    if (screen === "checkout") {
      setScreen("cart");
      return;
    }

    if (screen === "historyDetail") {
      setScreen("history");
      return;
    }

    if (screen === "history") {
      setScreen("cart");
      return;
    }

    if (screen === "management") {
      setScreen("cart");
      return;
    }
  }

  function selectCart(id) {
    const chosen = carts.find(item => item.id === id);

    setActiveCartId(id);
    setFlowMode("sale");
    setPath([]);

    setScreen(
      settings.customerRequired &&
      chosen &&
      !chosen.customerTypeSelected &&
      chosen.items.length === 0
        ? "customerSelect"
        : "cart"
    );

    clearNotice();
    setModal(null);
  }

  function createNewCart() {
    const newId = Math.max(0, ...carts.map(item => item.id)) + 1;

    const newCart = makeCart(
      newId,
      settings.customerRequired
        ? ""
        : (customerTypes[0]?.id || "regular")
    );

    setCarts(previous => [...previous, newCart]);
    setActiveCartId(newId);
    setPath([]);
    setFlowMode("sale");
    setModal(null);
    clearNotice();

    setScreen(
      settings.customerRequired ? "customerSelect" : "categories"
    );
  }

  function removeCartById(cartId) {
    const targetIndex = carts.findIndex(item => item.id === cartId);

    if (targetIndex < 0) return;

    if (carts.length === 1) {
      setCarts([
        makeCart(
          carts[0].id,
          settings.customerRequired
            ? ""
            : (customerTypes[0]?.id || "regular")
        )
      ]);

      setActiveCartId(carts[0].id);

      setScreen(
        settings.customerRequired ? "customerSelect" : "categories"
      );

      setModal(null);
      return;
    }

    const remaining = carts.filter(item => item.id !== cartId);
    setCarts(remaining);

    if (activeCartId === cartId) {
      const nextIndex = Math.max(
        0,
        Math.min(targetIndex - 1, remaining.length - 1)
      );

      setActiveCartId(remaining[nextIndex].id);
      setScreen("cart");
    }

    setModal(null);
  }

  function requestRemoveCart(cartId) {
    const target = carts.find(item => item.id === cartId);

    if (!target) return;

    if (paidTotal(target) > 0) {
      setRefundInput("");
      setModal({ type: "paidCartCancellation", cartId, cartName: target.name });
      return;
    }

    if (target.items.length === 0) {
      removeCartById(cartId);
      return;
    }

    setModal({
      type: "removeCart",
      cartId,
      cartName: target.name,
      last: carts.length === 1
    });
  }

  function calculateFinalPrice(
    basePrice,
    productId,
    manual = false,
    includeCustomerDiscount = true
  ) {
    const discountsAllowed =
      !manual || settings.manualPriceDiscounts;

    const productDiscount = discountsAllowed
      ? Math.max(0, Number(productDiscounts[productId] || 0))
      : 0;

    // ביטול עצמאי אינו יורש את סוג הלקוח של העגלה המושהית.
    const customerDiscount =
      discountsAllowed && includeCustomerDiscount
        ? Math.max(
            0,
            Number(selectedCustomerType?.discountPercent || 0)
          )
        : 0;

    let afterProduct = basePrice;

    if (productDiscount) {
      afterProduct *= (1 - productDiscount / 100);
    }

    let afterCustomer = afterProduct;

    if (customerDiscount) {
      afterCustomer *= (1 - customerDiscount / 100);
    }

    return {
      price: roundMoney(afterCustomer),
      productDiscount,
      customerDiscount
    };
  }

  function buildLine(product, priceData, qty, manual = false) {
    const discounts = calculateFinalPrice(
      priceData.amount,
      product.id,
      manual,
      flowMode !== "cancel"
    );

    const categoryPath = manual
      ? "ללא קטגוריה"
      : getPathLabel(path);

    return {
      id: `${product.id}-${Date.now()}-${Math.random()
        .toString(16)
        .slice(2, 7)}`,
      productId: product.id,
      name: product.name,
      supplier: product.supplier || "ללא ספק",
      icon: product.icon || "📦",
      categoryPath,
      priceLabel: priceData.label,
      basePrice: priceData.amount,
      productDiscountPercent: discounts.productDiscount,
      customerDiscountPercent: discounts.customerDiscount,
      price: discounts.price,
      quantity: qty,
      manualPrice: manual
    };
  }

  function addCurrentProduct() {
    if (!currentProduct) return;

    let priceData;

    const isManualPrice = manualPrice.trim() !== "";

    if (isManualPrice) {
      const amount = parsePrice(manualPrice);

      if (!Number.isFinite(amount) || amount <= 0) {
        notify("יש להזין מחיר תקין");
        return;
      }

      priceData = {
        label: "מחיר ידני",
        amount
      };
    } else {
      priceData = currentProduct.prices.find(
        item => item.id === selectedPrice
      );
    }

    if (!priceData) {
      notify("נא לבחור מחיר");
      return;
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      notify("נא לבחור כמות תקינה");
      return;
    }

    const newLine = buildLine(
      currentProduct,
      priceData,
      quantity,
      isManualPrice
    );

    if (flowMode === "cancel") {
      setCancelItems(previous => {
        const match = previous.find(
          item =>
            item.productId === newLine.productId &&
            item.price === newLine.price &&
            item.supplier === newLine.supplier &&
            item.categoryPath === newLine.categoryPath
        );

        if (!match) {
          return [...previous, newLine];
        }

        return previous.map(item =>
          item.id === match.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      });

      setScreen("cancelReview");
      clearNotice();
      return;
    }

    const available = stockAvailable(newLine.productId);
    if (newLine.quantity > available) {
      setModal({ type: "stockOverride", line: newLine, available });
      return;
    }
    confirmAddProduct(newLine);
    clearNotice();
  }

  function addManualProduct() {
    if (!manualName.trim()) {
      notify("נא להזין שם מוצר");
      return;
    }

    const amount = parsePrice(manualProductPrice);

    if (!Number.isFinite(amount) || amount <= 0) {
      notify("נא להזין מחיר תקין");
      return;
    }

    if (!Number.isInteger(manualProductQty) || manualProductQty < 1) {
      notify("נא להזין כמות תקינה");
      return;
    }

    const product = {
      id: `manual-${Date.now()}`,
      name: manualName.trim(),
      supplier: manualSupplier.trim() || "ללא ספק",
      icon: "📦"
    };

    const line = buildLine(
      product,
      { label: "מחיר ידני", amount },
      manualProductQty,
      true
    );

    if (flowMode === "cancel") {
      setCancelItems(previous => [...previous, line]);
      setScreen("cancelReview");
    } else {
      updateActiveCart(current => ({
        items: [...current.items, line]
      }));

      setScreen(path.length ? "products" : "categories");
    }

    setManualName("");
    setManualSupplier("");
    setManualProductPrice("");
    setManualProductQty(1);
    clearNotice();
  }

  function openEdit(item) {
    setEditingItem(item);
    setEditPrice(String(item.price));
    setEditQuantity(item.quantity);
    clearNotice();
  }

  function saveEdit() {
    const price = parsePrice(editPrice);

    if (!Number.isFinite(price) || price <= 0) {
      notify("נא להזין מחיר תקין");
      return;
    }

    if (!Number.isInteger(editQuantity) || editQuantity < 1) {
      notify("נא להזין כמות תקינה");
      return;
    }

    updateActiveCart(current => {
      const updated = current.items.map(item =>
        item.id === editingItem.id
          ? {
              ...item,
              price,
              basePrice:
                price === editingItem.price
                  ? item.basePrice
                  : price,
              productDiscountPercent:
                price === editingItem.price
                  ? item.productDiscountPercent
                  : 0,
              customerDiscountPercent:
                price === editingItem.price
                  ? item.customerDiscountPercent
                  : 0,
              manualPrice:
                price === editingItem.price
                  ? item.manualPrice
                  : true,
              quantity: editQuantity,
              priceLabel:
                price === editingItem.price
                  ? editingItem.priceLabel
                  : "מחיר בעריכה"
            }
          : item
      );

      const edited = updated.find(
        item => item.id === editingItem.id
      );

      const others = updated.filter(
        item => item.id !== editingItem.id
      );

      const matching = others.find(
        item =>
          item.productId === edited.productId &&
          item.price === edited.price &&
          item.supplier === edited.supplier &&
          item.categoryPath === edited.categoryPath &&
          item.productDiscountPercent ===
            edited.productDiscountPercent &&
          item.customerDiscountPercent ===
            edited.customerDiscountPercent
      );

      if (!matching) {
        return { items: updated };
      }

      return {
        items: others.map(item =>
          item.id === matching.id
            ? {
                ...item,
                quantity: item.quantity + edited.quantity
              }
            : item
        )
      };
    });

    setEditingItem(null);
    clearNotice();
  }

  function finishSale() {
    if (!cart.length) return;
    recordPayment();
    return;

    if (
      activeCart.payment === "אשראי" &&
      !settings.creditEnabled
    ) {
      notify("אפשרות אשראי לא הופעלה בהגדרות המנהל");
      return;
    }

    if (
      settings.customerRequired &&
      !activeCart.customerTypeSelected
    ) {
      setScreen("customerSelect");
      return;
    }

    if (
      activeCart.payment === "מזומן" &&
      String(activeCart.received || "").trim() !== ""
    ) {
      const receivedAmount = parsePrice(activeCart.received);

      if (
        !Number.isFinite(receivedAmount) ||
        receivedAmount < cartTotal
      ) {
        notify(
          `עדיין חסרים ${formatMoney(
            cartTotal -
              (Number.isFinite(receivedAmount)
                ? receivedAmount
                : 0)
          )}`
        );
        return;
      }
    }

    const order = {
      id: `sale-${Date.now()}`,
      date: new Date().toISOString(),
      employee: displayEmployee,
      customerTypeId:
        activeCart.customerTypeId ||
        customerTypes[0]?.id ||
        "regular",
      customerTypeName:
        selectedCustomerType?.name || "לקוח רגיל",
      customerName: activeCart.customerName || "",
      customerPhone: activeCart.customerPhone || "",
      customerEmail: activeCart.customerEmail || "",
      payment: activeCart.payment,
      total: cartTotal,
      itemCount: cartCount,
      items: cart.map(item => ({
        ...item,
        returnedQuantity: 0
      })),
      returns: []
    };

    setSalesHistory(previous => [order, ...previous]);
    setCompletedSale(order);
    setScreen("success");
    clearNotice();
  }

  function newSale() {
    const newId =
      Math.max(0, ...carts.map(item => item.id)) + 1;

    const newCart = makeCart(
      newId,
      settings.customerRequired
        ? ""
        : (customerTypes[0]?.id || "regular")
    );

    setCarts(previous => [
      ...previous.filter(item => item.id !== activeCartId),
      newCart
    ]);

    setActiveCartId(newId);
    setPath([]);
    setFlowMode("sale");
    setCompletedSale(null);

    setScreen(
      settings.customerRequired
        ? "customerSelect"
        : "categories"
    );
  }

  function startStandaloneCancellation() {
    setFlowMode("cancel");
    setCancelItems([]);
    setPath([]);
    setCurrentProduct(null);
    setModal(null);
    clearNotice();
    setScreen("cancelCategories");
  }

  function finishCancelSelection() {
    if (!cancelItems.length) {
      notify("לא נבחרו מוצרים לביטול");
      return;
    }

    setCancelRefundMethod("cash");
    setScreen("cancelComplete");
  }

  function completeStandaloneCancellation() {
    if (!cancelItems.length) {
      return;
    }

    const gross = cancelTotal;

    const feePercent =
      cancelRefundMethod === "credit" &&
      settings.creditCancellationFeeEnabled
        ? Number(settings.creditCancellationFeePercent || 0)
        : 0;

    const fee = roundMoney(gross * feePercent / 100);

    const record = {
      id: `cancel-${Date.now()}`,
      date: new Date().toISOString(),
      employee: displayEmployee,
      items: cancelItems.map(item => ({ ...item })),
      grossAmount: gross,
      feePercent,
      feeAmount: fee,
      refundAmount: roundMoney(gross - fee),
      method: cancelRefundMethod,
      status:
        cancelRefundMethod === "cash"
          ? "הוחזר במזומן"
          : "ממתין לביצוע החזר אשראי",
      source: "ביטול עצמאי"
    };

    setStandaloneCancellations(previous => [
      record,
      ...previous
    ]);

    setCancelItems([]);
    setFlowMode("sale");
    setPath([]);
    setScreen("cart");
    clearNotice();
  }

  function openHistoryReturn(order, line) {
    const available =
      line.quantity - (line.returnedQuantity || 0);

    if (available <= 0) {
      notify("כל הכמות של המוצר כבר הוחזרה");
      return;
    }

    setReturnDraft({
      orderId: order.id,
      lineId: line.id,
      available,
      lineName: line.name,
      unitPrice: line.price
    });

    setReturnQuantity(1);
    setReturnMethod("cash");
    setModal({ type: "historyReturn" });
  }

  function completeHistoryReturn() {
    if (!returnDraft) {
      return;
    }

    if (
      !Number.isInteger(returnQuantity) ||
      returnQuantity < 1 ||
      returnQuantity > returnDraft.available
    ) {
      notify("נא לבחור כמות תקינה");
      return;
    }

    const gross = roundMoney(
      returnDraft.unitPrice * returnQuantity
    );

    const feePercent =
      returnMethod === "credit" &&
      settings.creditCancellationFeeEnabled
        ? Number(settings.creditCancellationFeePercent || 0)
        : 0;

    const fee = roundMoney(
      gross * feePercent / 100
    );

    const record = {
      id: `return-${Date.now()}`,
      date: new Date().toISOString(),
      lineId: returnDraft.lineId,
      productName: returnDraft.lineName,
      quantity: returnQuantity,
      grossAmount: gross,
      feePercent,
      feeAmount: fee,
      refundAmount: roundMoney(gross - fee),
      method: returnMethod,
      status:
        returnMethod === "cash"
          ? "הוחזר במזומן"
          : "ממתין לביצוע החזר אשראי"
    };

    setSalesHistory(previous =>
      previous.map(order => {
        if (order.id !== returnDraft.orderId) {
          return order;
        }

        return {
          ...order,
          items: order.items.map(item =>
            item.id === returnDraft.lineId
              ? {
                  ...item,
                  returnedQuantity:
                    (item.returnedQuantity || 0) +
                    returnQuantity
                }
              : item
          ),
          returns: [
            ...(order.returns || []),
            record
          ]
        };
      })
    );

    setModal(null);
    setReturnDraft(null);
    clearNotice();
  }

  function addCustomerType() {
    const name = newCustomerTypeName.trim();
    const discount = parsePrice(
      newCustomerTypeDiscount
    );

    if (!name) {
      notify("יש להזין שם לסוג הלקוח");
      return;
    }

    if (
      !Number.isFinite(discount) ||
      discount < 0 ||
      discount > 100
    ) {
      notify("אחוז ההנחה חייב להיות בין 0 ל־100");
      return;
    }

    const id = `customer-${Date.now()}`;

    setCustomerTypes(previous => [
      ...previous,
      {
        id,
        name,
        discountPercent: discount
      }
    ]);

    setNewCustomerTypeName("");
    setNewCustomerTypeDiscount("0");
    clearNotice();
  }

  function updateCustomerType(typeId, changes) {
    setCustomerTypes(previous =>
      previous.map(type =>
        type.id === typeId
          ? { ...type, ...changes }
          : type
      )
    );
  }

  function updateProductDiscount(productId, value) {
    const parsed = parsePrice(value);

    if (!Number.isFinite(parsed)) {
      return;
    }

    setProductDiscounts(previous => ({
      ...previous,
      [productId]: Math.min(
        100,
        Math.max(0, parsed)
      )
    }));
  }

  function filteredHistory() {
    const term = historySearch
      .trim()
      .toLowerCase();

    return [...salesHistory]
      .filter(order => {
        if (!term) {
          return true;
        }

        const values = {
          all: `${order.customerName} ${order.customerPhone} ${order.customerEmail}`,
          name: order.customerName,
          phone: order.customerPhone,
          email: order.customerEmail
        };

        return String(
          values[historySearchField] || ""
        )
          .toLowerCase()
          .includes(term);
      })
      .sort(
        (a, b) =>
          new Date(b.date) - new Date(a.date)
      );
  }

  function goToOrder(order) {
    setSelectedOrderId(order.id);
    setScreen("historyDetail");
    clearNotice();
  }

  function openMore() {
    setModal({ type: "more" });
  }

  function optionAction(action) {
    setModal(null);
    clearNotice();

    if (action === "history") {
      setFlowMode("sale");
      setHistorySearch("");
      setScreen("history");
    }

    if (action === "cancel") {
      startStandaloneCancellation();
    }

    if (action === "management") {
      setFlowMode("sale");
      setManageSection("");
      setScreen("management");
    }

    if (action === "customer") {
      setModal({ type: "chooseCustomer" });
    }
  }

  function updateSetting(key, value) {
    setSettings(previous => ({
      ...previous,
      [key]: value
    }));

    if (
      key === "customerRequired" &&
      value
    ) {
      setCarts(previous =>
        previous.map(cartItem =>
          cartItem.items.length === 0
            ? {
                ...cartItem,
                customerTypeId: "",
                customerTypeSelected: false
              }
            : cartItem
        )
      );
    }

    if (
      key === "creditEnabled" &&
      !value
    ) {
      setCarts(previous =>
        previous.map(cartItem =>
          cartItem.payment === "אשראי"
            ? {
                ...cartItem,
                payment: "מזומן",
                received: ""
              }
            : cartItem
        )
      );
    }
  }

  useEffect(() => {
    if (screen !== "success" || !completedSale) return undefined;
    const timer = window.setTimeout(() => newSale(), 4000);
    return () => window.clearTimeout(timer);
  }, [screen, completedSale]);

  useEffect(() => {
    const container = cartTabsRef.current;
    if (!container) return;

    const activeTab = container.querySelector(
      `[data-cart-id="${activeCartId}"]`
    );

    activeTab?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest"
    });
  }, [activeCartId, carts.length]);

  const refundFeeNote = settings.creditCancellationFeeEnabled
    ? `ניכוי דמי ביטול באשראי: ${Number(
        settings.creditCancellationFeePercent || 0
      )}%`
    : "ללא ניכוי דמי ביטול באשראי";

  return (
    <div className="app" dir="rtl">
      <header className="topbar">
        <div className="brand">
          <span className="brand-icon">🧁</span>
          <div>
            <strong>קופה</strong>
          </div>
        </div>
      </header>

      <main className="main-content">
        {screen === "employee" && (
          <section className="screen employee-screen">
            <div className="screen-heading">
              <span className="big-icon">👤</span>
              <h1>כניסת עובד</h1>
              <p>בחרי את המוכר שיבצע את המכירות</p>
            </div>

            <div className="employee-list">
              {employees.map(name => (
                <button
                  key={name}
                  className={`large-option ${
                    employee === name ? "selected" : ""
                  }`}
                  onClick={() => setEmployee(name)}
                >
                  {name}
                </button>
              ))}

              <button
                className={`large-option ${
                  employee === "אחר" ? "selected" : ""
                }`}
                onClick={() => setEmployee("אחר")}
              >
                מוכר אחר
              </button>
            </div>

            {employee === "אחר" && (
              <input
                className="text-input"
                value={otherEmployee}
                onChange={event =>
                  setOtherEmployee(event.target.value)
                }
                placeholder="הקלדת שם המוכר"
              />
            )}

            {notice && (
              <div className="error-message">{notice}</div>
            )}

            <button
              className="primary-button"
              onClick={startAfterEmployee}
            >
              כניסה למערכת המכירות
            </button>
          </section>
        )}

        {screen === "customerSelect" && (
          <section className="screen employee-screen">
            <div className="screen-heading">
              <span className="big-icon">👥</span>
              <h1>בחירת סוג לקוח</h1>
              <p>בחירה נדרשת לפני תחילת המכירה</p>
            </div>

            <div className="employee-list">
              {customerTypes.map(type => (
                <button
                  key={type.id}
                  className="large-option"
                  onClick={() => chooseCustomerType(type.id)}
                >
                  {type.name}
                  {type.discountPercent > 0
                    ? ` · ${type.discountPercent}% הנחה`
                    : ""}
                </button>
              ))}
            </div>

            {notice && (
              <div className="error-message">{notice}</div>
            )}
          </section>
        )}

        {(screen === "categories" ||
          screen === "cancelCategories") && (
          <section className="screen">
            <div className="screen-heading">
              <span className="eyebrow">
                {flowMode === "cancel"
                  ? "מסלול ביטול מוצר"
                  : "מכירה"}
              </span>
              <h1>
                {currentNode?.name ||
                  (flowMode === "cancel"
                    ? "בחירת קטגוריה לביטול"
                    : "בחירת קטגוריה")}
              </h1>
              <p>
                {path.length
                  ? "בחרי קטגוריה להמשך"
                  : "בחרי קטגוריה להתחלת הפעולה"}
              </p>
            </div>

            <div className="path-strip">
              <button onClick={() => setPath([])}>
                קטגוריות
              </button>
              {path.map((id, index) => (
                <span className="path-part" key={id}>
                  ‹ {findNode(path.slice(0, index + 1))?.name}
                </span>
              ))}
            </div>

            <div className="category-list">
              {currentEntries.map(item => (
                <button
                  key={item.id}
                  className="category-button"
                  onClick={() => openCategory(item)}
                >
                  <span className="category-icon">
                    {item.icon || "📁"}
                  </span>
                  <span>{item.name}</span>
                  <span className="chevron">‹</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {screen === "categories" && (
          <section className="screen demo-search-zone">
            <input className="text-input demo-search" value={productSearch} onChange={e => setProductSearch(e.target.value)} placeholder="🔎 חיפוש מוצר מכל הקטלוג" aria-label="חיפוש מוצר מכל הקטלוג" />
            {productSearch.trim() && <div className="product-list">{allProducts.filter(p => p.name.includes(productSearch.trim()) || p.supplier.includes(productSearch.trim())).map(p => <button key={p.id} className="product-button" onClick={() => openProduct(p)}><span className="product-symbol">📦</span><span className="product-info"><strong>{p.name}</strong><small>{p.supplier}</small></span></button>)}</div>}
          </section>
        )}

        {(screen === "products" ||
          screen === "cancelProducts") && (
          <section className="screen">
            <div className="screen-heading">
              <span className="eyebrow">
                {flowMode === "cancel"
                  ? "בחירת מוצר לביטול"
                  : "בחירת מוצר"}
              </span>
              <h1>{currentNode?.name || "מוצרים"}</h1>
              <p>
                {flowMode === "cancel"
                  ? "בחרי את המוצר והכמות להחזרה"
                  : "לחצי על מוצר לבחירת מחיר וכמות"}
              </p>
            </div>

            <div className="path-strip">
              <button
                onClick={() => {
                  setPath([]);
                  setScreen(
                    flowMode === "cancel"
                      ? "cancelCategories"
                      : "categories"
                  );
                }}
              >
                קטגוריות
              </button>
              {path.map((id, index) => (
                <span className="path-part" key={id}>
                  ‹ {findNode(path.slice(0, index + 1))?.name}
                </span>
              ))}
            </div>

            <input className="text-input demo-search" value={productSearch} onChange={e => setProductSearch(e.target.value)} placeholder="🔎 חיפוש מוצר קבוע" aria-label="חיפוש מוצר" />
            <div className="product-list">
              {(productSearch.trim() ? allProducts.filter(product => product.name.includes(productSearch.trim()) || product.supplier.includes(productSearch.trim())) : currentProducts).map(product => (
                <button
                  key={product.id}
                  className="product-button"
                  onClick={() => openProduct(product)}
                >
                  <span className="product-symbol">📦</span>
                  <span className="product-info">
                    <strong>{product.name}</strong>
                    <small>{product.supplier}</small>
                  </span>
                  <span className="chevron">‹</span>
                </button>
              ))}
            </div>

            <button
              className="secondary-button"
              onClick={() => {
                setManualName("");
                setManualSupplier("");
                setManualProductPrice("");
                setManualProductQty(1);
                setScreen("manualProduct");
              }}
            >
              ＋ מוצר ידני
            </button>

            {flowMode === "cancel" && (
              <button
                className="text-button"
                onClick={() => setScreen("cancelReview")}
              >
                מעבר לרשימת הביטולים ({cancelItems.length})
              </button>
            )}
          </section>
        )}

        {(screen === "product" ||
          screen === "cancelProduct") &&
          currentProduct && (
            <section className="screen product-detail-screen">
              <div className="screen-heading compact-heading">
                <span className="big-icon">📦</span>
                <h1>{currentProduct.name}</h1>
                <p>{currentProduct.supplier}</p>
                <small className="category-path-label">
                  קטגוריה: {getPathLabel(path)}
                </small>
              </div>

              <h2 className="section-title">בחירת מחיר</h2>

              <div className="price-options">
                {currentProduct.prices.map(price => (
                  <button
                    key={price.id}
                    className={`price-option ${
                      selectedPrice === price.id && !manualPrice
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedPrice(price.id);
                      setManualPrice("");
                      clearNotice();
                    }}
                  >
                    <span>{price.label}</span>
                    <strong>{formatMoney(price.amount)}</strong>
                    {currentProduct.defaultPriceId === price.id && (
                      <small>ברירת מחדל</small>
                    )}
                  </button>
                ))}
              </div>

              <div className="manual-price-box">
                <label>מחיר אחר – הקלדה ידנית</label>
                <input
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  className="text-input money-input"
                  placeholder="הקלדת מחיר"
                  value={manualPrice}
                  onChange={event => {
                    setManualPrice(event.target.value);
                    setSelectedPrice("");
                    clearNotice();
                  }}
                />
              </div>

              <h2 className="section-title">כמות</h2>

              <div className="quantity-control">
                <button
                  onClick={() =>
                    setQuantity(old => Math.max(1, old - 1))
                  }
                  aria-label="הפחתת כמות"
                >
                  −
                </button>
                <strong>{quantity}</strong>
                <button
                  onClick={() => setQuantity(old => old + 1)}
                  aria-label="הגדלת כמות"
                >
                  +
                </button>
              </div>

              {notice && (
                <div className="error-message">{notice}</div>
              )}

              <button
                className={`primary-button add-to-cart-button ${
                  flowMode === "cancel"
                    ? "cancel-action-button"
                    : ""
                }`}
                onClick={addCurrentProduct}
              >
                {flowMode === "cancel"
                  ? "＋ הוספה לרשימת הביטול"
                  : "＋ הוספה לעגלה"}
              </button>
            </section>
          )}

        {screen === "manualProduct" && (
          <section className="screen">
            <div className="screen-heading compact-heading">
              <h1>מוצר ידני</h1>
              <p>מוצר שאינו קיים בקטלוג</p>
            </div>

            <label className="field-label">שם המוצר *</label>
            <input
              className="text-input"
              value={manualName}
              onChange={event =>
                setManualName(event.target.value)
              }
              placeholder="שם המוצר"
            />

            <label className="field-label">שם הספק</label>
            <input
              className="text-input"
              value={manualSupplier}
              onChange={event =>
                setManualSupplier(event.target.value)
              }
              placeholder="שם הספק (לא חובה)"
            />

            <label className="field-label">מחיר *</label>
            <input
              type="text"
              inputMode="decimal"
              autoComplete="off"
              className="text-input money-input"
              value={manualProductPrice}
              onChange={event =>
                setManualProductPrice(event.target.value)
              }
              placeholder="הקלדת מחיר"
            />

            <label className="field-label">כמות *</label>
            <div className="quantity-control">
              <button
                onClick={() =>
                  setManualProductQty(old =>
                    Math.max(1, old - 1)
                  )
                }
              >
                −
              </button>
              <strong>{manualProductQty}</strong>
              <button
                onClick={() =>
                  setManualProductQty(old => old + 1)
                }
              >
                +
              </button>
            </div>

            {notice && (
              <div className="error-message">{notice}</div>
            )}

            <button
              className="primary-button"
              onClick={addManualProduct}
            >
              {flowMode === "cancel"
                ? "הוספה לרשימת הביטול"
                : "＋ הוספה לעגלה"}
            </button>
          </section>
        )}

        {screen === "cancelReview" && (
          <section className="screen">
            <div className="screen-heading">
              <span className="eyebrow">ביטול עצמאי</span>
              <h1>בדיקת המוצרים לביטול</h1>
              <p>
                העגלה הנוכחית נשארת בהשהיה ולא משתנה
              </p>
            </div>

            {cancelItems.length === 0 ? (
              <div className="empty-state">
                <span>↩️</span>
                <h2>לא נבחרו מוצרים</h2>
                <p>
                  חזרי לקטגוריות כדי לבחור מוצר לביטול
                </p>
              </div>
            ) : (
              <div className="cart-list">
                {cancelItems.map(item => (
                  <div className="cart-item" key={item.id}>
                    <div className="cart-item-details">
                      <strong>{item.name}</strong>
                      <small>
                        {item.supplier} · {item.categoryPath}
                      </small>
                      <small>
                        {item.quantity} ×{" "}
                        {formatMoney(item.price)}
                      </small>
                      <b className="line-total">
                        {formatMoney(
                          item.quantity * item.price
                        )}
                      </b>
                    </div>
                    <div className="cart-actions">
                      <button
                        aria-label="הסר מרשימת הביטול"
                        onClick={() =>
                          setCancelItems(previous =>
                            previous.filter(
                              line => line.id !== item.id
                            )
                          )
                        }
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="checkout-total compact-total">
              <span>סכום להחזרה</span>
              <strong>{formatMoney(cancelTotal)}</strong>
            </div>

            {notice && (
              <div className="error-message">{notice}</div>
            )}

            <button
              className="secondary-button"
              onClick={() => {
                setPath([]);
                setScreen("cancelCategories");
              }}
            >
              ＋ ביטול מוצר נוסף
            </button>

            <button
              className="primary-button cancel-action-button"
              disabled={!cancelItems.length}
              onClick={finishCancelSelection}
            >
              אישור וסיום בחירת מוצרים לביטול
            </button>

            <button
              className="text-button"
              onClick={() => {
                setFlowMode("sale");
                setCancelItems([]);
                setPath([]);
                setScreen("cart");
              }}
            >
              חזרה למכירה בעגלה הנוכחית
            </button>
          </section>
        )}

        {screen === "cancelComplete" && (
          <section className="screen">
            <div className="screen-heading">
              <span className="big-icon">↩️</span>
              <h1>סיום ביטול מוצרים</h1>
              <p>
                בדקי את הסכום והגדירי כיצד הוחזר הכסף
              </p>
            </div>

            <div className="checkout-total">
              <span>סכום להחזרה</span>
              <strong>{formatMoney(cancelTotal)}</strong>
              <small>
                {cancelItems.reduce(
                  (sum, item) => sum + item.quantity,
                  0
                )}{" "}
                יחידות
              </small>
            </div>

            <div className="payment-options">
              <button
                className={`payment-button ${
                  cancelRefundMethod === "cash"
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  setCancelRefundMethod("cash")
                }
              >
                💵 החזרה במזומן
              </button>
              <button
                className={`payment-button ${
                  cancelRefundMethod === "credit"
                    ? "selected"
                    : ""
                }`}
                disabled={!settings.creditEnabled}
                onClick={() =>
                  setCancelRefundMethod("credit")
                }
              >
                💳 החזרה באשראי
              </button>
            </div>

            {cancelRefundMethod === "credit" && (
              <div className="info-message">
                {refundFeeNote}. סכום הניכוי:{" "}
                {formatMoney(standaloneFeeAmount)} ·
                סכום ההחזר:{" "}
                {formatMoney(standaloneRefundAmount)}.
                ההחזר יירשם כממתין לביצוע עד לחיבור
                ספק סליקה.
              </div>
            )}

            {notice && (
              <div className="error-message">{notice}</div>
            )}

            <button
              className="primary-button"
              onClick={completeStandaloneCancellation}
            >
              אישור הביטול וחזרה לעגלה
            </button>

            <button
              className="text-button"
              onClick={() => setScreen("cancelReview")}
            >
              חזרה לרשימת המוצרים
            </button>
          </section>
        )}

        {screen === "cart" && (
          <section className="screen">
            <div className="screen-heading compact-heading">
              <h1>{activeCart?.name || "עגלה"}</h1>
              <p>
                {cartCount} יחידות בעגלה ·{" "}
                {selectedCustomerType?.name ||
                  "לקוח רגיל"}
              </p>
            </div>

            <div className="cart-sticky-actions">
              <div className="checkout-total compact-total">
                <span>סכום העגלה</span>
                <strong>{formatMoney(cartTotal)}</strong>
              </div>
              <button
                className="primary-button"
                disabled={!cart.length}
                onClick={() => setScreen("checkout")}
              >
                מעבר לתשלום
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-state">
                <span>🛒</span>
                <h2>העגלה ריקה</h2>
                <p>
                  בחרי מוצרים כדי להתחיל עסקה
                </p>
                <button
                  className="secondary-button"
                  onClick={() =>
                    navigateWithCart("categories")
                  }
                >
                  מעבר לקטגוריות
                </button>
              </div>
            ) : (
              <div className="cart-list">
                {cart.map(item => (
                  <div className="cart-item" key={item.id}>
                    <div className="cart-item-details">
                      <strong>{item.name}</strong>
                      <small>
                        {item.supplier} · {item.priceLabel}
                      </small>
                      <small className="cart-category-label">
                        קטגוריה:{" "}
                        {item.categoryPath || "ללא קטגוריה"}
                      </small>
                      {(item.productDiscountPercent > 0 ||
                        item.customerDiscountPercent > 0) && (
                        <small>
                          הנחת מוצר{" "}
                          {item.productDiscountPercent || 0}% ·
                          הנחת לקוח{" "}
                          {item.customerDiscountPercent || 0}%
                        </small>
                      )}
                      <small>
                        {item.quantity} ×{" "}
                        {formatMoney(item.price)}
                      </small>
                      <b className="line-total">
                        {formatMoney(
                          item.quantity * item.price
                        )}
                      </b>
                    </div>

                    <div className="cart-actions">
                      <button
                        aria-label="עריכת מוצר"
                        onClick={() => openEdit(item)}
                      >
                        ✎
                      </button>
                      <button
                        className="delete-button"
                        aria-label="מחיקת מוצר"
                        onClick={() => deleteCartLine(item)}
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {undoLine?.cartId === activeCartId && (
              <button className="secondary-button" onClick={restoreCartLine}>↶ בטל הסרת מוצר</button>
            )}
            {paidTotal(activeCart) > 0 && (
              <div className="demo-balance-panel">
                <strong>התקבל בפועל: {formatMoney(paidTotal(activeCart))}</strong>
                <span>יתרה לתשלום: {formatMoney(Math.max(0, cartTotal - paidTotal(activeCart)))}</span>
                {paidTotal(activeCart) > cartTotal && <button className="secondary-button" onClick={() => { setRefundInput(""); setModal({ type: "excessRefund" }); }}>החזר עודף: {formatMoney(paidTotal(activeCart) - cartTotal)}</button>}
              </div>
            )}
            {notice && (<div className="error-message">{notice}</div>)}
          </section>
        )}

        {screen === "checkout" && (
          <section className="screen checkout-screen">
            <div className="screen-heading compact-heading">
              <h1>סיום מכירה</h1>
              <p>
                {selectedCustomerType?.name ||
                  "לקוח רגיל"}
              </p>
            </div>

            <div className="checkout-sticky-actions">
              <div className="checkout-total">
                <span>יתרה לתשלום</span>
                <strong>{formatMoney(Math.max(0, cartTotal - paidTotal(activeCart)))}</strong>
                <small>{cartCount} יחידות</small>
              </div>

              <button
                className="primary-button finish-sale-button"
                disabled={
                  !cart.length ||
                  (settings.customerRequired &&
                    !activeCart?.customerTypeSelected)
                }
                onClick={finishSale}
              >
                ✓ רישום תקבול / סיום
              </button>
            </div>

            <div
              className="checkout-action-row"
              role="group"
              aria-label="בחירת אמצעי תשלום"
            >
              <button
                className={`payment-button ${
                  activeCart?.payment === "מזומן"
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  updateActiveCart({
                    payment: "מזומן",
                    received: ""
                  })
                }
              >
                💵 מזומן
              </button>

              <button
                className={`payment-button ${
                  activeCart?.payment === "אשראי"
                    ? "selected"
                    : ""
                }`}
                disabled={!settings.creditEnabled}
                onClick={() =>
                  updateActiveCart({
                    payment: "אשראי",
                    received: ""
                  })
                }
              >
                💳 אשראי
              </button>
            </div>

            {activeCart?.payment === "מזומן" && (
              <div
                className={`received-row ${
                  String(activeCart?.received || "").trim() !== "" &&
                  Number.isFinite(
                    parsePrice(activeCart.received)
                  )
                    ? "has-change"
                    : ""
                }`}
              >
                <label className="received-input-box">
                  <span>
                    התקבל מהלקוח{" "}
                    <small>לא חובה</small>
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    className="text-input money-input"
                    value={activeCart?.received || ""}
                    onChange={event =>
                      updateActiveCart({
                        received: event.target.value
                      })
                    }
                    placeholder="סכום שהתקבל"
                  />
                </label>

                {String(
                  activeCart?.received || ""
                ).trim() !== "" &&
                  Number.isFinite(
                    parsePrice(activeCart.received)
                  ) && (
                    <div
                      className={`change-message ${
                        parsePrice(activeCart.received) >=
                        Math.max(0, cartTotal - paidTotal(activeCart))
                          ? "change-positive"
                          : "change-negative"
                      }`}
                    >
                      {parsePrice(activeCart.received) >=
                      Math.max(0, cartTotal - paidTotal(activeCart))
                        ? `עודף: ${formatMoney(
                            parsePrice(
                              activeCart.received
                            ) - Math.max(0, cartTotal - paidTotal(activeCart))
                          )}`
                        : `חסר: ${formatMoney(
                            Math.max(0, cartTotal - paidTotal(activeCart)) -
                              parsePrice(
                                activeCart.received
                              )
                          )}`}
                    </div>
                  )}
              </div>
            )}

            <div className="demo-balance-panel">
              <strong>סכום העסקה: {formatMoney(cartTotal)}</strong>
              <span>התקבל עד כה: {formatMoney(paidTotal(activeCart))}</span>
              <span>יתרה: {formatMoney(Math.max(0, cartTotal - paidTotal(activeCart)))}</span>
              <button className="text-button" onClick={() => setSplitOpen(v => !v)}>{splitOpen ? "הסתרת הסבר פיצול" : "＋ פיצול תשלום"}</button>
              {splitOpen && <small>להדגמה: הזיני סכום חלקי, רשמי תקבול ובחרי אמצעי נוסף להשלמת היתרה. אין סליקה אמיתית.</small>}
              <small>בתשלום חלקי חובה למלא שם לקוח לפני אישור.</small>
            </div>
            <details className="customer-details" open={paidTotal(activeCart) > 0 ? true : undefined}>
              <summary>פרטי לקוח – לא חובה</summary>

              <label className="field-label">
                שם הלקוח
              </label>
              <input
                className="text-input"
                value={activeCart?.customerName || ""}
                onChange={event =>
                  updateActiveCart({
                    customerName: event.target.value
                  })
                }
                placeholder="שם הלקוח"
              />

              <label className="field-label">
                טלפון
              </label>
              <input
                className="text-input"
                type="tel"
                inputMode="tel"
                value={activeCart?.customerPhone || ""}
                onChange={event =>
                  updateActiveCart({
                    customerPhone: event.target.value
                  })
                }
                placeholder="טלפון"
              />

              <label className="field-label">
                מייל
              </label>
              <input
                className="text-input"
                type="email"
                value={activeCart?.customerEmail || ""}
                onChange={event =>
                  updateActiveCart({
                    customerEmail: event.target.value
                  })
                }
                placeholder="מייל"
              />
            </details>

            {notice && (
              <div className="error-message">{notice}</div>
            )}

            {activeCart?.payment === "אשראי" && (
              <div className="info-message">
                אשראי מסומן להדגמה בלבד.
                אין כאן סליקה אמיתית.
              </div>
            )}
          </section>
        )}

        {screen === "success" && completedSale && (
          <section className="screen success-screen">
            <div className="success-icon">✓</div>
            <h1>המכירה הסתיימה!</h1>
            <p>מוכר: {completedSale.employee}</p>

            <div className="checkout-total">
              <span>סכום העסקה</span>
              <strong>{formatMoney(completedSale.total)}</strong>
              <small>
                {completedSale.customerName ||
                  completedSale.customerTypeName}
              </small>
            </div>

            <button className="primary-button" onClick={newSale}>
              התחלת מכירה חדשה
            </button>
          </section>
        )}

        {screen === "history" && (
          <section className="screen">
            <div className="screen-heading">
              <span className="eyebrow">אפשרויות נוספות</span>
              <h1>היסטוריית הזמנות</h1>
              <p>ההזמנה האחרונה מופיעה ראשונה</p>
            </div>

            <div className="history-search-row">
              <select
                className="text-input history-search-select"
                value={historySearchField}
                onChange={event =>
                  setHistorySearchField(event.target.value)
                }
              >
                <option value="all">כל הפרטים</option>
                <option value="name">שם</option>
                <option value="phone">טלפון</option>
                <option value="email">מייל</option>
              </select>

              <input
                className="text-input"
                value={historySearch}
                onChange={event =>
                  setHistorySearch(event.target.value)
                }
                placeholder="הקלדת שם, טלפון או מייל"
              />
            </div>

            {filteredHistory().length === 0 ? (
              <div className="empty-state">
                <span>🧾</span>
                <h2>
                  {salesHistory.length
                    ? "לא נמצאו הזמנות"
                    : "אין עדיין היסטוריית הזמנות"}
                </h2>
                <p>
                  {salesHistory.length
                    ? "נסי מילת חיפוש אחרת"
                    : "עסקאות שהושלמו יופיעו כאן עד לרענון הדף"}
                </p>
              </div>
            ) : (
              <div className="history-list">
                {filteredHistory().map(order => (
                  <button
                    className="history-order-card"
                    key={order.id}
                    onClick={() => goToOrder(order)}
                  >
                    <span className="history-order-heading">
                      <strong>
                        {order.customerName ||
                          order.customerTypeName ||
                          "לקוח אנונימי"}
                      </strong>
                      <small>
                        {new Date(order.date).toLocaleString("he-IL")}
                      </small>
                    </span>

                    <span className="history-order-meta">
                      {order.customerPhone || "ללא טלפון"} ·{" "}
                      {order.customerEmail || "ללא מייל"}
                    </span>

                    <span className="history-order-bottom">
                      <small>
                        {order.items.reduce(
                          (sum, item) => sum + item.quantity,
                          0
                        )}{" "}
                        יחידות · {order.payment}
                      </small>
                      <b>{formatMoney(order.total)}</b>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {screen === "historyDetail" && orderInView && (
          <section className="screen">
            <div className="screen-heading">
              <span className="eyebrow">פרטי הזמנה</span>
              <h1>
                {orderInView.customerName ||
                  orderInView.customerTypeName ||
                  "לקוח אנונימי"}
              </h1>
              <p>
                {new Date(orderInView.date).toLocaleString("he-IL")} ·
                מוכר: {orderInView.employee}
              </p>
            </div>

            <div className="order-customer-info">
              <span>
                טלפון: {orderInView.customerPhone || "לא הוזן"}
              </span>
              <span>
                מייל: {orderInView.customerEmail || "לא הוזן"}
              </span>
              <span>
                סוג לקוח: {orderInView.customerTypeName}
              </span>
              <span>תשלום: {orderInView.payment}</span>
            </div>

            <div className="cart-list">
              {orderInView.items.map(item => {
                const available =
                  item.quantity - (item.returnedQuantity || 0);

                return (
                  <div className="cart-item" key={item.id}>
                    <div className="cart-item-details">
                      <strong>{item.name}</strong>
                      <small>
                        {item.supplier} · {item.categoryPath}
                      </small>
                      <small>
                        {item.quantity} × {formatMoney(item.price)}
                      </small>
                      <b className="line-total">
                        {formatMoney(item.quantity * item.price)}
                      </b>
                      <small>
                        הוחזרו {item.returnedQuantity || 0} ·
                        נותרו {available}
                      </small>
                    </div>

                    <button
                      className="small-return-button"
                      disabled={available <= 0}
                      onClick={() =>
                        openHistoryReturn(orderInView, item)
                      }
                    >
                      החזרת פריט
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="checkout-total compact-total">
              <span>סכום הזמנה מקורי</span>
              <strong>{formatMoney(orderInView.total)}</strong>
            </div>

            {(orderInView.returns || []).length > 0 && (
              <div className="change-message">
                סך ההחזרים שתועדו:{" "}
                {formatMoney(
                  orderInView.returns.reduce(
                    (sum, item) => sum + item.refundAmount,
                    0
                  )
                )}
              </div>
            )}

            {(orderInView.returns || []).length > 0 && (
              <div className="return-history-block">
                <h2 className="section-title">
                  החזרים שבוצעו
                </h2>

                {orderInView.returns.map(item => (
                  <div
                    className="return-history-row"
                    key={item.id}
                  >
                    <span>
                      {item.productName} · {item.quantity} יח׳
                    </span>
                    <strong>
                      {formatMoney(item.refundAmount)}
                    </strong>
                    <small>
                      {item.feeAmount > 0
                        ? `ניכוי ${item.feePercent}%: ${formatMoney(
                            item.feeAmount
                          )} · `
                        : ""}
                      {item.status} ·{" "}
                      {new Date(item.date).toLocaleString("he-IL")}
                    </small>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {screen === "management" && (
          <section className="screen">
            {!manageSection ? (
              <>
                <div className="screen-heading"><span className="eyebrow">ניהול · תצוגת הדגמה</span><h1>מרכז ניהול החנות</h1><p>תמונת מצב ופעולות ניהול — נתונים מקומיים לדוגמה בלבד</p></div>
                <div className="demo-kpis">
                  <div><small>תקבולים שנרשמו</small><strong>{formatMoney(paidToday)}</strong></div>
                  <div><small>מכירות שהושלמו</small><strong>{salesHistory.length}</strong></div>
                  <div><small>עגלות עם יתרה פתוחה</small><strong>{openCarts.length}</strong></div>
                  <div><small>פריטים במלאי נמוך</small><strong>{lowStockProducts.length}</strong></div>
                </div>
                <div className="demo-admin-grid">
                  {[["📊", "לוח בקרה", "dashboard"], ["📦", "מוצרים ומלאי", "inventory"], ["🚚", "ספקים והתחשבנות", "suppliers"], ["💳", "תשלומים וחובות", "payments"], ["📋", "סיכום יום", "daily"], ["🕒", "יומן פעולות", "audit"]].map(([icon, label, id]) => <button key={id} className="demo-admin-tile" onClick={() => setManageSection(id)}><span>{icon}</span><strong>{label}</strong><small>פתיחה ‹</small></button>)}
                </div>

                <button
                  className="category-button"
                  onClick={() => setManageSection("settings")}
                >
                  ⚙️ הגדרות מערכת
                  <span className="chevron">‹</span>
                </button>

                <button
                  className="category-button"
                  onClick={() => setManageSection("customers")}
                >
                  👥 סוגי לקוחות והנחות
                  <span className="chevron">‹</span>
                </button>

                <button
                  className="category-button"
                  onClick={() => setManageSection("products")}
                >
                  📦 הנחות לפי מוצר
                  <span className="chevron">‹</span>
                </button>

                <button
                  className="category-button"
                  onClick={() => setManageSection("cancellations")}
                >
                  ↩️ רישומי ביטול עצמאי
                  <span className="chevron">‹</span>
                </button>
              </>
            ) : (
              <>
                <button
                  className="text-button back-management-button"
                  onClick={() => {
                    setManageSection("");
                    clearNotice();
                  }}
                >
                  → חזרה לניהול
                </button>

                <div className="screen-heading">
                  <h1>
                    {manageSection === "dashboard" ? "לוח בקרה" : manageSection === "inventory" ? "מוצרים ומלאי" : manageSection === "suppliers" ? "ספקים והתחשבנות" : manageSection === "payments" ? "תשלומים וחובות" : manageSection === "daily" ? "סיכום יום" : manageSection === "audit" ? "יומן פעולות" : manageSection === "settings"
                      ? "הגדרות מערכת"
                      : manageSection === "customers"
                        ? "סוגי לקוחות והנחות"
                        : manageSection === "products"
                          ? "הנחות לפי מוצר"
                          : "רישומי ביטול עצמאי"}
                  </h1>
                </div>

                {manageSection === "dashboard" && <div className="demo-admin-stack">
                  <div className="demo-kpis"><div><small>התקבל בפועל</small><strong>{formatMoney(paidToday)}</strong></div><div><small>יתרות פתוחות</small><strong>{formatMoney(openCarts.reduce((n,b)=>n+Math.max(0,basketTotal(b)-paidTotal(b)),0))}</strong></div><div><small>מכירות שהושלמו</small><strong>{salesHistory.length}</strong></div><div><small>פערי מלאי לבדיקה</small><strong>{stockAlerts.length}</strong></div></div>
                  <div className="demo-panel"><h2>דורש תשומת לב</h2>{openCarts.length === 0 && lowStockProducts.length === 0 && stockAlerts.length === 0 ? <p>אין כרגע התראות בתצוגה.</p> : <>{openCarts.map(b=><p key={b.id}>🔴 {b.name} · {b.customerName || "לקוח ללא שם"} · יתרה {formatMoney(basketTotal(b)-paidTotal(b))}</p>)}{lowStockProducts.slice(0,5).map(p=><p key={p.id}>📦 {p.name} · זמין {stockAvailable(p.id)}</p>)}{stockAlerts.slice(0,3).map(a=><p key={a.id}>⚠️ {a.message}</p>)}</>}</div>
                  <div className="demo-panel"><h2>פעולות מהירות</h2><div className="demo-inline-actions"><button className="secondary-button" onClick={()=>setManageSection("inventory")}>ניהול מלאי</button><button className="secondary-button" onClick={()=>setManageSection("payments")}>עגלות פתוחות</button><button className="secondary-button" onClick={()=>setManageSection("daily")}>סיכום יום</button></div></div>
                </div>}
                {manageSection === "inventory" && <div className="demo-admin-stack">
                  <div className="demo-panel"><h2>מוצרים ומלאי</h2><p>הכמויות נועדו להמחיש שריון וחריגה. שינוי מחיר נשמר כטיוטה עד לפרסום.</p><input className="text-input" value={adminProductSearch} onChange={e=>setAdminProductSearch(e.target.value)} placeholder="חיפוש מוצר או ספק" /></div>
                  <div className="demo-table-wrap"><table className="demo-table"><thead><tr><th>מוצר</th><th>ספק</th><th>זמין</th><th>משוריין</th><th>מחיר מוצג</th><th>טיוטת מחיר</th><th>פעולה</th></tr></thead><tbody>{demoCatalog.filter(p=>p.name.includes(adminProductSearch)||p.supplier.includes(adminProductSearch)).map(p=><tr key={p.id}><td><strong>{p.name}</strong><small>{p.prices.map(x=>x.label).join(" · ")}</small></td><td>{p.supplier}</td><td><span className={stockAvailable(p.id)<=5?"demo-low":""}>{stockAvailable(p.id)}</span></td><td>{stockReserved(p.id)}</td><td>{formatMoney(p.prices[0]?.amount||0)}</td><td><input className="text-input demo-small-input" type="number" min="0.01" step="0.01" placeholder="ללא שינוי" value={catalogDrafts[p.id]??""} onChange={e=>setCatalogDrafts(prev=>({...prev,[p.id]:e.target.value}))}/></td><td><button className="secondary-button" onClick={()=>{setStock(prev=>({...prev,[p.id]:(prev[p.id]??0)+1}));logDemo(`תוספת מלאי להדגמה · ${p.name}`)}}>＋ 1 מלאי</button></td></tr>)}</tbody></table></div>
                  <button className="primary-button" disabled={!Object.values(catalogDrafts).some(v=>String(v).trim())} onClick={()=>{setDemoCatalog(prev=>prev.map(p=>{const value=parsePrice(catalogDrafts[p.id]);return Number.isFinite(value)&&value>0?{...p,prices:p.prices.map((x,i)=>i===0?{...x,amount:value}:x)}:p}));setCatalogDrafts({});logDemo("פורסמו טיוטות מחירים בתצוגת הניהול");notify("טיוטות פורסמו בתצוגת הניהול; קטלוג הקופה המקורי לא השתנה")}}>פרסם שינויים בתצוגת הניהול</button>
                  <label className="setting-row"><span><strong>דרוש אישור מנהל לחריגת מלאי</strong><small>כבוי כברירת מחדל. אישור מוכר מספיק.</small></span><input type="checkbox" checked={adminRequiresStockApproval} onChange={e=>setAdminRequiresStockApproval(e.target.checked)}/></label>
                  {stockAlerts.length>0 && <div className="demo-panel"><h2>פערים לבדיקה</h2>{stockAlerts.map(a=><p key={a.id}>⚠️ {a.message}</p>)}</div>}
                </div>}
                {manageSection === "suppliers" && <div className="demo-admin-stack"><div className="demo-panel"><h2>התחשבנות ספקים · המחשה</h2><p>הסכומים הם חישוב דוגמה לפי מכירות שהושלמו, לא הסכמים אמיתיים. תנאי ספקים יוגדרו במערכת הייצור.</p></div><div className="demo-table-wrap"><table className="demo-table"><thead><tr><th>ספק</th><th>שווי פריטים שנמכרו</th><th>תשלומים שנרשמו לספק</th><th>הפרש להמחשה</th></tr></thead><tbody>{demoSuppliers.map(name=>{const gross=salesHistory.flatMap(o=>o.items).filter(x=>x.supplier===name).reduce((n,x)=>n+x.price*x.quantity,0);const paid=supplierSettlements.filter(x=>x.name===name).reduce((n,x)=>n+x.amount,0);return <tr key={name}><td>{name}</td><td>{formatMoney(gross)}</td><td>{formatMoney(paid)}</td><td>{formatMoney(gross-paid)}</td></tr>})}</tbody></table></div><div className="demo-panel"><h2>רישום תשלום לספק — הדגמה</h2><div className="demo-inline-actions"><select className="text-input" value={supplierDraft.name} onChange={e=>setSupplierDraft(p=>({...p,name:e.target.value}))}><option value="">בחרי ספק</option>{demoSuppliers.map(n=><option key={n}>{n}</option>)}</select><input className="text-input" type="number" min="0" placeholder="סכום" value={supplierDraft.amount} onChange={e=>setSupplierDraft(p=>({...p,amount:e.target.value}))}/><button className="primary-button" onClick={()=>{const amount=parsePrice(supplierDraft.amount);if(!supplierDraft.name||!Number.isFinite(amount)||amount<=0){notify("בחרי ספק וסכום תקין");return;}setSupplierSettlements(p=>[...p,{...supplierDraft,amount}]);logDemo(`תשלום לספק ${supplierDraft.name} · ${formatMoney(amount)}`);setSupplierDraft({name:"",amount:""})}}>רישום</button></div></div></div>}
                {manageSection === "payments" && <div className="demo-admin-stack"><div className="demo-kpis"><div><small>תקבולים בתצוגה</small><strong>{formatMoney(paidToday)}</strong></div><div><small>חוב פתוח</small><strong>{formatMoney(openCarts.reduce((n,b)=>n+basketTotal(b)-paidTotal(b),0))}</strong></div></div><div className="demo-panel"><h2>עגלות עם תשלום חלקי</h2>{openCarts.length?openCarts.map(b=><div className="demo-row" key={b.id}><div><strong>{b.name} · {b.customerName}</strong><small>התקבל {formatMoney(paidTotal(b))} · יתרה {formatMoney(basketTotal(b)-paidTotal(b))}</small></div><button className="secondary-button" onClick={()=>{setActiveCartId(b.id);setScreen("cart");setManageSection("")}}>מעבר לעגלה</button></div>):<p>אין כרגע עגלות עם חוב פתוח.</p>}</div><div className="demo-panel"><h2>עסקאות שהושלמו</h2>{salesHistory.slice(0,8).map(o=><div className="demo-row" key={o.id}><span>{new Date(o.date).toLocaleString("he-IL")} · {o.employee}</span><strong>{formatMoney(o.total)}</strong></div>)}{salesHistory.length===0&&<p>טרם בוצעו מכירות בתצוגה.</p>}</div></div>}
                {manageSection === "daily" && <div className="demo-admin-stack"><div className="demo-panel"><h2>סיכום יום · תצוגה בלבד</h2><p>אפשר לאמת כל סעיף בנפרד. הסימונים אינם סוגרים את היום ואינם משנים עסקאות.</p></div><div className="demo-kpis"><div><small>תקבולים</small><strong>{formatMoney(paidToday)}</strong></div><div><small>עסקאות</small><strong>{salesHistory.length}</strong></div><div><small>עגלות פתוחות</small><strong>{openCarts.length}</strong></div><div><small>פערי מלאי</small><strong>{stockAlerts.length}</strong></div></div>{dailySections.map(section=><label className="setting-row" key={section}><span><strong>{section}</strong><small>{dailyVerified[section]?"אומת בתצוגה":"ממתין לבדיקה"}</small></span><input type="checkbox" checked={!!dailyVerified[section]} onChange={e=>setDailyVerified(prev=>({...prev,[section]:e.target.checked}))}/></label>)}<div className="info-message">סטטוס: {dailySections.every(s=>dailyVerified[s])?"נבדק במלואו":dailySections.some(s=>dailyVerified[s])?"נבדק חלקית":"לא נבדק"}</div></div>}
                {manageSection === "audit" && <div className="demo-admin-stack"><div className="demo-panel"><h2>יומן פעולות מקומי</h2><p>ממחיש תיעוד פעולות, אינו יומן ביקורת מאובטח.</p>{demoEvents.length?demoEvents.map(e=><div className="demo-row" key={e.id}><div><strong>{e.message}</strong><small>{e.employee} · {new Date(e.date).toLocaleString("he-IL")}</small></div></div>):<p>טרם נרשמו פעולות הדגמה.</p>}</div></div>}
                {manageSection === "settings" && (
                  <div className="admin-settings-list">
                    <label className="setting-row">
                      <span>
                        <strong>
                          חובה לבחור סוג לקוח בתחילת מכירה
                        </strong>
                        <small>
                          כאשר האפשרות מופעלת, לא ניתן
                          להתחיל מכירה בלי בחירה
                        </small>
                      </span>
                      <input
                        type="checkbox"
                        checked={settings.customerRequired}
                        onChange={event =>
                          updateSetting(
                            "customerRequired",
                            event.target.checked
                          )
                        }
                      />
                    </label>

                    <label className="setting-row">
                      <span>
                        <strong>
                          הפעלת אפשרות תשלום באשראי
                        </strong>
                        <small>
                          החיבור לספק הסליקה יוגדר בשלב הבא;
                          כרגע זו המחשה בלבד
                        </small>
                      </span>
                      <input
                        type="checkbox"
                        checked={settings.creditEnabled}
                        onChange={event =>
                          updateSetting(
                            "creditEnabled",
                            event.target.checked
                          )
                        }
                      />
                    </label>

                    <label className="setting-row">
                      <span>
                        <strong>
                          ניכוי דמי ביטול בהחזר אשראי
                        </strong>
                        <small>
                          ברירת המחדל היא ללא ניכוי
                        </small>
                      </span>
                      <input
                        type="checkbox"
                        checked={
                          settings.creditCancellationFeeEnabled
                        }
                        onChange={event =>
                          updateSetting(
                            "creditCancellationFeeEnabled",
                            event.target.checked
                          )
                        }
                      />
                    </label>

                    {settings.creditCancellationFeeEnabled && (
                      <label className="field-label">
                        אחוז דמי ביטול באשראי
                        <input
                          type="text"
                          inputMode="decimal"
                          className="text-input money-input"
                          value={
                            settings.creditCancellationFeePercent
                          }
                          onChange={event =>
                            updateSetting(
                              "creditCancellationFeePercent",
                              Math.max(
                                0,
                                Math.min(
                                  100,
                                  parsePrice(
                                    event.target.value
                                  ) || 0
                                )
                              )
                            )
                          }
                        />
                      </label>
                    )}

                    <label className="setting-row">
                      <span>
                        <strong>
                          החלת הנחות גם על מחיר ידני
                        </strong>
                        <small>
                          ברירת מחדל כבויה: מחיר ידני הוא
                          המחיר הסופי
                        </small>
                      </span>
                      <input
                        type="checkbox"
                        checked={settings.manualPriceDiscounts}
                        onChange={event =>
                          updateSetting(
                            "manualPriceDiscounts",
                            event.target.checked
                          )
                        }
                      />
                    </label>

                    <div className="info-message">
                      הנחה על מחיר רגיל תחושב קודם לפי המוצר
                      ולאחר מכן לפי סוג הלקוח. הגדרות אלה
                      זמניות ונמחקות ברענון. סימון אשראי
                      כאן מציג את האפשרות בהדגמה בלבד
                      ואינו מחבר ספק סליקה.
                    </div>
                  </div>
                )}

                {manageSection === "customers" && (
                  <div className="admin-settings-list">
                    {customerTypes.map(type => (
                      <div
                        className="customer-type-admin-row"
                        key={type.id}
                      >
                        <input
                          className="text-input"
                          value={type.name}
                          onChange={event =>
                            updateCustomerType(type.id, {
                              name: event.target.value
                            })
                          }
                        />

                        <label>
                          הנחת לקוח %
                          <input
                            className="text-input short-number-input"
                            type="text"
                            inputMode="decimal"
                            value={type.discountPercent}
                            onChange={event =>
                              updateCustomerType(type.id, {
                                discountPercent: Math.max(
                                  0,
                                  Math.min(
                                    100,
                                    parsePrice(
                                      event.target.value
                                    ) || 0
                                  )
                                )
                              })
                            }
                          />
                        </label>

                        {type.id !== "regular" && (
                          <button
                            className="small-delete-button"
                            onClick={() =>
                              setCustomerTypes(previous =>
                                previous.filter(
                                  item => item.id !== type.id
                                )
                              )
                            }
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}

                    <h2 className="section-title">
                      הוספת סוג לקוח
                    </h2>

                    <label className="field-label">
                      שם סוג הלקוח
                      <input
                        className="text-input"
                        value={newCustomerTypeName}
                        onChange={event =>
                          setNewCustomerTypeName(
                            event.target.value
                          )
                        }
                        placeholder="לדוגמה: מוסדי"
                      />
                    </label>

                    <label className="field-label">
                      הנחת לקוח באחוזים
                      <input
                        className="text-input"
                        type="text"
                        inputMode="decimal"
                        value={newCustomerTypeDiscount}
                        onChange={event =>
                          setNewCustomerTypeDiscount(
                            event.target.value
                          )
                        }
                      />
                    </label>

                    <button
                      className="primary-button"
                      onClick={addCustomerType}
                    >
                      הוספת סוג לקוח
                    </button>

                    {notice && (
                      <div className="error-message">
                        {notice}
                      </div>
                    )}

                    <div className="info-message">
                      הנחת מוצר תחושב ראשונה. הנחת הלקוח
                      תחושב לאחריה על המחיר החדש.
                    </div>
                  </div>
                )}

                {manageSection === "products" && (
                  <div className="admin-settings-list">
                    <p className="muted-admin-note">
                      המנהל יכול להגדיר אחוז הנחה לכל מוצר.
                      0 פירושו ללא הנחה.
                    </p>

                    {allProducts.map(product => (
                      <label
                        className="product-discount-row"
                        key={product.id}
                      >
                        <span>
                          <strong>{product.name}</strong>
                          <small>{product.supplier}</small>
                        </span>

                        <input
                          className="text-input short-number-input"
                          type="text"
                          inputMode="decimal"
                          aria-label={`אחוז הנחה עבור ${product.name}`}
                          value={
                            productDiscounts[product.id] ?? 0
                          }
                          onChange={event =>
                            updateProductDiscount(
                              product.id,
                              event.target.value
                            )
                          }
                        />
                        <b>%</b>
                      </label>
                    ))}
                  </div>
                )}

                {manageSection === "cancellations" && (
                  <div className="admin-settings-list">
                    {standaloneCancellations.length === 0 ? (
                      <div className="empty-state">
                        <h2>אין רישומי ביטול</h2>
                      </div>
                    ) : (
                      standaloneCancellations.map(record => (
                        <div
                          className="return-history-row"
                          key={record.id}
                        >
                          <strong>
                            {formatMoney(record.refundAmount)} ·{" "}
                            {record.status}
                          </strong>
                          <span>
                            {record.items
                              .map(
                                item =>
                                  `${item.name} × ${item.quantity}`
                              )
                              .join(", ")}
                          </span>
                          <small>
                            {record.feeAmount > 0
                              ? `ניכוי ${record.feePercent}%: ${formatMoney(
                                  record.feeAmount
                                )} · `
                              : ""}
                            {new Date(
                              record.date
                            ).toLocaleString("he-IL")}{" "}
                            · {record.employee}
                          </small>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </>
            )}
          </section>
        )}
      </main>

      {showNavigation && (
        <nav className="bottom-navigation">
          <div className="nav-cart-list" ref={cartTabsRef}>
            {carts.map(basket => {
              const count = basket.items.reduce(
                (sum, item) => sum + item.quantity,
                0
              );

              const total = basket.items.reduce(
                (sum, item) =>
                  sum + item.quantity * item.price,
                0
              );

              return (
                <div
                  className="nav-cart-wrap"
                  key={basket.id}
                  data-cart-id={basket.id}
                >
                  <button
                    className={`nav-cart ${
                      basket.id === activeCartId
                        ? "active"
                        : ""
                    }`}
                    onClick={() => selectCart(basket.id)}
                  >
                    <strong>{basket.name}</strong>
                    <small>
                      {count} יחידות · {formatMoney(total)}
                    </small>
                  </button>

                  <button
                    className="nav-cart-x"
                    aria-label={`הסרת ${basket.name}`}
                    onClick={() =>
                      requestRemoveCart(basket.id)
                    }
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>

          <button
            className="nav-add"
            onClick={createNewCart}
            title="פתיחת עגלה חדשה"
          >
            <span>＋</span>
            <small>עגלה</small>
          </button>

          <button className="nav-action" onClick={back}>
            <span>←</span>
            <small>חזרה</small>
          </button>

          <button
            className="nav-action"
            onClick={() =>
              navigateWithCart("categories")
            }
          >
            <span>▦</span>
            <small>קטגוריות</small>
          </button>

          <button
            className="nav-action nav-more"
            onClick={openMore}
          >
            <span>⋯</span>
            <small>עוד</small>
          </button>

          <div
            className="seller-mini"
            title={`מוכר/ת: ${displayEmployee}`}
          >
            <span>
              {(displayEmployee || "?").slice(0, 1)}
            </span>
            <small>
              {displayEmployee || "מוכר"}
            </small>
          </div>
        </nav>
      )}

      {modal?.type === "more" && (
        <div className="modal-backdrop">
          <div className="modal more-options-modal">
            <div className="modal-title-row">
              <h2>אפשרויות נוספות</h2>
              <button
                className="modal-close-button"
                onClick={() => setModal(null)}
              >
                ×
              </button>
            </div>

            <button
              className="more-option"
              onClick={() => optionAction("history")}
            >
              🧾 <span>היסטוריית הזמנות</span> ‹
            </button>

            <button
              className="more-option"
              onClick={() => optionAction("customer")}
            >
              👥 <span>בחירת סוג לקוח</span> ‹
            </button>

            <button
              className="more-option"
              onClick={() => optionAction("cancel")}
            >
              ↩️ <span>ביטול מוצר עצמאי</span> ‹
            </button>

            <button
              className="more-option"
              onClick={() => optionAction("management")}
            >
              ⚙️ <span>מעבר לניהול</span> ‹
            </button>
          </div>
        </div>
      )}

      {modal?.type === "chooseCustomer" && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-title-row">
              <h2>בחירת סוג לקוח</h2>
              <button
                className="modal-close-button"
                onClick={() => setModal(null)}
              >
                ×
              </button>
            </div>

            {customerTypes.map(type => (
              <button
                key={type.id}
                className="large-option"
                onClick={() => {
                  applyCustomerType(type.id);
                  setModal(null);
                }}
              >
                {type.name} · {type.discountPercent}%
              </button>
            ))}
          </div>
        </div>
      )}

      {modal?.type === "stockOverride" && <div className="modal-backdrop"><div className="modal"><h2>פער בין הכמות למלאי הרשום</h2><p>זמין לפי המערכת: {modal.available} יחידות. התבקשה כמות: {modal.line.quantity}.</p><p>ייתכן שהמלאי הפיזי לא עודכן. האם המוצר קיים בפועל?</p>{adminRequiresStockApproval && <div className="error-message">המנהל הגדיר שנדרש אישור מנהל. זו הדמיה בלבד — אין כאן אימות זהות אמיתי.</div>}<button className="primary-button" onClick={()=>{setStockAlerts(prev=>[{id:Date.now(),message:`${modal.line.name}: חריגה של ${modal.line.quantity-modal.available} יחידות · ${displayEmployee}`} ,...prev]);logDemo(`חריגת מלאי מאושרת · ${modal.line.name}`);confirmAddProduct(modal.line);setModal(null)}}>{adminRequiresStockApproval?"הדמיית אישור מנהל והמשך":"אני מאשר/ת שהמוצר קיים — המשך"}</button><button className="text-button" onClick={()=>setModal(null)}>חזרה ללא הוספה</button></div></div>}
      {modal?.type === "excessRefund" && <div className="modal-backdrop"><div className="modal"><h2>החזר עודף</h2><p>עודף להסדרה: {formatMoney(Math.max(0,paidTotal(activeCart)-cartTotal))}</p><label className="field-label">סכום שהוחזר בפועל</label><input className="text-input money-input" inputMode="decimal" value={refundInput} onChange={e=>setRefundInput(e.target.value)} placeholder="סכום ההחזר"/><button className="primary-button" onClick={recordRefund}>תיעוד החזר שבוצע</button><button className="text-button" onClick={()=>setModal(null)}>ביטול</button></div></div>}
      {modal?.type === "paidCartCancellation" && <div className="modal-backdrop"><div className="modal"><h2>ביטול עגלה שהתקבל בה כסף</h2><p>{modal.cartName}</p><div className="demo-balance-panel"><span>התקבל נטו: {formatMoney(paidTotal(carts.find(b=>b.id===modal.cartId)))}</span><strong>החזר נדרש: {formatMoney(paidTotal(carts.find(b=>b.id===modal.cartId)))}</strong></div><label className="field-label">סכום שהוחזר בפועל</label><input className="text-input money-input" inputMode="decimal" value={refundInput} onChange={e=>setRefundInput(e.target.value)} placeholder="סכום שהוחזר"/><button className="primary-button danger-confirm" onClick={finalizePaidCartCancellation}>אישור החזר וסגירת העגלה</button><button className="text-button" onClick={()=>setModal(null)}>חזרה לעגלה</button></div></div>}
      {modal?.type === "removeCart" && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>
              {modal.last
                ? "לנקות את העגלה?"
                : `להסיר את ${modal.cartName}?`}
            </h2>

            <p>
              {modal.last
                ? "זו העגלה היחידה. תכולתה תימחק והיא תישאר ריקה ומוכנה למכירה."
                : "העגלה מכילה מוצרים. הסרתה תמחק את תכולתה."}
            </p>

            <button
              className="primary-button danger-confirm"
              onClick={() =>
                removeCartById(modal.cartId)
              }
            >
              כן, {modal.last ? "לנקות" : "להסיר"}
            </button>

            <button
              className="text-button"
              onClick={() => setModal(null)}
            >
              ביטול
            </button>
          </div>
        </div>
      )}

      {modal?.type === "historyReturn" && returnDraft && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-title-row">
              <h2>החזרת מוצר מהזמנה</h2>
              <button
                className="modal-close-button"
                onClick={() => setModal(null)}
              >
                ×
              </button>
            </div>

            <p>{returnDraft.lineName}</p>

            <label className="field-label">
              כמות להחזרה (נותרו {returnDraft.available})
            </label>

            <div className="quantity-control">
              <button
                onClick={() =>
                  setReturnQuantity(old =>
                    Math.max(1, old - 1)
                  )
                }
              >
                −
              </button>
              <strong>{returnQuantity}</strong>
              <button
                onClick={() =>
                  setReturnQuantity(old =>
                    Math.min(
                      returnDraft.available,
                      old + 1
                    )
                  )
                }
              >
                +
              </button>
            </div>

            <div className="checkout-total compact-total">
              <span>סכום לפני ניכוי</span>
              <strong>
                {formatMoney(historyReturnGross)}
              </strong>
            </div>

            {returnMethod === "credit" &&
              settings.creditCancellationFeeEnabled && (
                <div className="info-message">
                  דמי ביטול:{" "}
                  {formatMoney(historyReturnFeeAmount)} ·
                  סכום ההחזר:{" "}
                  {formatMoney(historyReturnNetAmount)}
                </div>
              )}

            <div className="payment-options">
              <button
                className={`payment-button ${
                  returnMethod === "cash"
                    ? "selected"
                    : ""
                }`}
                onClick={() => setReturnMethod("cash")}
              >
                💵 מזומן
              </button>

              <button
                className={`payment-button ${
                  returnMethod === "credit"
                    ? "selected"
                    : ""
                }`}
                disabled={!settings.creditEnabled}
                onClick={() => setReturnMethod("credit")}
              >
                💳 אשראי
              </button>
            </div>

            {returnMethod === "credit" && (
              <div className="info-message">
                {refundFeeNote}. ההחזר יתועד כממתין
                לביצוע.
              </div>
            )}

            <button
              className="primary-button"
              onClick={completeHistoryReturn}
            >
              אישור החזרת המוצר
            </button>

            <button
              className="text-button"
              onClick={() => setModal(null)}
            >
              ביטול
            </button>
          </div>
        </div>
      )}

      {editingItem && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-title-row">
              <h2>עריכת מוצר</h2>
              <button
                className="modal-close-button"
                onClick={() =>
                  setEditingItem(null)
                }
              >
                ×
              </button>
            </div>

            <p>{editingItem.name}</p>

            <label className="field-label">
              מחיר ליחידה
            </label>
            <input
              type="text"
              inputMode="decimal"
              autoComplete="off"
              className="text-input money-input"
              value={editPrice}
              onChange={event =>
                setEditPrice(event.target.value)
              }
            />

            <label className="field-label">
              כמות
            </label>

            <div className="quantity-control">
              <button
                onClick={() =>
                  setEditQuantity(old =>
                    Math.max(1, old - 1)
                  )
                }
              >
                −
              </button>
              <strong>{editQuantity}</strong>
              <button
                onClick={() =>
                  setEditQuantity(old => old + 1)
                }
              >
                +
              </button>
            </div>

            {notice && (
              <div className="error-message">
                {notice}
              </div>
            )}

            <button
              className="primary-button"
              onClick={saveEdit}
            >
              שמירת שינויים
            </button>

            <button
              className="text-button"
              onClick={() => {
                setEditingItem(null);
                clearNotice();
              }}
            >
              ביטול
            </button>
          </div>
        </div>
      )}

      {notice &&
        !["employee", "customerSelect"].includes(screen) && (
          <div className="global-notice" role="status">
            {notice}
            <button onClick={clearNotice}>×</button>
          </div>
        )}

      <div className="prototype-footer">
        הדגמת מסכים בלבד · הנתונים נמחקים ברענון ·
        אין סליקה, הרשאות אמת, שרת או התחשבנות חשבונאית אמיתית
      </div>
    </div>
  );
}
