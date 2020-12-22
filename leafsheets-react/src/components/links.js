// Imports

import { color, layout, space, typography, position, variant } from 'styled-system';
import styled from 'styled-components';
import React from "react";

import { Link } from 'react-router-dom';
import { FlexRow } from './layouts.js';

// Components

const UnstyledLink = (props) => {
  const { children, to, ...allOtherProps } = props;
  return (
    <FlexRow {...allOtherProps} >
      <Link to={to}>{children}</Link>
    </FlexRow>
  )
}

const linkVariants = {
  standard: {
    color: 'inherit',
    textDecoration: 'none',
    '&:hover': {
      color: 'accent',
      textDecoration: 'none'
    },
    '&:hover *': {
      color: 'accent',
      textDecoration: 'none',
    },
    '&:visited': {
      color: 'black !important',
      textDecoration: 'none',
    },
  },
}

const LinkTo = styled(UnstyledLink)(
  {
    alignItems: 'center',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'row',
    flexBasis: 'auto',
    flexWrap: 'wrap',
    justifyContent: 'center',
    cursor: 'pointer',
    textAlign: 'left',
    textDecoration: 'underline',
    maxWidth: 'none',
    minWidth: 0,
    width: 'auto',
  },
  color,
  space,
  layout,
  position,
  typography,
  variant({
    scale: 'links',
    variants: linkVariants,
  })
)

LinkTo.defaultProps = {
  variant: 'standard',
}

export { LinkTo }