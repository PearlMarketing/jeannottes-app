import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';

import { SIZES, COLORS, FONTS } from '../../constants';

// Ideally, this would be the same component used for each picker
const OptionPicker = ({
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
      {pickerOptions.map((option) => (
        <TouchableOpacity
          key={option}
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
            const optionIndex = selectedOptions.findIndex(
              (e) => e.option === pickerName
            );
            let updatedOption = [...selectedOptions];
            updatedOption[optionIndex] = {...updatedOption[optionIndex], value: option}
            setSelectedOptions(updatedOption);
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
              {option}
            </Text>
          </View>
          {/* Price, if applicable */}
          {option.price && (
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
};

export default OptionPicker;
