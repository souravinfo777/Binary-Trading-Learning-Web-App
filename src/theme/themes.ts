export interface ThemeColorPalette {
  c50: string;
  c100: string;
  c200: string;
  c300: string;
  c400: string;
  c500: string;
  c600: string;
  c700: string;
  c800: string;
  c900: string;
  c950: string;
}

export interface BlackTheme {
  id: string;
  nameEn: string;
  nameBn: string;
  tagEn: string;
  tagBn: string;
  bgPrimary: string;
  bgSurface: string;
  bgCard: string;
  accentColor: string;
  accentHover: string;
  borderColor: string;
  glowColor: string;
  badgeBg: string;
  badgeText: string;
  previewColors: {
    bg: string;
    surface: string;
    accent: string;
  };
  palette: ThemeColorPalette;
}

export const BLACK_THEMES: BlackTheme[] = [
  {
    id: "oled-pure",
    nameEn: "OLED Pitch Void",
    nameBn: "ওলেড পিচ ভয়েড",
    tagEn: "True 0-Nit Absolute Black • Maximum Battery & Contrast",
    tagBn: "সম্পূর্ণ পিওর ওলেড ব্ল্যাক • সর্বোচ্চ চোখ আরাম ও ব্যাটারি সেভিং",
    bgPrimary: "#000000",
    bgSurface: "#05070d",
    bgCard: "#090d16",
    accentColor: "#06b6d4",
    accentHover: "#22d3ee",
    borderColor: "rgba(255, 255, 255, 0.12)",
    glowColor: "rgba(6, 182, 212, 0.35)",
    badgeBg: "rgba(6, 182, 212, 0.15)",
    badgeText: "#22d3ee",
    previewColors: {
      bg: "#000000",
      surface: "#090d16",
      accent: "#06b6d4",
    },
    palette: {
      c50: "#ecfeff",
      c100: "#cffafe",
      c200: "#a5f3fc",
      c300: "#67e8f9",
      c400: "#22d3ee",
      c500: "#06b6d4",
      c600: "#0891b2",
      c700: "#0e7490",
      c800: "#155e75",
      c900: "#164e63",
      c950: "#082f49",
    },
  },
  {
    id: "obsidian-stealth",
    nameEn: "Obsidian Stealth",
    nameBn: "অবসিডিয়ান স্টিলথ",
    tagEn: "Matte Carbon Black • Distraction-Free Pure Price Action",
    tagBn: "ম্যাট কার্বন ডার্ক • মনোযোগ ধরে রাখার জন্য মিনিমালিস্ট স্টিলথ",
    bgPrimary: "#050507",
    bgSurface: "#0a0a0e",
    bgCard: "#111117",
    accentColor: "#94a3b8",
    accentHover: "#cbd5e1",
    borderColor: "rgba(148, 163, 184, 0.18)",
    glowColor: "rgba(148, 163, 184, 0.25)",
    badgeBg: "rgba(148, 163, 184, 0.15)",
    badgeText: "#e2e8f0",
    previewColors: {
      bg: "#050507",
      surface: "#111117",
      accent: "#94a3b8",
    },
    palette: {
      c50: "#f8fafc",
      c100: "#f1f5f9",
      c200: "#e2e8f0",
      c300: "#cbd5e1",
      c400: "#94a3b8",
      c500: "#64748b",
      c600: "#475569",
      c700: "#334155",
      c800: "#1e293b",
      c900: "#0f172a",
      c950: "#0a0e1a",
    },
  },
  {
    id: "midnight-navy",
    nameEn: "Midnight Sapphire",
    nameBn: "মিডনাইট স্যাফায়ার",
    tagEn: "Institutional Deep Navy Black • Wall Street Quant Style",
    tagBn: "ডিপ ব্লু স্যাফায়ার ব্ল্যাক • প্রাতিষ্ঠানিক ওয়াল স্ট্রিট লুক",
    bgPrimary: "#02050f",
    bgSurface: "#060d21",
    bgCard: "#0b1736",
    accentColor: "#38bdf8",
    accentHover: "#60a5fa",
    borderColor: "rgba(56, 189, 248, 0.22)",
    glowColor: "rgba(56, 189, 248, 0.35)",
    badgeBg: "rgba(56, 189, 248, 0.15)",
    badgeText: "#7dd3fc",
    previewColors: {
      bg: "#02050f",
      surface: "#0b1736",
      accent: "#38bdf8",
    },
    palette: {
      c50: "#eff6ff",
      c100: "#dbeafe",
      c200: "#bfdbfe",
      c300: "#93c5fd",
      c400: "#60a5fa",
      c500: "#3b82f6",
      c600: "#2563eb",
      c700: "#1d4ed8",
      c800: "#1e40af",
      c900: "#1e3a8a",
      c950: "#081a3d",
    },
  },
  {
    id: "matrix-emerald",
    nameEn: "Matrix Emerald Terminal",
    nameBn: "ম্যাট্রিক্স এমারেল্ড টার্মিনাল",
    tagEn: "Pitch Dark with Glowing Cyber Green • Sureshot Confluence",
    tagBn: "পিচ ব্ল্যাক ও সাইবার গ্রিন • হাই কনফ্লুয়েন্স শিওরশট লুক",
    bgPrimary: "#010804",
    bgSurface: "#031409",
    bgCard: "#052110",
    accentColor: "#10b981",
    accentHover: "#34d399",
    borderColor: "rgba(16, 185, 129, 0.25)",
    glowColor: "rgba(16, 185, 129, 0.4)",
    badgeBg: "rgba(16, 185, 129, 0.18)",
    badgeText: "#6ee7b7",
    previewColors: {
      bg: "#010804",
      surface: "#052110",
      accent: "#10b981",
    },
    palette: {
      c50: "#ecfdf5",
      c100: "#d1fae5",
      c200: "#a7f3d0",
      c300: "#6ee7b7",
      c400: "#34d399",
      c500: "#10b981",
      c600: "#059669",
      c700: "#047857",
      c800: "#065f46",
      c900: "#064e3b",
      c950: "#022c15",
    },
  },
  {
    id: "cyberpunk-neon",
    nameEn: "Cyberpunk Laser",
    nameBn: "সাইবারপাঙ্ক লেজার",
    tagEn: "Neo-Tokyo Nightlife • Deep Onyx with Magenta/Cyan Neon",
    tagBn: "নিয়ন ম্যাজেন্টা ও সায়ান ভাইব • নিও-টোকিও অলটারনেটিভ",
    bgPrimary: "#040108",
    bgSurface: "#0c0318",
    bgCard: "#16052b",
    accentColor: "#d946ef",
    accentHover: "#e879f9",
    borderColor: "rgba(217, 70, 239, 0.25)",
    glowColor: "rgba(217, 70, 239, 0.4)",
    badgeBg: "rgba(217, 70, 239, 0.18)",
    badgeText: "#f0abfc",
    previewColors: {
      bg: "#040108",
      surface: "#16052b",
      accent: "#d946ef",
    },
    palette: {
      c50: "#fdf4ff",
      c100: "#fae8ff",
      c200: "#f5d0fe",
      c300: "#f0abfc",
      c400: "#e879f9",
      c500: "#d946ef",
      c600: "#c026d3",
      c700: "#a21caf",
      c800: "#86198f",
      c900: "#701a75",
      c950: "#38063d",
    },
  },
  {
    id: "crimson-shadow",
    nameEn: "Crimson Pit Abyss",
    nameBn: "ক্রিমসন পিট অ্যাবিস",
    tagEn: "Aggressive Floor Trading Pit • Blood Ruby Dark Carbon",
    tagBn: "ব্লাড রুবি ডার্ক কার্বন • ফ্লোর ট্রেডিং পিট হাই ফোকাস",
    bgPrimary: "#080103",
    bgSurface: "#140307",
    bgCard: "#22050c",
    accentColor: "#f43f5e",
    accentHover: "#fb7185",
    borderColor: "rgba(244, 63, 94, 0.25)",
    glowColor: "rgba(244, 63, 94, 0.4)",
    badgeBg: "rgba(244, 63, 94, 0.18)",
    badgeText: "#fda4af",
    previewColors: {
      bg: "#080103",
      surface: "#22050c",
      accent: "#f43f5e",
    },
    palette: {
      c50: "#fff1f2",
      c100: "#ffe4e6",
      c200: "#fecdd3",
      c300: "#fda4af",
      c400: "#fb7185",
      c500: "#f43f5e",
      c600: "#e11d48",
      c700: "#be123c",
      c800: "#9f1239",
      c900: "#881337",
      c950: "#3d0611",
    },
  },
  {
    id: "gold-prestige",
    nameEn: "Prestige Onyx Gold",
    nameBn: "প্রেস্টিজ অনিক্স গোল্ড",
    tagEn: "Swiss Private Vault • Rich Onyx with Champagne Gold",
    tagBn: "সুইস প্রাইভেট ভল্ট • প্রিমিয়াম গোল্ড ও অনিক্স ব্ল্যাক",
    bgPrimary: "#060501",
    bgSurface: "#120e03",
    bgCard: "#1c1605",
    accentColor: "#f59e0b",
    accentHover: "#fbbf24",
    borderColor: "rgba(245, 158, 11, 0.25)",
    glowColor: "rgba(245, 158, 11, 0.4)",
    badgeBg: "rgba(245, 158, 11, 0.18)",
    badgeText: "#fcd34d",
    previewColors: {
      bg: "#060501",
      surface: "#1c1605",
      accent: "#f59e0b",
    },
    palette: {
      c50: "#fffbeb",
      c100: "#fef3c7",
      c200: "#fde68a",
      c300: "#fcd34d",
      c400: "#fbbf24",
      c500: "#f59e0b",
      c600: "#d97706",
      c700: "#b45309",
      c800: "#92400e",
      c900: "#78350f",
      c950: "#3b1e02",
    },
  },
  {
    id: "tokyo-violet",
    nameEn: "Tokyo Violet Night",
    nameBn: "টোকিও ভায়োলেট নাইট",
    tagEn: "Deep Cosmic Space • Electric Royal Amethyst & Purple",
    tagBn: "মহাজাগতিক গ্যালাকটিক ব্ল্যাক • রয়্যাল অ্যামিথিস্ট ভাইব",
    bgPrimary: "#030209",
    bgSurface: "#09051c",
    bgCard: "#120a33",
    accentColor: "#8b5cf6",
    accentHover: "#a78bfa",
    borderColor: "rgba(139, 92, 246, 0.25)",
    glowColor: "rgba(139, 92, 246, 0.4)",
    badgeBg: "rgba(139, 92, 246, 0.18)",
    badgeText: "#c4b5fd",
    previewColors: {
      bg: "#030209",
      surface: "#120a33",
      accent: "#8b5cf6",
    },
    palette: {
      c50: "#faf5ff",
      c100: "#f3e8ff",
      c200: "#e9d5ff",
      c300: "#d8b4fe",
      c400: "#c084fc",
      c500: "#a855f7",
      c600: "#9333ea",
      c700: "#7e22ce",
      c800: "#6b21a8",
      c900: "#581c87",
      c950: "#2d084d",
    },
  },
  {
    id: "titanium-steel",
    nameEn: "Titanium Gunmetal",
    nameBn: "টাইটানিয়াম গানমেটাল",
    tagEn: "Industrial Aerospace Dark • Ice Sky Blue & Cold Steel",
    tagBn: "অ্যারোস্পেস গানমেটাল ডার্ক • কোল্ড স্টিল ও আইস স্কাই ব্লু",
    bgPrimary: "#07090d",
    bgSurface: "#0d1118",
    bgCard: "#131924",
    accentColor: "#38bdf8",
    accentHover: "#7dd3fc",
    borderColor: "rgba(56, 189, 248, 0.22)",
    glowColor: "rgba(56, 189, 248, 0.35)",
    badgeBg: "rgba(56, 189, 248, 0.15)",
    badgeText: "#bae6fd",
    previewColors: {
      bg: "#07090d",
      surface: "#131924",
      accent: "#38bdf8",
    },
    palette: {
      c50: "#f0f9ff",
      c100: "#e0f2fe",
      c200: "#bae6fd",
      c300: "#7dd3fc",
      c400: "#38bdf8",
      c500: "#0ea5e9",
      c600: "#0284c7",
      c700: "#0369a1",
      c800: "#075985",
      c900: "#0c4a6e",
      c950: "#082f4d",
    },
  },
  {
    id: "mariana-teal",
    nameEn: "Mariana Deep Abyss",
    nameBn: "মারিয়ানা ডিপ অ্যাবিস",
    tagEn: "Deep Mariana Trench • Calm Oceanic Teal & Aquamarine",
    tagBn: "মারিয়ানা ট্রেঞ্চ প্যাসিফিক • প্রশান্ত ডিপ সি টিল ও অ্যাকুয়ামেরিন",
    bgPrimary: "#010708",
    bgSurface: "#021114",
    bgCard: "#041d22",
    accentColor: "#14b8a6",
    accentHover: "#2dd4bf",
    borderColor: "rgba(20, 184, 166, 0.25)",
    glowColor: "rgba(20, 184, 166, 0.4)",
    badgeBg: "rgba(20, 184, 166, 0.18)",
    badgeText: "#5eead4",
    previewColors: {
      bg: "#010708",
      surface: "#041d22",
      accent: "#14b8a6",
    },
    palette: {
      c50: "#f0fdfa",
      c100: "#ccfbf1",
      c200: "#99f6e4",
      c300: "#5eead4",
      c400: "#2dd4bf",
      c500: "#14b8a6",
      c600: "#0d9488",
      c700: "#0f766e",
      c800: "#115e59",
      c900: "#134e4a",
      c950: "#042f2c",
    },
  },
];

export const STORAGE_KEY_BLACK_THEME = "quant_otc_black_theme_id";

export function getInitialBlackTheme(): BlackTheme {
  try {
    const savedId = localStorage.getItem(STORAGE_KEY_BLACK_THEME);
    if (savedId) {
      const match = BLACK_THEMES.find((t) => t.id === savedId);
      if (match) return match;
    }
  } catch (e) {
    console.error("Failed to read theme from localStorage", e);
  }
  return BLACK_THEMES[0]; // Default: oled-pure
}

export function saveBlackTheme(themeId: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_BLACK_THEME, themeId);
  } catch (e) {
    console.error("Failed to save theme to localStorage", e);
  }
}

export function applyThemeToDocument(theme: BlackTheme): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  // 1. High-level Master Theme Variables
  root.style.setProperty("--theme-bg-primary", theme.bgPrimary);
  root.style.setProperty("--theme-bg-surface", theme.bgSurface);
  root.style.setProperty("--theme-bg-card", theme.bgCard);
  root.style.setProperty("--theme-accent", theme.accentColor);
  root.style.setProperty("--theme-accent-hover", theme.accentHover);
  root.style.setProperty("--theme-border", theme.borderColor);
  root.style.setProperty("--theme-glow", theme.glowColor);
  root.style.setProperty("--theme-badge-bg", theme.badgeBg);
  root.style.setProperty("--theme-badge-text", theme.badgeText);

  // 2. Dynamic Override for Tailwind v4's Cyan Spectrum
  const p = theme.palette;
  root.style.setProperty("--color-cyan-50", p.c50);
  root.style.setProperty("--color-cyan-100", p.c100);
  root.style.setProperty("--color-cyan-200", p.c200);
  root.style.setProperty("--color-cyan-300", p.c300);
  root.style.setProperty("--color-cyan-400", p.c400);
  root.style.setProperty("--color-cyan-500", p.c500);
  root.style.setProperty("--color-cyan-600", p.c600);
  root.style.setProperty("--color-cyan-700", p.c700);
  root.style.setProperty("--color-cyan-800", p.c800);
  root.style.setProperty("--color-cyan-900", p.c900);
  root.style.setProperty("--color-cyan-950", p.c950);

  // 3. Fallback/Explicit variables
  root.style.setProperty("--theme-c50", p.c50);
  root.style.setProperty("--theme-c100", p.c100);
  root.style.setProperty("--theme-c200", p.c200);
  root.style.setProperty("--theme-c300", p.c300);
  root.style.setProperty("--theme-c400", p.c400);
  root.style.setProperty("--theme-c500", p.c500);
  root.style.setProperty("--theme-c600", p.c600);
  root.style.setProperty("--theme-c700", p.c700);
  root.style.setProperty("--theme-c800", p.c800);
  root.style.setProperty("--theme-c900", p.c900);
  root.style.setProperty("--theme-c950", p.c950);

  // 4. Set document body background & theme class
  document.body.style.backgroundColor = theme.bgPrimary;

  BLACK_THEMES.forEach((t) => {
    document.body.classList.remove(`theme-${t.id}`);
  });
  document.body.classList.add(`theme-${theme.id}`);

  // 5. Notify canvas and visual sub-systems
  window.dispatchEvent(new CustomEvent("otc-theme-changed", { detail: theme }));
}
