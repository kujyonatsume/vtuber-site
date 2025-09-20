// tailwind.config.js
import colors from "tailwindcss/colors";
import theme from "./theme.json";

/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        ...colors,
        neutral: theme.neutral,
        secondary: theme.secondary,
        primary: theme.primary,
      },
      keyframes: {
        slideUp: {
          "0%": { transform: "translateY(12px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        glow: {
          "0%,100%": { boxShadow: "0 0 0px rgba(0,0,0,0)" },
          "50%": { boxShadow: "0 0 32px rgba(255,255,255,.08)" },
        },
      },
      animation: {
        slideUp: "slideUp .5s ease both",
        float: "float 3s ease-in-out infinite",
        glow: "glow 2.4s ease-in-out infinite",
      },
    },
  },
};
