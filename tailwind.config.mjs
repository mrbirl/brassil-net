/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        background: '#F5F5F4',
        surface:    '#FFFFFF',
        ink:        '#0A0A0A',
        muted:      '#737373',
        rim:        '#E5E5E4',
        accent:     '#FF5C1F',
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        mono:  ['"IBM Plex Mono"', 'ui-monospace', '"SF Mono"', 'Menlo', 'monospace'],
      },
      letterSpacing: {
        display:         '-0.02em',
        'display-tight': '-0.025em',
        label:           '0.04em',
        'label-wide':    '0.08em',
      },
      borderRadius: {
        card:     '12px',
        'card-lg': '16px',
        pill:     '100px',
      },
      boxShadow: {
        card: '0 2px 20px rgba(0,0,0,0.07)',
      },
    },
  },
  plugins: [],
};
