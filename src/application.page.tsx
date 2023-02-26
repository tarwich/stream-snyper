import {
  Box,
  Button,
  IconButton,
  Image,
  Menu,
  MenuItem,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from '@chakra-ui/react';
import React from 'react';
import { FaDoorOpen, FaPlusCircle } from 'react-icons/fa';
import { EditStreamModal } from './components/edit-stream-modal';
import { Gravatar } from './components/gravatar';
import { Streams } from './components/streams';
import { useCurrentUser } from './lib/use-current-user';
import { HBox, VBox } from './ui/boxes';

export const Application = () => {
  const { user, clearTokens } = useCurrentUser();
  const [editingStream, setEditingStream] = React.useState(false);

  const addStream = () => {
    setEditingStream(true);
  };

  return (
    <VBox height="full">
      <HBox
        display="grid"
        gridTemplateColumns="auto 1fr auto"
        bgColor="gray.300"
        placeItems="center start"
        p="xs"
      >
        <Image src="/logo-right.png" h="8" />
        <span />

        <HBox gap="sm" placeItems="center end">
          {/* Button to add a stream */}
          <Button
            colorScheme="brand"
            size="sm"
            leftIcon={<FaPlusCircle />}
            onClick={addStream}
          >
            Add Stream
          </Button>

          {/* Gravatar */}
          <Popover size="sm">
            <PopoverTrigger>
              <IconButton p={0} aria-label="User">
                <Gravatar email={user?.email} size={32} />
              </IconButton>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>{user?.email}</PopoverHeader>
              <PopoverBody>
                <Menu isOpen={true}>
                  <MenuItem icon={<FaDoorOpen />} onClick={clearTokens}>
                    Logout
                  </MenuItem>
                </Menu>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </HBox>
      </HBox>

      <Box h="full" overflowY="auto">
        <Streams />
      </Box>

      <EditStreamModal
        onClose={() => setEditingStream(false)}
        isOpen={editingStream}
        name={''}
      />
    </VBox>
  );
};
