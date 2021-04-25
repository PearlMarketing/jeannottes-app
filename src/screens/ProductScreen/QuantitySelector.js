import React from 'react';

const QuantitySelector = ({ product }) => {
  return (
    <View>
      {/* Quantity */}
      <View
        style={{
          position: 'absolute',
          bottom: -20,
          width: SIZES.width,
          height: 50,
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        <TouchableOpacity
          style={{
            width: 50,
            backgroundColor: COLORS.white,
            alignItems: 'center',
            justifyContent: 'center',
            borderTopLeftRadius: 25,
            borderBottomLeftRadius: 25,
          }}
          onPress={() => editOrder('-', product?.id, product?.price)}
        >
          <Text
            style={{
              ...FONTS.body1,
            }}
          >
            -
          </Text>
        </TouchableOpacity>
        <View
          style={{
            width: 50,
            backgroundColor: COLORS.white,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              ...FONTS.h2,
            }}
          >
            {getOrderQty(product?.id)}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            width: 50,
            backgroundColor: COLORS.white,
            alignItems: 'center',
            justifyContent: 'center',
            borderTopRightRadius: 25,
            borderBottomRightRadius: 25,
          }}
          onPress={() => editOrder('+', product?.id, product?.price)}
        >
          <Text style={{ ...FONTS.body1 }}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default QuantitySelector