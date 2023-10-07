import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      gridTemplateColumns: {
        statistics: 'repeat(auto-fill, minmax(320px, 1fr))'
      }
    },
    colors: {
      palette: {
        primary: {
          100: '#cdf4e7',
          300: '#aaecd6',
          500: '#7ae1bf',
          700: '#2dc895',
          800: '#1c7a5b',
          900: '#104936'
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
      }
    }
  },
  plugins: []
}
export default config
