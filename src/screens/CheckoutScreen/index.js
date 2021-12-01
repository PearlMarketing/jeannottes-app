import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Input } from 'react-native-elements';
import { observer, inject } from 'mobx-react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
// import { isIphoneX } from 'react-native-iphone-x-helper';
import Header from '../../components/Header';
import Loader from '../../components/Loader';
import StyledTextInput from '../../components/TextInput';

import { validateEmail, validatePhone } from '../../services/helpers';

import { SIZES, COLORS, FONTS } from '../../constants';
import Service from '../../services/services';
import ShopToast from '../../components/ShopToast';
import RenderSeparator from '../../components/RenderSeparator';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import RouteButton from '../../components/RouteButton';

const CheckoutScreen = inject('shop')(
  observer(({ shop, route, navigation }) => {
    const [currentUser, setCurrentUser] = React.useState({
      firstName: shop.user.firstName || '',
      lastName: shop.user.lastName || '',
      email: shop.user.email || '',
      phone: shop.user.phone || '',
    });

    const [processing, setProcessing] = React.useState(false);

    const createOrder = (e) => {
      if (processing) {
        e.preventDefault;
      } else {
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
          ShopToast(
            'Phone number not valid. Please enter a valid phone number.'
          );
        } else {
          // passes validation
          setProcessing(true);

          shop.userStore.updateUser(currentUser);
          shop.cart
            .checkout()
            .then((response) => {
              // If order was successful
              setProcessing(false);
              navigation.navigate('Confirmation');
            })
            .catch((error) => {
              setProcessing(false);
              ShopToast(
                'There was an error with the order. Please try again later.'
              );
            });
        }
      }
    };

    const LineTotal = ({ text, total }) => (
      <View
        style={{
          width: '100%',
          backgroundColor: COLORS.white,
          color: COLORS.primary,
          paddingVertical: SIZES.padding,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        <Text style={{ ...FONTS.h4 }}>
          {text}: ${total}
        </Text>
      </View>
    );

    return (
      <SafeAreaView
        style={styles.container}
        edges={['top', 'right', 'bottom', 'left']}
      >
        <FocusAwareStatusBar barStyle='dark-content' />
        <Header route={route} navigation={navigation} dark title='Checkout' />
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
                paddingVertical: 20,
              }}
            >
              No Items in Cart
            </Text>

            <RouteButton
              onPress={() => {
                navigation.navigate('Shop');
              }}
            >
              Order Items
            </RouteButton>
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
                    <Text
                      style={{ fontWeight: 'bold' }}
                      onPress={() => navigation.navigate('Account / Reorder', { screen: 'Login'})}
                    >
                      Click Here to log in
                    </Text>
                  </Text>
                )}
              </View>

              {/* Checkout Fields */}
              <View
                style={{
                  marginVertical: 8,
                }}
              >
                {/* First Name */}
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

                {/* Last Name */}
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

                {/* Email Address */}
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

                {/* Phone Number */}
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

            {/* Order Button */}
            <RouteButton disabled={processing} onPress={createOrder}>
              {processing ? 'Processing...' : 'Submit'}
            </RouteButton>
          </>
        )}
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
