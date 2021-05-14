import { values } from 'mobx';
import { types, getParent, flow } from 'mobx-state-tree';

import Service from '../services/services';

import { replaceHTML } from '../services/helpers';

export const Variation = types.model('Variation', {
  productId: types.number,
  id: types.identifierNumber,
  price: types.number,
  attributes: types.array(
    types.model({
      id: types.number,
      name: types.string,
      option: types.string,
    })
  ),
  meta_data: types.array(
    types.model({
      id: types.number,
      key: types.string,
      value: types.string,
    })
  ),
  isAvailable: true,
});

export const VariationStore = types
  .model('VariationStore', {
    isLoading: true,
    variations: types.map(Variation),
  })
  .views((self) => ({
    get shop() {
      return getParent(self);
    },
    get availableVariations() {
      return values(self.variations);
    },
    get sortedAvailableVariations() {
      return sortVariations(values(self.variations));
    },
  }))
  .actions((self) => {
    function markLoading(loading) {
      self.isLoading = loading;
    }

    function updateVariations(response) {
      values(self.variations).forEach(
        (variation) => (variation.isAvailable = false)
      );
      response.forEach((variationData) => {
        self.variations.put(variationData);
        self.variations.get(variationData.id).isAvailable = true;
      });
    }

    const loadVariations = flow(function* loadVariations(product) {
      try {
        const response = yield Service.ProductVariations(product.id);
        const variationsData = response.data.map((variation) => {
          return {
            ...variation,
            productId: product.id,
            price: parseFloat(variation.price),
          };
        });
        updateVariations(variationsData);
        markLoading(false);
      } catch (err) {
        console.error('Failed to load variations ', err);
      }
    });

    return {
      updateVariations,
      loadVariations,
    };
  });

function sortVariations(variations) {
  return variations
    .filter((b) => b.isAvailable)
    .sort((a, b) => (a.name > b.name ? 1 : a.name === b.name ? 0 : -1));
}
