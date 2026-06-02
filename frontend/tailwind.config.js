/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0fdfa",
          500: "#14b8a6", // Teal moderno corporativo
          900: "#134e4a",
        },
      },
      animation: {
        flow: "flow 2s infinite linear",
      },
      keyframes: {
        flow: {
          "0%": { backgroundPosition: "200% center" },
          "100%": { backgroundPosition: "0% center" },
        },
      },
    },
  },
  plugins: [],
};
