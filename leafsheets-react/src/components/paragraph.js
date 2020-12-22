// Imports

import { color, flexbox, layout, space, typography, variant } from 'styled-system'
import styled from 'styled-components';

// Variants

const paragraphVariants = {
  large: {
    backgroundColor: 'transparent',
    color: 'black',
    fontFamily: 'Barlow',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: '24px',
  },
  medium: {
    backgroundColor: 'transparent',
    color: 'blueGrey',
    fontFamily: 'Barlow',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: '22px',
  },
  small: {
    backgroundColor: 'transparent',
    fontFamily: 'Barlow',
    fontSize: 13,
    fontWeight: '400',
    lineHeight: '20px',
  },
  menu: {
    backgroundColor: 'transparent',
    color: 'black',
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: '28px',
  },
  legal: {
    backgroundColor: 'transparent',
    color: 'black',
    fontFamily: 'Barlow',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: '20px',
  },
  footer: {
    backgroundColor: 'transparent',
    color: '#999999',
    fontFamily: 'Roboto',
    fontSize: 18,
    fontWeight: '400',
    lineHeight: '24px',
  },
  overlay: {
    backgroundColor: 'transparent',
    color: 'white',
    fontFamily: 'Barlow',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: '24px',
  }
}

// Components

const Paragraph = styled.p(
  {
    boxSizing: 'border-box',
    marginTop: 0,
    textAlign: 'left',
  },
  color,
  flexbox,
  space,
  layout,
  typography,
  variant({
    scale: 'paragraphs',
    variants: paragraphVariants,
  })
)

Paragraph.defaultProps = {
  variant: 'medium',
}

export { Paragraph }
