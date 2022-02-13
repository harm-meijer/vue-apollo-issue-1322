<template>
  <div>
    <button v-on:click="toggleCountry">
      toggle country
    </button>
  </div>
  <div>country ref value:{{ country }}</div>
  <div>
    <h3>First result</h3>
    <pre>{{ JSON.stringify(first, undefined, 2) }}</pre>
  </div>
</template>
<script>
import { ref } from '@vue/reactivity';
import { computed, watch } from '@vue/runtime-core';
import { useQuery } from '@vue/apollo-composable';
import { gql } from '@apollo/client/core';
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
      total
      results {
        name(locale: $locale)
        masterVariant {
          # If you do the following it will work
          # anythingButId: id
          id
          scopedPrice {
            country
          }
        }
      }
    }
  }
`;

export default {
  name: 'App',
  setup() {
    const country = ref('US');
    const priceSelector = computed(() => {
      return {
        US: { currency: 'USD', country: 'US' },
        DE: { currency: 'EUR', country: 'DE' },
      }[country.value];
    });
    const variables = ref({
      locale: 'en',
      limit: 1,
      offset: 0,
      priceSelector: priceSelector.value,
    });
    const { result } = useQuery(
      query,
      variables
      //uncomment this makes it work but refetches
      // { fetchPolicy: 'no-cache' }
    );
    const first = computed(() => {
      if (result.value) {
        console.log(
          'cache is now:',
          JSON.stringify(cache.extract(), undefined, 2)
        );
      }
      return {
        name: result?.value?.productProjectionSearch
          ?.results?.[0]?.name,
        priceCountry:
          result?.value?.productProjectionSearch
            ?.results?.[0]?.masterVariant?.scopedPrice,
      };
    });
    const toggleCountry = () => {
      if (country.value === 'US') {
        country.value = 'DE';
        return;
      }
      if (country.value === 'DE') {
        country.value = 'US';
        return;
      }
    };
    watch;
    watch(priceSelector, (priceSelector) => {
      variables.value = {
        priceSelector,
      };
    });
    return { first, country, toggleCountry };
  },
};
</script>
