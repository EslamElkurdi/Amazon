/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        amazonclone: {
          background: '#EAEDED',
          light_blue: '#232F3A',
          yellow: '#FEBD69',
          DEFAULT: '#131921',
        },
      },
      fontFamily: {
        amazone: ["'Amazon Ember', Arial, sans-serif"],
      },
      borderColor: {
        amazoneInput: '#007185',
      },
      boxShadow: {
        amazoneInput: '0 0 0 3px #c8f3fa, 0 1px 2px rgba(15,17,17,.15) inset',
        amazoneInputError: '0 0 0 1px #cc0c39 inset;',
        continueButton: '0 0 0 3px #c8f3fa, inset 0 0 0 2px #fff',
        createButton: '0 2px 5px 0 rgba(213,217,217,.5)',
        line: '3px 3px 5px 1px rgba(213, 217, 217, .5)',
        EditButton: '0 2px 5px 0 rgba(213,217,217,.5)',
      },
    },
  },
  plugins: [],
};


// theme: {
//     container: {
//       center: true,
//     },
//     extend: {
      // fontFamily: {
      //   amazone: ["'Amazon Ember', Arial, sans-serif"],
      // },
      // borderColor: {
      //   amazoneInput: '#007185',
      // },
      // boxShadow: {
      //   amazoneInput: '0 0 0 3px #c8f3fa, 0 1px 2px rgba(15,17,17,.15) inset',
      //   amazoneInputError: '0 0 0 1px #cc0c39 inset;',
      //   continueButton: '0 0 0 3px #c8f3fa, inset 0 0 0 2px #fff',
      //   createButton: '0 2px 5px 0 rgba(213,217,217,.5)',
      //   line: '3px 3px 5px 1px rgba(213, 217, 217, .5)',
      //   EditButton:'0 2px 5px 0 rgba(213,217,217,.5)',
      // },
//     },
//   },
