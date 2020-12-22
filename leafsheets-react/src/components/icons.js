// Imports

import React from "react";
import { color, layout, space, typography, position, variant } from 'styled-system'
import styled from 'styled-components';

// Variants

const iconVariants = {
  large: {
    height: 65,
    width: 65,
    '*': {
      fontSize: 65,
      maxHeight: 65,
      maxWidth: 65,
    }
  },
  mediumLarge: {
    height: 36,
    width: 36,
    '*': {
      fontSize: 36,
      maxHeight: 36,
      maxWidth: 36,
    }
  },
  medium: {
    height: 26,
    width: 26,
    '*': {
      fontSize: 26,
      maxHeight: 26,
      maxWidth: 26,
    }
  },
  small: {
    height: 14,
    width: 14,
    '*': {
      fontSize: 14,
      maxHeight: 14,
      maxWidth: 14,
    }
  },
  xSmall: {
    height: 8,
    width: 8,
    '*': {
      fontSize: 8,
      maxHeight: 8,
      maxWidth: 8,
    }
  },
  button: {
    cursor: "pointer",
    height: 20,
    width: 20,
    '*': {
      fontSize: 20,
      maxHeight: 20,
      maxWidth: 20,
      '&:hover': {
        opactity: "0.9",
        color: "black",
      }
    },
  },
  save: {
    color: 'secondary',
    cursor: "pointer",
    '*': {
      height: 20,
      width: 20,
    }
  },
  controlPanel: {
    color: 'primary',
    cursor: "pointer",
    '*': {
      height: 20,
      width: 20,
    }
  }
}

// Components

const UnstyledIcon = (props) => {
  const { icon, className, onClick, color, ...otherProps } = props;
  return (<div {...otherProps} className={className} onClick={onClick}>{icon[0]}</div>);
}

const Icon = styled(UnstyledIcon)(
  { 
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  color,
  space,
  layout,
  position,
  typography,
  variant({
    scale: 'icons',
    variants: iconVariants,
  })
)

Icon.defaultProps = {
  variant: 'medium'
}

const ClickableIcon = styled(Icon)`
  cursor: pointer;
`

export { Icon, ClickableIcon }