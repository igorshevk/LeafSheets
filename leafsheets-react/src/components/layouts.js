// Imports

import {
  border,
  color,
  layout,
  flexbox,
  space,
  shadow,
  position,
  typography,
} from 'styled-system';
import styled from 'styled-components';

// Components

export const Box = styled.div({
  boxSizing: 'border-box',
  minWidth: 0,
});

export const FlexBox = styled(Box)(
  {
    display: 'flex',
  },
  layout,
  flexbox
);

export const FlexRow = styled(Box)(
  {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    width: '100%',
  },
  border,
  space,
  color,
  shadow,
  layout,
  position,
  flexbox,
  typography
);

export const FlexColumn = styled(Box)(
  {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  border,
  space,
  color,
  layout,
  shadow,
  position,
  flexbox,
  typography
);

// Container

export const Container = styled(FlexBox)(
  {
    as: 'section',
    flexWrap: 'wrap',
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: '1440px',
    width: '100vw',
  },
  color,
  space,
  layout,
  position
);

// Page

export const Page = styled(FlexRow)(
  {
    minHeight: '100vh',
    marginTop: '-80px',
    width: '100%',
  },
  color,
  space,
  layout,
  flexbox
);

// Section

const Section = styled(FlexBox)(
  {
    as: 'section',
    flexWrap: 'wrap',
    width: '100vw',
  },
  color,
  space,
  layout,
  position,
  shadow
);

// Divider

export const Divider = styled.div(
  {
    backgroundColor: 'transparent',
    borderRadius: '4px',
    color: '#30E1A5',
    height: '48px',
    fontFamily: 'Barlow',
    fontSize: '34px',
    fontWeight: '500',
    lineHeight: '48px',
    marginBottom: '40px',
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'center',
    maxWidth: '600px',
    width: '100%',
  },
  space,
  color
);

Section.defaultProps = {
  as: 'section',
};

export {Section};
