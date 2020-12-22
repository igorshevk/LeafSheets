// Imports

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { withRouter } from 'react-router';
import Loader from 'react-loader-spinner';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Lottie from 'react-lottie';

import { endLoading, redirectTo } from '../../actions/ui';
import { FlexColumn, FlexRow } from '../layouts';
import animationData from './icon-loader.json';
import { Paragraph } from '../paragraph';
import { Title } from '../headers';

// Loader

class OverlayLoader extends Component {

    constructor(props) {
        super(props);
        this.state = this.initialState();
    }

    initialState() {
        return {
            redirecting: false,
        }
    }

    static propTypes = {
        isLoading: PropTypes.bool.isRequired,
        redirectEndpoint: PropTypes.string,
        title: PropTypes.string.isRequired,
        subtitle: PropTypes.string.isRequired,
        redirectTo: PropTypes.func.isRequired,
        endLoading: PropTypes.func.isRequired,
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.isLoading !== this.props.isLoading) {
            let shouldPreventBodyScroll = false;
            if (this.props.isLoading === true) {
                shouldPreventBodyScroll = true;
            }
            if (shouldPreventBodyScroll === true) {
                document.body.classList.add('overflowHidden');
            } else {
                document.body.classList.remove('overflowHidden');
            }
        }
        if (prevProps.redirectEndpoint !== this.props.redirectEndpoint) {
            this.setState({ redirecting: true})
            if (this.props.redirectEndpoint === null) {
                this.setState({ redirecting: false})
            }
        }
    }

    delayRedirect = to => {
        const { redirecting } = this.state;
        if (redirecting === false && to !== null) {
            const { history: { push } } = this.props;
            setTimeout(() => {
                push(to);
                this.props.endLoading();
                this.props.redirectTo({endpoint: null});
            }, 2500);
        }
    };

    render() {
        let { title, subtitle, isLoading, redirectEndpoint } = this.props;
        const defaultOptions = {
            loop: true,
            autoplay: true, 
            animationData: animationData,
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
            }
          };
        if (isLoading === false) {
            return null;
        }
        if (redirectEndpoint !== null) {
            this.delayRedirect(redirectEndpoint);
        }
        return (
            <FlexColumn height="100vh" width="100vw"
              position="fixed"
              top="0"
              left="0"
              bg="rgba(0,0,0,0.92)"
              zIndex="25">
                  <FlexColumn minHeight="0px !important" height="25vh !important" justifyContent="flex-start" position="absolute" top="30%">
                    <Loader
                        type="TailSpin"
                        color="#30E1A5"
                        height={90}
                        width={90}
                        visible={isLoading} />
                    <FlexRow minHeight="0px !important" height="60px !important" position="absolute" top="15px">
                        <Lottie options={defaultOptions}
                            height={60}
                            width={60}/>
                    </FlexRow>
                    <Title className="animatedEllipsis" mb="8px" mt="30px" color="accent">{title}</Title>
                    <Paragraph variant="overlay" color="accent">{subtitle}</Paragraph>
                  </FlexColumn>  
            </FlexColumn>
        )
    }
}

const mapStateToProps = state => ({
    isLoading: state.uiReducer.isLoading,
    redirectEndpoint: state.uiReducer.redirectEndpoint,
    title: state.uiReducer.loadingTitle,
    subtitle: state.uiReducer.loadingSubtitle
})
  
OverlayLoader.defaultProps = {
    title: 'Loading',
    subtitle: 'Please be patient, while we serve your request.',
    isLoading: false,
    redirectEndpoint: null
}

export default connect(
    mapStateToProps,
    { endLoading, redirectTo }
)(withRouter(OverlayLoader));

