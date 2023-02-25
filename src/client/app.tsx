import { ChakraProvider } from '@chakra-ui/react';
import React, { PropsWithChildren } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { defaultTheme } from './theme';

// Chakra: (props: Children) => (
//   <ChakraProvider children={props.children} theme={defaultTheme} />
// ),
// Router: (props: Children) => <BrowserRouter children={props.children} />,

const Providers = (props: PropsWithChildren) => {
  const PROVIDERS = [
    (props: PropsWithChildren) => (
      <ChakraProvider theme={defaultTheme}>{props.children}</ChakraProvider>
    ),
    (props: PropsWithChildren) => (
      <BrowserRouter>{props.children}</BrowserRouter>
    ),
  ];

  return PROVIDERS.reduceRight(
    (children, Parent) => <Parent>{children}</Parent>,
    <>{props.children}</>,
  );
};

export const App = () => {
  return (
    <Providers>
      <Routes>
        <Route path="*" element={<b>The App</b>} />
      </Routes>
    </Providers>
  );
};
