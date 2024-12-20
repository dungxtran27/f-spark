/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        backgroundSecondary: "#D4D3D8",
        backgroundPrimary: "#f2f2f2",
        primary: "#AC7AF7",
        textSecondary: "#8e8e8e",
        primaryBlue: "#007BF7",
        textHeaders: "#10004B",
        inputBackground: "#F8F8FF",
        pendingStatus: "#F08E1D",
        okStatus: "#15CB49",
      },
    },
  },
  plugins: [],
};
