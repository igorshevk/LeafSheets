// Imports

import {Link} from 'react-router-dom';
import React from 'react';

import {FlexColumn, FlexRow} from '../../layouts';
import ProgressControl from './progress-control';
import {Paragraph} from '../../paragraph';
import {Title} from '../../headers';

// Document

const UserSheetCard = ({userSheet, ...styleProps}) => {
  return (
    <FlexColumn
      alignItems="flex-start"
      border="1px solid"
      borderColor={'rgba(0,0,0,0.06)'}
      borderRadius={4}
      width={[320, 280]}
      minHeight={417}
      maxHeight={417}
      maxWidth="90%"
      justifyContent="space-between"
      p={20}
      mb={20}
      height="100%"
      {...styleProps}
    >
      <FlexColumn alignItems="flex-start" justifyContent="flex-start" flexGrow={0}>
        <FlexRow my={'0px'}>
          <Paragraph>{userSheet.sheet.use_case.toUpperCase()}</Paragraph>
        </FlexRow>
        <Title variant="small" fontFamily="Roboto !important" mt={'10px'} mb={'16px'}>
          {userSheet.sheet.title}
        </Title>
        <Paragraph>{userSheet.sheet.short_description.substring(0, 120)}...</Paragraph>
        <Link to={`/sheets/${userSheet.sheet.id}`}>
          <Paragraph variant="small" color="lightGrey">
            View Sheet Details
          </Paragraph>
        </Link>
      </FlexColumn>
      <FlexColumn height={'114px !important'} justifyContent="flex-end" width="100%">
        <ProgressControl userSheet={userSheet} />
      </FlexColumn>
    </FlexColumn>
  );
};

export default UserSheetCard;
