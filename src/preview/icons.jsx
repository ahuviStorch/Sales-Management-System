// ==========================================
// אייקונים ואיורים מקומיים (SVG בלבד — ללא נכסים חיצוניים)
// ==========================================

const BASE = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
  focusable: "false",
};

export function NavIcon({ name }) {
  switch (name) {
    case "pos":
      return (
        <svg {...BASE}>
          <rect x="3" y="4" width="18" height="12" rx="2" />
          <path d="M8 20h8M12 16v4" />
        </svg>
      );
    case "stock":
      return (
        <svg {...BASE}>
          <path d="M3 8.5 12 4l9 4.5v7L12 20l-9-4.5v-7Z" />
          <path d="M3 8.5 12 13l9-4.5M12 13v7" />
        </svg>
      );
    case "history":
      return (
        <svg {...BASE}>
          <path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1" />
          <path d="M3 4v4h4" />
          <path d="M12 7.5V12l3 2" />
        </svg>
      );
    case "cancel":
      return (
        <svg {...BASE}>
          <path d="M5 8h14l-1.2 11.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8L5 8Z" />
          <path d="M9 8V6a3 3 0 0 1 6 0v2M10 12v4M14 12v4" />
        </svg>
      );
    case "manage":
      return (
        <svg {...BASE}>
          <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
          <circle cx="16" cy="7" r="2" />
          <circle cx="8" cy="17" r="2" />
        </svg>
      );
    case "payment":
      return (
        <svg {...BASE}>
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <path d="M3 10h18M7 15h3" />
        </svg>
      );
    default:
      return null;
  }
}

// סמל המותג — עלה/ענף מופשט בתוך עיגול זהב
export function BrandMark() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <rect width="48" height="48" rx="14" fill="#e8c24a" />
      <g fill="none" stroke="#1c2a1c" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 37V18" />
        <path d="M24 27c-4.5 0-8-2.6-8-5.8 4.4 0 8 2.3 8 5.8Z" />
        <path d="M24 23c4.5 0 8-2.6 8-5.8-4.4 0-8 2.3-8 5.8Z" />
        <path d="M18.5 37h11" />
      </g>
    </svg>
  );
}

// איורי קטגוריה — צורות מופשטות בלבד
export function CategoryArt({ id }) {
  const common = { viewBox: "0 0 64 64", "aria-hidden": "true", focusable: "false" };
  switch (id) {
    case "cat1":
      return (
        <svg {...common}>
          <circle cx="32" cy="38" r="15" fill="#f3c74d" stroke="#123a2b" strokeWidth="2.4" />
          <circle cx="32" cy="38" r="15" fill="none" stroke="#d9ad2e" strokeWidth="1" />
          <path d="M32 25c-1-3 1-6 4-6" fill="none" stroke="#123a2b" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M27 36l5-2 5 2-2 6h-6l-2-6Z" fill="#1f7a4d" opacity=".85" />
        </svg>
      );
    case "cat2":
      return (
        <svg {...common}>
          <path d="M14 46c0-9 8-26 18-26s18 17 18 26" fill="#1f7a4d" opacity=".9" />
          <path d="M14 46c0-9 8-26 18-26s18 17 18 26" fill="none" stroke="#123a2b" strokeWidth="2.4" />
          <path d="M32 20v26" stroke="#123a2b" strokeWidth="2" strokeLinecap="round" />
          <path d="M20 46c1-6 4-12 8-15M44 46c-1-6-4-12-8-15" fill="none" stroke="#123a2b" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M12 46h40" stroke="#123a2b" strokeWidth="2.6" strokeLinecap="round" />
        </svg>
      );
    case "cat3":
      return (
        <svg {...common}>
          <path d="M32 48V30" stroke="#123a2b" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M32 36c-6 0-11-3.5-11-8 6 0 11 3.2 11 8Z" fill="#1f7a4d" opacity=".9" stroke="#123a2b" strokeWidth="2" strokeLinejoin="round" />
          <path d="M32 32c6 0 11-3.5 11-8-6 0-11 3.2-11 8Z" fill="#1f7a4d" opacity=".75" stroke="#123a2b" strokeWidth="2" strokeLinejoin="round" />
          <path d="M32 24c3 0 6-2 6-4.5-3 0-6 1.6-6 4.5Z" fill="#1f7a4d" stroke="#123a2b" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M24 48h16" stroke="#123a2b" strokeWidth="2.6" strokeLinecap="round" />
        </svg>
      );
    case "cat4":
      return (
        <svg {...common}>
          <path d="M32 14v28" stroke="#123a2b" strokeWidth="2.2" strokeLinecap="round" />
          {[20, 26, 32, 38, 44].map((y, i) => (
            <ellipse key={y} cx="32" cy={y} rx={i % 2 ? 5.5 : 7} ry="3.4" fill="#1f7a4d" opacity={0.55 + i * 0.08} stroke="#123a2b" strokeWidth="1.4" />
          ))}
          <path d="M24 46h16" stroke="#123a2b" strokeWidth="2.6" strokeLinecap="round" />
        </svg>
      );
    case "cat5":
      return (
        <svg {...common}>
          <circle cx="32" cy="24" r="12" fill="#f3c74d" stroke="#123a2b" strokeWidth="2.4" />
          <path d="M20 34c-3 6-3 12 0 14M44 34c3 6 3 12 0 14" fill="none" stroke="#1f7a4d" strokeWidth="3" strokeLinecap="round" />
          <path d="M26 24h12M32 18v12" stroke="#123a2b" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "cat6":
      return (
        <svg {...common}>
          <path d="M18 34h28l-3 18H21l-3-18Z" fill="#e4ecd9" stroke="#123a2b" strokeWidth="2.4" strokeLinejoin="round" />
          <path d="M24 34c0-5 3.5-8 8-8s8 3 8 8" fill="none" stroke="#123a2b" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M26 42h12" stroke="#1f7a4d" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="32" cy="32" r="16" fill="#e4ecd9" stroke="#123a2b" strokeWidth="2.4" />
        </svg>
      );
  }
}

export function CartArt() {
  return (
    <svg viewBox="0 0 64 64" width="44" height="44" aria-hidden="true" focusable="false">
      <path d="M12 16h6l6 26h24l6-18H22" fill="none" stroke="#123a2b" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="27" cy="50" r="3.4" fill="#123a2b" />
      <circle cx="45" cy="50" r="3.4" fill="#123a2b" />
    </svg>
  );
}
