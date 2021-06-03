import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { icons, SIZES, COLORS, FONTS } from '../constants';

const Header = ({ route, navigation, page, dark, transparent, title }) => {
  return (
    <View style={[styles.header, transparent && styles.headerTransparent]}>
      <TouchableOpacity
        style={{
          width: 50,
          // paddingLeft: SIZES.padding * 2,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => navigation.goBack()}
      >
        <Ionicons
          name='arrow-back'
          size={32}
          color={dark ? COLORS.primary : COLORS.white}
        />
      </TouchableOpacity>

      <View
        style={{
          // paddingTop: SIZES.padding,
          // paddingBottom: SIZES.padding,
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            // marginVertical: 10,
            ...FONTS.h2,
            color: COLORS.primary,
          }}
        >
          {title}
        </Text>
      </View>

      <View
        style={{
          width: 50,
          // paddingLeft: SIZES.padding * 2,
          justifyContent: 'center',
        }}
      >
      </View>

      {/* Restaurant Name Section */}
      {/* <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: SIZES.padding * 3,
            borderRadius: SIZES.radius,
            backgroundColor: COLORS.lightGray3,
          }}>
          <Text style={{ ...FONTS.h3 }}>{page}</Text>
        </View>
      </View> */}

      {/* <TouchableOpacity
        style={{
          width: 50,
          paddingRight: SIZES.padding * 2,
          justifyContent: 'center',
        }}>
        <Image
          source={icons.list}
          resizeMode="contain"
          style={{
            width: 30,
            height: 30,
          }}
        />
      </TouchableOpacity> */}
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
  },
  headerTransparent: {
    position: 'absolute',
    top: 20,
  },
});
