import { Box } from '@chakra-ui/react';
import React from 'react';
import { Auth } from './components/auth';
import { HBox, VBox } from './ui/boxes';
import { Pile } from './ui/pile';

export const LandingPage = () => {
  return (
    <VBox gap={'sm'}>
      <LandingPageHero />
    </VBox>
  );
};

const LandingPageHero = () => {
  return (
    <Pile>
      {/* Image */}
      <Box
        backgroundImage={'/landing/hero.webp'}
        backgroundSize={'cover'}
        backgroundPosition={'center 80%'}
        height={'500px'}
      />
      {/* Black overlay */}
      <Box bg={'blackAlpha.600'} />
      {/* Gradient that starts clear and fades to black for the last 10% */}
      <Box bgGradient={'linear(to-b, transparent, blackAlpha.900 90%)'} />
      {/* Hero name and callout */}
      <HBox display="grid" gridAutoColumns="1fr">
        <Box
          display={'flex'}
          flexDirection={'column'}
          placeContent={'start center'}
          gap={'md'}
          p={'lg'}
        >
          <Box
            as={'h1'}
            fontSize={'5xl'}
            fontWeight={'bold'}
            color={'white'}
            textShadow={'0 0 10px black'}
            textDecoration={'underline'}
            textDecorationColor={'white'}
          >
            Stream
            <Box as={'span'} color={'brand.500'}>
              Snyper
            </Box>
          </Box>
          <Box
            as={'p'}
            fontSize={'lg'}
            fontWeight={'medium'}
            color={'white'}
            textShadow={'0 0 10px black'}
          >
            Monitor multiple Twitch streams at once.
          </Box>
        </Box>

        <Auth placeSelf={'center'} />
      </HBox>
    </Pile>
  );
};
