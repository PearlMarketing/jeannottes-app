import { values } from 'mobx';
import { types, getParent, flow } from 'mobx-state-tree';

import Service from '../services/services';

// A single option type (i.e. size, bread, vegetables)
export const Option = types.model('Option', {
  id: types.identifierNumber,
  name: types.string,
  // Array of available option choices (i.e. wheat, white & grain)
  options: types.array(
    types.model({
      name: types.string,
      price: types.optional(types.number, 0),
      isQty: types.optional(types.boolean, false),
    })
  ),
  type: types.string,
  isAvailable: true,
});

// Store of all option types
export const OptionStore = types
  .model('OptionStore', {
    isLoading: true,
    options: types.map(Option),
  })
  .views((self) => ({
    get shop() {
      return getParent(self);
    },
    get availableOptions() {
      return values(self.options);
    }
  }))
  .actions((self) => {
    function markLoading(loading) {
      self.isLoading = loading;
    }

    // Runs after loadOptions is finished fetching data from website API
    function updateOptions(response) {
      values(self.options).forEach((option) => (option.isAvailable = false));
      response.forEach((optionData) => {
        self.options.put(optionData);
        self.options.get(optionData.id).isAvailable = true;
      });
    }

    // Loads product options from Wordpress website
    const loadOptions = flow(function* loadOptions() {
      try {
        const response = yield Service.ProductEPO();

        const optionsData = response.data.filter((e) => e.id === 1773)[0]
          .tm_meta.tmfbuilder;

        let optionsArray = [];

        // Add radio option types to optionsArray (i.e. size, bread)
        for (i = 0; i < optionsData.radiobuttons_header_title.length; i++) {
          optionsArray.push({
            id: optionsArray.length,
            name: optionsData.radiobuttons_header_title[i],
            options: optionsData.multiple_radiobuttons_options_title[i].map(
              (e, i) => ({
                name: e,
              })
            ),
            type: 'radio',
          });
        }
        
        // Add checkbox option types to optionsArray (i.e vegetables, dressings)
        for (i = 0; i < optionsData.checkboxes_internal_name.length; i++) {
          optionsArray.push({
            id: optionsArray.length,
            name: optionsData.checkboxes_internal_name[i],
            options: optionsData.multiple_checkboxes_options_value[i].map(
              (e, j) => ({
                name: e,
                price: parseFloat(optionsData.multiple_checkboxes_options_price[i][j].split("*")[0]),
                isQty: optionsData.checkboxes_quantity[i] !== "",
              })
            ),
            type: 'checkbox',
          });
        }
        
        // After all checkbox and radio options are added to array, update store
        updateOptions(optionsArray);
        markLoading(false);
      } catch (err) {
        console.error('Failed to load options ', err);
      }
    });

    return {
      updateOptions,
      loadOptions,
    };
  });
