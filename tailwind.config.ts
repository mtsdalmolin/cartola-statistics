import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    screens: {
      mobile: { max: '480px' },
      tablet: { max: '768px' },
      desktop: { max: '1200px' }
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      gridTemplateColumns: {
        statistics: 'repeat(auto-fill, minmax(320px, 1fr))'
      },
      colors: {
        palette: {
          primary: {
            100: 'var(--brand-100)',
            200: 'var(--brand-200)',
            300: 'var(--brand-300)',
            400: 'var(--brand-400)',
            500: 'var(--brand-500)',
            600: 'var(--brand-600)',
            700: 'var(--brand-700)',
            800: 'var(--brand-800)',
            900: 'var(--brand-900)'
          },
          neutral: {
            100: '#f8f9fa',
            200: '#e1e7ec',
            300: '#d5dde5',
            400: '#cad2d9',
            500: '#aebecd',
            600: '#929fb1',
            700: '#6e7a8a',
            800: '#404b5a',
            900: '#202833'
          }
        },
      },
      keyframes: {
        scrollVertically: {
          '100%': { transform: 'translateY(-50%)' }
        }
      },
      animation: {
        scrollVertically: 'scrollVertically 20s linear infinite'
      }
    }
  },
  plugins: []
}
export default config
