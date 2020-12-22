// Imports

import React from 'react';

import {FlexColumn, FlexRow} from '../../layouts';
import {Paragraph} from '../../paragraph';
import {Title} from '../../headers';
import {Icon} from '../../icons';

// Marketing

const MarketingCard = ({bg, icon, title, paragraph, exclaim, link}) => {
  let accentColor = 'primary';
  let textColor = 'white';
  if (bg === 'primary' || bg === 'primaryBg') {
    accentColor = 'accent';
  }
  if (bg === 'primaryBg') {
    textColor = 'black';
  }

  return (
    <FlexColumn
      bg={bg}
      borderRadius={8}
      height={152}
      flexGrow={1}
      minWidth={250}
      maxWidth={330}
      minHeight={0}
      width="100%"
      px={16}
      pt={16}
      pb={20}
      mr={['0', '40px']}
      mb={40}
    >
      <FlexRow width="100%">
        {exclaim && (
          <Title variant="medium" color={accentColor} mr={10}>
            {exclaim}
          </Title>
        )}
        {icon && <Icon icon={icon} color={accentColor} mb={16} mr={10} />}
        <Title variant={['small', 'medium']} color={textColor}>
          {title}
        </Title>
      </FlexRow>
      <Paragraph variant="small" color={textColor} width="100%">
        {paragraph}
      </Paragraph>
    </FlexColumn>
  );
};

export default MarketingCard;
