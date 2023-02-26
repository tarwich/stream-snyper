import {
  Box,
  Button,
  Card,
  CardHeader,
  IconButton,
  Image,
  Stack,
} from '@chakra-ui/react';
import React, { ComponentProps } from 'react';
import { FaEdit } from 'react-icons/fa';
import { EditStreamModal } from './edit-stream-modal';

export type StreamCardProps = {
  name: string;
} & ComponentProps<typeof Card>;

export const StreamCard = (props: StreamCardProps) => {
  const { name, ...rest } = props;
  const [isEditing, setIsEditing] = React.useState(false);

  const lowerName = name.toLowerCase();

  return (
    <Card
      variant="elevated"
      rounded="lg"
      overflow="hidden"
      shadow="lg"
      size="sm"
      {...rest}
    >
      <CardHeader>
        <Stack direction="row" spacing="4">
          <Button
            variant="link"
            size="sm"
            as="a"
            href={`https://www.twitch.tv/${lowerName}`}
          >
            {name}
          </Button>
          <Box flex="1" />

          {/* Edit button */}
          <IconButton
            aria-label="Edit"
            icon={<FaEdit />}
            size="sm"
            padding="0"
            onClick={() => setIsEditing(true)}
          />
        </Stack>
      </CardHeader>
      <Image
        src={`https://static-cdn.jtvnw.net/previews-ttv/live_user_${lowerName}-440x248.jpg`}
        objectFit="cover"
        maxW="20rem"
      />
      <EditStreamModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        name={name}
      />
    </Card>
  );
};
