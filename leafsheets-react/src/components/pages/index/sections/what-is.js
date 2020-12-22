// Imports

import Media from 'react-media';
import React from 'react';

import {FlexColumn, Section, Container} from '../../../layouts';
import {breakpoints} from '../../../../styles/themes';
import {Paragraph} from '../../../paragraph';
import {Title} from '../../../headers';

// Background

const bgImgStyle = {
  height: '100%',
  left: '50%',
  maxWidth: '1440px',
  position: 'absolute',
  top: '0',
  width: '100%',
  transform: 'translateX(-50%)',
  zIndex: 5,
};

const bgImgStyleMobile = {
  height: '100%',
  left: '50%',
  maxWidth: '768px',
  position: 'absolute',
  top: '0',
  width: '100%',
  transform: 'translateX(-50%)',
  zIndex: 5,
};

const ipadStyle = {
  height: '450px',
  left: '50%',
  position: 'absolute',
  bottom: '0',
  width: 'auto',
  transform: 'translateX(-50%)',
  zIndex: 6,
};

const iPhoneStyle = {
  height: '450px',
  left: '50%',
  position: 'absolute',
  bottom: '0',
  width: 'auto',
  transform: 'translateX(-50%)',
  zIndex: 6,
};

// What Is

const WhatIs = () => (
  <Section bg="primaryBg" position="relative">
    <Media
      queries={{
        mobile: `(max-width: ${breakpoints[0]})`,
        desktop: `(min-width: ${breakpoints[0]})`,
      }}
    >
      {matches => (
        <>
          {matches.mobile && (
            <>
              <video style={bgImgStyleMobile} autoPlay="autoplay" loop="loop">
                <source src="/whatis-bg.mp4" type="video/mp4" />
              </video>
              <video style={iPhoneStyle} autoPlay loop="loop">
                <source src="/whatis-iphone.mp4" type="video/mp4" />
              </video>
            </>
          )}
          {matches.desktop && (
            <>
              <video style={bgImgStyle} autoPlay="autoplay" loop="loop">
                <source src="/whatis-bg.mp4" type="video/mp4" />
              </video>
              <video style={ipadStyle} autoPlay loop="loop">
                <source src="/whatis-ipad.mp4" type="video/mp4" />
              </video>
            </>
          )}
        </>
      )}
    </Media>
    <Container bg="transparent" flexDirection="column" minHeight={700} zIndex={6}>
      <FlexColumn bg="transparent" flexBasis={['100%', '50%']}>
        <Title as="h1" variant="large" mt="80px">
          Time is Money
        </Title>
        <Paragraph
          variant="medium"
          color="primary"
          width={['85%', '35%']}
          mx={'auto'}
          textAlign="center"
        >
          And we save you a ton of time. How much time? Our build process averages 90%
          faster than our competition. How? We've standardized our process to provide the
          most efficient quality-to-time ratio on the market.
        </Paragraph>
      </FlexColumn>
    </Container>
  </Section>
);

export default WhatIs;
