module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 0 1px rgba(59,130,246,0.35), 0 20px 60px rgba(37,99,235,0.25)',
      },
      colors: {
        panel: '#0f172a',
        accent: '#3b82f6',
        mint: '#2dd4bf',
      }
    }
  },
  plugins: [],
}
