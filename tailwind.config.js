/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: '#007AFF',
                'primary-light': '#4a9eff',
                'primary-supper-light': '#73b4ff',
                'primary-dark': '#0056b3',
                'pink-light': '#F0D9D9',
                'green-light': '#18C07A',
            },
        },
    },
    plugins: [],
};
