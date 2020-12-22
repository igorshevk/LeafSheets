// Imports

import { color, layout, space, typography, position, variant } from 'styled-system'
import styled from 'styled-components';

// Variants

const inputVariants = {
  full: {
    color: "black",
    borderColor: 'normalGrey',
    flexBasis: ["100%", "100%"],
    "&:hover": {
      borderColor: "accent",
    },
    "&::placeholder": {
      textOverflow: 'ellipsis !important',
      color: 'normalGrey'
    }
  },
  half: {
    color: "black",
    borderColor: 'normalGrey',
    "&:hover": {
      borderColor: "accent",
    },
    "&::placeholder": {
      textOverflow: 'ellipsis !important',
      color: 'normalGrey'
    },
    flexBasis: ["48%", "48%"]
  },
  twoThird: {
    color: "black",
    borderColor: 'normalGrey',
    "&:hover": {
      borderColor: "accent",
    },
    "&::placeholder": {
      textOverflow: 'ellipsis !important',
      color: 'normalGrey'
    },
    flexBasis: ["100%", "65.5%"]
  },
  third: {
    color: "black",
    borderColor: 'normalGrey',
    "&:hover": {
      borderColor: "accent",
    },
    "&::placeholder": {
      textOverflow: 'ellipsis !important',
      color: 'normalGrey'
    },
    flexBasis: ["100%", "31%"]
  },
  fourth: {
    color: "black",
    borderColor: 'normalGrey',
    "&:hover": {
      borderColor: "accent",
    },
    "&::placeholder": {
      textOverflow: 'ellipsis !important',
      color: 'normalGrey'
    },
    flexBasis: ["100%", "24%"]
  }
}

// Components

const Input = styled.input(
  { 
    borderStyle: "solid",
    borderWidth: "1px",
    borderRadius: "4px",
    flexGrow: "0",
    fontFamily: "Barlow",
    fontSize: "18px",
    fontWeight: "400",
    height: "48px",
    lineHeight: "24px",
    marginBottom: "24px",
    minWidth: "0",
    paddingLeft: "20px",
    paddingRight: "20px",
    outline: "none",
  },
  color,
  space,
  layout,
  position,
  typography,
  variant({
    scale: 'inputs',
    variants: inputVariants,
  })
)

Input.defaultProps = {
  variant: 'full'
}

export { Input };