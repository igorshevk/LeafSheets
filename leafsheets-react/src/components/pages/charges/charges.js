// Imports

import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {getCharges} from '../../../actions/charges';
import {updateNavColor} from '../../../actions/ui';
import {FlexRow, Container} from '../../layouts';
import {Paragraph} from '../../paragraph';
import {Title} from '../../headers';
import {Page} from '../../layouts';
import {Charge} from './charge';

// Orders

class ChargesPage extends Component {
  constructor(props) {
    super(props);
    this.renderCharges = this.renderCharges.bind(this);
  }

  static propTypes = {
    updateNavColor: PropTypes.func.isRequired,
    getCharges: PropTypes.func.isRequired,
    charges: PropTypes.array.isRequired,
  };

  componentDidMount() {
    window.scroll(0, 0);
    this.props.updateNavColor('white');
    this.props.getCharges();
  }

  renderCharges(charges) {
    return <>{charges && charges.map(charge => <Charge charge={charge} />)}</>;
  }

  render() {
    const {isAuthenticated, charges} = this.props;
    if (!isAuthenticated) {
      return <Redirect to="/login" />;
    }
    return (
      <Page
        alignItems="flex-start"
        justifyContent="flex-start"
        bg="white"
        pt={'80px'}
        pb={'96px'}
      >
        <Container
          alignItems="flex-start"
          justifyContent="flex-start"
          flexDirection="column"
          px={['20px', '60px']}
          py="48px"
        >
          <Title
            textAlign={['center', 'flex-start']}
            mx={['auto', '0']}
            color="accent"
            mb={'10px'}
          >
            Order History
          </Title>
          <Paragraph textAlign={['center', 'flex-start']} mx={['auto', '0']}>
            Here's a list of all your orders on Leafsheets
          </Paragraph>
          <FlexRow justifyContent={['center', 'flex-start']} alignItems="center" mt={48}>
            {this.renderCharges(charges)}
          </FlexRow>
        </Container>
      </Page>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  charges: state.chargeReducer.charges,
});

ChargesPage.defaultProps = {
  charges: [],
};

export default connect(
  mapStateToProps,
  {
    getCharges,
    updateNavColor,
  }
)(ChargesPage);
