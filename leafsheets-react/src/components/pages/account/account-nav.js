// Imports

import {FaUser, FaGlobe, FaMapMarkerAlt, FaCreditCard} from 'react-icons/fa';
import {color, space, layout} from 'styled-system';
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import {connect} from 'react-redux';

import {FlexColumn, FlexRow} from '../../layouts';
import {Paragraph} from '../../paragraph';
import {Icon} from '../../icons';

// Sub Components

const Row = styled(FlexRow)(
  {
    alignItems: 'center',
    cursor: 'pointer',
    flexWrap: 'wrap',
    height: '48px',
    justifyContent: 'flex-start',
    textDecoration: 'none',
    '&:hover': {
      backgroundColor: 'primary',
    },
  },
  color,
  space,
  layout
);

const NavRow = props => {
  const {icon, title, active = false, ...otherProps} = props;
  let iconColor = 'normalGrey';
  let titleWeight = '400';
  let bg = 'white';
  if (active === true) {
    bg = 'secondaryBg';
    iconColor = 'accent';
    titleWeight = '500';
  }
  return (
    <Row {...otherProps} bg={bg} px={['20px', '30px']}>
      <Icon variant="small" icon={icon} color={iconColor} />
      <Paragraph
        color="black"
        variant="menu"
        fontWeight={`${titleWeight} !important`}
        ml="20px"
        mb="0"
        mt="2px"
      >
        {title}
      </Paragraph>
    </Row>
  );
};

// Account Nav

class AccountNav extends Component {
  static propTypes = {};

  render() {
    const {...styleProps} = this.props;
    return (
      <FlexColumn {...styleProps} pt="80px" position="sticky" top="80px">
        <NavRow as={Link} to="/account" icon={[<FaUser />]} title="Account" />
        <NavRow as={Link} to="/account" icon={[<FaGlobe />]} title="Company" />
        <NavRow as={Link} to="/account" icon={[<FaCreditCard />]} title="Payments" />
        <NavRow as={Link} to="/account" icon={[<FaMapMarkerAlt />]} title="Locations" />
      </FlexColumn>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  {}
)(AccountNav);
