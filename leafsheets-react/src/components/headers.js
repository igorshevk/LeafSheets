// Imports

import { color, layout, space, typography, position, variant } from 'styled-system'
import styled from 'styled-components';

// Variants

const titleVariants = {
  xLarge: {
    backgroundColor: 'transparent',
    fontFamily: 'Barlow Condensed',
    fontSize: 58,
    fontWeight: '600',
    lineHeight: '64px',
  },
  large: {
    backgroundColor: 'transparent',
    fontFamily: 'Barlow Condensed',
    fontSize: 40,
    fontWeight: '500',
    lineHeight: '44px',
  },
  medium: {
    backgroundColor: 'transparent',
    fontFamily: 'Barlow Condensed',
    fontSize: 32,
    fontWeight: '500',
    lineHeight: '32px',
  },
  small: {
    backgroundColor: 'transparent',
    fontFamily: 'Barlow Condensed',
    fontSize: 24,
    fontWeight: '500',
    lineHeight: '32px',
  },
  xSmall: {
    backgroundColor: 'transparent',
    fontFamily: 'Roboto',
    fontSize: 18,
    fontWeight: '500',
    lineHeight: '24px',
  },
  xSmallNormal: {
    backgroundColor: 'transparent',
    fontFamily: 'Roboto',
    fontSize: 18,
    fontWeight: '400',
    lineHeight: '24px',
  }
}

// Components

const Title = styled.h3(
  {
    boxSizing: 'border-box',
    marginBottom: 16,
    marginTop: 0,
    textAlign: 'left',
  },
  color,
  space,
  layout,
  position,
  typography,
  variant({
    scale: 'titles',
    variants: titleVariants,
  })
)

Title.defaultProps = {
  variant: 'medium',
}

export { Title }