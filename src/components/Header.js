import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { icons, SIZES, COLORS, FONTS } from '../constants';

const Header = ({ route, navigation, page, dark }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        position: 'absolute',
        zIndex: 10,
        top: 40,
        left: 0,
      }}
    >
      <TouchableOpacity
        style={{
          width: 50,
          paddingLeft: SIZES.padding * 2,
          justifyContent: 'center',
        }}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name='arrow-back' size={32} color={COLORS.white} />
      </TouchableOpacity>

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
