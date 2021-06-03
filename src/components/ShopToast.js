import React from 'react';
import { Pressable, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
// import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-root-toast';
import { SIZES } from '../constants';

// Add a Toast on screen.
const ShopToast = (message, navigation) => {
  Toast.show(
    <Text
      style={
        {
          // marginHorizontal: SIZES.padding * 3,
          // marginVertical: SIZES.padding * 3,
          // fontSize: SIZES.body2,
        }
      }
    >
      {message}
    </Text>,
    {
      duration: Toast.durations.LONG,
      position: -60,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
      onPress: () => {
        if (navigation) {
          navigation.navigate('Cart');
          
        }
      },
      onShow: () => {
        // calls on toast\`s appear animation start
      },
      onShown: () => {
        // calls on toast\`s appear animation end.
      },
      onHide: () => {
        // calls on toast\`s hide animation start.
      },
      onHidden: () => {
        // calls on toast\`s hide animation end.
      },
    }
  );

  // You can manually hide the Toast, or it will automatically disappear after a `duration` ms timeout.
  // setTimeout(function () {
  //   Toast.hide(toast);
  // }, 3000);
};

export default ShopToast;
