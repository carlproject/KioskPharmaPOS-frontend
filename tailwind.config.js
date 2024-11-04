/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      animation: {
        'slide-in-out': 'slideInOut 4s ease-in-out',
      },
      keyframes: {
        slideInOut: {
          '0%, 100%': { opacity: 0, transform: 'translateY(20px)' },
          '10%, 90%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

