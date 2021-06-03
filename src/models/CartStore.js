import { when, reaction, values } from 'mobx';
import {
  types,
  getParent,
  getSnapshot,
  applySnapshot,
  destroy,
  flow,
} from 'mobx-state-tree';
import { Product } from './ProductStore';

import Service from '../services/services';

const CartEntry = types
  .model('CartEntry', {
    // quantity: 0,
    id: types.identifierNumber,
    product: types.number,
    name: types.string,
    type: types.string,
    options: types.array(
      types.model({
        id: types.maybe(types.number),
        name: types.string,
        value: types.union(types.string, types.array(types.string)),
        price: types.optional(types.number, 0),
      })
    ),
    price: types.number,
    type: types.string,
  })
  .views((self) => ({
    get subTotal() {
      return self.options.reduce((sum, e) => sum + e.price, 0);
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
      self.entries.push({
        ...entry,
        product: entry.id,
        id: self.entries.length,
        options: entry.options.map((option) => ({
          id: option.id,
          name: option.name,
          value: Array.isArray(option.value)
            ? Array.from(option.value)
            : option.value,
          price: option.price,
        })),
      });
      if (notify) self.shop.alert('Added to cart');
    }
    function remove(product) {
      destroy(product);
    }

    const checkout = flow(function* checkout() {
      let lineItems = [];
      self.entries.map((entry) => {
        // format product options
        let productOptions = [];

        entry.options.map((option) => {
          // maps each product option in WC format
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
          productOptions.push(formattedOption)
        });

        // take each entry and format
        let entryData = {
          product_id: entry.product,
          variation_id: entry.options.filter((e) => e.name === 'Size')[0].id,
          quantity: 1,
          // calculate subtotal for each item
          subtotal: entry.subTotal,
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
        payment_method: 'cod',
        payment_method_title: 'Cash',
        set_paid: true,
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
        // yield Service.CreateOrder(orderData);

        // If successful, clear cart
        console.log(orderData);
        self.clear();

        // self.shop.alert(`Bought products for ${total} $ !`);
      } catch (err) {
        console.error('Failed to post order ', err);
        // If not successful, show error toast
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
      remove,
      checkout,
      clear,
      readFromLocalStorage,
    };
  });
