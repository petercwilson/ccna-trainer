/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Navy color scheme
        navy: {
          dark: '#022a3a',
          DEFAULT: '#0076a9',
          mid: '#003f5c',
          lite: '#004d73',
        },
        // Gold accent
        gold: {
          DEFAULT: '#e8b00f',
          dark: '#b88c0c',
          light: '#f2c434',
        },
        // Status colors
        success: '#1ea86a',
        danger: '#d93025',
        warning: '#e8a012',
        // Text colors
        text: {
          DEFAULT: '#fffef9',
          muted: '#C6CCD0',
          'off-white': '#f5f5f0',
        }
      },
      fontFamily: {
        'liberator': ['Liberator', 'sans-serif'],
        'roboto': ['Roboto Slab', 'serif'],
        'mono': ['Share Tech Mono', 'monospace'],
      },
      backgroundImage: {
        'noise': `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.65' numOctaves='3'/%3E%3CfeColorMatrix values='0 0 0 0 0, 0 0 0 0 0.08, 0 0 0 0 0.12, 0 0 0 0.03 0'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(232, 176, 15, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(232, 176, 15, 0.5)' },
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(232, 176, 15, 0.3)',
        'glow-lg': '0 0 30px rgba(232, 176, 15, 0.4)',
        'glow-gold': '0 4px 24px rgba(232, 176, 15, 0.25)',
        'inner-glow': 'inset 0 0 20px rgba(232, 176, 15, 0.1)',
        'elevation-1': '0 2px 8px rgba(0, 0, 0, 0.15)',
        'elevation-2': '0 4px 16px rgba(0, 0, 0, 0.2)',
        'elevation-3': '0 8px 32px rgba(0, 0, 0, 0.25)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
