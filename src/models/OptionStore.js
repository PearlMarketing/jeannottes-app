import { values } from 'mobx';
import { types, getParent, flow } from 'mobx-state-tree';

import Service from '../services/services';

export const Option = types.model('Option', {
  id: types.identifierNumber,
  name: types.string,
  options: types.array(
    types.model({
      name: types.string,
      price: types.optional(types.number, 0),
    })
  ),
  type: types.string,
  isAvailable: true,
});

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

    function updateOptions(response) {
      values(self.options).forEach((option) => (option.isAvailable = false));
      response.forEach((optionData) => {
        self.options.put(optionData);
        self.options.get(optionData.id).isAvailable = true;
      });
    }

    const loadOptions = flow(function* loadOptions() {
      try {
        const response = yield Service.ProductEPO();
        const optionsData = response.data.filter((e) => e.id === 1773)[0]
          .tm_meta.tmfbuilder;
        let radioOptions = [];
        // Radio Options
        for (i = 0; i < optionsData.radiobuttons_header_title.length; i++) {
          radioOptions.push({
            id: radioOptions.length,
            name: optionsData.radiobuttons_header_title[i],
            options: optionsData.multiple_radiobuttons_options_title[i].map(
              (e, i) => ({
                name: e,
              })
            ),
            type: 'radio',
          });
        }
        // Checkbox Options
        for (i = 0; i < optionsData.checkboxes_internal_name.length; i++) {
          radioOptions.push({
            id: radioOptions.length,
            name: optionsData.checkboxes_internal_name[i],
            options: optionsData.multiple_checkboxes_options_value[i].map(
              (e, i) => ({
                name: e,
              })
            ),
            type: 'checkbox',
          });
        }

        // multiple_radiobuttons_options_title.map((option) => {
        //   return {
        //     ...option,
        //     // price: parseFloat(option.price),
        //   };
        // });
        updateOptions(radioOptions);
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
