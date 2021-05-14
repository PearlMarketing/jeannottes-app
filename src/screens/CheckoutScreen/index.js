import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  StatusBar,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { isIphoneX } from 'react-native-iphone-x-helper';
import Header from '../../components/Header';
import Loader from '../../components/Loader';

import { Input } from 'react-native-elements';

import { icons, SIZES, COLORS, FONTS } from '../../constants';
import Service from '../../services/services';

const CheckoutScreen = ({ route, navigation }) => {
  const [orderItems, setOrderItems] = React.useState([
    {
      name: 'BLT',
      price: 7.99,
      options: [
        {
          option: 'Size',
          value: 'Small',
          price: 0,
        },
        {
          option: 'Bread',
          value: 'White Roll',
        },
        {
          option: 'Cheese',
          value: 'American',
        },
      ],
    },
  ]);

  React.useEffect(() => {
    // // passes down selected item
    // let { item } = route.params;
    // setProduct(item);
  }, []);

  function FocusAwareStatusBar(props) {
    const isFocused = useIsFocused();
    return isFocused ? <StatusBar {...props} /> : null;
  }

  const LineItem = ({ item }) => (
    <TouchableOpacity
      style={{
        width: SIZES.width,
      }}
      onPress={() =>
        navigation.navigate('Product', {
          item,
        })
      }
    >
      <View
        style={{
          width: '100%',
          backgroundColor: COLORS.white,
          color: COLORS.primary,
          paddingVertical: SIZES.padding,
          paddingHorizontal: SIZES.padding * 2,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottomWidth: 1,
        }}
      >
        <View>
          <Text style={{ ...FONTS.h4 }}>{item.name}</Text>
          <Text style={{ ...FONTS.body3 }}>Options</Text>
        </View>
        <Text style={{ ...FONTS.h4 }}>${item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  const LineTotal = ({ text, total }) => (
    <View
      style={{
        width: SIZES.width,
      }}
    >
      <View
        style={{
          width: '100%',
          backgroundColor: COLORS.white,
          color: COLORS.primary,
          paddingVertical: SIZES.padding,
          paddingHorizontal: SIZES.padding * 2,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
          borderBottomWidth: 1,
        }}
      >
        <Text style={{ ...FONTS.h4 }}>
          {text}: ${total}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top', 'right', 'bottom', 'left']}
    >
      <FocusAwareStatusBar barStyle='dark-content' />
      <Header route={route} navigation={navigation} dark />
      {/* {isLoadingProduct ? (
        <Loader />
      ) : ( */}
      <>
        <View
          style={{
            // paddingTop: SIZES.padding,
            paddingBottom: SIZES.padding,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              marginVertical: 10,
              ...FONTS.h2,
              color: COLORS.primary,
            }}
          >
            Checkout
          </Text>
        </View>

        {/* Checkout Fields */}
        <Input
          placeholder='Enter First Name'
          label='First Name'
        />
        <Input
          placeholder='Enter Last Name'
          label='Last Name'
        />
        <Input
          placeholder='Enter Email Address'
          label='Email Address'
        />
        <Input
          placeholder='Enter Phone Number'
          label='Phone Number'
        />

        

        {/* Order Button */}
        <View
          style={{
            padding: SIZES.padding * 2,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            width: SIZES.width,
            bottom: 0,
            paddingBottom: isIphoneX ? 30 : 0,
            // backgroundColor: 'white',
          }}
        >
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
            onPress={() =>
              navigation.navigate('Confirmation', {
                // product: product,
                // selectedOptions: selectedOptions,
              })
            }
          >
            <Text
              style={{
                color: COLORS.white,
                ...FONTS.h3,
              }}
            >
              Submit
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
    backgroundColor: COLORS.lightGray2,
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

export default CheckoutScreen;
