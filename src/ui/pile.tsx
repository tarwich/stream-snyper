// A pile is a grid where all items are overlaid on top of each other

import { Box } from '@chakra-ui/react';
import styled from '@emotion/styled';

export const Pile = styled(Box)`
  display: grid;
  grid-template: 'pile' 1fr / 1fr;

  > * {
    grid-area: pile;
  }
`;
