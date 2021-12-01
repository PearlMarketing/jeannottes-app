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
  Touchable,
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

import { SIZES, COLORS, FONTS } from '../../constants';
import secureStore from '../../services/secureStore';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import RouteButton from '../../components/RouteButton';
import RecentOrders from '../../components/RecentOrders';

const AccountScreen = inject('shop')(
  observer(({ shop, route, navigation }) => {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'right', 'left']}>
        <FocusAwareStatusBar barStyle='dark-content' />
        <Header route={route} navigation={navigation} dark title='Account' />
        {/* if not logged in */}
        {!shop.user.email ? (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
            }}
          >
            <RouteButton
              onPress={() => {
                navigation.navigate('Login');
              }}
            >
              Log In
            </RouteButton>
            <RouteButton
              onPress={() => {
                navigation.navigate('Register');
              }}
            >
              Create Account
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

              {/* Recent Orders */}
              <View
                style={{
                  marginVertical: 20,
                }}
              >
                <Text style={{ ...FONTS.h3 }}>Recent Orders</Text>
                <RecentOrders />
              </View>
              {/* Edit Personal Information */}
              {/* Change Password */}
            </ScrollView>

            {/* Log Out User */}
            <RouteButton onPress={() => {
                  shop.userStore.logoutUser();
                }}>Log Out</RouteButton>
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
