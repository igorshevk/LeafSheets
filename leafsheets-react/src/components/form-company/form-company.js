// Imports

import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {addCompany} from '../../actions/companies';

// Form

export class AddCompanyForm extends Component {
  state = {
    name: '',
  };

  static propTypes = {
    addCompany: PropTypes.func.isRequired,
  };

  onChange = e => this.setState({[e.target.name]: e.target.value});

  onSubmit = e => {
    e.preventDefault();
    const {name} = this.state;
    const company = {name};
    this.props.addCompany(company);
    this.setState({name: ''});
  };

  render() {
    const {name} = this.state;
    return (
      <div style={{backgroundColor: 'white'}}>
        <h2>Add Company</h2>
        <form onSubmit={this.onSubmit}>
          <div>
            <label>Name</label>
            <input type="text" name="name" onChange={this.onChange} value={name} />
          </div>
          <div>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    );
  }
}

export default connect(
  null,
  {addCompany}
)(AddCompanyForm);
