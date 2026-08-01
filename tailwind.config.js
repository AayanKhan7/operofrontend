/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#1B2F4E',
        periwinkle: '#C7D6EF',
        sky: '#7C97C4',
        'deep-blue': '#4A639A',
        paper: '#F4F6FB',
        panel: '#FFFFFF',
        rule: '#D8E1F0',
        'whatsapp-green': '#25D366',
        amber: '#C98A2C',
        plum: '#6E4A66',
        rust: '#B5484B',
        'ink-black': '#0A0A0A',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Poppins', 'sans-serif'], // Treat Poppins as our "serif" equivalent for display
        mono: ['IBM Plex Mono', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '12px',
        md: '12px',
        lg: '16px',
        full: '9999px',
      },
      boxShadow: {
        card: '0 4px 20px rgba(27, 47, 78, 0.05)',
      }
    },
  },
  plugins: [],
}
