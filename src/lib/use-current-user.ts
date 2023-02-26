import React, { useEffect } from 'react';
import { useImmer } from 'use-immer';
import { useGetUserQuery, useTokenMutation } from './gotrue.queries';

export type User = {
  id: string;
  email: string;
  user_metadata?: any;
};

const REFRESH_TOKEN_KEY = 'token';

export const createUserContext = () => {
  const [state, setState] = useImmer<{
    refreshToken: string | null;
    accessToken: string | null;
    user: User | null;
  }>({
    refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
    accessToken: null,
    user: null,
  });
  const tokenMutation = useTokenMutation();

  const setToken = (
    tokens:
      | { refreshToken: string; accessToken?: string }
      | { refreshToken?: string; accessToken: string },
  ) => {
    setState((draft) => {
      if (tokens.refreshToken) {
        draft.refreshToken = tokens.refreshToken;
        localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
      }
      if (tokens.accessToken) draft.accessToken = tokens.accessToken;
    });
  };

  const clearTokens = () => {
    setState((draft) => {
      draft.refreshToken = null;
      draft.accessToken = null;
      draft.user = null;
    });
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  };

  const refreshAccessToken = async () => {
    if (!state.refreshToken) return;
    if (state.accessToken) return;

    tokenMutation.mutate(
      {
        grant_type: 'refresh_token',
        refresh_token: state.refreshToken,
      },
      {
        onSuccess: (result) => {
          setToken({
            refreshToken: result.refresh_token,
            accessToken: result.access_token,
          });
        },
        onError: (error) => {
          setState((draft) => {
            draft.accessToken = null;
          });
          console.error(error);
        },
      },
    );
  };

  // When the refresh token changes, get a new access token
  useEffect(() => void refreshAccessToken(), [state.refreshToken]);

  // When the access token changes, get the current user
  const getUserQuery = useGetUserQuery(state.accessToken ?? '');

  // When the current user changes, update the user state
  useEffect(() => {
    if (getUserQuery.data) {
      setState((draft) => {
        draft.user = getUserQuery.data;
      });
    }
  }, [getUserQuery.data]);

  return {
    user: state.user,
    setToken,
    clearTokens,
    accessToken: state.accessToken,
  };
};

export type UserContext = ReturnType<typeof createUserContext>;

const UserContext = React.createContext({} as UserContext);

export const UserProvider = UserContext.Provider;

export const useCurrentUser = () => {
  return React.useContext(UserContext);
};
