import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, FONTS } from '../constants';

const Header = ({ navigation, dark, transparent, title, noback }) => {
  return (
    <View style={[styles.header, transparent && styles.headerTransparent]}>
      {/* Arrow back button */}
      <TouchableOpacity
        style={{
          width: 50,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => navigation.goBack()}
      >
        {!noback && (
          <Ionicons
            name='arrow-back'
            size={32}
            color={dark ? COLORS.primary : COLORS.white}
          />
        )}
      </TouchableOpacity>

      {/* Title of View along Top */}
      <View
        style={{
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            ...FONTS.h2,
            color: COLORS.primary,
          }}
        >
          {title}
        </Text>
      </View>

      {/* Placeholder to help title center */}
      <View
        style={{
          width: 50,
          justifyContent: 'center',
        }}
      ></View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
    elevation: 10,
  },
  headerTransparent: {
    position: 'absolute',
    top: 20,
  },
});
