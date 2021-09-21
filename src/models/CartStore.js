import { when, reaction, values } from 'mobx';
import {
  types,
  getParent,
  getSnapshot,
  applySnapshot,
  destroy,
  flow,
  clone,
  cast,
  castToSnapshot,
} from 'mobx-state-tree';
import { Product } from './ProductStore';

import { Option } from './SelectionStore';

import Service from '../services/services';

const CartEntry = types
  .model('CartEntry', {
    // quantity: 0,
    id: types.identifierNumber,
    product: types.number,
    name: types.string,
    type: types.string,
    quantity: types.number,
    options: types.array(Option),
    // options: types.array(
    //   types.model({
    //     id: types.maybe(types.number),
    //     name: types.string,
    //     value: types.union(
    //       types.string,
    //       types.array(
    //         // Add objects with pricing and qty
    //         types.model({
    //           name: types.string,
    //           qty: types.number,
    //           price: types.optional(types.number, 0),
    //         })
    //       )
    //     ),
    //     price: types.optional(types.number, 0),
    //   })
    // ),
    price: types.number,
  })
  .views((self) => ({
    // get subTotal() {
    //   return self.options.reduce((sum, e) => sum + e.price, 0);
    // },
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
      return self.subTotal * 0.09;
    },
  }))
  .actions((self) => ({
    // increaseQuantity(number) {
    //     self.quantity += number
    // },
    // setQuantity(number) {
    //     self.quantity = number
    // },
    remove() {
      getParent(self, 2).remove(self);
    },
  }));

export const CartStore = types
  .model('CartStore', {
    entries: types.array(CartEntry),
  })
  .views((self) => ({
    get shop() {
      return getParent(self);
    },
    get subTotal() {
      return self.entries.reduce((sum, e) => sum + e.subTotal, 0);
    },
    get tax() {
      return self.subTotal * 0.09;
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
      return (
        self.entries.length > 0
        // && self.entries.every((entry) => entry.isValidProduct)
      );
    },
  }))
  .actions((self) => {
    // function afterAttach() {
    //   if (typeof window !== 'undefined' && window.localStorage) {
    //     when(
    //       () => !self.shop.isLoading,
    //       () => {
    //         self.readFromLocalStorage();
    //         reaction(
    //           () => getSnapshot(self),
    //           (json) => {
    //             window.localStorage.setItem('cart', JSON.stringify(json));
    //           }
    //         );
    //       }
    //     );
    //   }
    // },
    function addProduct(entry, notify = true) {
      // console.log(entry);
      // console.log(getSnapshot(entry));
      self.entries.push({
        ...getSnapshot(entry),
        product: entry.id,
        id: self.entries.length,
        // options: entry.options,
        // options: entry.options.map((option) => ({
        //   id: option.id,
        //   name: option.name,
        //   // value: option.value,
        //   value: Array.isArray(option.value)
        //     ? option.value.map((extra) => ({
        //         name: extra.name,
        //         qty: extra.qty,
        //         price: extra.price,
        //       }))
        //     : option.value,
        //   price: option.price,
        // })),
      });
      if (notify) self.shop.alert('Added to cart');
      // console.log(self.entries);
    }
    const reorderProduct = flow(function* reorderProduct(entry, notify = true) {
      const productType = self.shop.products.get(entry.product_id).type;

      // console.log('type:' + productType);

      // Each option section needs to be an array
      let options = [];

      // Push Size option first
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
        value: entry.meta_data.filter((e) => e.key === 'pa_size')[0].display_value,
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

      entry.meta_data
        .filter((e) => e.key === '_tmcartepo_data')[0]
        .value.map((option, i) => {
          // ! Combine options of the same type

          // ? check if option name already exists in array, if not, add entire object
          options.filter((e) => e.name === option.name).length === 0 || i === 0
            ? options.push({
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
            : // ? otherwise, if option type already exists, add just the value
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

      // ! This is the model
      // id: types.maybe(types.number),
      // name: types.string,
      // value: types.union(
      //   types.string,
      //   types.array(
      //     // Add objects with pricing and qty
      //     types.model({
      //       name: types.string,
      //       qty: types.number,
      //       price: types.optional(types.number, 0),
      //     })
      //   )
      // ),
      // price: types.optional(types.number, 0),

      // ! This was my old map
      // options: entry.options.map((option) => ({
      //   id: option.id,
      //   name: option.name,
      //   // value: option.value,
      //   value: Array.isArray(option.value)
      //     ? option.value.map((extra) => ({
      //         name: extra.name,
      //         qty: extra.qty,
      //         price: extra.price,
      //       }))
      //     : option.value,
      //   price: option.price,
      // })),
      if (notify) self.shop.alert('Added to cart');
      // console.log(self.entries);
    });
    function remove(product) {
      destroy(product);
    }

    const checkout = flow(function* checkout() {
      let lineItems = [];
      self.entries.map((entry) => {
        // format product options
        let productOptions = [];

        entry.options
          .filter((option) => option.name !== 'Size')
          .map((option) => {
            // maps each product option in WC format
            if (Array.isArray(option.value)) {
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

                // console.log(option);
                productOptions.push(formattedOption);
              });
            } else {
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

              // console.log(option);
              productOptions.push(formattedOption);
            }
          });

        // take each entry and format
        let entryData = {
          product_id: entry.product,
          variation_id: entry.options.filter((e) => e.name === 'Size')[0].id,
          quantity: entry.quantity,
          // calculate subtotal for each item
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
        // push to lineItems array
        lineItems.push(entryData);
      });
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

      // Sample Data for testing
      const sampleOrderData = {
        payment_method: 'cod',
        payment_method_title: 'Cash',
        set_paid: true,
        billing: {
          first_name: 'Culver',
          last_name: 'Lau',
          address_1: '',
          address_2: '',
          city: '',
          state: '',
          postcode: '',
          country: '',
          email: 'culver@pearlmarketing.com',
          phone: '(555) 555-5555',
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
        line_items: [
          {
            product_id: 1698,
            variation_id: 1699,
            quantity: 1,
            subtotal: '6.98',
            meta_data: [
              {
                key: '_tmcartepo_data',
                value: [
                  {
                    mode: 'builder',
                    element: {
                      type: '',
                    },
                    name: 'Choose Your Bread',
                    value: 'White Roll',
                    price: 0,
                    section: '',
                    quantity: 1,
                  },
                  {
                    mode: 'builder',
                    element: {
                      type: '',
                    },
                    name: 'Choose Your Cheese',
                    value: 'Provolone',
                    price: 0,
                    section: '',
                    quantity: 1,
                  },
                  {
                    mode: 'builder',
                    element: {
                      type: '',
                    },
                    name: 'Optional Vegetables',
                    value: 'Lettuce',
                    price: 0,
                    section: '',
                    quantity: 1,
                  },
                  {
                    mode: 'builder',
                    element: {
                      type: '',
                    },
                    name: 'Optional Vegetables',
                    value: 'Tomatoes',
                    price: 0,
                    section: '',
                    quantity: 1,
                  },
                  // {
                  //   mode: 'builder',
                  //   element: {
                  //     type: '',
                  //   },
                  //   name: 'Optional Dressings',
                  //   value: 'Oil',
                  //   price: 0,
                  //   section: '',
                  //   quantity: 1,
                  // },
                  // {
                  //   mode: 'builder',
                  //   cssclass: 'extra-quantity',
                  //   element: {
                  //     type: '',
                  //     // type: 'checkbox',
                  //     rules_type: {
                  //       'Extra Bacon (add .50 per slice)_0': ['math'],
                  //     },
                  //     _: {
                  //       price_type: false,
                  //     },
                  //   },
                  //   name: 'Extras',
                  //   value: 'Extra Bacon (add .50 per slice)',
                  //   price: 2,
                  //   section: '',
                  //   quantity: '4',
                  //   price_formula: '0.50*{quantity}',
                  // },
                  // {
                  //   mode: 'builder',
                  //   element: {
                  //     type: '',
                  //   },
                  //   name: 'Schedule For Later? (Optional)',
                  //   value: '16:30',
                  //   price: 0,
                  //   section: '',
                  //   quantity: 1,
                  // },
                  {
                    mode: 'builder',
                    element: {
                      type: '',
                    },
                    name: 'Special instructions',
                    value: 'This is a test! DO NOT MAKE ME',
                    price: 0,
                    section: '',
                    quantity: 1,
                  },
                ],
              },
              {
                key: '_tm_epo',
                value: [1],
              },
            ],
          },
        ],
        shipping_lines: [],
      };

      try {
        // Post to wc
        const response = yield Service.CreateOrder(orderData);

        // console.log(orderData);

        // If successful, clear cart
        // console.warn(orderData);
        self.clear();

        return response;
        // self.shop.alert(`Bought products for ${total} $ !`);
      } catch (err) {
        console.error('Failed to post order ', err);
        // If not successful, show error toast
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
      addProduct,
      reorderProduct,
      remove,
      checkout,
      clear,
      readFromLocalStorage,
    };
  });
