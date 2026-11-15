/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#050505',
          secondary: '#0B0B0F',
          card: '#101014',
          'card-hover': '#16161C',
          red: '#FF3038',
          'red-crimson': '#C81020',
          'red-bright': '#FF5555',
          'red-dark': '#8B0000',
          'red-glow': 'rgba(255, 48, 56, 0.35)',
          text: '#F5F5F5',
          muted: '#A0A0A8',
          subtle: '#666672',
          border: 'rgba(255, 48, 56, 0.28)',
          'border-bright': 'rgba(255, 48, 56, 0.65)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Rajdhani', 'Space Grotesk', 'sans-serif'],
        mono: ['Space Grotesk', 'monospace'],
        display: ['Orbitron', 'Rajdhani', 'sans-serif'],
      },
      boxShadow: {
        'neon-sm': '0 0 10px rgba(255, 48, 56, 0.25)',
        'neon-md': '0 0 20px rgba(255, 48, 56, 0.35)',
        'neon-lg': '0 0 30px rgba(255, 48, 56, 0.50)',
        'neon-inset': 'inset 0 0 15px rgba(255, 48, 56, 0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-scan': 'scan 4s linear infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
};
