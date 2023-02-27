import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalContent,
  ModalOverlay,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useStreams } from '../lib/use-streams';
import { VBox } from '../ui/boxes';

export type EditStreamModalProps = {
  name: string;
  isOpen: boolean;
  onClose: () => void;
};

export const EditStreamModal = (props: EditStreamModalProps) => {
  const { streams, addStream, updateStream, removeStream } = useStreams();
  const { register, handleSubmit, reset } = useForm<{
    name: string;
  }>({
    values: {
      name: props.name,
    },
  });
  const stream = streams.find((stream) => stream.name === props.name) || {
    name: '',
  };

  useEffect(() => {
    reset({ name: props.name });
  }, [props.isOpen]);

  useEffect(() => {
    reset({
      name: stream.name,
    });
  }, [stream.name, reset]);

  const onSubmit = handleSubmit((data) => {
    if (props.name) {
      updateStream(props.name, data);
    } else {
      addStream(data);
    }

    props.onClose();
  });

  const onDelete = () => {
    removeStream(props.name);
    props.onClose();
  };

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <VBox p="md" gap="sm" as="form" onSubmit={onSubmit}>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input {...register('name')} />
          </FormControl>

          {props.name && (
            <Button color="red.500" onClick={onDelete}>
              Delete
            </Button>
          )}

          <Button type="submit">Save</Button>
        </VBox>
      </ModalContent>
    </Modal>
  );
};
