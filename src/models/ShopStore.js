import { types, getEnv } from 'mobx-state-tree';
import { ProductStore } from './ProductStore';
import { OptionStore } from './OptionStore';
import { VariationStore } from './VariationStore';
import { CartStore } from './CartStore';
import { ViewStore } from './ViewStore';

export const ShopStore = types
  .model('ShopStore', {
    productStore: types.optional(ProductStore, {
      products: {},
    }),
    optionStore: types.optional(OptionStore, {
      options: {},
    }),
    variationStore: types.optional(VariationStore, {
      options: {},
    }),
    cart: types.optional(CartStore, {
      entries: [],
    }),
    view: types.optional(ViewStore, {}),
  })
  .views((self) => ({
    get fetch() {
      return getEnv(self).fetch;
    },
    get alert() {
      return getEnv(self).alert;
    },
    get isLoading() {
      return self.productStore.isLoading;
    },
    get products() {
      return self.productStore.products;
    },
    get availableProducts() {
      return self.productStore.availableProducts;
    },
    get sortedAvailableProducts() {
      return self.productStore.sortedAvailableProducts;
    },
    get options() {
      return self.optionStore.options;
    },
    get availableOptions() {
      return self.optionStore.availableOptions;
    },
    get variations() {
      return self.variationStore.variations;
    },
    get availableVariations() {
      return self.variationStore.availableVariations;
    },
  }))
  .actions((self) => ({
    afterCreate() {
      self.productStore.loadProducts();
      self.optionStore.loadOptions();
    },
  }));
