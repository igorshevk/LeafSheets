// Imports

import {FaHeart} from 'react-icons/fa';
import React from 'react';

import MarketingCard from '../../../cards/marketing-card/marketing-card';
import {Section, FlexRow, Container} from '../../../layouts';
import {Paragraph} from '../../../paragraph';
import {Title} from '../../../headers';

// Pricing

const Pricing = () => {
  return (
    <Section bg="white" minHeight={700}>
      <Container flexDirection="column" alignItems="center">
        <Title as="h1" variant="large" mt="96px">
          Unleash the Innovation
        </Title>
        <Paragraph textAlign="center" maxWidth={["75%", "500px"]}>
          Leafsheets supplies the foundation to your most important documents,
          freeing your time to be spent creating and innovating. Our easy-to-use
          document builder takes a fraction of the time, while delivering industry-leading
          standard operating procedures, business plans, and much more. Own your journey
          with step-by-step guides provided with each sheet.
        </Paragraph>
        <FlexRow justifyContent="center" px={['20px', '60px']} mt="80px" mb="136px">
          <MarketingCard
            bg="primaryBg"
            title='Cost Effective'
            paragraph='Our price point is unmatched. We pride ourselves on being the most accessible in the cannabis industry.'
            icon={[<FaHeart />]}
            link="/login"
          />
          <MarketingCard
            bg="primaryBg"
            title='Time Savings'
            paragraph='Our build process is 90% faster than our competitors, saving you massive amounts of precious time!'
            icon={[<FaHeart />]}
            link="/login"
          />
          <MarketingCard
            bg="primaryBg"
            title='Trouble-Free Build'
            paragraph="Reserve your brain power. We'll guide you through each step of the process with clear directions."
            icon={[<FaHeart />]}
            link="/login"
          />
          <MarketingCard
            bg="primaryBg"
            title='Certified Documents'
            paragraph='Our sheets have a track record of being awarded licenses. Tried and true—the proof is in the details.'
            icon={[<FaHeart />]}
            link="/login"
          />
          <MarketingCard
            bg="primaryBg"
            title="Approved Services"
            paragraph="Services to compliment your business. Each is researched, reviewed, and highly regarded."
            icon={[<FaHeart />]}
            link="/login"
          />
          <MarketingCard
            bg="primaryBg"
            title='State Specialized'
            paragraph="We inspect each of our sheets for state specific details to assure the highest level of quality."
            icon={[<FaHeart />]}
            link="/login"
          />
        </FlexRow>
      </Container>
    </Section>
  );
};

export default Pricing;
