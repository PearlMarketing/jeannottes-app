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
import secureStore from '../../services/secureStore';
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

const LogInScreen = inject('shop')(
  observer(({ shop, route, navigation }) => {
    const [currentUser, setCurrentUser] = React.useState({
      email: '',
      password: '',
    });

    const [processing, setProcessing] = React.useState(false);

    const loginUser = async (e) => {
      if (processing) {
        e.preventDefault;
      } else {
        try {
          setProcessing(true);
          const { data: auth } = await Service.SetToken({
            username: currentUser.username,
            password: currentUser.password,
          });
          // console.log(auth);
          if (auth.success === true) {
            try {
              await secureStore.save('token', JSON.stringify(auth.data));
              await shop.userStore.loadUser();
              // console.log(shop.user);
              ShopToast('Successfully Logged In to ' + shop.user.nicename);
              setProcessing(false);
              navigation.navigate('Account');
            } catch (err) {
              setProcessing(false);
              ShopToast('An error occured while logging in. Please try again');
            }
          } else {
            setProcessing(false);
            ShopToast(auth.message);
          }
        } catch (e) {
          setProcessing(false)
          ShopToast(e.response.data.message);
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
        <Header route={route} navigation={navigation} dark title='Log In' />
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
              {/* Email Address */}
              <StyledTextInput
                placeholder='Enter Username or Email Address'
                label='Username or Email Address'
                onChangeText={(value) =>
                  setCurrentUser({
                    ...currentUser,
                    username: value,
                  })
                }
                value={currentUser.username}
                textContentType='username'
                autoCompleteType='username'
                autoCapitalize='none'
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
                textContentType='password'
                autoCompleteType='password'
                secureTextEntry
                autoCapitalize='none'
              />
            </View>

            {/* //! Don't allow button until all fields are filled out */}
            {/* Login Button */}
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
                onPress={loginUser}
              >
                <Text
                  style={{
                    color: COLORS.white,
                    ...FONTS.h3,
                  }}
                >
                  {processing ? 'Processing...' : 'Log In'}
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
            <View
              style={{
                paddingVertical: SIZES.padding,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
              }}
            >
              <Text onPress={() => navigation.navigate('Register')}>
                Don't have an account? Register Here.
              </Text>
            </View>
            <View
              style={{
                paddingVertical: SIZES.padding,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
              }}
            >
              <Text onPress={() => navigation.navigate('Reset Password')}>
                Forgot Password? Reset Your Password Here.
              </Text>
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

export default LogInScreen;
