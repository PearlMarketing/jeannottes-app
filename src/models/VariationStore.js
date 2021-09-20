import { values } from 'mobx';
import { types, getParent, flow } from 'mobx-state-tree';

import Service from '../services/services';

export const Variation = types.model('Variation', {
  id: types.identifierNumber,
  productName: types.string,
  name: 'Size',
  options: types.array(
    types.model({
      id: types.number,
      name: types.string,
      price: types.number,
      // barcode: types.string,
    })
  ),
  type: 'size',
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
  }))
  .actions((self) => {
    function markLoading(loading) {
      self.isLoading = loading;
    }

    function updateVariations(response) {
      self.variations.put(response);
      self.variations.get(response.id).isAvailable = true;
    }

    const loadVariations = flow(function* loadVariations(productId, productName) {
      try {
        const response = yield Service.ProductVariations(productId);
        const variationsData = {
          id: productId,
          productName: productName,
          options: response.data.map((variation, i) => ({
            id: variation.id,
            name: variation.attributes[0].option,
            price: parseFloat(variation.price),
            // barcode: variation.meta_data[0].value,
          })),
        };
        updateVariations(variationsData);
        markLoading(false);
        self.shop.productStore.markLoadedVariation(productId, true);
      } catch (err) {
        console.error('Failed to load variations ', err);
      }
    });

    return {
      updateVariations,
      loadVariations,
    };
  });