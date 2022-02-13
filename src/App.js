import { gql, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { cache } from './apollo';

const query = gql`
  query products(
    $locale: Locale! = "en"
    $limit: Int! = 1
    $offset: Int! = 0
    $priceSelector: PriceSelectorInput!
    $sorts: [String!] = []
    $filters: [SearchFilterInput!] = []
  ) {
    productProjectionSearch(
      limit: $limit
      offset: $offset
      sorts: $sorts
      priceSelector: $priceSelector
      filters: $filters
    ) {
      results {
        name(locale: $locale)
        masterVariant {
          id
          scopedPrice {
            country
          }
        }
      }
    }
  }
`;

const App = () => {
  const [country, setCountry] = useState('US');
  const [priceSelector, setPriceSelector] = useState({
    currency: 'USD',
    country: 'US',
  });
  const [first, setFirst] = useState();
  useEffect(() => {
    setPriceSelector(
      {
        US: { currency: 'USD', country: 'US' },
        DE: { currency: 'EUR', country: 'DE' },
      }[country]
    );
  }, [country]);
  const { data } = useQuery(query, {
    variables: { priceSelector },
  });
  useEffect(() => {
    setFirst({
      name: data?.productProjectionSearch?.results?.[0]
        ?.name,
      priceCountry:
        data?.productProjectionSearch?.results?.[0]
          ?.masterVariant?.scopedPrice?.country,
    });
    if (data) {
      console.log(
        'cache is now:',

        JSON.stringify(cache.extract(), undefined, 2)
      );
    }
  }, [data]);
  const toggleCountry = () => {
    if (country === 'US') {
      setCountry('DE');
      return;
    }
    if (country === 'DE') {
      setCountry('US');
    }
  };
  return (
    <div>
      <div>
        <button onClick={toggleCountry}>
          toggle country
        </button>
      </div>
      <div>country:{country}</div>
      <div>
        <h3>First result</h3>
        <pre>{JSON.stringify(first, undefined, 2)}</pre>
      </div>
    </div>
  );
};
export default App;
