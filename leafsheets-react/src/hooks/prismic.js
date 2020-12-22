// Imports

import { useState, useEffect } from 'react';
import Prismic from 'prismic-javascript';

import Client from '../clients/prismic'

// Hooks

export function FetchPrismicDocs(apiID) {
  const [doc, setDocData] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await Client.query(
        Prismic.Predicates.at('document.type', apiID)
      )
      if (response) {
        setDocData(response.results[0])
      }
    }
    fetchData()
  }, [apiID]);

  return doc;
}