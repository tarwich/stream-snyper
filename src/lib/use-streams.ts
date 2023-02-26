import { createContext, useContext, useEffect } from 'react';
import { useImmer } from 'use-immer';
import { useUpdateUserMutation } from './gotrue.queries';
import { useCurrentUser } from './use-current-user';

export type Stream = {
  name: string;
};

export const createStreamsContext = () => {
  const { user, accessToken } = useCurrentUser();
  const [streams, setStreams] = useImmer([] as Stream[]);

  const KEY = `streams-${user?.id ?? 'anonymous'}`;

  const updateUserMutation = useUpdateUserMutation(accessToken || '');

  useEffect(() => {
    if (!user) return;

    const streams = user?.user_metadata?.streams ?? [];

    setStreams((draft) => {
      draft.splice(0, draft.length, ...streams);
    });
  }, [KEY]);

  const saveStreams = () => {
    localStorage.setItem(KEY, JSON.stringify(streams));

    updateUserMutation.mutate({
      email: user?.email ?? '',
      data: { streams },
    });
  };

  useEffect(() => {
    saveStreams();
  }, [streams]);

  const addStream = (stream: Stream) => {
    setStreams((draft) => {
      draft.push(stream);
    });
  };

  const removeStream = (name: string) => {
    setStreams((draft) => {
      const index = draft.findIndex((s) => s.name === name);
      if (index === -1) return;
      draft.splice(index, 1);
    });
  };

  const updateStream = (name: string, stream: Stream) => {
    setStreams((draft) => {
      const index = draft.findIndex((s) => s.name === name);
      if (index === -1) return;
      draft[index] = stream;
    });
  };

  return {
    streams,
    addStream,
    removeStream,
    updateStream,
    isLoading: updateUserMutation.isLoading,
  };
};

export type StreamsContext = ReturnType<typeof createStreamsContext>;

export const StreamsContext = createContext<StreamsContext>({} as any);

export const StreamsProvider = StreamsContext.Provider;

export const useStreams = () => {
  return useContext(StreamsContext);
};
