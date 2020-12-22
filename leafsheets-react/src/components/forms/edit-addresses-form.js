// Imports

import React, { Component } from 'react';

import ExistingAddressForm from '../addresses/existing-address-form';
import AddressForm from '../addresses/address-form';
import { FlexColumn, FlexRow } from '../layouts';
import { Paragraph } from '../paragraph';
import { Button } from '../buttons';
import { Title } from '../headers';

// Edit Addresses Form

class EditAddressesForm extends Component {

    constructor(props) {
        super(props);
        this.state = this.initialState();
        this.addressRef = React.createRef();
        this.saveEnabled = this.saveEnabled.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    initialState() {
        return {
            saveEnabled: false,
        }
    }

    async handleSubmit() {
        await this.addressRef.current.addAddress();
    }

    saveEnabled(props) {
        let saveEnabled = false;
        if (props) {
            const { user_address } = props;
            const { first_name, last_name, street_1, city, state, postal } = user_address;
            if (first_name !== undefined && first_name.length > 0 &&
                last_name !== undefined && last_name.length > 0 &&
                street_1 !== undefined && street_1.length > 0 &&
                city !== undefined && city.length > 0 &&
                state !== undefined && state.length > 0 &&
                postal !== undefined && postal.length === 5) {
                    saveEnabled = true;
            }
        }
        this.setState({ saveEnabled : saveEnabled });
    }

    render() {
        const { saveEnabled } = this.state;
        return (
            <>
                <FlexColumn mt={this.props.mt} zIndex={this.props.zIndex} alignItems="flex-start" bg='white' flexBasis={['100%', '66%']} pb="24px" width="100%">
                    <FlexRow mb="24px" justifyContent="space-between" alignItems="center" height="40px" zIndex="9" flexWrap="nowrap">
                        <FlexRow flexBasis={["100%", "75%"]} maxWidth={["100%", "600px"]} minWidth={["0", "540px"]} justifyContent="space-between">
                            <Title mb="0" variant="medium">Addresses</Title>
                        </FlexRow>
                        <FlexColumn height="0px" maxWidth="400px" flexBasis={["0%", "25%"]} minWidth="0" width="100%" justifyContent="flex-start"></FlexColumn>
                    </FlexRow>
                    <FlexRow justifyContent="flex-start" alignItems="flex-start">
                        <FlexRow mb="24px" flexBasis={["100%", "75%"]} maxWidth="600px" minWidth={["0", "540px"]} justifyContent="space-between" mr={["0", "40px"]}>
                            <ExistingAddressForm editing={true} mb="50px" />
                            <FlexRow mb="24px" flexBasis={["100%", "100%"]} maxWidth={["100%", "600px"]} minWidth={["0", "540px"]} justifyContent="space-between">
                                <Title mb="0" variant="medium">New Address</Title>
                                <Button disabled={!saveEnabled} bg={ saveEnabled ? "accent !important" : "lightGrey !important" } variant="save" onClick={this.handleSubmit}>Add</Button>
                            </FlexRow>
                            <AddressForm saveEnabled={this.saveEnabled} ref={this.addressRef} sendActions={true}/>
                        </FlexRow>
                        <FlexColumn maxWidth="400px" flexBasis={["100%", "25%"]} flexGrow="1" minWidth="none" width="100%" justifyContent="flex-start" mt={["8px", "0"]} pr="40px">
                            <Paragraph><b>Tips:</b> Fusce vehicula dolor arcu, sit amet blandit dolor mollis nec. Donec viverra eleifend lacus, vitae ullamcorper metus.</Paragraph>
                            <Paragraph><b>Use Case:</b> Sed sollicitudin ipsum quis nunc sollicitudin ultrices. Donec euismod scelerisque ligula. Maecenas eu va.</Paragraph>
                        </FlexColumn>
                    </FlexRow>
                </FlexColumn>
            </>
        )
    }
}

export default EditAddressesForm;