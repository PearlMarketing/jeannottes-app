import { values } from 'mobx';
import { types, getParent, flow } from 'mobx-state-tree';
import { SIZES } from '../constants';

import Service from '../services/services';

// A single selected option type
export const Option = types.model('Option', {
  id: types.maybe(types.number),
  name: types.string,
  value: types.union(
    types.string,
    types.array(
      // If the option is not Size, it will use this array model
      types.model({
        name: types.string,
        qty: types.number,
        price: types.optional(types.number, 0),
      })
    )
  ),
  price: types.optional(types.number, 0),
});

// A group the selected options for a specific product
export const Selection = types
  .model('Selection', {
    id: types.identifierNumber,
    name: types.string,
    type: types.string,
    options: types.array(Option),
    price: types.number,
    quantity: types.optional(types.number, 1),
    isAvailable: false,
  })
  .views((self) => ({
    get subTotal() {
      const size = self.options.reduce((sum, e) => sum + e.price, 0);
      const extras = self.options.reduce((sum, e) => {
        let addon = 0;
        Array.isArray(e.value) &&
          (addon += e.value.reduce((sum, e) => sum + e.price * e.qty, 0));
        return sum + addon;
      }, 0);
      return size + extras;
    },
  }));

export const SelectionStore = types
  .model('SelectionStore', {
    isLoading: true,
    selections: types.map(Selection),
  })
  .views((self) => ({
    get shop() {
      return getParent(self);
    },
    get availableSelections() {
      return values(self.selections);
    },
  }))
  .actions((self) => {
    function markLoading(loading) {
      self.isLoading = loading;
    }

    // When we first land on a specific product view, if selection has not been initiated yet, initiate selection object
    function addSelection(product) {
      const selectionData = {
        id: product.id,
        name: product.name,
        type: product.type,
        options: [],
        price: product.price,
      };
      updateSelections(selectionData);
    }

    // Run on product selection initiation
    function updateSelections(response) {
      self.selections.put(response);
      self.selections.get(response.id).isAvailable = true;
    }

    // Clears selected options when the product is added tp cart
    function clearSelections(product) {
      self.selections.get(product.id).options = [];
      self.selections.get(product.id).quantity = 1
    }

    // Adds a new option type to a product selection
    function addOption(product, option) {
      if (
        // Checks if selected option type exist yet for that specific product
        self.selections
          .get(product.id)
          .options.filter((e) => e.name === option.name).length > 0
      ) {
        // If it does exist, then change the value
        const optionIndex = self.selections
          .get(product.id)
          .options.findIndex((e) => e.name === option.name);
        let updatedOptions = [...self.selections.get(product.id).options];
        updatedOptions[optionIndex] = option;
        self.selections.get(product.id).options = updatedOptions;
      } else {
        // If it does not exist yet, add the new option type to selection group of that specific product
        self.selections.get(product.id).options.push(option);
      }
    }

    // Add a new option item to a option type
    function addOptionItem(product, option, item) {
      self.selections
        .get(product.id)
        .options.filter((e) => e.name === option.name)[0]
        .value.push({ name: item.name, qty: 1, price: item.price });
    }

    // This changes the quantity of the product in cart (quantity of sandwich)
    function updateQuantity(product, n) {
      self.selections.get(product.id).quantity = n;
    }

    // For option types that have selectable quantity (i.e. extra meats, extra cheeses)
    function increaseQty(product, option, item) {
      self.selections
        .get(product.id)
        .options.filter((e) => e.name === option.name)[0]
        .value.filter((e) => e.name === item.name)[0].qty++;
    }

    // For option types that have selectable quantity (i.e. extra meats, extra cheeses)
    function decreaseQty(product, option, item) {
      self.selections
        .get(product.id)
        .options.filter((e) => e.name === option.name)[0]
        .value.filter((e) => e.name === item.name)[0].qty--;

      // If quantity goes down to 0, then remove the option from the array
      if (
        self.selections
          .get(product.id)
          .options.filter((e) => e.name === option.name)[0]
          .value.filter((e) => e.name === item.name)[0].qty < 1
      ) {
        removeOptionItem(product, option, item);
      }
    }

    // Runs when quantity of a selected option item goes down to 0
    function removeOptionItem(product, option, item) {
      const itemIndex = self.selections
        .get(product.id)
        .options.filter((e) => e.name === option.name)[0]
        .value.findIndex((e) => e.name === item.name);
      if (itemIndex > -1) {
        const updatedItems = self.selections
          .get(product.id)
          .options.filter((e) => e.name === option.name)[0]
          .value.splice(itemIndex, 1);
      }
    }

    return {
      addSelection,
      clearSelections,
      addOption,
      updateSelections,
      addOptionItem,
      removeOptionItem,
      updateQuantity,
      increaseQty,
      decreaseQty,
    };
  });
