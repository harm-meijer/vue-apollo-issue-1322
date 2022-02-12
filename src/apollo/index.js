import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  defaultDataIdFromObject,
} from '@apollo/client/core';
import auth from './auth';
const cache = new InMemoryCache({
  //getting default id is broken
  dataIdFromObject(responseObject) {
    if (responseObject?.scopedPrice?.country) {
      console.log('variable:', responseObject.scopedPrice);
      console.log(
        'key:',
        defaultDataIdFromObject(responseObject)
      );
      // return `${defaultDataIdFromObject(
      //   responseObject
      // )}:${JSON.stringify(responseObject.scopedPrice)}`;
    }
    return defaultDataIdFromObject(responseObject);
  },
});
const httpLink = createHttpLink({
  uri: 'https://api.europe-west1.gcp.commercetools.com/sunrise-spa/graphql',
  fetch: (url, options) => {
    return auth({
      id: '1mnlpBq-fHCCkAzmSXxNBB37',
      secret: 'WS9hXm6dKyqyuLOHciL6jkbCbFHrDSOL',
      scope:
        'manage_my_orders:sunrise-spa ' +
        'manage_my_profile:sunrise-spa ' +
        'manage_my_payments:sunrise-spa ' +
        'view_published_products:sunrise-spa ' +
        'view_categories:sunrise-spa ' +
        'manage_my_shopping_lists:sunrise-spa ' +
        'manage_orders:sunrise-spa ' +
        'create_anonymous_token:sunrise-spa',
      projectKey: 'sunrise-spa',
      authUrl:
        'https://auth.europe-west1.gcp.commercetools.com',
    }).then((token) => {
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          authorization: `Bearer ${token}`,
        },
      });
    });
  },
});
export const apolloClient = new ApolloClient({
  cache,
  link: httpLink,
});
