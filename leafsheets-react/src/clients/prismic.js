// Imports

import Prismic from 'prismic-javascript';

// Client

const apiEndpoint = process.env.REACT_APP_PRISMIC_ENDPOINT;
const accessToken = process.env.REACT_APP_PRISMIC_ACCESS_TOKEN;

const Client = Prismic.client(apiEndpoint, { accessToken });

export default Client;