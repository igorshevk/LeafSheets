// Imports

import React from 'react';

import {Section, FlexColumn, Container} from '../../../layouts';
import {Paragraph} from '../../../paragraph';
import {Button} from '../../../buttons';
import {Title} from '../../../headers';
import {Link} from 'react-router-dom';

// SignUp

const SignUp = () => (
  <Section bg="primaryBg" minHeight={500}>
    <Container flexDirection="row">
      <FlexColumn
        minHeight={350}
        bg="primaryBg"
        alignItems="flex-start"
        justifyContent="center"
        flexBasis={['100%', '50%']}
        pl={['20px', '60px']}
        pr={['15%', '7.5%']}
      >
        <Title as="h1" variant="large" mb="16px">
          Become a Leafsheets Member – It’s Free!
        </Title>
        <Paragraph variant="medium" width={['100', '100%']} textAlign="left" mb="36px">
          You'll have access to our resourses library. We've done the research to assure
          that our members only work with the best and brightest in the industry. Plus,
          you'll get exclusive content and state-specific application checklists!
        </Paragraph>
        <Button variant="pill" as={Link} to="/register" px={60}>
          Sign Up
        </Button>
      </FlexColumn>
      <FlexColumn
        alignItems="center"
        justifyContent="center"
        minHeight={500}
        bg="primaryBg"
        flexBasis={['100%', '50%']}
      >
        <img
          alt="Sign Up"
          src="/index-signup.png"
          style={{height: 'auto', maxWidth: '500px', width: '100%'}}
        />
      </FlexColumn>
    </Container>
  </Section>
);

export default SignUp;
