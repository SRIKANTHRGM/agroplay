/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./App.tsx",
        "./index.tsx"
    ],
    theme: {
        extend: {
            colors: {
                'neon-green': '#22c55e',
                'neon-blue': '#3b82f6',
            },
        },
    },
    plugins: [],
}
