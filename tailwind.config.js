/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.ejs"
  ],
  theme: {
    extend: {
      animation : {
        marquee : "marquee 10s linear infinite"
      },
      fontSize: {
        'fluid-lg': 'clamp(0.75rem, 1vw + 1rem, 2rem)',
      },
      keyframes : {
        marquee : {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-250%)'},
        }
      }
    },
  },
  plugins: [require('tailwindcss-motion')],
}

