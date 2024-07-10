
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,jsx,php}',
    './frontend-component-header/src/**/*.{html,js,jsx,php}',
  ],
  darkMode: 'class',
  prefix: 'tw-', // prefix for all classes
  theme: {
    container: {
      center: true,
      screens: {
        sm: '100%',
        md: '100%',
        lg: '1024px',
        xl: '1280px',
      },
    },
    borderWidth: {
      DEFAULT: '1.5px',
      0: '0',
      2: '2px',
      3: '3px',
      4: '4px',
      6: '6px',
      8: '8px',
    },
    extend: {
      gridTemplateColumns: {
        16: 'repeat(16, minmax(0, 1fr))',
      },
      gridColumn: {
        'span-14': 'span 14 / span 14',
        'span-15': 'span 15 / span 15',
        'span-16': 'span 16 / span 16',
      },
      gridColumnStart: {
        13: '13',
        14: '14',
        15: '15',
        16: '16',
        17: '17',
      },
      gridColumnEnd: {
        13: '13',
        14: '14',
        15: '15',
        16: '16',
        17: '17',
      },
      fontFamily: {
        grotesk: ['grotesk', 'sans-serif'],
        mursGothic: ['MursGothic', 'serif'],
      },
      colors: {
        dark: '#2c1005',
        mainOrange: '#e67d2d',
        lightOrange: '#ffcba4',
        lighterOrange: '#fcf1ed',
        mainPurple: '#7a00ad',
        lightPurple: '#e6afff',
        blue: '#0041be',
        lightBlue: '#87bee1',
        body: '#F9F8F4',
        gray: {
          100: '#f9f9f9',
          200: '#8E8E8E',
          300: '#f5f5f5',
        },
        orange: {
          100: '#fffcfa',
          200: '#fdf2e7',
          300: '#f9d5b3',
          400: '#f6b77e',
          500: '#f39949',
          600: '#e67d2d',
          700: '#ce5b00',
          800: '#542600',
          900: '#2c1005',
          1000: '#180c02',
        },
        purple: {
          100: '#fcf5ff',
          200: '#f8e5ff',
          300: '#daabea',
          400: '#ba72d5',
          500: '#9a39c0',
          600: '#6923aa',
          700: '#66008e',
          800: '#3c0054',
          900: '#270037',
          1000: '#12001a',
        },
        neutral: {
          100: '#ffffff',
          200: '#e8e8e9',
          300: '#dddddd',
          400: '#bbbbbd',
          500: '#909193',
          600: '#606164',
          700: '#494a4e',
          800: '#333438',
          900: '#1c1d22',
          1000: '#110f12',
        },
        system: {
          navy: '#344150',
          blueLight: '#F4F6F9',
          green: '#00d759',
          mint: '#dbffe7',
          red: '#ff1f2d',
          lightRed: '#ffedee',
          yellow: '#ffb61e',
          lightYellow: '#fff5e1',
        },
      },
    },
  },
  // corePlugins: {
  //   preflight: false, // remove default styles
  // },
  plugins: [],
};
