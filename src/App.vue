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
import gql from 'graphql-tag';

const query = gql`
  query products(
    $locale: Locale!
    $limit: Int!
    $offset: Int!
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
    const locale = ref('en');
    const limit = ref(1);
    const offset = ref(0);
    const country = ref('US');
    const priceSelector = computed(() => {
      return {
        US: { currency: 'USD', country: 'US' },
        DE: { currency: 'EUR', country: 'DE' },
      }[country.value];
    });
    const variables = ref({
      locale: locale.value,
      limit: limit.value,
      offset: offset.value,
      priceSelector: priceSelector.value,
    });
    const { result } = useQuery(
      query,
      variables
      //uncomment this makes it work but refetches
      // { fetchPolicy: 'no-cache' }
    );
    const first = computed(() => ({
      name: result?.value?.productProjectionSearch
        ?.results?.[0]?.name,
      priceCountry:
        result?.value?.productProjectionSearch?.results?.[0]
          ?.masterVariant?.scopedPrice?.country,
    }));
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
        locale: locale.value,
        limit: limit.value,
        offset: offset.value,
        priceSelector,
      };
    });
    return { first, country, toggleCountry };
  },
};
</script>
