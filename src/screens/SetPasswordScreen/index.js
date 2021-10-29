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

const SetPasswordScreen = inject('shop')(
  observer(({ shop, route, navigation }) => {
    const [currentUser, setCurrentUser] = React.useState({
      email: '',
      code: '',
      password: '',
      confirmPassword: '',
    });

    const [processing, setProcessing] = React.useState(false);

    React.useEffect(() => {
      let { email } = route.params;
      setCurrentUser({
        ...currentUser,
        email: email,
      });
    }, []);

    const setPassword = async (e) => {
      if (processing) {
        e.preventDefault;
      } else {
        if (currentUser.email === '') {
          console.log('missing email');
          ShopToast('Please enter an email address.');
        } else if (!validateEmail(currentUser.email)) {
          // not a valid email
          console.log('email not valid');
          ShopToast('Email address not valid. Please enter a valid email.');
        } else if (currentUser.code === '') {
          console.log('missing code');
          ShopToast('Please enter verification code sent to your email address.');
        } else if (currentUser.password === '') {
          console.log('missing password');
          ShopToast('Please enter a password.');
        } else if (currentUser.confirmPassword === '') {
          console.log('missing confirm password');
          ShopToast('Please confirm password.');
        } else if (currentUser.confirmPassword !== currentUser.password) {
          console.log('passwords do not match');
          ShopToast('Passwords do not match.');
        } else {
          setProcessing(true);
          try {
            // passes validation
            // console.log(currentUser);
            const response = await Service.SetPassword(currentUser);
            // console.log(response);

            if (response.data.data.status === 200) {
              setProcessing(false);
              // setCurrentUser({
              //   email: ''
              // });
              ShopToast(response.data.message);
              navigation.navigate('Account');
            } else {
              setProcessing(false);
              // console.error(
              //   response.data.data.status + ': ' + response.data.message
              // );
              ShopToast(
                response.data.data.status + ': ' + response.data.message
              );
            }
          } catch (e) {
            setProcessing(false);
            console.log(e.response.data.message);
            ShopToast(e.response.data.message);
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
        <Header
          route={route}
          navigation={navigation}
          dark
          title='Set Password'
        />
        <>
          <ScrollView
            style={{
              backgroundColor: COLORS.white,
              width: SIZES.width,
              paddingHorizontal: SIZES.padding * 2,
            }}
          >
            <View
              style={{
                // width: SIZES.width,
                marginVertical: 8,
                // paddingHorizontal: SIZES.padding * 2,
              }}
            >
              <Text>
                Type in a new password, along with the verification code sent to
                your email address
              </Text>
            </View>
            {/* Checkout Fields */}
            <View
              style={{
                // width: SIZES.width,
                marginVertical: 8,
                // paddingHorizontal: SIZES.padding * 2,
              }}
            >
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
              {/* Code */}
              <StyledTextInput
                placeholder='Enter Verification Code'
                label='Verification Code'
                onChangeText={(value) =>
                  setCurrentUser({
                    ...currentUser,
                    code: value,
                  })
                }
                value={currentUser.code}
                // textContentType='code'
                // autoCapitalize='none'
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
            {/* Set Password Button */}
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
                onPress={setPassword}
              >
                <Text
                  style={{
                    color: COLORS.white,
                    ...FONTS.h3,
                  }}
                >
                  {processing ? 'Processing...' : 'Set Password'}
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

export default SetPasswordScreen;
