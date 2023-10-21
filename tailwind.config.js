/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./*.html", "./js/*.js"],
    theme: {
        screens: {
            'xxxs': '320px',
            'xxs': '375px',
            'xs': '425px',
            'sm': '576px',
            // => @media (min-width: 576px) { ... }

            'md': '768px',
            // => @media (min-width: 960px) { ... }

            'lg': '1024px',
            'xl': '1280px',
            '2xl': '1536px',
            // => @media (min-width: 1440px) { ... }
        },
        extend: {
            colors: {
                clifford: '#da373d',
            }
        },
    },
    plugins: [],
  }
