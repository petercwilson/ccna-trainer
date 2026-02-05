/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Navy color scheme - matches your current design
        navy: {
          dark: '#022a3a',    // Pantone 303 C
          DEFAULT: '#0076a9', // Pantone 7690 C
          mid: '#003f5c',
          lite: '#004d73',
        },
        // Gold accent
        gold: {
          DEFAULT: '#e8b00f', // Pantone 1235 C
          dark: '#b88c0c',
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
      }
    },
  },
  plugins: [],
}
