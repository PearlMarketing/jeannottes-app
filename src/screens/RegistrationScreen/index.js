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

import { validateEmail, validatePhone } from '../../services/helpers';

import { icons, SIZES, COLORS, FONTS } from '../../constants';
import Service from '../../services/services';
import ShopToast from '../../components/ShopToast';

const RegistrationScreen = inject('shop')(
  observer(({ shop, route, navigation }) => {
    const [currentUser, setCurrentUser] = React.useState({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    });

    const [processing, setProcessing] = React.useState(false);

    const createCustomer = async (e) => {
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
        } else if (currentUser.username === '') {
          console.log('missing username');
          ShopToast('Please enter a username.');
        } else if (currentUser.password === '') {
          console.log('missing password');
          ShopToast('Please enter a password.');
        } else if (currentUser.confirmPassword === '') {
          console.log('missing confirm password');
          ShopToast('Please confirm password.');
        } else if (currentUser.confirmPassword !== currentUser.password) {
          console.log('passwords do not match');
          ShopToast('Passwords do not match.');
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
          setProcessing(true);
          try {
            // passes validation
            const customerData = {
              username: currentUser.username,
              password: currentUser.password,
              first_name: currentUser.firstName,
              last_name: currentUser.lastName,
              email: currentUser.email,
              billing: {
                first_name: currentUser.firstName,
                last_name: currentUser.lastName,
                company: '',
                address_1: '',
                address_2: '',
                city: '',
                state: '',
                postcode: '',
                country: '',
                phone: currentUser.phone,
                email: currentUser.email,
              },
            };
            const testData = {
              email: 'culverlauphotography@gmail.com',
              first_name: 'Culver',
              last_name: 'Lau',
              username: 'culvertest',
              password: 'test',
              billing: {
                first_name: 'Culver',
                last_name: 'Lau',
                company: '',
                address_1: '',
                address_2: '',
                city: '',
                state: '',
                postcode: '',
                country: '',
                phone: '4552134839',
                email: 'culverlauphotography@gmail.com',
              },
            };
            console.log(customerData);
            const response = await Service.CreateCustomer(customerData);
            console.log(response);

            ShopToast(
              'Successfully Created Account for ' +
                currentUser.email +
                '. Please log in.'
            );
            setProcessing(false);
            setCurrentUser({
              firstName: '',
              lastName: '',
              username: '',
              email: '',
              phone: '',
              password: '',
              confirmPassword: '',
            });
            navigation.navigate('Account');
          } catch (error) {
            ShopToast(
              'An error occured while creating account. Please try again.'
            );
            setProcessing(false);
            console.error('Failed to post order ', error);
          }
        }
      }
    };

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
        <Header route={route} navigation={navigation} dark title='Register' />
        <>
          <ScrollView
            style={{
              backgroundColor: COLORS.white,
              width: SIZES.width,
              paddingHorizontal: SIZES.padding * 2,
            }}
          >
            {/* Checkout Fields */}
            <View
              style={{
                // width: SIZES.width,
                marginVertical: 8,
                // paddingHorizontal: SIZES.padding * 2,
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
                textContentType='givenName'
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
                textContentType='familyName'
              />
              {/* Username */}
              <StyledTextInput
                placeholder='Enter Username'
                label='Username'
                onChangeText={(value) =>
                  setCurrentUser({
                    ...currentUser,
                    username: value,
                  })
                }
                value={currentUser.username}
                textContentType='username'
                autoCapitalize='none'
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
                textContentType='emailAddress'
                autoCompleteType='email'
                keyboardType='email-address'
                autoCapitalize='none'
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
                textContentType='telephoneNumber'
                autoCompleteType='tel'
                keyboardType='phone-pad'
              />
              {/* Password */}
              <StyledTextInput
                placeholder='Enter Password'
                label='Password'
                onChangeText={(value) =>
                  setCurrentUser({
                    ...currentUser,
                    password: value,
                  })
                }
                value={currentUser.password}
                textContentType='newPassword'
                autoCompleteType='password'
                secureTextEntry
                autoCapitalize='none'
              />
              {/* Repeat Password */}
              <StyledTextInput
                placeholder='Confirm Password'
                label='Confirm Password'
                onChangeText={(value) =>
                  setCurrentUser({
                    ...currentUser,
                    confirmPassword: value,
                  })
                }
                value={currentUser.confirmPassword}
                secureTextEntry
                autoCapitalize='none'
              />
            </View>

            {/* //! Don't allow button until all fields are filled out */}
            {/* Registration Button */}
            <View
              style={{
                paddingVertical: SIZES.padding,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: processing ? '#777' : COLORS.primary,
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  ...styles.shadow,
                  borderRadius: SIZES.radius * 2,
                }}
                disabled={processing}
                onPress={createCustomer}
              >
                <Text
                  style={{
                    color: COLORS.white,
                    ...FONTS.h3,
                  }}
                >
                  {processing ? 'Processing...' : 'Register'}
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
          </ScrollView>
        </>
      </SafeAreaView>
    );
  })
);

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
  },
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

export default RegistrationScreen;
