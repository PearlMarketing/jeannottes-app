import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { observer, inject } from 'mobx-react';

import { SIZES, COLORS, FONTS } from '../../constants';

const Checkbox = inject('shop')(
  observer(({ shop, product, option, item }) => {
    return (
      <View
        style={{
          width: SIZES.width,
          marginVertical: 8,
          paddingHorizontal: SIZES.padding * 2,
        }}
      >
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: SIZES.padding * 2,
            paddingVertical: SIZES.padding * 2,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.secondary,
          }}
          onPress={() => {
            if (
              shop.selectionStore.selections
                ?.get(product.id)
                .options.filter((e) => e.name === option.name)[0]
                ?.value.includes(item.name)
            ) {
              shop.selectionStore.removeOptionItem(product, option, item)
            } else {
              shop.selectionStore.addOptionItem(product, option, item)
            }
            // Toggle checkbox
          }}
        >
          <View>
            <Text
              style={{
                marginRight: 10,
              }}
            >
              {shop.selectionStore.selections
                ?.get(product.id)
                .options.filter((e) => e.name === option.name)[0]
                ?.value.includes(item.name) ? (
                <Ionicons name='checkbox-outline' size={28} />
              ) : (
                <Ionicons name='square-outline' size={28} />
              )}
            </Text>
          </View>
          <View>
            <Text
              style={{
                ...FONTS.h3,
                color: COLORS.primary,
              }}
            >
              {item.name}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  })
);

export default Checkbox;

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
