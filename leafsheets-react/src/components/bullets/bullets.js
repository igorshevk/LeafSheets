// Imports

import React from "react";
import { FaCheckCircle } from 'react-icons/fa';

import { Paragraph } from '../paragraph';
import { FlexRow } from '../layouts';
import { Icon } from '../icons';

// Pricing

const Bullets = ({ bullets }) => {
  return (
    <FlexRow mt={20}>
      <FlexRow flexBasis={['100%', '45%']} mr={[0, '10px']} alignItems="center" mb='12px'>
        <Icon variant="small" icon={[<FaCheckCircle />]} color='accent' mr={10} />
        <Paragraph variant="small" color='primary' textAlign='left' m={0}>
          A bullet
        </Paragraph>
      </FlexRow>
      <FlexRow flexBasis={['100%', '45%']} mr={[0, '10px']} alignItems="center" mb='12px'>
        <Icon variant="small" icon={[<FaCheckCircle />]} color='accent' mr={10} />
        <Paragraph variant="small" color='primary' textAlign='left' m={0}>
          A bullet
        </Paragraph>
      </FlexRow>
      <FlexRow flexBasis={['100%', '45%']} mr={[0, '10px']} alignItems="center" mb='12px'>
        <Icon variant="small" icon={[<FaCheckCircle />]} color='accent' mr={10} />
        <Paragraph variant="small" color='primary' textAlign='left' m={0}>
          A bullet
        </Paragraph>
      </FlexRow>
      <FlexRow flexBasis={['100%', '45%']} mr={[0, '10px']} alignItems="center" mb='12px'>
        <Icon variant="small" icon={[<FaCheckCircle />]} color='accent' mr={10} />
        <Paragraph variant="small" color='primary' textAlign='left' m={0}>
          A bullet
        </Paragraph>
      </FlexRow>
      <FlexRow flexBasis={['100%', '45%']} mr={[0, '10px']} alignItems="center" mb='12px'>
        <Icon variant="small" icon={[<FaCheckCircle />]} color='accent' mr={10} />
        <Paragraph variant="small" color='primary' textAlign='left' m={0}>
          A bullet
        </Paragraph>
      </FlexRow>
      <FlexRow flexBasis={['100%', '45%']} mr={[0, '10px']} alignItems="center" mb='12px'>
        <Icon variant="small" icon={[<FaCheckCircle />]} color='accent' mr={10} />
        <Paragraph variant="small" color='primary' textAlign='left' m={0}>
          A bullet
        </Paragraph>
      </FlexRow>
    </FlexRow>
  )
};

export default Bullets;