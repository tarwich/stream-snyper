import ms from 'ms';
import { useState } from 'react';
import { get, post } from './http';
import { useConfig } from './use-config';

/** Update the clientId every hour */
const UPDATE_INTERVAL = ms('1 hour');

export const useTwitch = () => {
  const { config } = useConfig();

  const [state, setState] = useState({
    clientId: localStorage.getItem('clientId') || '',
    updatedAt: Date.now(),
  });

  const getClientId = async () => {
    if (state.clientId && Date.now() - state.updatedAt < UPDATE_INTERVAL) {
      return state.clientId;
    }

    const { clientId } = await get<{ clientId: string }>(
      `${config.api.endpoint}/client-id`,
    );
    setState({ clientId, updatedAt: Date.now() });

    return clientId;
  };

  const getStreamInfo = async (streamName: string) => {
    const clientId = await getClientId();

    return post<{
      data: {
        user: {
          id: string;
          login: string;
          displayName: string;
          description: string;
          createdAt: string;
          roles: {
            isPartner: boolean;
          };
          stream: {
            id: string;
            title: string;
            type: string;
            viewersCount: number;
            createdAt: string;
            game: {
              name: string;
            };
          };
        };
      };
    }>(
      'https://gql.twitch.tv/gql',
      {
        variables: { login: streamName },
        query: `
          query($login: String!) {
            user(login: $login) {
              id
              login
              displayName
              description
              createdAt
              roles {
                isPartner
              }
              stream {
                id
                title
                type
                viewersCount
                createdAt
                game {
                  name
                }
              }
            }
          }
        `.trim(),
      },
      {
        headers: {
          'Client-ID': clientId,
          'Content-Type': 'text/plain',
          Origin: 'https://www.twitch.tv',
        },
      },
    );
  };

  return {
    getStreamInfo,
  };
};
