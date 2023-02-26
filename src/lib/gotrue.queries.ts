import { useMutation, useQuery } from '@tanstack/react-query';
import { get, post, put } from './http';
import { useConfig } from './use-config';

// #region TokenMutation

export type TokenMutationParameters =
  | {
      grant_type: 'password';
      /** Actually an email */
      username: string;
      password: string;
    }
  | {
      grant_type: 'refresh_token';
      refresh_token: string;
    };

export type TokenMutationResult = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
};

export const useTokenMutation = () => {
  const { config } = useConfig();

  const mutation = useMutation<
    TokenMutationResult,
    string,
    TokenMutationParameters
  >(['login'], async (parameters) => {
    const result = await post(
      `${config.auth.endpoint}/token?${new URLSearchParams(parameters)}`,
    ).catch((error) => {
      return Promise.reject(
        error.msg || error.error_description || error.error || error,
      );
    });

    return result;
  });

  return mutation;
};

// #endregion TokenMutation

// #region GetUserQuery

export type GetUserResult = {
  id: string;
  email: string;
  confirmation_sent_at: string;
  created_at: string;
  updated_at: string;
};

export const useGetUserQuery = (accessToken: string) => {
  const { config } = useConfig();

  const query = useQuery<GetUserResult, string>(
    ['user', accessToken],
    async () => {
      const result = await get(
        `${config.auth.endpoint}/user`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      ).catch((error) => {
        return Promise.reject(error.msg || error.error || error);
      });

      return result;
    },
    {
      enabled: !!accessToken,
    },
  );

  return query;
};

// #endregion GetUserQuery

// #region UpdateUserMutation

export type UpdateUserMutationParameters = {
  email: string;
  password?: string;
  data?: Record<string, any>;
};

export type UpdateUserMutationResult = GetUserResult;

export const useUpdateUserMutation = (accessToken: string) => {
  const { config } = useConfig();

  const mutation = useMutation<
    UpdateUserMutationResult,
    string,
    UpdateUserMutationParameters
  >(['user', accessToken], async (parameters) => {
    const result = await put(`${config.auth.endpoint}/user`, parameters, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).catch((error) => {
      return Promise.reject(error.msg || error.error || error);
    });

    return result;
  });

  return mutation;
};

// #endregion UpdateUserMutation
