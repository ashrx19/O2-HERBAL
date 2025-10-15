module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#12372A',
        secondary: '#436850',
        accent: '#ADBC9F'
      },
      fontFamily: {
        heading: ['"Abril Fatface"', 'cursive'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      }
    }
  },
  plugins: []
}
