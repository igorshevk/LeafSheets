// Imports

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { FlexRow } from '../layouts.js';

// Progress Indicator

class ProgressIndicator extends Component {

    constructor(props) {
        super(props);
        this.state = this.initialState();
        this.updateProgress = this.updateProgress.bind(this);
    }

    initialState() {
        return {
            progress: 0,
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.activeUserSheet !== this.props.activeUserSheet) {
            this.updateProgress(this.props.activeUserSheet);
        }
    }

    componentDidMount() {
        this.updateProgress(this.props.activeUserSheet);
    }

    updateProgress(userSheet) {
        let newProgress = this.state.progress;
        newProgress = (parseInt(userSheet.completed_required_input_count) / parseInt(userSheet.required_input_count)) * 100;
        this.setState({
            progress: newProgress,
        });
    }

    render() {
        const { progress } = this.state;
        const oppositeOfProgress = (100 - progress);
        return (
            <FlexRow height="4px" justifyContent="flex-start" width="100%">
                <FlexRow height="4px" backgroundColor="accent" flexBasis={`${progress}%`} width="auto" />
                <FlexRow height="4px" backgroundColor="lightGrey" flexBasis={`${oppositeOfProgress}%`} width="auto" />
            </FlexRow>
        )
    }
}

const mapStateToProps = state => ({
    activeUserSheet: state.sheetsAndItemsReducer.activeUserSheet,
})

export default connect(
    mapStateToProps,
    {}
)(ProgressIndicator)