import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { PropsWithChildren } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Application } from './application';
import { ConfirmSignupPage } from './confirm-signup.page';
import { LandingPage } from './landing.page';
import { ConfigProvider, createConfig } from './lib/use-config';
import {
  createUserContext,
  useCurrentUser,
  UserProvider,
} from './lib/use-current-user';
import { defaultTheme } from './theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export const Wrapper = () => {
  const PROVIDERS = [
    // ChakraProvider
    (props: PropsWithChildren) => (
      <ChakraProvider theme={defaultTheme} children={props.children} />
    ),
    // BrowserRouter
    (props: PropsWithChildren) => <BrowserRouter children={props.children} />,
    // QueryClient
    (props: PropsWithChildren) => (
      <QueryClientProvider client={queryClient} children={props.children} />
    ),
    // ConfigProvider
    (props: PropsWithChildren) => (
      <ConfigProvider value={createConfig()} children={props.children} />
    ),
    // CurrentUserProvider
    (props: PropsWithChildren) => (
      <UserProvider value={createUserContext()} children={props.children} />
    ),
    // Router
    (props: PropsWithChildren) => {
      const { user } = useCurrentUser();
      const { hash } = useLocation();

      // See if there is a #confirmation_token in the URL
      const confirmationToken = new URLSearchParams(hash.slice(1)).get(
        'confirmation_token',
      );

      return (
        <Routes>
          {
            // If there is a confirmation token, show the confirmation page
            confirmationToken && (
              <Route
                path="*"
                element={
                  <ConfirmSignupPage confirmationToken={confirmationToken} />
                }
              />
            )
          }
          {
            // If there is a user, show the application
            user && <Route path="/home/*" element={<Application />} />
          }
          <Route path="*" element={<LandingPage />} />
        </Routes>
      );
    },
  ];

  return PROVIDERS.reduceRight(
    (children, Parent) => <Parent>{children}</Parent>,
    <></>,
  );
};
