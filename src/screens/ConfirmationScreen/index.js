import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '../../components/Header';

import { SIZES, COLORS, FONTS } from '../../constants';

import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import RouteButton from '../../components/RouteButton';

const ConfirmationScreen = ({ route, navigation }) => (
  <SafeAreaView
    style={styles.container}
    edges={['top', 'right', 'bottom', 'left']}
  >
    <FocusAwareStatusBar barStyle='dark-content' />
    <Header
      route={route}
      navigation={navigation}
      dark
      title='Order Confirmation'
      noback
    />
    <View
      style={{
        paddingHorizontal: SIZES.padding * 2,
        paddingVertical: SIZES.padding,
        alignItems: 'center',
        justifyContent: 'center',
        width: SIZES.width,
        backgroundColor: 'white',
        flex: 1,
      }}
    >
      <Text
        style={{
          ...FONTS.h3,
          paddingVertical: 20,
          textAlign: 'center',
        }}
      >
        Your order has been submitted. An email has been sent to your email
        address with your order details.
      </Text>
      <RouteButton
        onPress={() => {
          navigation.navigate('Shop');
        }}
      >
        Return To Store
      </RouteButton>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
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

export default ConfirmationScreen;
