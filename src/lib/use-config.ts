import React from 'react';
import { useImmer } from 'use-immer';

export const createConfig = () => {
  const auth = {
    endpoint: import.meta.env.VITE_AUTH_ENDPOINT,
  };

  const [config, updateConfig] = useImmer({ auth });

  return { config, setConfig: updateConfig };
};

export type Config = ReturnType<typeof createConfig>;

const ConfigContext = React.createContext({} as Config);
export const ConfigProvider = ConfigContext.Provider;

export const useConfig = () => {
  return React.useContext(ConfigContext);
};
