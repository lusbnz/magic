export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f6fe',
          100: '#ddecfd',
          500: '#0069ff', // DigitalOcean primary blue
          600: '#0053cc',
          700: '#00409a',
        },
        do: {
          bg: '#0a0d18',
          card: '#10172a',
          surface: '#151f38',
          border: '#232f4e',
          text: '#f3f4f6',
          muted: '#8b9bb4',
          accent: '#0069ff',
          indigo: '#6366f1',
          emerald: '#10b981',
          amber: '#f59e0b'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
