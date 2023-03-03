import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { type PropsWithChildren } from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { Application } from './application.page';
import { ConfirmSignupPage } from './confirm-signup.page';
import { LandingPage } from './landing.page';
import { ConfigProvider, createConfig } from './lib/use-config';
import {
  createUserContext,
  useCurrentUser,
  UserProvider,
} from './lib/use-current-user';
import { createStreamsContext, StreamsProvider } from './lib/use-streams';
import { defaultTheme } from './theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

export const Wrapper = () => {
  const PROVIDERS = [
    // ChakraProvider
    (props: PropsWithChildren) => (
      <ChakraProvider theme={defaultTheme}>{props.children}</ChakraProvider>
    ),
    // BrowserRouter
    BrowserRouter,
    // QueryClient
    (props: PropsWithChildren) => (
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    ),
    // ConfigProvider
    (props: PropsWithChildren) => (
      <ConfigProvider value={createConfig()}>{props.children}</ConfigProvider>
    ),
    // CurrentUserProvider
    (props: PropsWithChildren) => (
      <UserProvider value={createUserContext()}>{props.children}</UserProvider>
    ),
    // StreamsProvider
    (props: PropsWithChildren) => (
      <StreamsProvider value={createStreamsContext()}>
        {props.children}
      </StreamsProvider>
    ),
    // Router
    (props: PropsWithChildren) => {
      const { user } = useCurrentUser();
      const { hash } = useLocation();
      const navigate = useNavigate();
      /** Should redirect when user becomes valid */
      const [shouldRedirect, setShouldRedirect] = React.useState(user === null);

      React.useEffect(() => {
        if (user != null && shouldRedirect) {
          navigate('/home');
        }
      }, [user, shouldRedirect, navigate]);

      // See if there is a #confirmation_token in the URL
      const confirmationToken =
        new URLSearchParams(hash.slice(1)).get('confirmation_token') ?? '';

      return (
        <Routes>
          {
            // If there is a confirmation token, show the confirmation page
            Boolean(confirmationToken) && (
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
            user != null && <Route path="/home/*" element={<Application />} />
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
