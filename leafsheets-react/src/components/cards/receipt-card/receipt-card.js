// Imports

import React from 'react';

import {FlexColumn} from '../../layouts';
import { colors } from '../../../styles/colors';
import {Paragraph} from '../../paragraph';
import {Title} from '../../headers';

// Receipt Card

const ReceiptCard = ({order, title, description, img}) => {
  return (
    <FlexColumn
      alignItems="flex-start"
      width={350}
      justifyContent="flex-start"
      mb="48px"
    >
        <img alt="Receipt Step" src={img} style={{ width: "100%", maxWidth: '350px', height: '150px' }}/>
        <Title mt="24px">
            <span style={{ color: `${colors.accent}`, marginRight: '6px' }}>{order}.</span>
            {title}
        </Title>
        <Paragraph mt="16px">
            {description}
        </Paragraph>
    </FlexColumn>
  );
};

export default ReceiptCard;
