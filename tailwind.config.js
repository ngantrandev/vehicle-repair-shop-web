/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: '#007AFF',
                'primary-light': '#4a9eff',
                'primary-dark': '#0056b3',
            },
        },
    },
    plugins: [],
};
