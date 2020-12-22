// Imports

import Media from 'react-media';
import React from 'react';

import {FlexRow, FlexColumn} from '../../layouts';
import {breakpoints} from '../../../styles/themes';
import {Paragraph} from '../../paragraph';
import {Title} from '../../headers';
import Moment from 'react-moment';

// Charge

export const Charge = ({charge}) => {
  const {order, sheets, card} = charge;
  const subtotal = (parseFloat(order.subtotal) / parseFloat(100)).toFixed(2);
  return (
    <FlexColumn width="100%">
      <FlexRow
        alignItems="center"
        justifyContent="space-between"
        width="100%"
        borderBottom="1px solid"
        borderColor="normalGrey"
      >
        <Title variant="small">Order #0000{order.id}</Title>
        <Paragraph variant="small" fontWeight="600 !important">
          <Moment format="MMM D, YYYY">{charge.created_at}</Moment>
        </Paragraph>
      </FlexRow>
      <FlexRow
        alignItems="center"
        justifyContent="space-between"
        width="100%"
        borderBottom="1px solid"
        borderColor="normalGrey"
      >
        <Paragraph marginTop="13px" flexGrow="1" variant="small">
          Sheet
        </Paragraph>
        <Media
          queries={{
            desktop: `(min-width: ${breakpoints[1]})`,
          }}
        >
          {matches => (
            <>
              {matches.desktop && (
                <Paragraph
                  marginTop="13px"
                  maxWidth="100px"
                  minWidth="80px"
                  textAlign="left !important"
                  variant="small"
                >
                  SKU
                </Paragraph>
              )}
            </>
          )}
        </Media>
        <Paragraph
          marginTop="13px"
          maxWidth="100px"
          minWidth="80px"
          textAlign="center !important"
          variant="small"
        >
          Pages
        </Paragraph>
        <Paragraph
          marginTop="13px"
          maxWidth="100px"
          minWidth="80px"
          textAlign="right !important"
          variant="small"
        >
          Price
        </Paragraph>
      </FlexRow>
      {sheets.map(sheet => {
        let price = sheet.price;
        price = (parseFloat(price) / parseFloat(100)).toFixed(2);
        return (
          <FlexRow alignItems="center" justifyContent="space-between" width="100%">
            <Paragraph
              marginTop="13px"
              flexGrow="1"
              fontWeight="600 !important"
              variant="small"
            >
              {sheet.title}
            </Paragraph>
            <Media
              queries={{
                desktop: `(min-width: ${breakpoints[1]})`,
              }}
            >
              {matches => (
                <>
                  {matches.desktop && (
                    <Paragraph
                      marginTop="13px"
                      maxWidth="100px"
                      minWidth="80px"
                      fontWeight="600 !important"
                      textAlign="left !important"
                      variant="small"
                    >
                      {sheet.id}
                    </Paragraph>
                  )}
                </>
              )}
            </Media>
            <Paragraph
              marginTop="13px"
              maxWidth="100px"
              minWidth="80px"
              fontWeight="600 !important"
              textAlign="center !important"
              variant="small"
            >
              {sheet.page_count}
            </Paragraph>
            <Paragraph
              marginTop="13px"
              maxWidth="100px"
              minWidth="80px"
              fontWeight="600 !important"
              textAlign="right !important"
              variant="small"
            >
              ${price}
            </Paragraph>
          </FlexRow>
        );
      })}
      <FlexRow
        borderTop="1px solid"
        borderColor="normalGrey"
        justifyContent={['flex-end', 'space-between']}
        flexWrap="wrap"
      >
        <FlexColumn
          flexGrow="1"
          alignItems={['flex-end', 'flex-start']}
          order={[1, 0]}
          width={['100%', 'auto']}
        >
          <Paragraph variant="small" textAlign="left">
            Type: {card.brand}
          </Paragraph>
          <Paragraph variant="small" textAlign="left">
            Number: XXXX—{card.last_4}
          </Paragraph>
        </FlexColumn>
        <FlexColumn
          flexGrow="0"
          maxWidth="300px"
          minWidth="240px"
          alignItems="flex-end"
          width={['100%', 'auto']}
          order={[0, 1]}
        >
          <FlexRow justifyContent="space-between">
            <Paragraph marginTop="13px">Promo Code</Paragraph>
            <Paragraph>—</Paragraph>
          </FlexRow>
          <FlexRow
            borderBottom="1px solid"
            borderColor="normalGrey"
            justifyContent="space-between"
          >
            <Paragraph fontWeight="500 !important">Subtotal</Paragraph>
            <Paragraph fontWeight="600 !important">${subtotal}</Paragraph>
          </FlexRow>
          <FlexRow justifyContent="space-between">
            <Paragraph fontWeight="500 !important">Total</Paragraph>
            <Paragraph variant="large">${subtotal}</Paragraph>
          </FlexRow>
        </FlexColumn>
      </FlexRow>
    </FlexColumn>
  );
};
