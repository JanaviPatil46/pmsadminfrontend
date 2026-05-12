// ThemeSettings.jsx
// Self-contained — no props needed.
// Uses the same SettingsCard / SaveBtn patterns as FirmSetting.js
//
//   import ThemeSettings from "./ThemeSettings";   ← use inside FirmSetting's tab

import { useState, useEffect, useCallback } from "react";
import { Check, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "react-toastify";

// ─── Theme definitions ────────────────────────────────────────────────────────
const THEMES = {
  default: {
    label: "Ocean Blue", emoji: "🌊", description: "Your current default",
    vars: {
      "--primary": "217 89% 61%", "--primary-foreground": "0 0% 100%",
      "--background": "210 40% 98%", "--foreground": "222 47% 11%",
      "--card": "0 0% 100%", "--card-foreground": "222 47% 11%",
      "--secondary": "210 20% 96%", "--accent": "210 20% 96%",
      "--muted": "210 20% 96%", "--muted-foreground": "215 16% 47%",
      "--border": "214 20% 88%", "--input": "214 20% 88%",
      "--ring": "217 89% 55%", "--popover": "0 0% 100%", "--popover-foreground": "222 47% 11%",
    },
  },
  violet: {
    label: "Violet Dusk", emoji: "🔮", description: "Deep purple tones",
    vars: {
      "--primary": "262 80% 58%", "--primary-foreground": "0 0% 100%",
      "--background": "260 30% 97%", "--foreground": "262 40% 12%",
      "--card": "0 0% 100%", "--card-foreground": "262 40% 12%",
      "--secondary": "262 20% 95%", "--accent": "262 20% 95%",
      "--muted": "262 20% 95%", "--muted-foreground": "262 12% 50%",
      "--border": "262 18% 88%", "--input": "262 18% 88%",
      "--ring": "262 80% 52%", "--popover": "0 0% 100%", "--popover-foreground": "262 40% 12%",
    },
  },
  emerald: {
    label: "Emerald Forest", emoji: "🌿", description: "Fresh greens",
    vars: {
      "--primary": "158 64% 42%", "--primary-foreground": "0 0% 100%",
      "--background": "150 30% 97%", "--foreground": "158 40% 10%",
      "--card": "0 0% 100%", "--card-foreground": "158 40% 10%",
      "--secondary": "150 20% 95%", "--accent": "150 20% 95%",
      "--muted": "150 20% 95%", "--muted-foreground": "158 12% 48%",
      "--border": "150 18% 87%", "--input": "150 18% 87%",
      "--ring": "158 64% 36%", "--popover": "0 0% 100%", "--popover-foreground": "158 40% 10%",
    },
  },
  rose: {
    label: "Rose Quartz", emoji: "🌸", description: "Warm pinks",
    vars: {
      "--primary": "340 82% 58%", "--primary-foreground": "0 0% 100%",
      "--background": "340 30% 98%", "--foreground": "340 40% 12%",
      "--card": "0 0% 100%", "--card-foreground": "340 40% 12%",
      "--secondary": "340 20% 96%", "--accent": "340 20% 96%",
      "--muted": "340 20% 96%", "--muted-foreground": "340 12% 50%",
      "--border": "340 18% 88%", "--input": "340 18% 88%",
      "--ring": "340 82% 52%", "--popover": "0 0% 100%", "--popover-foreground": "340 40% 12%",
    },
  },
  amber: {
    label: "Amber Glow", emoji: "🟡", description: "Warm golden tones",
    vars: {
      "--primary": "38 95% 50%", "--primary-foreground": "38 60% 10%",
      "--background": "40 40% 98%", "--foreground": "38 50% 10%",
      "--card": "0 0% 100%", "--card-foreground": "38 50% 10%",
      "--secondary": "40 25% 95%", "--accent": "40 25% 95%",
      "--muted": "40 25% 95%", "--muted-foreground": "38 12% 48%",
      "--border": "40 20% 87%", "--input": "40 20% 87%",
      "--ring": "38 95% 44%", "--popover": "0 0% 100%", "--popover-foreground": "38 50% 10%",
    },
  },
  slate: {
    label: "Slate Mono", emoji: "🩶", description: "Neutral grey",
    vars: {
      "--primary": "220 14% 30%", "--primary-foreground": "0 0% 100%",
      "--background": "220 20% 97%", "--foreground": "220 25% 10%",
      "--card": "0 0% 100%", "--card-foreground": "220 25% 10%",
      "--secondary": "220 14% 95%", "--accent": "220 14% 95%",
      "--muted": "220 14% 95%", "--muted-foreground": "220 10% 50%",
      "--border": "220 14% 88%", "--input": "220 14% 88%",
      "--ring": "220 14% 24%", "--popover": "0 0% 100%", "--popover-foreground": "220 25% 10%",
    },
  },
  dark: {
    label: "Dark Mode", emoji: "🌑", description: "Easy on the eyes",
    vars: {
      "--primary": "217 89% 61%", "--primary-foreground": "0 0% 100%",
      "--background": "222 47% 8%", "--foreground": "210 40% 95%",
      "--card": "222 40% 12%", "--card-foreground": "210 40% 95%",
      "--secondary": "222 30% 18%", "--accent": "222 30% 18%",
      "--muted": "222 30% 18%", "--muted-foreground": "215 16% 60%",
      "--border": "222 20% 22%", "--input": "222 20% 22%",
      "--ring": "217 89% 55%", "--popover": "222 40% 12%", "--popover-foreground": "210 40% 95%",
    },
  },
   
midnight: {
  label: "Midnight",
  emoji: "🌃",
  description: "Deep navy luxury",
  vars: {
    "--primary":            "226 70% 55%",
    "--primary-foreground": "0 0% 100%",
    "--background":         "226 45% 7%",
    "--foreground":         "220 30% 92%",
    "--card":               "226 40% 11%",
    "--card-foreground":    "220 30% 92%",
    "--secondary":          "226 35% 16%",
    "--accent":             "226 35% 16%",
    "--muted":              "226 35% 16%",
    "--muted-foreground":   "220 20% 55%",
    "--border":             "226 30% 20%",
    "--input":              "226 30% 20%",
    "--ring":               "226 70% 50%",
    "--popover":            "226 40% 11%",
    "--popover-foreground": "220 30% 92%",
  },
},
 
forest: {
  label: "Forest Night",
  emoji: "🌲",
  description: "Dark earthy greens",
  vars: {
    "--primary":            "142 50% 45%",
    "--primary-foreground": "0 0% 100%",
    "--background":         "150 25% 7%",
    "--foreground":         "140 20% 88%",
    "--card":               "148 22% 11%",
    "--card-foreground":    "140 20% 88%",
    "--secondary":          "148 18% 16%",
    "--accent":             "148 18% 16%",
    "--muted":              "148 18% 16%",
    "--muted-foreground":   "140 12% 52%",
    "--border":             "148 16% 20%",
    "--input":              "148 16% 20%",
    "--ring":               "142 50% 40%",
    "--popover":            "148 22% 11%",
    "--popover-foreground": "140 20% 88%",
  },
},
 
crimson: {
  label: "Crimson",
  emoji: "🔴",
  description: "Bold red, dark base",
  vars: {
    "--primary":            "0 72% 55%",
    "--primary-foreground": "0 0% 100%",
    "--background":         "0 20% 7%",
    "--foreground":         "0 15% 90%",
    "--card":               "0 18% 11%",
    "--card-foreground":    "0 15% 90%",
    "--secondary":          "0 14% 16%",
    "--accent":             "0 14% 16%",
    "--muted":              "0 14% 16%",
    "--muted-foreground":   "0 10% 52%",
    "--border":             "0 14% 20%",
    "--input":              "0 14% 20%",
    "--ring":               "0 72% 50%",
    "--popover":            "0 18% 11%",
    "--popover-foreground": "0 15% 90%",
  },
},
 
arctic: {
  label: "Arctic",
  emoji: "🧊",
  description: "Icy cool whites",
  vars: {
    "--primary":            "199 89% 48%",
    "--primary-foreground": "0 0% 100%",
    "--background":         "200 40% 98%",
    "--foreground":         "200 50% 10%",
    "--card":               "200 60% 100%",
    "--card-foreground":    "200 50% 10%",
    "--secondary":          "200 30% 94%",
    "--accent":             "200 30% 94%",
    "--muted":              "200 30% 94%",
    "--muted-foreground":   "200 18% 46%",
    "--border":             "200 25% 86%",
    "--input":              "200 25% 86%",
    "--ring":               "199 89% 42%",
    "--popover":            "0 0% 100%",
    "--popover-foreground": "200 50% 10%",
  },
},
 
sand: {
  label: "Sand Dune",
  emoji: "🏜️",
  description: "Warm neutral beige",
  vars: {
    "--primary":            "28 60% 45%",
    "--primary-foreground": "0 0% 100%",
    "--background":         "38 40% 96%",
    "--foreground":         "30 35% 12%",
    "--card":               "36 50% 99%",
    "--card-foreground":    "30 35% 12%",
    "--secondary":          "36 25% 91%",
    "--accent":             "36 25% 91%",
    "--muted":              "36 25% 91%",
    "--muted-foreground":   "30 15% 48%",
    "--border":             "34 20% 84%",
    "--input":              "34 20% 84%",
    "--ring":               "28 60% 40%",
    "--popover":            "36 50% 99%",
    "--popover-foreground": "30 35% 12%",
  },
},
 
grape: {
  label: "Grape",
  emoji: "🍇",
  description: "Rich dark purple",
  vars: {
    "--primary":            "280 65% 58%",
    "--primary-foreground": "0 0% 100%",
    "--background":         "278 30% 7%",
    "--foreground":         "276 20% 90%",
    "--card":               "278 26% 11%",
    "--card-foreground":    "276 20% 90%",
    "--secondary":          "278 22% 17%",
    "--accent":             "278 22% 17%",
    "--muted":              "278 22% 17%",
    "--muted-foreground":   "276 14% 54%",
    "--border":             "278 20% 22%",
    "--input":              "278 20% 22%",
    "--ring":               "280 65% 52%",
    "--popover":            "278 26% 11%",
    "--popover-foreground": "276 20% 90%",
  },
},
 
copper: {
  label: "Copper",
  emoji: "🟤",
  description: "Metallic warm brown",
  vars: {
    "--primary":            "20 75% 50%",
    "--primary-foreground": "0 0% 100%",
    "--background":         "22 30% 97%",
    "--foreground":         "20 40% 10%",
    "--card":               "0 0% 100%",
    "--card-foreground":    "20 40% 10%",
    "--secondary":          "22 22% 93%",
    "--accent":             "22 22% 93%",
    "--muted":              "22 22% 93%",
    "--muted-foreground":   "20 14% 48%",
    "--border":             "22 18% 85%",
    "--input":              "22 18% 85%",
    "--ring":               "20 75% 44%",
    "--popover":            "0 0% 100%",
    "--popover-foreground": "20 40% 10%",
  },
},
 
obsidian: {
  label: "Obsidian",
  emoji: "⬛",
  description: "True black minimal",
  vars: {
    "--primary":            "0 0% 92%",
    "--primary-foreground": "0 0% 8%",
    "--background":         "0 0% 5%",
    "--foreground":         "0 0% 90%",
    "--card":               "0 0% 9%",
    "--card-foreground":    "0 0% 90%",
    "--secondary":          "0 0% 14%",
    "--accent":             "0 0% 14%",
    "--muted":              "0 0% 14%",
    "--muted-foreground":   "0 0% 50%",
    "--border":             "0 0% 18%",
    "--input":              "0 0% 18%",
    "--ring":               "0 0% 70%",
    "--popover":            "0 0% 9%",
    "--popover-foreground": "0 0% 90%",
  },
},

};

const STORAGE_KEY = "app-theme";
const CUSTOM_KEY  = "app-theme-custom";

// ─── Utilities ────────────────────────────────────────────────────────────────
const hsl = (v) => `hsl(${v})`;

function applyVars(vars) {
  const root = document.documentElement;
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
}

function hslToHex(hslStr) {
  try {
    const [h, s, l] = hslStr.trim().split(/\s+/).map(parseFloat);
    const c = document.createElement("canvas");
    c.width = c.height = 1;
    const ctx = c.getContext("2d");
    ctx.fillStyle = `hsl(${h},${s}%,${l}%)`;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
  } catch { return "#6b7280"; }
}

function hexToHsl(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

// ─── Mini UI preview inside each theme tile ───────────────────────────────────
function MiniPreview({ vars }) {
  return (
    <div className="rounded-lg overflow-hidden border mb-2.5"
      style={{ background: hsl(vars["--background"]), borderColor: hsl(vars["--border"]) }}>
      <div className="h-4 flex items-center gap-1 px-2"
        style={{ background: hsl(vars["--card"]), borderBottom: `1px solid ${hsl(vars["--border"])}` }}>
        <div className="rounded-full w-2 h-2" style={{ background: hsl(vars["--primary"]) }} />
        <div className="rounded-full w-2 h-2" style={{ background: hsl(vars["--border"]) }} />
        <div className="rounded-full w-2 h-2" style={{ background: hsl(vars["--border"]) }} />
      </div>
      <div className="p-2 flex gap-1.5">
        <div className="rounded w-7 flex flex-col gap-1 p-1" style={{ background: hsl(vars["--secondary"]) }}>
          {[100, 70, 85].map((w, i) => (
            <div key={i} className="h-1 rounded-full" style={{
              width: `${w}%`,
              background: i === 0 ? hsl(vars["--primary"]) : hsl(vars["--muted-foreground"]),
              opacity: i === 0 ? 1 : 0.35,
            }} />
          ))}
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <div className="h-4 rounded" style={{ background: hsl(vars["--card"]), border: `1px solid ${hsl(vars["--border"])}` }} />
          <div className="flex gap-1">
            <div className="h-1.5 rounded flex-1" style={{ background: hsl(vars["--muted"]) }} />
            <div className="h-1.5 rounded w-5"   style={{ background: hsl(vars["--primary"]) }} />
          </div>
          <div className="h-1.5 rounded w-3/4"   style={{ background: hsl(vars["--muted"]), opacity: 0.6 }} />
        </div>
      </div>
    </div>
  );
}

// ─── Theme selection tile ─────────────────────────────────────────────────────
function ThemeCard({ id, theme, isActive, onSelect, onMouseEnter, onMouseLeave }) {
  return (
    <button
      onClick={() => onSelect(id)}
      onMouseEnter={() => onMouseEnter(id)}
      onMouseLeave={onMouseLeave}
      className={[
        "relative text-left rounded-xl border-2 p-3 w-full transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isActive
          ? "border-primary shadow-md"
          : "border-border hover:border-primary/40 hover:shadow-sm",
      ].join(" ")}
      style={{ background: hsl(theme.vars["--card"]) }}
    >
      {isActive && (
        <span className="absolute top-2 right-2 flex items-center justify-center w-5 h-5 rounded-full"
          style={{ background: hsl(theme.vars["--primary"]) }}>
          <Check className="w-3 h-3" style={{ color: hsl(theme.vars["--primary-foreground"]) }} />
        </span>
      )}
      <MiniPreview vars={theme.vars} />
      <p className="text-xs font-semibold" style={{ color: hsl(theme.vars["--foreground"]) }}>
        {theme.emoji} {theme.label}
      </p>
      <p className="text-[10px] mt-0.5" style={{ color: hsl(theme.vars["--muted-foreground"]) }}>
        {theme.description}
      </p>
    </button>
  );
}

// ─── Custom colour editor rows ────────────────────────────────────────────────
const EDITABLE_VARS = [
  { key: "--primary",          label: "Primary / Button" },
  { key: "--background",       label: "Page background" },
  { key: "--card",             label: "Card background" },
  { key: "--secondary",        label: "Secondary surfaces" },
  { key: "--border",           label: "Borders" },
  { key: "--foreground",       label: "Main text" },
  { key: "--muted-foreground", label: "Muted text" },
  { key: "--ring",             label: "Focus ring" },
];

function CustomEditor({ baseVars, onChange }) {
  const [local, setLocal] = useState({ ...baseVars });

  useEffect(() => { setLocal({ ...baseVars }); }, [baseVars]);

  const handlePick = (key, hex) => {
    const updated = { ...local, [key]: hexToHsl(hex) };
    setLocal(updated);
    onChange(updated);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
      {EDITABLE_VARS.map(({ key, label }) => (
        <div key={key}
          className="flex items-center gap-3 rounded-lg border px-3 py-2.5"
          style={{ borderColor: hsl(local["--border"]) }}>
          <label
            className="relative w-8 h-8 rounded-md overflow-hidden cursor-pointer border-2 shrink-0 transition-transform hover:scale-105"
            style={{ borderColor: hsl(local["--border"]) }}
            title={`Edit ${label}`}
          >
            <div className="w-full h-full" style={{ background: hsl(local[key] ?? "0 0% 80%") }} />
            <input
              type="color"
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              value={hslToHex(local[key] ?? "0 0% 80%")}
              onChange={(e) => handlePick(key, e.target.value)}
            />
          </label>
          <div className="min-w-0">
            <p className="text-xs font-medium truncate text-foreground">{label}</p>
            <p className="text-[10px] font-mono truncate text-muted-foreground">{local[key]}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Shared sub-components matching FirmSetting.js exactly ───────────────────
const SettingsCard = ({ title, children }) => (
  <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
    <div className="border-b border-border px-5 py-3.5">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
    </div>
    <div className="p-5 space-y-4">{children}</div>
  </div>
);

const SaveBtn = ({ onClick }) => (
  <button
    onClick={onClick}
    className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
  >
    Save
  </button>
);

// ─── Main component ───────────────────────────────────────────────────────────
export default function ThemeSettings() {
  const [activeKey, setActiveKey] = useState(() => localStorage.getItem(STORAGE_KEY) || "default");
  const [customVars, setCustomVars] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CUSTOM_KEY)); } catch { return null; }
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Apply persisted theme immediately on mount
  useEffect(() => {
    const savedCustom = (() => {
      try { return JSON.parse(localStorage.getItem(CUSTOM_KEY)); } catch { return null; }
    })();
    const base = THEMES[localStorage.getItem(STORAGE_KEY)]?.vars ?? THEMES.default.vars;
    applyVars(savedCustom ?? base);
  }, []);

  const committedVars = THEMES[activeKey]?.vars ?? THEMES.default.vars;
  const isDirty = customVars !== null;

  const handleMouseEnter = useCallback((key) => {
    applyVars(THEMES[key].vars);
  }, []);

  const handleMouseLeave = useCallback(() => {
    applyVars(customVars ?? committedVars);
  }, [customVars, committedVars]);

  const handleSelectPreset = (key) => {
    setActiveKey(key);
    setCustomVars(null);
    applyVars(THEMES[key].vars);
  };

  const handleCustomChange = (vars) => {
    setCustomVars(vars);
    applyVars(vars);
  };

  const handleResetCustom = () => {
    setCustomVars(null);
    applyVars(committedVars);
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, activeKey);
    if (customVars) {
      localStorage.setItem(CUSTOM_KEY, JSON.stringify(customVars));
    } else {
      localStorage.removeItem(CUSTOM_KEY);
    }
    toast.success("Theme saved successfully!");
  };

  return (
    <div className="space-y-6">

      {/* Preset picker */}
      <SettingsCard title="Colour theme">
        <p className="text-sm text-muted-foreground -mt-1">
          Choose a colour theme applied across buttons, backgrounds, and cards.
          Hover to preview — click to select, then Save.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.entries(THEMES).map(([key, theme]) => (
            <ThemeCard
              key={key}
              id={key}
              theme={theme}
              isActive={activeKey === key && !isDirty}
              onSelect={handleSelectPreset}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          ))}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs text-muted-foreground">
            Active theme:{" "}
            <span className="font-semibold text-foreground">
              {isDirty ? "Custom" : (THEMES[activeKey]?.label ?? "—")}
            </span>
          </span>
          {isDirty && (
            <button
              onClick={handleResetCustom}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset to preset
            </button>
          )}
        </div>

        <SaveBtn onClick={handleSave} />
      </SettingsCard>

      {/* Custom colour editor */}
      <SettingsCard title="Custom colours">
        <div className="-mt-1">
          <button
            onClick={() => setShowAdvanced((v) => !v)}
            className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showAdvanced ? "Hide" : "Show"} custom colour editor
          </button>
          <p className="text-xs text-muted-foreground mt-1">
            Fine-tune individual colours. Changes preview live — Save to persist.
          </p>
        </div>

        {showAdvanced && (
          <>
            <CustomEditor
              baseVars={customVars ?? committedVars}
              onChange={handleCustomChange}
            />
            <div className="flex items-center gap-3 pt-1">
              <SaveBtn onClick={handleSave} />
              {isDirty && (
                <button
                  onClick={handleResetCustom}
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
              )}
            </div>
          </>
        )}
      </SettingsCard>

    </div>
  );
}
