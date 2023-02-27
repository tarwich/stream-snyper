import { Wrap } from '@chakra-ui/react';
import React from 'react';
import { useStreams } from '../lib/use-streams';
import { StreamCard } from './stream-card';

const nameComparator = new Intl.Collator(undefined, {
  sensitivity: 'base',
  numeric: true,
});

export const Streams = () => {
  const { streams } = useStreams();

  return (
    <Wrap p="sm">
      {streams
        .slice()
        // Live streams first, then sort by name
        .sort((a, b) => {
          if (a.live && !b.live) {
            return -1;
          }
          if (!a.live && b.live) {
            return 1;
          }
          return nameComparator.compare(a.name, b.name);
        })
        .map((stream) => (
          <StreamCard key={stream.name} stream={stream} />
        ))}
    </Wrap>
  );
};
