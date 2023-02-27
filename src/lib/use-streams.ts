import { createContext, useContext, useEffect } from 'react';
import { useImmer } from 'use-immer';
import { useUpdateUserMutation } from './gotrue.queries';
import { useConfig } from './use-config';
import { useCurrentUser } from './use-current-user';
import { useTwitch } from './use-twitch';

/** Streams are considered stale after 30 seconds */
const STALE_AFTER = 30 * 1000;

export type Stream = {
  name: string;
  lastUpdated?: number;
  stale?: boolean;
  game?: string;
  live?: boolean;
};

const serializeStreams = (streams: Stream[]) => {
  return streams.map((s) => ({
    name: s.name,
    lastUpdated: s.lastUpdated,
    game: s.game,
    live: s.live,
  }));
};

const deserializeStreams = (streams: any[] = []) => {
  return streams.map((s) => ({
    name: s.name,
    lastUpdated: s.lastUpdated,
    game: s.game,
    live: s.live,
  }));
};

const getOldestStream = (streams: Stream[]) => {
  const DEFAULT = { lastUpdated: Infinity } as Stream;
  let oldestStream = DEFAULT;

  for (const stream of streams) {
    if (!stream.lastUpdated) return stream;
    if (stream.lastUpdated < (oldestStream.lastUpdated || Infinity)) {
      oldestStream = stream;
    }
  }

  if (oldestStream === DEFAULT) return undefined;

  return oldestStream;
};

const getStreamToUpdate = (streams: Stream[]) => {
  const oldestStream = getOldestStream(streams);

  if (!oldestStream) return undefined;

  // If the found item is younger than STALE_AFTER, then it's not stale
  if (Date.now() - (oldestStream.lastUpdated || 0) < STALE_AFTER) {
    return undefined;
  }

  return oldestStream;
};

export const createStreamsContext = () => {
  const { config } = useConfig();
  const { user, accessToken } = useCurrentUser();
  const [streams, setStreams] = useImmer([] as Stream[]);
  const { getStreamInfo } = useTwitch();

  const KEY = `streams-${user?.id ?? 'anonymous'}`;

  const updateUserMutation = useUpdateUserMutation(accessToken || '');

  useEffect(() => {
    if (!user) return;

    const streams = deserializeStreams(user?.user_metadata?.streams);

    setStreams(streams);
  }, [user?.user_metadata?.streams]);

  const saveStreams = (newStreams = streams) => {
    const serializedStreams = serializeStreams(newStreams);

    updateUserMutation.mutate({
      email: user?.email ?? '',
      data: { streams: serializedStreams },
    });
  };

  const addStream = (stream: Stream) => {
    const newStreams = [...streams, stream];
    setStreams(newStreams);
    saveStreams(newStreams);
  };

  const removeStream = (name: string) => {
    console.log('removeStream', name);
    const newStreams = streams.filter((s) => s.name !== name);
    setStreams(newStreams);
    saveStreams(newStreams);
  };

  const updateStream = (name: string, stream: Stream, save = true) => {
    console.log('updateStream', name, stream);
    const newStreams = streams.map((s) => (s.name === name ? stream : s));
    setStreams(newStreams);
    if (save) saveStreams(newStreams);
  };

  const refreshStream = async (stream: Stream) => {
    try {
      const streamInfo = await getStreamInfo(stream.name);
      console.log('refreshStream', stream.name, streamInfo);

      const live = !!streamInfo?.data?.user?.stream;

      if (live) {
        await fetch(
          `https://static-cdn.jtvnw.net/previews-ttv/live_user_${stream.name?.toLowerCase()}-440x248.jpg`,
          { cache: 'reload' },
        );
      }

      const newStream = {
        ...stream,
        lastUpdated: Date.now(),
        live: live,
        game: streamInfo?.data?.user?.stream?.game?.name,
      };

      updateStream(stream.name, newStream, true);
    } catch (err) {
      console.error('refreshStream error', err);

      // Mark the stream as updated so we don't try to update it again
      updateStream(stream.name, { ...stream, lastUpdated: Date.now() }, true);
    }
  };

  // Set a timer to wait one second, then find the oldest stream and update it.
  // After the update, set a new timer to wait one second, plus a random amount
  // of time between 0 and 2 seconds. Then repeat.
  useEffect(() => {
    let running = true;

    const tick = () => {
      if (!running) return;
      const stream = getStreamToUpdate(streams);
      if (stream) refreshStream(stream);
      setTimeout(tick, 1000 + Math.random() * 5000);
    };

    setTimeout(tick, 1000 + Math.random() * 5000);

    return () => {
      running = false;
    };
  }, [streams]);

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
