// useTheme.js
// Drop this hook anywhere in your project (e.g. src/hooks/useTheme.js)
// It reads/writes CSS variables on :root and persists the chosen theme to localStorage.

import { useState, useEffect, useCallback } from "react";

// ─── Preset Themes ────────────────────────────────────────────────────────────
// Each theme overrides only the variables that change; the rest stay as defined
// in index.css.  Values are plain HSL triplets (no "hsl()" wrapper) to match
// the existing convention.

export const THEMES = {
  default: {
    label: "Ocean Blue",
    emoji: "🌊",
    vars: {
      "--primary":            "217 89% 61%",
      "--primary-foreground": "0 0% 100%",
      "--background":         "210 40% 98%",
      "--foreground":         "222 47% 11%",
      "--card":               "0 0% 100%",
      "--card-foreground":    "222 47% 11%",
      "--secondary":          "210 20% 96%",
      "--accent":             "210 20% 96%",
      "--muted":              "210 20% 96%",
      "--muted-foreground":   "215 16% 47%",
      "--border":             "214 20% 88%",
      "--input":              "214 20% 88%",
      "--ring":               "217 89% 55%",
      "--popover":            "0 0% 100%",
      "--popover-foreground": "222 47% 11%",
    },
  },
  violet: {
    label: "Violet Dusk",
    emoji: "🔮",
    vars: {
      "--primary":            "262 80% 58%",
      "--primary-foreground": "0 0% 100%",
      "--background":         "260 30% 97%",
      "--foreground":         "262 40% 12%",
      "--card":               "0 0% 100%",
      "--card-foreground":    "262 40% 12%",
      "--secondary":          "262 20% 95%",
      "--accent":             "262 20% 95%",
      "--muted":              "262 20% 95%",
      "--muted-foreground":   "262 12% 50%",
      "--border":             "262 18% 88%",
      "--input":              "262 18% 88%",
      "--ring":               "262 80% 52%",
      "--popover":            "0 0% 100%",
      "--popover-foreground": "262 40% 12%",
    },
  },
  emerald: {
    label: "Emerald Forest",
    emoji: "🌿",
    vars: {
      "--primary":            "158 64% 42%",
      "--primary-foreground": "0 0% 100%",
      "--background":         "150 30% 97%",
      "--foreground":         "158 40% 10%",
      "--card":               "0 0% 100%",
      "--card-foreground":    "158 40% 10%",
      "--secondary":          "150 20% 95%",
      "--accent":             "150 20% 95%",
      "--muted":              "150 20% 95%",
      "--muted-foreground":   "158 12% 48%",
      "--border":             "150 18% 87%",
      "--input":              "150 18% 87%",
      "--ring":               "158 64% 36%",
      "--popover":            "0 0% 100%",
      "--popover-foreground": "158 40% 10%",
    },
  },
  rose: {
    label: "Rose Quartz",
    emoji: "🌸",
    vars: {
      "--primary":            "340 82% 58%",
      "--primary-foreground": "0 0% 100%",
      "--background":         "340 30% 98%",
      "--foreground":         "340 40% 12%",
      "--card":               "0 0% 100%",
      "--card-foreground":    "340 40% 12%",
      "--secondary":          "340 20% 96%",
      "--accent":             "340 20% 96%",
      "--muted":              "340 20% 96%",
      "--muted-foreground":   "340 12% 50%",
      "--border":             "340 18% 88%",
      "--input":              "340 18% 88%",
      "--ring":               "340 82% 52%",
      "--popover":            "0 0% 100%",
      "--popover-foreground": "340 40% 12%",
    },
  },
  amber: {
    label: "Amber Glow",
    emoji: "🟡",
    vars: {
      "--primary":            "38 95% 50%",
      "--primary-foreground": "38 60% 10%",
      "--background":         "40 40% 98%",
      "--foreground":         "38 50% 10%",
      "--card":               "0 0% 100%",
      "--card-foreground":    "38 50% 10%",
      "--secondary":          "40 25% 95%",
      "--accent":             "40 25% 95%",
      "--muted":              "40 25% 95%",
      "--muted-foreground":   "38 12% 48%",
      "--border":             "40 20% 87%",
      "--input":              "40 20% 87%",
      "--ring":               "38 95% 44%",
      "--popover":            "0 0% 100%",
      "--popover-foreground": "38 50% 10%",
    },
  },
  slate: {
    label: "Slate Mono",
    emoji: "🩶",
    vars: {
      "--primary":            "220 14% 30%",
      "--primary-foreground": "0 0% 100%",
      "--background":         "220 20% 97%",
      "--foreground":         "220 25% 10%",
      "--card":               "0 0% 100%",
      "--card-foreground":    "220 25% 10%",
      "--secondary":          "220 14% 95%",
      "--accent":             "220 14% 95%",
      "--muted":              "220 14% 95%",
      "--muted-foreground":   "220 10% 50%",
      "--border":             "220 14% 88%",
      "--input":              "220 14% 88%",
      "--ring":               "220 14% 24%",
      "--popover":            "0 0% 100%",
      "--popover-foreground": "220 25% 10%",
    },
  },
  dark: {
    label: "Dark Mode",
    emoji: "🌑",
    vars: {
      "--primary":            "217 89% 61%",
      "--primary-foreground": "0 0% 100%",
      "--background":         "222 47% 8%",
      "--foreground":         "210 40% 95%",
      "--card":               "222 40% 12%",
      "--card-foreground":    "210 40% 95%",
      "--secondary":          "222 30% 18%",
      "--accent":             "222 30% 18%",
      "--muted":              "222 30% 18%",
      "--muted-foreground":   "215 16% 60%",
      "--border":             "222 20% 22%",
      "--input":              "222 20% 22%",
      "--ring":               "217 89% 55%",
      "--popover":            "222 40% 12%",
      "--popover-foreground": "210 40% 95%",
    },
  },
};

// ─── Helper: apply a vars map to :root ────────────────────────────────────────
function applyVars(vars) {
  const root = document.documentElement;
  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
const STORAGE_KEY = "app-theme";

export function useTheme() {
  const [themeKey, setThemeKey] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || "default";
  });

  // Apply theme on mount and whenever it changes
  useEffect(() => {
    const theme = THEMES[themeKey] ?? THEMES.default;
    applyVars(theme.vars);
    localStorage.setItem(STORAGE_KEY, themeKey);
  }, [themeKey]);

  const setTheme = useCallback((key) => {
    if (THEMES[key]) setThemeKey(key);
  }, []);

  // Apply a one-off custom variable map (for live preview)
  const previewTheme = useCallback((vars) => {
    applyVars(vars);
  }, []);

  // Reset to whatever is saved
  const resetPreview = useCallback(() => {
    const theme = THEMES[themeKey] ?? THEMES.default;
    applyVars(theme.vars);
  }, [themeKey]);

  return {
    themeKey,
    theme: THEMES[themeKey] ?? THEMES.default,
    setTheme,
    previewTheme,
    resetPreview,
    themes: THEMES,
  };
}
