import { DeepPartial, extendTheme, Theme } from '@chakra-ui/react';

export const defaultTheme = extendTheme({
  colors: {
    brand: {
      100: '#a5c9e1',
      200: '#6aaed6',
      300: '#2490c5',
      400: '#1f7ebd',
      500: '#1779bc',
      600: '#156da9',
      700: '#125c86',
      800: '#0e4963',
      900: '#0a2f38',
    },
  },

  space: {
    sm: '1rem',
    md: '2rem',
    lg: '4rem',
  },

  // Default to dark mode
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
    cssVarPrefix: 'snyper',
  },
} as DeepPartial<Theme>);

console.log(defaultTheme);
