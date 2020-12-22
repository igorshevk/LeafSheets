// Imports

import { 
  border,
  buttonStyle, 
  color, 
  layout, 
  space, 
  position, 
  typography, 
  variant } from 'styled-system';
import styled from 'styled-components'

// Variants
    
const buttonVariants = {
  pill: {
    color: 'primary',
    backgroundColor: 'transparent',
    border: 'solid',
    borderColor: 'primary',
    borderRadius: 42,
    borderWidth: 1,
    paddingTop: "0",
    paddingBottom: "4px",
    '&:hover': {
      borderColor: 'accent',
      color: 'accent',
    },
  },
  box: {
    color: 'primary',
    backgroundColor: 'secondaryBg',
    border: 'solid',
    borderColor: 'accent',
    borderRadius: 8,
    borderWidth: 1,
    textDecoration: "none !important",
    '&:hover': {
      borderColor: 'primary',
      backgroundColor: 'primaryBg',
    },
  },
  plain: {
    color: 'primary',
    backgroundColor: 'transparent',
    border: 'solid',
    borderColor: 'transparent',
    borderRadius: 0,
    borderWidth: 0,
    '&:hover': {
      color: 'accent',
    },
  },
  purchase: {
    color: 'secondary',
    cursor: 'pointer',
    backgroundColor: 'accent',
    border: 'solid',
    borderColor: 'transparent',
    borderRadius: 4,
    borderWidth: 1,
    height: "60px",
    fontSize: 18,
    width: "100%",
    '&:hover': {
      backgroundColor: 'secondary',
      borderColor: 'primary',
      color: 'primary',

    },
    '&:disabled': {
      backgroundColor: 'normalGrey',
      borderColor: "transparent",
      color: 'secondary',
      cursor: "none",
      pointerEvents: "none"
    }
  },
  save: {
    color: 'secondary',
    cursor: 'pointer',
    backgroundColor: 'accent',
    border: 'solid',
    borderRadius: 4,
    borderWidth: 1,
    height: "40px",
    lineHeight: "36px",
    fontSize: 14,
    maxWidth: "60px",
    padding: '0px',
    paddingLeft: '10px',
    paddingRight: '10px',
    paddingTop: '0px',
    '&:not(disabled):hover': {
      backgroundColor: 'secondary',
      borderColor: 'accent',
      color: 'primary',
      '*': {
        color: 'primary',
      }
    },
    '&:disabled': {
      backgroundColor: 'lightGrey',
      color: 'secondary',
      cursor: "none",
      pointerEvents: "none"
    }
  },
  userSheetPrimary: {
    color: 'primary',
    cursor: 'pointer',
    backgroundColor: 'lightGray',
    borderRadius: 4,
    height: "40px",
    lineHeight: "30px",
    fontSize: 14,
    padding: 0,
    transition: 'background-color 0.25s ease, color 0.25s ease',
    width: "100%",
    '&:hover': {
      backgroundColor: 'accent',
      color: 'secondary',
      transition: 'background-color 0.25s ease, color 0.25s ease',
    },
  },
  userSheetSecondary: {
    color: 'primary',
    cursor: 'pointer',
    backgroundColor: 'secondaryBg',
    border: '1px solid lightGray',
    borderColor: 'lightGray',
    borderWidth: '1px',
    borderRadius: 4,
    height: "40px",
    lineHeight: "40px",
    fontSize: 14,
    padding: 0,
    transition: 'background-color 0.25s ease, color 0.25s ease',
    width: "50%",
    '&:hover': {
      backgroundColor: 'accent',
      borderColor: 'accent',
      color: 'secondary',
      transition: 'background-color 0.25s ease, color 0.25s ease',
    },
  },
  controlPanel: {
    color: 'primary',
    cursor: 'pointer',
    backgroundColor: 'secondaryBg',
    border: '1px solid lightGray',
    borderColor: 'lightGray',
    borderWidth: '1px',
    borderRadius: 4,
    height: "40px",
    lineHeight: "36px",
    fontSize: 14,
    padding: '0px',
    paddingLeft: '10px',
    paddingRight: '10px',
    paddingTop: '0px',
    transition: 'background-color 0.25s ease, color 0.25s ease',
    '&:hover': {
      backgroundColor: 'accent',
      borderColor: 'accent',
      color: 'secondary',
      transition: 'background-color 0.25s ease, color 0.25s ease',
      '*': {
        color: 'secondary',
      }
    },
  },
  exit: {
    color: 'secondary',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    borderRadius: '6px',
    height: "40px",
    lineHeight: "40px",
    fontSize: 16,
    padding: '0px',
    paddingLeft: '10px',
    paddingRight: '10px',
    paddingTop: '0px',
    transition: 'background-color 0.25s ease, color 0.25s ease',
    '&:hover': {
      backgroundColor: 'accent',
      color: 'primary',
      transition: 'background-color 0.25s ease, color 0.25s ease',
      '*': {
        color: 'secondary',
      }
    },
  }
}

// Components

const Button = styled.button(
  {
    alignItems: 'center',
    backgroundColor: 'primaryBg',
    border: 0,
    boxSizing: 'border-box',
    cursor: 'pointer !important',
    display: 'flex',
    fontFamily: 'Barlow',
    fontSize: 14,
    fontWeight: '500',
    height: 40,
    justifyContent: 'center',
    outline: 0,
    padding: '6px 12px 6px 12px',
    textAlign: 'center',
    textDecoration: 'none !important',
    transition: 'color 0.05s linear, border 0.05s linear',
  },
  border,
  buttonStyle,
  color,
  layout,
  space,
  position,
  typography,
  variant({
    scale: 'buttons',
    variants: buttonVariants,
  })
)

Button.defaultProps = {
  variant: 'pill',
}

export { Button, buttonVariants }