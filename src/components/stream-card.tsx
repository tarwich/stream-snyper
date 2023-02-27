import {
  Box,
  Button,
  Card,
  CardHeader,
  IconButton,
  Image,
  Text,
} from '@chakra-ui/react';
import React, { ComponentProps } from 'react';
import { FaCircle, FaEdit } from 'react-icons/fa';
import { Stream } from '../lib/use-streams';
import { HBox } from '../ui/boxes';
import { EditStreamModal } from './edit-stream-modal';

export type StreamCardProps = {
  stream: Stream;
} & ComponentProps<typeof Card>;

export const StreamCard = (props: StreamCardProps) => {
  const { stream, ...rest } = props;
  const [isEditing, setIsEditing] = React.useState(false);

  const lowerName = stream.name.toLowerCase();

  // const clientIdQuery = useClientIdQuery();

  return (
    <Card
      variant="elevated"
      rounded="lg"
      overflow="hidden"
      shadow="lg"
      size="sm"
      maxW="20rem"
      {...rest}
    >
      <CardHeader>
        <HBox
          display="grid"
          gridTemplateColumns="auto auto 1fr auto"
          placeItems="center start"
          gap="4"
        >
          <Box p="0" color={stream.live ? 'green.500' : 'red.500'}>
            <FaCircle />
          </Box>

          <Button
            variant="link"
            size="sm"
            as="a"
            href={`https://www.twitch.tv/${lowerName}`}
          >
            {stream.name}
          </Button>

          <Text noOfLines={1} fontSize="sm" color="gray.500">
            {stream.game}
          </Text>

          {/* Edit button */}
          <IconButton
            aria-label="Edit"
            icon={<FaEdit />}
            size="sm"
            padding="0"
            onClick={() => setIsEditing(true)}
          />
        </HBox>
      </CardHeader>
      <Image
        src={`https://static-cdn.jtvnw.net/previews-ttv/live_user_${lowerName}-440x248.jpg`}
        objectFit="cover"
        maxW="20rem"
      />
      <EditStreamModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        name={stream.name}
      />
    </Card>
  );
};
