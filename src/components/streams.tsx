// Preview
// https://static-cdn.jtvnw.net/previews-ttv/live_user_kaicenat-440x248.jpg

import { Wrap } from '@chakra-ui/react';
import React from 'react';
import { useStreams } from '../lib/use-streams';
import { StreamCard } from './stream-card';

const streams = [
  {
    name: 'xQc',
  },
  {
    name: 'summit1g',
  },
  {
    name: 'sodapoppin',
  },
  {
    name: 'amouranth',
  },
  {
    name: 'justaminx',
  },
  {
    name: 'lirik',
  },
];

export const Streams = () => {
  const { streams } = useStreams();

  return (
    <Wrap>
      {streams.map((stream) => (
        <StreamCard key={stream.name} {...stream} />
      ))}
    </Wrap>
  );
};
