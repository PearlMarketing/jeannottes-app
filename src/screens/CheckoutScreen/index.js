import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Input } from 'react-native-elements';
import { observer, inject } from 'mobx-react';
import { useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
// import { isIphoneX } from 'react-native-iphone-x-helper';
import Header from '../../components/Header';
import Loader from '../../components/Loader';
import StyledTextInput from '../../components/TextInput';

import { icons, SIZES, COLORS, FONTS } from '../../constants';
import Service from '../../services/services';
import ShopToast from '../../components/ShopToast';

const CheckoutScreen = inject('shop')(
  observer(({ shop, route, navigation }) => {
    const [currentUser, setCurrentUser] = React.useState({
      firstName: shop.user.firstName || '',
      lastName: shop.user.lastName || '',
      email: shop.user.email || '',
      phone: shop.user.phone || '',
    });

    // React.useEffect(() => {
    //   // check if user is logged in

    //   // if so, fill in checkout user information
    //   setCurrentUser({
    //     firstName: shop.user.firstName || '',
    //     lastName: shop.user.lastName || '',
    //     email: shop.user.email || '',
    //     phone: shop.user.phone || '',
    //   })

    // })

    const createOrder = () => {
      if (currentUser.firstName === '') {
        console.log('missing first name');
        ShopToast('Please enter a first name.');
      } else if (currentUser.lastName === '') {
        console.log('missing last name');
        ShopToast('Please enter a last name.');
      } else if (currentUser.email === '') {
        console.log('missing email');
        ShopToast('Please enter an email address.');
      } else if (currentUser.phone === '') {
        console.log('missing phone');
        ShopToast('Please enter a phone number.');
      } else if (!validateEmail(currentUser.email)) {
        // not a valid email
        console.log('email not valid');
        ShopToast('Email address not valid. Please enter a valid email.');
      } else if (!validatePhone(currentUser.phone)) {
        // not a valid phone number
        console.log('phone not valid');
        ShopToast('Phone number not valid. Please enter a valid phone number.');
      } else {
        // passes validation
        shop.userStore.updateUser(currentUser);
        shop.cart
          .checkout()
          .then((response) => {
            // If order was successful
            navigation.navigate('Confirmation');
          })
          .catch((error) => {
            ShopToast(
              'There was an error with the order. Please try again later.'
            );
          });
      }
    };

    function FocusAwareStatusBar(props) {
      const isFocused = useIsFocused();
      return isFocused ? <StatusBar {...props} /> : null;
    }

    const validateEmail = (email) => {
      var re =
        /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
      return re.test(email);
    };

    const validatePhone = (phone) => {
      var re = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
      return re.test(phone);
    };

    const RenderSeparator = () => (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#CED0CE',
        }}
      />
    );

    const LineTotal = ({ text, total }) => (
      <View
        style={
          {
            // width: SIZES.width,
          }
        }
      >
        <View
          style={{
            width: '100%',
            backgroundColor: COLORS.white,
            color: COLORS.primary,
            paddingVertical: SIZES.padding,
            // paddingHorizontal: SIZES.padding * 2,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
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
        <Header route={route} navigation={navigation} dark title='Checkout' />
        {/* {isLoadingProduct ? (
        <Loader />
      ) : ( */}
        <>
          {!shop.cart.entries.length ? (
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
                  paddingVertical: 20
                }}
              >
                No Items in Cart
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
          ) : (
            <>
              <ScrollView
                style={{
                  backgroundColor: COLORS.white,
                  width: SIZES.width,
                  paddingHorizontal: SIZES.padding * 2,
                }}
              >
                {/* Check Logged In Status */}
                <View
                  style={{
                    marginVertical: 8,
                  }}
                >
                  {shop.user.nicename ? (
                    <Text>Logged in as {shop.user.nicename}</Text>
                  ) : (
                    <Text>
                      Have an account?{' '}
                      <Text onPress={() => navigation.navigate('Login')}>
                        Log in Here
                      </Text>
                    </Text>
                  )}
                </View>
                {/* Checkout Fields */}
                <View
                  style={{
                    // width: SIZES.width,
                    marginVertical: 8,
                    // paddingHorizontal: SIZES.padding * 2,
                  }}
                >
                  <StyledTextInput
                    placeholder='Enter First Name'
                    label='First Name'
                    onChangeText={(value) =>
                      setCurrentUser({
                        ...currentUser,
                        firstName: value,
                      })
                    }
                    value={currentUser.firstName}
                  />
                  <StyledTextInput
                    placeholder='Enter Last Name'
                    label='Last Name'
                    onChangeText={(value) =>
                      setCurrentUser({
                        ...currentUser,
                        lastName: value,
                      })
                    }
                    value={currentUser.lastName}
                  />
                  <StyledTextInput
                    placeholder='Enter Email Address'
                    label='Email Address'
                    onChangeText={(value) =>
                      setCurrentUser({
                        ...currentUser,
                        email: value,
                      })
                    }
                    value={currentUser.email}
                    autoCompleteType='email'
                    keyboardType='email-address'
                  />
                  <StyledTextInput
                    placeholder='Enter Phone Number'
                    label='Phone Number'
                    onChangeText={(value) =>
                      setCurrentUser({
                        ...currentUser,
                        phone: value,
                      })
                    }
                    value={currentUser.phone}
                    autoCompleteType='tel'
                    keyboardType='number-pad'
                  />
                </View>

                <RenderSeparator />
                <LineTotal
                  text='Subtotal'
                  total={shop.cart.subTotal.toFixed(2)}
                />
                <RenderSeparator />
                <LineTotal text='Taxes' total={shop.cart.tax.toFixed(2)} />
                <RenderSeparator />
                <LineTotal text='Total' total={shop.cart.total.toFixed(2)} />
                <RenderSeparator />
              </ScrollView>

              {/* // TODO: Prevent button from pressing multiple times */}
              {/* Order Button */}
              <View
                style={{
                  paddingHorizontal: SIZES.padding * 2,
                  paddingVertical: SIZES.padding,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: SIZES.width,
                  backgroundColor: 'white',
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
                  onPress={createOrder}
                >
                {
                  // If order is already processing, prevent press

                  // Else, if order is ready, begin processing
                }
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
          )}
        </>
      </SafeAreaView>
    );
  })
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

export default CheckoutScreen;
