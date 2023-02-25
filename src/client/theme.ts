import { extendTheme } from '@chakra-ui/react';

export const defaultTheme = extendTheme({
  colors: {
    brand: {
      100: '#f7fafc',
      900: '#1a202c',
    },
  },

  // Default to dark mode
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
});
