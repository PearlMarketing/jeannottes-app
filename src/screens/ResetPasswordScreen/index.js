import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import { observer, inject } from 'mobx-react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import StyledTextInput from '../../components/TextInput';

import { validateEmail } from '../../services/helpers';

import { SIZES, COLORS, FONTS } from '../../constants';
import Service from '../../services/services';
import ShopToast from '../../components/ShopToast';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import RouteButton from '../../components/RouteButton';

const ResetPasswordScreen = inject('shop')(
  observer(({ shop, route, navigation }) => {
    const [currentUser, setCurrentUser] = React.useState({
      email: '',
    });

    const [processing, setProcessing] = React.useState(false);

    const resetPassword = async (e) => {
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
        } else {
          setProcessing(true);
          try {
            // passes validation
            const response = await Service.ResetPassword(currentUser);

            if (response.data.data.status === 200) {
              setProcessing(false);
              ShopToast(response.data.message);
              navigation.navigate('Set Password', {email: currentUser.email});
            } else {
              setProcessing(false);
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
          title='Reset Password'
        />
        <>
          <ScrollView
            style={{
              backgroundColor: COLORS.white,
              width: SIZES.width,
            }}
          >
            <View
              style={{
                // width: SIZES.width,
                marginVertical: 8,
                paddingHorizontal: SIZES.padding * 2,
              }}
            >
              <Text>
                Type in your email address, and a code will be sent to your
                email address to verify your identity.
              </Text>
            </View>
            {/* Checkout Fields */}
            <View
              style={{
                // width: SIZES.width,
                marginVertical: 8,
                paddingHorizontal: SIZES.padding * 2,
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
            </View>

            {/* Reset Password Button */}
            <RouteButton disabled={processing} onPress={resetPassword}>
              {processing ? 'Processing...' : 'Reset Password'}
            </RouteButton>
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

export default ResetPasswordScreen;
