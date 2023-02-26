import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useConfirmSignupMutation } from './confirm-signup.queries';

export type ConfirmSignupPageProps = {
  confirmationToken: string;
};

export const ConfirmSignupPage = (props: ConfirmSignupPageProps) => {
  return (
    <Box w="100vw" h="100vh" bgImage="/landing/hero.webp" bgSize="cover">
      <Modal isOpen={true} isCentered onClose={() => {}}>
        {/* <ModalOverlay background="blackAlpha.800" /> */}
        <ModalOverlay
          bgGradient={
            'radial-gradient(circle at center, transparent 0, black 100%)'
          }
        />
        <ModalContent>
          <ModalHeader>Confirm Account</ModalHeader>
          <ModalBody>
            <Confirm confirmationToken={props.confirmationToken} />
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

type ConfirmProps = {
  confirmationToken: string;
};

/** Show an alert with a circular spinner while the confirmation is in progress. */
const Confirm = (props: ConfirmProps) => {
  const location = useLocation();
  const confirmSignupMutation = useConfirmSignupMutation();

  // Confirm the account when the component mounts
  useEffect(() => {
    confirmSignupMutation.mutate({ token: props.confirmationToken });
  }, [props.confirmationToken]);

  // On error, show Error
  if (confirmSignupMutation.isError) {
    return <ErrorMessage message={confirmSignupMutation.error.msg} />;
  }

  // On success, show Success
  // if (confirmSignupMutation.isSuccess) {
  //   return <Success />;
  // }

  return (
    <Alert
      status="info"
      variant="subtle"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      height="200px"
      borderRadius="md"
    >
      <Spinner size="lg" />
      <AlertTitle mt={4} mb={1} fontSize="lg">
        Confirming account
      </AlertTitle>
      <AlertDescription>
        Please wait while we confirm your account...
      </AlertDescription>
    </Alert>
  );
};

type ErrorMessageProps = {
  message: string;
};

const ErrorMessage = (props: ErrorMessageProps) => {
  return (
    <Alert
      status="error"
      variant="subtle"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      height="200px"
      borderRadius="md"
    >
      <AlertIcon boxSize="40px" mr={0} />
      <AlertTitle mt={4} mb={1} fontSize="lg">
        Error confirming account
      </AlertTitle>
      <AlertDescription>{props.message}</AlertDescription>
    </Alert>
  );
};

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // In 3 seconds, remove the confirmation_token from the hash, but don't remove
  // the rest of the hash.
  useEffect(() => {
    setTimeout(() => {
      const searchParams = new URLSearchParams(location.hash.slice(1));
      searchParams.delete('confirmation_token');
      const newUrl = `${location.pathname}${
        location.search
      }#${searchParams.toString()}`.replace(/#$/, '');
      navigate(newUrl);
    }, 2000);
  }, [location.pathname]);

  return (
    <Alert
      status="success"
      variant="subtle"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      height="200px"
      borderRadius="md"
    >
      <AlertIcon boxSize="40px" mr={0} />
      <AlertTitle mt={4} mb={1} fontSize="lg">
        Account confirmed!
      </AlertTitle>
    </Alert>
  );
};
