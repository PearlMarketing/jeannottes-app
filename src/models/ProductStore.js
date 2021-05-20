import { values } from 'mobx';
import { types, getParent, flow } from 'mobx-state-tree';

import Service from '../services/services';

import { replaceHTML } from '../services/helpers';

export const Product = types.model('Product', {
  id: types.identifierNumber,
  name: types.string,
  type: types.string,
  short_description: types.string,
  price: types.number,
  categories: types.array(
    types.model({
      id: types.number,
      name: types.string,
      slug: types.string,
    })
  ),
  images: types.array(
    types.model({
      id: types.number,
      src: types.string,
    })
  ),
  variations: types.array(types.number),
  isAvailable: true,
  loadedVariations: false,
});

export const ProductStore = types
  .model('ProductStore', {
    isLoading: true,
    products: types.map(Product),
  })
  .views((self) => ({
    get shop() {
      return getParent(self);
    },
    get availableProducts() {
      return values(self.products);
    },
    get sortedAvailableProducts() {
      return sortProducts(values(self.products));
    },
  }))
  .actions((self) => {
    function markLoading(loading) {
      self.isLoading = loading;
    }

    function markLoadedVariation(productId, result) {
      self.products.get(productId).loadedVariations = result;
    }

    function updateProducts(response) {
      values(self.products).forEach((product) => (product.isAvailable = false));
      response.forEach((productData) => {
        self.products.put(productData);
        self.products.get(productData.id).isAvailable = true;
      });
    }

    const loadProducts = flow(function* loadProducts() {
      try {
        const response = yield Service.Products(`category=22&per_page=50`);
        const productsData = response.data
          .filter((item) => item.status === 'publish')
          .map((product) => {
            // self.shop.variationStore.loadVariations(product);
            return {
              ...product,
              short_description: replaceHTML(product.short_description),
              price: parseFloat(product.price),
            };
          });
        updateProducts(productsData);
        markLoading(false);
      } catch (err) {
        console.error('Failed to load products ', err);
      }
    });

    return {
      updateProducts,
      loadProducts,
      markLoadedVariation,
    };
  });

function sortProducts(products) {
  return products
    .filter((b) => b.isAvailable)
    .sort((a, b) => (a.name > b.name ? 1 : a.name === b.name ? 0 : -1));
}
