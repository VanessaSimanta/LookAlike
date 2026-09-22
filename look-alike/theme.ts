import { createTheme, MantineColorsTuple } from '@mantine/core';

const brand: MantineColorsTuple = [
  '#FFFFFF', // white
  '#FAF9F6', // light cream
  '#F1F5F9', // light blue 1
  '#94A3B8', // light blue 2
  '#CBD5E1', // light gray
  '#E11D48', // red
  '#D9D9D9', // gray - brown
  '#475569', // dark gray
  '#0F172A', // dark blue
  '#0F172A', // black
];

export const theme = createTheme({
  colors: { brand },
  primaryColor: 'brand',
  primaryShade: { light: 6, dark: 8 },

  fontFamily: 'var(--font-sans, -apple-system, BlinkMacSystemFont, sans-serif)',

  headings: {
    fontFamily: 'var(--font-display, Georgia, serif)',
  },
});