/** @type {import('tailwindcss').Config} */
module.exports = {
  // This is the CRITICAL part. It tells Tailwind to scan all files 
  // inside your 'src' folder ending in .js, .jsx, .ts, or .tsx 
  // for class names like 'bg-gray-900' or 'flex'.
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
