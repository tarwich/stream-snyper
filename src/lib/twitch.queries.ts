import { useQuery } from '@tanstack/react-query';
import ms from 'ms';
import { get, post } from './http';
import { useConfig } from './use-config';

// #region ClientIdQuery

export type ClientIdQueryParams = never;

export type ClientIdQueryResult = {
  clientId: string;
};

// Call the .netlify/functions/client-id endpoint to get the client ID
export const useClientIdQuery = () => {
  const { config } = useConfig();
  const clientId = localStorage.getItem('clientId');

  const clientIdQuery = useQuery(
    ['clientId'],
    () => get<ClientIdQueryResult>(`${config.api.endpoint}/client-id`),
    {
      cacheTime: ms('1 hour'),
      ...(clientId ? { initialData: { clientId } } : {}),
    },
  );

  return clientIdQuery;
};

// #endregion ClientIdQuery

// #region StreamInfoQuery

export type StreamInfoQueryParams = { streamName: string };
export type StreamInfoQueryResult = {
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

export const useStreamInfoQuery = (streamName: string) => {
  const clientIdQuery = useClientIdQuery();

  const streamInfoQuery = useQuery(
    ['streamInfo', streamName],
    () =>
      post('https://gql.twitch.tv/gql', {
        headers: {
          'Client-ID': clientIdQuery.data,
          'Content-Type': 'text/plain',
          Origin: 'https://www.twitch.tv',
        },
        body: JSON.stringify({
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
        }),
      }),
    {
      enabled: !!clientIdQuery.data,
    },
  );

  return streamInfoQuery;
};

// #endregion StreamInfoQuery
