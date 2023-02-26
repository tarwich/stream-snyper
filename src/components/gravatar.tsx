import { Image, ImageProps } from '@chakra-ui/react';
import { md5 } from 'hash-wasm';
import React, { useEffect, useState } from 'react';

export type GravatarProps = {
  email?: string;
  size?: number;
} & ImageProps;

export const Gravatar = (props: GravatarProps) => {
  const { email, size = 80, ...rest } = props;
  const [hash, setHash] = useState<string>();
  const url = `https://www.gravatar.com/avatar/${hash}?s=${size}&d=retro`;

  useEffect(() => {
    if (!email) return;
    let isMounted = true;

    md5(email.trim().toLowerCase()).then((hash) => {
      if (isMounted) setHash(hash);
    });

    return () => {
      isMounted = false;
    };
  }, [email]);

  if (!hash) return null;

  return <Image src={url} borderRadius="full" placeSelf="center" {...rest} />;
};
