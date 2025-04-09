/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'game-primary': '#6366f1',
        'game-secondary': '#a855f7',
        'game-accent': '#0ea5e9',
        'game-success': '#10b981',
        'game-warning': '#f59e0b',
        'game-error': '#ef4444',
        'game-surface': '#ffffff',
        'game-background': '#f8fafc',
        'game-text': '#0f172a',
        'game-text-light': '#64748b'
      },
      fontFamily: {
        'sans': ['Inter var', 'Inter', 'system-ui', 'sans-serif'],
        'display': ['Lexend', 'system-ui', 'sans-serif']
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      },
      boxShadow: {
        'game': '0 4px 6px -1px rgba(99, 102, 241, 0.1), 0 2px 4px -1px rgba(99, 102, 241, 0.06)',
        'game-lg': '0 10px 15px -3px rgba(99, 102, 241, 0.1), 0 4px 6px -2px rgba(99, 102, 241, 0.05)',
        'game-xl': '0 20px 25px -5px rgba(99, 102, 241, 0.1), 0 10px 10px -5px rgba(99, 102, 241, 0.04)'
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem'
      }
    },
  },
  plugins: [],
  darkMode: 'class'
}
