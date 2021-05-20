import { when, reaction, values } from 'mobx';
import {
  types,
  getParent,
  getSnapshot,
  applySnapshot,
  destroy,
} from 'mobx-state-tree';
import { Product } from './ProductStore';

const CartEntry = types
  .model('CartEntry', {
    // quantity: 0,
    id: types.identifierNumber,
    product: types.reference(Product),
    name: types.string,
    type: types.string,
    options: types.array(
      types.model({
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
    get hasDiscount() {
      return self.subTotal >= 100;
    },
    get discount() {
      return self.subTotal * (self.hasDiscount ? 0.1 : 0);
    },
    get total() {
      return self.subTotal - self.discount;
    },
    get canCheckout() {
      return (
        self.entries.length > 0
        // && self.entries.every((entry) => entry.isValidProduct)
      );
    },
  }))
  .actions((self) => ({
    afterAttach() {
      if (typeof window !== 'undefined' && window.localStorage) {
        when(
          () => !self.shop.isLoading,
          () => {
            self.readFromLocalStorage();
            reaction(
              () => getSnapshot(self),
              (json) => {
                window.localStorage.setItem('cart', JSON.stringify(json));
              }
            );
          }
        );
      }
    },
    addProduct(entry, notify = true) {
      // let entry = self.entries.find((entry) => entry.product === product)
      // if (!entry) {
      // const price = self.shop.availableVariations.filter((e) => e.id === product.id)[0].options.filter((e) => e.name === selectedOptions.filter((e) => e.option === 'Size')[0].value)[0].price
      const options = entry.options.map((option) => ({
        name: option.name,
        value: option.value,
        price: option.price,
      }))
      self.entries.push({
        ...entry,
        product: entry.id,
        id: self.entries.length,
        options: options
      });
      // entry = self.entries[self.entries.length - 1]
      // }
      // entry.increaseQuantity(quantity)
      if (notify) self.shop.alert('Added to cart');
      if (notify) self.shop.alert(self.entries);
    },
    remove(product) {
      destroy(product);
    },
    checkout() {
      const total = self.total;
      self.clear();
      self.shop.alert(`Bought products for ${total} $ !`);
    },
    clear() {
      self.entries.clear();
    },
    readFromLocalStorage() {
      const cartData = window.localStorage.getItem('cart');
      if (cartData) applySnapshot(self, JSON.parse(cartData));
    },
  }));
