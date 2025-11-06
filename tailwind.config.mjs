/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,vue}"
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          background: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        },
        'red-50': 'oklch(.971 .013 17.38)',
        'red-600': 'oklch(.577 .245 27.325)',
        'red-700': 'oklch(.505 .213 27.518)',
        'amber-50': 'oklch(.987 .022 95.277)',
        'amber-100': 'oklch(.962 .059 95.617)',
        'amber-200': 'oklch(.924 .12 95.746)',
        'amber-600': 'oklch(.666 .179 58.318)',
        'amber-700': 'oklch(.555 .163 48.998)',
        'yellow-50': 'oklch(.987 .026 102.212)',
        'green-50': 'oklch(.982 .018 155.826)',
        'emerald-50': 'oklch(.979 .021 166.113)',
        'emerald-100': 'oklch(.95 .052 163.051)',
        'emerald-200': 'oklch(.905 .093 164.15)',
        'emerald-400': 'oklch(.765 .177 163.223)',
        'emerald-500': 'oklch(.696 .17 162.48)',
        'emerald-600': 'oklch(.596 .145 163.225)',
        'emerald-700': 'oklch(.508 .118 165.612)',
        'blue-50': 'oklch(.97 .014 254.604)',
        'blue-100': 'oklch(.932 .032 255.585)',
        'blue-200': 'oklch(.882 .059 254.128)',
        'blue-400': 'oklch(.707 .165 254.624)',
        'blue-600': 'oklch(.546 .245 262.881)',
        'blue-700': 'oklch(.488 .243 264.376)',
        'purple-100': 'oklch(.946 .033 307.174)',
        'purple-700': 'oklch(.496 .265 301.924)',
        'slate-50': 'oklch(.984 .003 247.858)',
        'slate-100': 'oklch(.968 .007 247.896)',
        'slate-200': 'oklch(.929 .013 255.508)',
        'slate-300': 'oklch(.869 .022 252.894)',
        'slate-400': 'oklch(.704 .04 256.788)',
        'slate-500': 'oklch(.554 .046 257.417)',
        'slate-600': 'oklch(.446 .043 257.281)',
        'slate-700': 'oklch(.372 .044 257.287)',
        'slate-800': 'oklch(.279 .041 260.031)',
        'slate-900': 'oklch(.208 .042 265.755)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xs: '.125rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      spacing: {
        'spacing': '.25rem',
      },
      container: {
        sm: '24rem',
        '2xl': '42rem',
        '3xl': '48rem',
        '4xl': '56rem',
      },
      fontSize: {
        xs: '.75rem',
        sm: '.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
      },
      letterSpacing: {
        tight: '-.025em',
      },
      lineHeight: {
        relaxed: '1.625',
      },
      blur: {
        md: '12px',
      },
    }
  },
  plugins: [require("tailwindcss-animate")],
}