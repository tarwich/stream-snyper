import { Wrap } from '@chakra-ui/react';
import React from 'react';
import { useStreams } from '../lib/use-streams';
import { StreamCard } from './stream-card';

export const Streams = () => {
  const { streams } = useStreams();

  return (
    <Wrap p="sm">
      {streams.map((stream) => (
        <StreamCard key={stream.name} stream={stream} />
      ))}
    </Wrap>
  );
};
