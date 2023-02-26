import { useEffect } from 'react';
import { useImmer } from 'use-immer';
import { useCurrentUser } from './use-current-user';

export type Stream = {
  name: string;
};

export const useStreams = () => {
  const { user } = useCurrentUser();
  const [streams, setStreams] = useImmer([
    { name: 'xQc' },
    { name: 'summit1g' },
    { name: 'sodapoppin' },
    { name: 'amouranth' },
    { name: 'justaminx' },
    { name: 'lirik' },
  ] as Stream[]);

  const KEY = `streams-${user?.id ?? 'anonymous'}`;

  const writeStreams = (streams: Stream[]) => {
    localStorage.setItem(KEY, JSON.stringify(streams));
  };

  useEffect(() => {
    if (!user) return;

    const streams = JSON.parse(localStorage.getItem(KEY) ?? '[]');

    setStreams((draft) => {
      draft.splice(0, draft.length, ...streams);
    });
  });

  const addStream = (stream: Stream) => {
    console.log(stream);
    setStreams((draft) => {
      draft.push(stream);
      writeStreams(draft);
    });
  };

  const removeStream = (name: string) => {
    setStreams((draft) => {
      const index = draft.findIndex((s) => s.name === name);
      if (index === -1) return;
      draft.splice(index, 1);
      writeStreams(draft);
    });
  };

  const updateStream = (name: string, stream: Stream) => {
    console.log(name, stream);
    setStreams((draft) => {
      const index = draft.findIndex((s) => s.name === name);
      if (index === -1) return;
      draft[index] = stream;
      writeStreams(draft);
    });
  };

  return { streams, addStream, removeStream, updateStream };
};
