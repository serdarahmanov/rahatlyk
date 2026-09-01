import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#faf8f4',
          100: '#f0e8d8',
          200: '#dfd0b8',
          300: '#c8ad88',
          400: '#a88e6a',
          500: '#8a7256',
          600: '#6e5a44',
          700: '#524030',
          800: '#382c22',
          900: '#1e1611',
          950: '#0f0b07',
        },
      },
    },
  },
}

export default config
