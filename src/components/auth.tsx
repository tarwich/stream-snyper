import {
  Alert,
  Button,
  Card,
  CardBody,
  CardProps,
  Center,
  Heading,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useTokenMutation } from '../lib/gotrue.queries';
import { useCurrentUser } from '../lib/use-current-user';
import { useSignupMutation } from './auth.queries';

export const Auth = (props: CardProps) => {
  const [mode, setMode] = React.useState<'login' | 'signup'>('login');

  const switchMode = useCallback(() => {
    setMode((mode) => (mode === 'login' ? 'signup' : 'login'));
  }, []);

  return (
    <Card size="lg" variant="elevated" w="50vw" maxW="lg" {...props}>
      <CardBody>{mode === 'login' ? <LoginForm /> : <SignupForm />}</CardBody>

      <Center mb={4}>
        {mode === 'login' ? (
          <Text size="lg">
            Don't have an account?{' '}
            <Button variant="link" onClick={switchMode}>
              Sign up
            </Button>
          </Text>
        ) : (
          <Text size="lg">
            Already have an account?{' '}
            <Button variant="link" onClick={switchMode}>
              Login
            </Button>
          </Text>
        )}
      </Center>
    </Card>
  );
};

const SignupForm = () => {
  type SignupForm = {
    email: string;
    password: string;
  };
  const { register, handleSubmit } = useForm<SignupForm>();
  const signupMutation = useSignupMutation();

  const onSubmit = async (data: SignupForm) => {
    signupMutation.mutate(data);
  };

  return (
    <Stack gap="md" as="form" onSubmit={handleSubmit(onSubmit)} w="100%">
      <Heading size="md">Sign up</Heading>
      <Input {...register('email')} placeholder="Email" />
      <Input {...register('password')} type="password" placeholder="Password" />
      <Button type="submit" disabled={signupMutation.isLoading}>
        Sign up
      </Button>
      {signupMutation.isLoading && <Alert status="info">Loading...</Alert>}
      {signupMutation.error && (
        <Alert status="error">{signupMutation.error?.msg}</Alert>
      )}
    </Stack>
  );
};

const LoginForm = () => {
  const { setToken } = useCurrentUser();
  const { register, handleSubmit } = useForm<{
    email: string;
    password: string;
  }>();

  const loginMutation = useTokenMutation();

  const onSubmit = handleSubmit((data) => {
    loginMutation.mutate(
      {
        grant_type: 'password',
        username: data.email,
        password: data.password,
      },
      {
        onSuccess: (data) => {
          setToken({
            refreshToken: data.refresh_token,
            accessToken: data.access_token,
          });
        },
      },
    );
  });

  return (
    <Stack gap="md" as="form" onSubmit={onSubmit} w="100%">
      <Heading size="md">Login</Heading>
      <Input {...register('email')} placeholder="Email" />
      <Input {...register('password')} type="password" placeholder="Password" />
      <Button type="submit" disabled={loginMutation.isLoading}>
        Login
      </Button>
      {loginMutation.isLoading && <Alert status="info">Loading...</Alert>}
      {loginMutation.error && (
        <Alert status="error">{loginMutation.error}</Alert>
      )}
      {loginMutation.isSuccess && <Alert status="success">Logged in</Alert>}
    </Stack>
  );
};
