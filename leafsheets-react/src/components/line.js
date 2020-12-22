// Imports

import { color, space } from 'styled-system';
import styled from 'styled-components';

// Components

const Line = styled.hr(
  {
    boxSizing: 'border-box',
    borderTop: '1px solid #30E1A5',
    maxWidth: 'none',
    minWidth: 0,
    width: '100%',
  },
  color,
  space
)

export { Line }