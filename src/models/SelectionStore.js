import { values } from 'mobx';
import { types, getParent, flow } from 'mobx-state-tree';
import { SIZES } from '../constants';

import Service from '../services/services';

export const Selection = types
  .model('Selection', {
    id: types.identifierNumber,
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
    isAvailable: false,
  })
  .views((self) => ({
    get subTotal() {
      return self.options.reduce((sum, e) => sum + e.price, 0);
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
        .value.push(item.name);
    }

    function removeOptionItem(product, option, item) {
      const itemIndex = self.selections
        .get(product.id)
        .options.filter((e) => e.name === option.name)[0]
        .value.findIndex((e) => e === item.name);
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
    };
  });
