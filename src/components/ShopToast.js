import React from 'react';
import { Text } from 'react-native';
import Toast from 'react-native-root-toast';

// Add a Toast on screen.
const ShopToast = (message, route) => {
  Toast.show(
    <Text>
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
        if (route) {
          navigation.navigate(route);
        }
      },
    }
  );
};

export default ShopToast;
