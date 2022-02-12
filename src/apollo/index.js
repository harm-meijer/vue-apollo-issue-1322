import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  defaultDataIdFromObject,
} from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import auth from './auth';
false && defaultDataIdFromObject;
const cache = new InMemoryCache({
  //getting default id is broken
  // dataIdFromObject(responseObject) {
  //   if (responseObject?.scopedPrice?.country) {
  //     return `${defaultDataIdFromObject(responseObject)}:${
  //       responseObject?.scopedPrice?.country
  //     }`;
  //   }
  //   return defaultDataIdFromObject(responseObject);
  // },
});
const httpLink = createHttpLink({
  uri: 'https://api.europe-west1.gcp.commercetools.com/sunrise-spa/graphql',
});
const authLink = setContext((_, { headers }) => {
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
  }).then((token) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }));
});
export const apolloClient = new ApolloClient({
  cache,
  link: authLink.concat(httpLink),
});
