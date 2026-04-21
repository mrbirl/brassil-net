/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        background: '#ECEAE5',
        surface:    '#FFFFFF',
        ink:        '#1A1917',
        muted:      '#6B6560',
        rim:        '#D9D5CF',
        subtle:     '#F2EFE8',
        accent:     '#B85C28',
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans:  ['Outfit', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        display:         '-0.02em',
        'display-tight': '-0.025em',
        label:           '0.08em',
        'label-wide':    '0.15em',
      },
      borderRadius: {
        card:     '16px',
        'card-sm': '12px',
        pill:     '100px',
      },
      boxShadow: {
        card: '0 2px 20px rgba(0,0,0,0.07)',
      },
    },
  },
  plugins: [],
};
