import {
  types,
  getParent,
  getSnapshot,
  applySnapshot,
  destroy,
  flow,
} from 'mobx-state-tree';

import { Option } from './SelectionStore';

import Service from '../services/services';

// A single cart item
const CartEntry = types
  .model('CartEntry', {
    id: types.identifierNumber,
    product: types.number,
    name: types.string,
    type: types.string,
    quantity: types.number,
    options: types.array(Option),
    price: types.number,
  })
  .views((self) => ({
    get store() {
      return getParent(self);
    },
    get subTotal() {
      const size = self.options.reduce((sum, e) => sum + e.price, 0);
      const extras = self.options.reduce((sum, e) => {
        let addon = 0;
        Array.isArray(e.value) &&
          (addon += e.value.reduce((sum, e) => sum + e.price * e.qty, 0));
        return sum + addon;
      }, 0);
      return (size + extras) * self.quantity;
    },
    get tax() {
      return self.subTotal * self.store.taxRate * 0.01;
    },
  }))
  .actions((self) => ({
    remove() {
      getParent(self, 2).remove(self);
    },
  }));

// Entire cart store
export const CartStore = types
  .model('CartStore', {
    entries: types.array(CartEntry),
    taxRate: types.optional(types.number, 8.5),
  })
  .views((self) => ({
    get shop() {
      return getParent(self);
    },
    get subTotal() {
      return self.entries.reduce((sum, e) => sum + e.subTotal, 0);
    },
    get tax() {
      return self.subTotal * self.taxRate * 0.01;
    },
    get hasDiscount() {
      return self.subTotal >= 100;
    },
    get discount() {
      return self.subTotal * (self.hasDiscount ? 0.1 : 0);
    },
    get total() {
      return self.subTotal + self.tax - self.discount;
    },
    get canCheckout() {
      return self.entries.length > 0;
    },
  }))
  .actions((self) => {
    function setTax(taxRate) {
      self.taxRate = parseFloat(taxRate);
    }

    // Grabs tax from Wordpress website.
    const loadTax = flow(function* loadTax() {
      try {
        const response = yield Service.Tax(1);
        const taxRate = response.data.rate;
        setTax(taxRate);
      } catch (err) {
        console.error('Failed to load tax ', err);
      }
    });

    function addProduct(entry, notify = true) {
      self.entries.push({
        ...getSnapshot(entry),
        product: entry.id,
        id: self.entries.length,
      });
      if (notify) self.shop.alert('Added to cart');
    }

    // This function is used on the Account screen, when customer wants to reorder a previously ordered product with selected options intact
    const reorderProduct = flow(function* reorderProduct(entry, notify = true) {
      const productType = self.shop.products.get(entry.product_id).type;
      let options = [];

      // Pushes Size option first
      productType === 'variable' &&
        (self.shop.productStore.products.get(entry.product_id).loadedVariations
          ? console.log('variations already loaded')
          : yield self.shop.variationStore.loadVariations(
              entry.product_id,
              entry.name
            ));

      options.push({
        id: entry.variation_id,
        name: 'Size',
        value: entry.meta_data.filter((e) => e.key === 'pa_size')[0]
          .display_value,
        price: self.shop.availableVariations
          .filter((e) => e.id === entry.product_id)[0]
          .options.filter(
            (e) =>
              e.name.toLowerCase() ===
              entry.meta_data
                .filter((e) => e.key === 'pa_size')[0]
                .display_value.toLowerCase()
          )[0].price,
      });

      // Combine options of the same type for correct MST SelectionStore formatting
      entry.meta_data
        .filter((e) => e.key === '_tmcartepo_data')[0]
        .value.map((option, i) => {

          // check if option name already exists in array
          options.filter((e) => e.name === option.name).length === 0 || i === 0
            ? // if not, add entire option type
            options.push({
                name: option.name,
                value: [
                  {
                    name: option.value,
                    qty: option.quantity,
                    price:
                      self.shop.availableOptions
                        .filter((product) => product.name === option.name)[0]
                        ?.options?.filter(
                          (extra) => extra.name === option.value
                        )[0].price || 0,
                  },
                ],
              })
            : // otherwise, if option type already exists, add just the value to existing array
              (options
                .filter((e) => e.name === option.name)[0]
                .value.push({
                  name: option.value,
                  qty: option.quantity,
                  price:
                    self.shop.availableOptions
                      .filter((product) => product.name === option.name)[0]
                      ?.options?.filter(
                        (extra) => extra.name === option.value
                      )[0].price || 0,
                }),
              console.log(options.filter((e) => e.name === option.name)[0]));
        });

      // properly formatted product entry when reordering
      const newEntry = {
        product: entry.product_id,
        id: self.entries.length,
        name: entry.parent_name || entry.name,
        options: options,
        type: productType,
        price: self.shop.availableProducts.filter(
          (product) => product.id === entry.product_id
        )[0].price,
      };

      self.entries.push(newEntry);

      if (notify) self.shop.alert('Added to cart');
    });

    // Used when swipe removing on the cart screen
    function remove(product) {
      destroy(product);
    }

    const checkout = flow(function* checkout() {
      let lineItems = [];

      self.entries.map((entry) => {

        // We want to map out each cart item, but we need to first map out the product options within each product
        let productOptions = [];
        entry.options
          .filter((option) => option.name !== 'Size')
          .map((option) => {

            // Because the size option does not use an aray for the value, we need to separate size from all the other options.
            // * Possible todo is to change this so that Size is consistent with the rest of the options.

            if (Array.isArray(option.value)) {
              // If it is NOT size
              option.value.map((value) => {
                const formattedOption = {
                  mode: 'builder',
                  element: {
                    type: '',
                  },
                  name: option.name,
                  value: value.name,
                  price: value.price,
                  section: '',
                  // TODO: add conditional for quantity items
                  quantity: value.qty,
                };

                productOptions.push(formattedOption);
              });
            } else {
              // For the size option
              const formattedOption = {
                mode: 'builder',
                element: {
                  type: '',
                },
                name: option.name,
                value: option.value,
                price: option.price,
                section: '',
                // TODO: add conditional for quantity items
                quantity: 1,
              };

              productOptions.push(formattedOption);
            }
          });

        // Now that we have all the product options added, we take the cart item, reformat it to fit Woocommerce post order data, and add it to the lineItems array.
        let entryData = {
          product_id: entry.product,
          variation_id: entry.options.filter((e) => e.name === 'Size')[0].id,
          quantity: entry.quantity,
          subtotal: entry.subTotal.toString(),
          total: entry.subTotal.toString(),
          meta_data: [
            {
              key: '_tmcartepo_data',
              value: productOptions,
            },
            {
              key: '_tm_epo',
              value: [1],
            },
          ],
        };
        lineItems.push(entryData);
      });

      // Includes customer information into post data
      const orderData = {
        customer_id: self.shop.user.id,
        payment_method: 'cod',
        payment_method_title: 'Cash',
        set_paid: true,
        status: 'processing',
        billing: {
          first_name: self.shop.user.firstName,
          last_name: self.shop.user.lastName,
          address_1: '',
          address_2: '',
          city: '',
          state: '',
          postcode: '',
          country: '',
          email: self.shop.user.email,
          phone: self.shop.user.phone,
        },
        shipping: {
          first_name: '',
          last_name: '',
          address_1: '',
          address_2: '',
          city: '',
          state: '',
          postcode: '',
          country: '',
        },
        line_items: lineItems,
        shipping_lines: [],
      };

      try {
        // Post to Website Woocommerce
        const response = yield Service.CreateOrder(orderData);

        // If successful, clear cart
        self.clear();

        return response;
      } catch (err) {
        // If not successful, show error toast
        console.error('Failed to post order ', err);
        throw err;
      }
    });

    function clear() {
      self.entries.clear();
    }

    function readFromLocalStorage() {
      const cartData = window.localStorage.getItem('cart');
      if (cartData) applySnapshot(self, JSON.parse(cartData));
    }

    return {
      loadTax,
      addProduct,
      reorderProduct,
      remove,
      checkout,
      clear,
      readFromLocalStorage,
    };
  });
