import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';

import { SIZES, COLORS, FONTS } from '../../constants';

// Ideally, this would be the same component used for each picker
const SizePicker = ({
  product,
  slideY,
  slideDown,
  pickerValues,
  setSelectedVariation,
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
        background: COLORS.white,
        bottom: 0,
        bottom: isIphoneX ? 30 : 0,
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
      {pickerValues.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: SIZES.padding * 2,
            paddingVertical: SIZES.padding * 2,
            borderBottomWidth: 1,
            background: COLORS.white,
            borderBottomColor: COLORS.secondary,
          }}
          onPress={() => {
            setSelectedVariation(option);
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

export default SizePicker;
