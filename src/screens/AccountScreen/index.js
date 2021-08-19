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
import secureStore from '../../services/secureStore';

const AccountScreen = inject('shop')(
  observer(({ shop, route, navigation }) => {
    const [currentUser, setCurrentUser] = React.useState({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    });

    function FocusAwareStatusBar(props) {
      const isFocused = useIsFocused();
      return isFocused ? <StatusBar {...props} /> : null;
    }

    const RenderSeparator = () => (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#CED0CE',
        }}
      />
    );

    return (
      <SafeAreaView
        style={styles.container}
        edges={['top', 'right', 'bottom', 'left']}
      >
        <FocusAwareStatusBar barStyle='dark-content' />
        <Header route={route} navigation={navigation} dark title='Account' />
        {/* if not logged in */}
        {!shop.user.nicename ? (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
            }}
          >
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
                onPress={() => {
                  navigation.navigate('Login');
                }}
              >
                <Text
                  style={{
                    color: COLORS.white,
                    ...FONTS.h3,
                  }}
                >
                  Log In
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
                onPress={() => {
                  navigation.navigate('Register');
                }}
              >
                <Text
                  style={{
                    color: COLORS.white,
                    ...FONTS.h3,
                  }}
                >
                  Create Account
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
              {/* {console.log(shop.user)} */}
              {/* {Object.keys(shop.user).map((key) => {
                if (typeof shop.user[key] !== 'object')
                return (<Text>{key}: {shop.user[key]}</Text>)
              })} */}
              {/* <Text>{JSON.stringify(shop.user, null, 4)}</Text> */}
              {/* Account Information */}
              <View
                style={{
                  marginVertical: 8,
                }}
              >
                <Text>Username: {shop.user['nicename']}</Text>
                <Text>First Name: {shop.user['firstName']}</Text>
                <Text>Last Name: {shop.user['lastName']}</Text>
                <Text>Email: {shop.user['email']}</Text>
                <Text>Phone: {shop.user['phone']}</Text>
              </View>
              <View
                style={{
                  marginVertical: 8,
                }}
              >
                <Text>Street Address: {shop.user['billing']['address_1']}</Text>
                <Text>City: {shop.user['billing']['city']}</Text>
                <Text>State: {shop.user['billing']['state']}</Text>
                <Text>Zip Code: {shop.user['billing']['postcode']}</Text>
              </View>
              {/* Recent Orders */}
              {/* Preferred Payment Methods */}
              {/* Edit Personal Information */}
              {/* Change Password */}
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
                    shop.userStore.logoutUser();
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.white,
                      ...FONTS.h3,
                    }}
                  >
                    Log Out
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
        )}
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

export default AccountScreen;
