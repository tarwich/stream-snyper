import { useMutation } from '@tanstack/react-query';
import { post } from './lib/http';
import { useConfig } from './lib/use-config';

export type ConfirmSignupMutationParameters = {
  token: string;
};

export type ConfirmSignupMutationResult = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
};

export const useConfirmSignupMutation = () => {
  const { config } = useConfig();

  const mutation = useMutation<
    ConfirmSignupMutationResult,
    { code: number; msg: string },
    ConfirmSignupMutationParameters
  >(['confirm-signup'], async (parameters) => {
    const result = await post(`${config.auth.endpoint}/verify`, {
      type: 'signup',
      token: parameters.token,
    });

    return result;
  });

  return mutation;
};
