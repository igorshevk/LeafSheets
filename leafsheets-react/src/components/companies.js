// Imports

import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {getCompanies, deleteCompany} from '../actions/companies';

export class Companies extends Component {
  static propTypes = {
    companies: PropTypes.array.isRequired,
    getCompanies: PropTypes.func.isRequired,
    deleteCompany: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getCompanies();
  }

  render() {
    return (
      <Fragment>
        <h2>Companies</h2>
        <table style={{backgroundColor: 'white'}}>
          <thead style={{backgroundColor: 'white'}}>
            <tr>
              <th>Name</th>
              <th />
            </tr>
          </thead>
          <tbody style={{backgroundColor: 'white'}}>
            {this.props.companies.map(company => (
              <tr key={company.id}>
                <td>{company.name}</td>
                <td>
                  <button onClick={this.props.deleteCompany.bind(this, company.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  companies: state.companiesReducer.companies,
});

export default connect(
  mapStateToProps,
  {getCompanies, deleteCompany}
)(Companies);
