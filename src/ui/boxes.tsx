import { Box } from '@chakra-ui/react';
import styled from '@emotion/styled';

export const HBox = styled(Box)``;

HBox.defaultProps = {
  display: 'flex',
  flexDirection: 'row',
  gridAutoFlow: 'column',
};

export const VBox = styled(Box)``;

VBox.defaultProps = {
  display: 'flex',
  flexDirection: 'column',
  gridAutoFlow: 'row',
};
