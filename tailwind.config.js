/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [  "./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
    
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        primary: "hsl(var(--primary))",
        border: "hsl(var(--border))",
        muted: "hsl(var(--muted))",
        destructive: "hsl(var(--destructive))",
        success: "hsl(var(--success))",
        "success-foreground": "hsl(var(--success-foreground))",
      
      },
    },
  },
  plugins: [],
}


