import { useMutation } from '@tanstack/react-query';
import { post } from '../lib/http';
import { useConfig } from '../lib/use-config';

export type SignupMutationParameters = {
  email: string;
  password: string;
};

export type SignupMutationResult = {
  id: string;
  email: string;
  confirmation_sent_at: string;
  created_at: string;
  updated_at: string;
};

export const useSignupMutation = () => {
  const { config } = useConfig();

  const mutation = useMutation<
    SignupMutationResult,
    { code: number; msg: string },
    SignupMutationParameters
  >(['signup'], async (parameters) => {
    const result = await post(`${config.auth.endpoint}/signup`, parameters);

    return result;
  });

  return mutation;
};
