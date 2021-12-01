import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';

import { SIZES, COLORS, FONTS } from '../constants';
import { observer, inject } from 'mobx-react';

const OptionButton = inject('shop')(
  observer(({ shop, item, product, showOptions, navigation, handlePresentModalPress }) => {

    return (
      <BottomSheetModalProvider>
        <View
          style={{
            width: SIZES.width,
            marginVertical: 8,
            paddingHorizontal: SIZES.padding * 2,
          }}
        >
          <TouchableOpacity
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: COLORS.white,
              paddingVertical: 10,
              paddingHorizontal: 20,
              ...styles.shadow,
              borderRadius: SIZES.radius,
            }}
            onPress={() => {
              handlePresentModalPress();
              // if (item.type === 'radio' || item.type === 'size') {
              //   showOptions(item.options, item.name);
              //   // handlePresentModalPress;
              // } else if (item.type === 'checkbox') {
              //   // if checkbox option doesn't yet exist, add it
              //   if (
              //     !shop.selectionStore.selections
              //       ?.get(product.id)
              //       .options.filter((e) => e.name === item.name).length
              //   ) {
              //     shop.selectionStore.addOption(product, {
              //       name: item.name,
              //       value: [],
              //     });
              //   }
              //   navigation.navigate('SelectOptions', {
              //     item,
              //     product,
              //     // selectedOptions,
              //     // setSelectedOptions,
              //   });
              // }
            }}
          >
            <View>
              <Text
                style={{
                  ...FONTS.body4,
                }}
              >
                {item.name}
              </Text>
              <Text
                style={{
                  ...FONTS.h3,
                  color: COLORS.primary,
                }}
              >
                {item.type === 'radio' || item.type === 'size'
                  ? shop.selectionStore.selections
                      ?.get(product.id)
                      .options.filter((e) => e.name === item.name)[0]?.value ||
                    ''
                  : item.type === 'checkbox'
                  ? (shop.selectionStore.selections
                      ?.get(product.id)
                      .options.filter((e) => e.name === item.name)[0]
                      ?.value.reduce((sum, e) => sum + e.qty, 0) ||
                      shop.selectionStore.selections
                        ?.get(product.id)
                        .options.filter((e) => e.name === item.name)[0]?.value
                        .length ||
                      0) + ' Selected'
                  : ''}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </BottomSheetModalProvider>
    );
  })
);

export default OptionButton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray2,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  select: {},
});
