import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { isIphoneX } from 'react-native-iphone-x-helper';
import Header from '../../components/Header';
import Loader from '../../components/Loader';

import { icons, SIZES, COLORS, FONTS } from '../../constants';
import Service from '../../services/services';

const ConfirmationScreen = ({ route, navigation }) => {
  const [orderItems, setOrderItems] = React.useState(null);

  React.useEffect(() => {
    // // passes down selected item
    // let { item } = route.params;
    // setProduct(item);
  }, []);

  function FocusAwareStatusBar(props) {
    const isFocused = useIsFocused();
    return isFocused ? <StatusBar {...props} /> : null;
  }

  return (
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
      {/* {isLoadingProduct ? (
        <Loader />
      ) : ( */}
      <>
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
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.primary,
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 10,
              paddingHorizontal: 20,
              ...styles.shadow,
              borderRadius: SIZES.radius * 2,
            }}
            onPress={() => {
              // TODO: only allow if there are items in cart
              navigation.navigate('Shop', {
                // product: product,
                // selectedOptions: selectedOptions,
              });
            }}
          >
            <Text
              style={{
                color: COLORS.white,
                ...FONTS.h3,
              }}
            >
              Order Items
            </Text>
            <Ionicons
              name='arrow-forward'
              style={{
                color: COLORS.white,
                position: 'absolute',
                right: 20,
                // ...FONTS.h3,
              }}
              size={26}
            />
          </TouchableOpacity>
        </View>
      </>
      {/* )} */}
    </SafeAreaView>
  );
};

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
