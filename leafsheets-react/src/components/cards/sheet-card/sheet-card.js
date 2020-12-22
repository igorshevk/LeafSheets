// Imports

import {FaArrowRight} from 'react-icons/fa';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import React from 'react';

import {FlexColumn, FlexRow} from '../../layouts';
import { colors } from '../../../styles/colors';
import {Paragraph} from '../../paragraph';
import {Title} from '../../headers';
import {Icon} from '../../icons';

// Styles

const LearnMore = styled(FlexRow)`
    & *,
    & *:visited {
      color: ${colors.black};
    }
    &:hover * {
      color: ${colors.accent} !important;
    }
`

// Sheet

const SheetCard = ({icon, title, titleIcon, paragraph, link, mx}) => {
  return (
    <FlexColumn
      mx={mx}
      height={250}
      minWidth={250}
      maxWidth={330}
      flexGrow={1}
      minHeight={0}
      mb={60}
      pr={["0", "32px"]}
      alignItems={["center", "flex-start"]}
      justifyContent="space-between"
    >
      <FlexColumn alignItems={["center", "flex-start"]} minHeight={0} mb={0}>
        <Icon variant="large" icon={icon} color="accent" mb={32} mr={10} />
        <FlexRow justifyContent={["center", "flex-start"]} width="100%">
          <Title textAlign={["center", "left"]} variant="xSmall" color="primary" pt={'1px'}>
            {title}
          </Title>
          {titleIcon && <Icon icon={titleIcon} color="red" mb={16} ml={10} />}
        </FlexRow>
        <Paragraph textAlign={["center", "left"]} variant="small" color="blueGrey" width="100%" pr={["0",'10px']}>
          {paragraph.substring(0, 160)}...
        </Paragraph>
      </FlexColumn>
      <Link to={link}>
        <LearnMore alignItems="center">
          <Paragraph mb={0}>Learn More</Paragraph>
          <Icon
            icon={[<FaArrowRight />]}
            variant="small"
            color="lightGrey"
            ml={10}
            mt={'2px'}
          />
        </LearnMore>
      </Link>
    </FlexColumn>
  );
};

export default SheetCard;
