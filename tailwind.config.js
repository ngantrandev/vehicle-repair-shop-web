/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: '#007AFF',
                'light-gray': '#F9F9F9',
                'primary-light': '#4a9eff',
                'primary-supper-light': '#73b4ff',
                'primary-dark': '#0056b3',
                'pink-light': '#F0D9D9',
                'green-light': '#18C07A',
                'success-50': '#ECFDF3',
                'success-500': '#12B76A',
                'success-700': '#027A48',
            },
        },
    },
    plugins: [],
};
