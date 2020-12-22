// Imports

import Media from 'react-media';
import React from 'react';

import MarketingCard from '../../../cards/marketing-card/marketing-card';
import {Section, FlexColumn, FlexRow, Container} from '../../../layouts';
import {colors} from '../../../../styles/colors';
import {breakpoints} from '../../../../styles/themes';
import {Paragraph} from '../../../paragraph';
import {Title} from '../../../headers';

const imageStyle = {
  color: 'transparent',
  height: '700px',
  position: 'absolute',
  left: '-1px',
  width: 'auto',
};

const imageStyleMobile = {
  color: 'transparent',
  height: '500px',
  position: 'absolute',
  left: '-1px',
  width: '100vw',
};

// Hero

const Hero = () => (
  <Section maxHeight="none" flexDirection="row" flexWrap="wrap" bg="primaryBg">
    <Container flexDirection="row" flexWrap="wrap" overflow="hidden">
      <FlexColumn
        alignItems="flex-start"
        bg="primaryBg"
        flexBasis={['100%', '50%']}
        overflow="hidden"
      >
        <FlexColumn
          minHeight={[350, 350]}
          flexBasis={['100%', '100%']}
          alignItems={['center', 'flex-start']}
          justifyContent="flex-start"
          px={['20px', '60px']}
        >
          <Title
            as="h1"
            variant="xLarge"
            pt="80px"
            pb={['20px', '0px']}
            textAlign={['center', 'left']}
          >
            Driving your <span style={{color: `${colors.accent}`}}>creativity</span>
            <br />
            through our <span style={{color: `${colors.accent}`}}>accessibility</span>.
          </Title>
          <Paragraph maxWidth={['80%', '400px']} textAlign={['center', 'left']}>
            Leafsheets is a document builder for drafting the finest cannabis sheets on
            the market. Create, build, and innovate — you have the power. We have the
            tools.
          </Paragraph>
        </FlexColumn>
        <FlexRow
          alignItems="flex-end"
          justifyContent={['center', 'flex-start']}
          minHeight={[0, 350]}
          px={['20px', '60px']}
          pb={['20px', '60px']}
        >
          <MarketingCard
            bg="accent"
            title="State Guides"
            paragraph="State specific checklists of everything you'll need before launching your new cannabis business."
            exclaim="FREE"
            link="/login"
          />
        </FlexRow>
      </FlexColumn>
      <FlexRow
        bg="primaryBg"
        justifyContent="flex-start"
        minHeight={[500, 700]}
        flexBasis={['100%', '50%']}
        position="relative"
        overflow={'hidden'}
        maxWidth={['100vw', '1440px']}
      >
        <Media
          queries={{
            mobile: `(max-width: ${breakpoints[0]})`,
            desktop: `(min-width: ${breakpoints[0]})`,
          }}
        >
          {matches => (
            <>
              {matches.mobile && (
                <video
                  style={imageStyleMobile}
                  height="100%"
                  width="100vw"
                  autoPlay="autoplay"
                  loop="loop"
                >
                  <source src="/leafsheets-hero.mp4" type="video/mp4" />
                </video>
              )}
              {matches.desktop && (
                <video
                  style={imageStyle}
                  height="100%"
                  width="100%"
                  autoPlay="autoplay"
                  loop="loop"
                >
                  <source src="/leafsheets-hero.mp4" type="video/mp4" />
                </video>
              )}
            </>
          )}
        </Media>
      </FlexRow>
    </Container>
  </Section>
);

export default Hero;
