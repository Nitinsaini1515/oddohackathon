/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#060816',
          bgSecondary: '#0F172A',
          card: '#111827',
          cardHover: '#1E293B',
          primary: '#4F46E5',
          darkBlue: '#2563EB',
          purple: '#7C3AED',
          accent: '#A855F7',
          success: '#22C55E',
          warning: '#F59E0B',
          danger: '#EF4444',
          secondaryText: '#94A3B8',
          border: 'rgba(255,255,255,0.05)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      },
      boxShadow: {
        'premium': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow-primary': '0 0 15px rgba(79, 70, 229, 0.35)',
        'glow-purple': '0 0 15px rgba(124, 58, 237, 0.35)',
        'glow-success': '0 0 15px rgba(34, 197, 94, 0.25)',
      }
    },
  },
  plugins: [],
}
