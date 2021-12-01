import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { observer, inject } from 'mobx-react';

import { SIZES, COLORS, FONTS } from '../../constants';

// Ideally, this would be the same component used for each picker
const QuantityPicker = inject('shop')(
  observer(
    ({
      shop,
      product,
      slideY,
      slideDown,
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
            // paddingBottom: isIphoneX ? 30 : 0,
            backgroundColor: 'white',
            elevation: 5,
            transform: [
              {
                translateY: slideY.interpolate({
                  inputRange: [0, 1],
                  outputRange: [viewHeight, 0],
                  // outputRange: [isIphoneX ? viewHeight + 30 : viewHeight, 0],
                }),
              },
            ],
          }}
        >
          {[1,2,3,4,5,6,7,8,9,10].map((n, i) => (
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
                shop.selectionStore.updateQuantity(product, n)
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
                  {n}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </Animated.View>
      );
    }
  )
);

export default QuantityPicker;
