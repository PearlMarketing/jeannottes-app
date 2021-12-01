import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SIZES, COLORS, FONTS } from '../constants';

const RouteButton = ({ onPress, disabled, children, ...props }) => {
  return (
    <View
      style={{
        paddingHorizontal: SIZES.padding * 2,
        paddingVertical: SIZES.padding,
        alignItems: 'center',
        justifyContent: 'center',
        width: SIZES.width,
        backgroundColor: 'white',

        // shadowColor: '#000',
        // shadowOffset: {
        //   width: 0,
        //   height: -3,
        // },
        // shadowOpacity: 0.1,
        // shadowRadius: 3,
        // elevation: 1,
      }}
    >
      <TouchableOpacity
        style={{
          backgroundColor: disabled ? '#777' : COLORS.primary,
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 10,
          paddingHorizontal: 20,
          ...styles.shadow,
          borderRadius: SIZES.radius * 2,
        }}
        onPress={onPress}
        {...props}
      >
        <Text
          style={{
            color: COLORS.white,
            ...FONTS.h3,
          }}
        >
          {children}
        </Text>
        <Ionicons
          name='arrow-forward'
          style={{
            color: COLORS.white,
            position: 'absolute',
            right: 20,
          }}
          size={26}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default RouteButton;
