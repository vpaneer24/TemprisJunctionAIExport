export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#03060A",
        panel: "#0B1220",
        cyan: "#00C8F0",
        purple: "#7C3AED",
        soft: "#9FB3C8"
      },
      boxShadow: {
        glow: "0 0 30px rgba(0, 200, 240, 0.12)",
      }
    },
  },
  plugins: [],
};
