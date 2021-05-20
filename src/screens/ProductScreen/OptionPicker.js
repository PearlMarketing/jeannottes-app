import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { observer, inject } from 'mobx-react';

import { SIZES, COLORS, FONTS } from '../../constants';

// Ideally, this would be the same component used for each picker
const OptionPicker = inject('shop')(
  observer(
    ({
      shop,
      product,
      slideY,
      slideDown,
      pickerOptions,
      pickerName,
      selectedOptions,
      setSelectedOptions,
    }) => {
      const [viewHeight, setViewHeight] = React.useState(0);

      return (
        <Animated.View
          onLayout={(event) => {
            setViewHeight(event.nativeEvent.layout.height);
          }}
          style={{
            width: SIZES.width,
            marginTop: 15,
            position: 'absolute',
            bottom: 0,
            paddingBottom: isIphoneX ? 30 : 0,
            backgroundColor: 'white',
            transform: [
              {
                translateY: slideY.interpolate({
                  inputRange: [0, 1],
                  outputRange: [isIphoneX ? viewHeight + 30 : viewHeight, 0],
                }),
              },
            ],
          }}
        >
          {pickerOptions.map((option, i) => (
            <TouchableOpacity
              key={i}
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
                shop.selectionStore.addOption(product, {
                  name: pickerName,
                  value: option.name,
                  price: option.price,
                })
                // const optionIndex = selectedOptions.findIndex(
                //   (e) => e.option === pickerName
                // );
                // let updatedOption = [...selectedOptions];
                // if (optionIndex >= 0) {
                //   updatedOption[optionIndex] = {
                //     ...updatedOption[optionIndex],
                //     value: option.name,
                //   };
                // } else {
                //   updatedOption.push({
                //     option: pickerName,
                //     value: option.name,
                //   });
                // }
                // setSelectedOptions(updatedOption);
                slideDown();
              }}
            >
              <View>
                <Text
                  style={{
                    ...FONTS.h3,
                    color: COLORS.primary,
                  }}
                >
                  {/* Option */}
                  {option.name}
                </Text>
              </View>
              {/* Price, if applicable */}
              {option.price > 0 && (
                <View>
                  <Text
                    style={{
                      ...FONTS.body3,
                      marginRight: 10,
                    }}
                  >
                    ${option.price.toFixed(2)}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </Animated.View>
      );
    }
  )
);

export default OptionPicker;
