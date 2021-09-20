import { values } from 'mobx';
import { types, getParent, flow } from 'mobx-state-tree';
import { SIZES } from '../constants';

import Service from '../services/services';

export const Option = types.model('Option', {
  id: types.maybe(types.number),
  name: types.string,
  value: types.union(
    types.string,
    types.array(
      // Add objects with pricing and qty
      types.model({
        name: types.string,
        qty: types.number,
        price: types.optional(types.number, 0),
      })
    )
  ),
  price: types.optional(types.number, 0),
});

export const Selection = types
  .model('Selection', {
    id: types.identifierNumber,
    name: types.string,
    type: types.string,
    options: types.array(Option),
    price: types.number,
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

    function updateSelections(response) {
      self.selections.put(response);
      self.selections.get(response.id).isAvailable = true;
    }

    function clearSelections(product) {
      self.selections.get(product.id).options = [];
    }

    function addOption(product, option) {
      if (
        // Does option exist yet
        self.selections
          .get(product.id)
          .options.filter((e) => e.name === option.name).length > 0
      ) {
        // If so, then change the value
        const optionIndex = self.selections
          .get(product.id)
          .options.findIndex((e) => e.name === option.name);
        let updatedOptions = [...self.selections.get(product.id).options];
        updatedOptions[optionIndex] = option;
        self.selections.get(product.id).options = updatedOptions;
      } else {
        // Add new option to selection
        self.selections.get(product.id).options.push(option);
      }
    }

    function addOptionItem(product, option, item) {
      self.selections
        .get(product.id)
        .options.filter((e) => e.name === option.name)[0]
        .value.push({ name: item.name, qty: 1, price: item.price });
      // console.log(self.selections.get(product.id));
    }

    function increaseQty(product, option, item) {
      self.selections
        .get(product.id)
        .options.filter((e) => e.name === option.name)[0]
        .value.filter((e) => e.name === item.name)[0].qty++;
    }

    function decreaseQty(product, option, item) {
      self.selections
        .get(product.id)
        .options.filter((e) => e.name === option.name)[0]
        .value.filter((e) => e.name === item.name)[0].qty--;

      if (
        self.selections
          .get(product.id)
          .options.filter((e) => e.name === option.name)[0]
          .value.filter((e) => e.name === item.name)[0].qty < 1
      ) {
        removeOptionItem(product, option, item);
      }
    }

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
      increaseQty,
      decreaseQty,
    };
  });
