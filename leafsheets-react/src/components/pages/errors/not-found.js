// Imports

import React from 'react';

import { Page } from '../../layouts';

// 404: Not Found

class NotFoundPage extends React.Component {
  render() {
    return (
      <>
          <Page bg="white" alignItems="center" px="40px">
              404 Not Found
          </Page>
      </>
    );
  }
}

export default NotFoundPage;
