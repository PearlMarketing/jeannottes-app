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

const FeedbackScreen = inject('shop')(
  observer(({ shop, route, navigation }) => {
    const [currentUser, setCurrentUser] = React.useState({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: '',
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
        <Header route={route} navigation={navigation} dark title='Feedback' />
        {/* {isLoadingProduct ? (
        <Loader />
      ) : ( */}
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
                placeholder='Enter Message'
                label='Message'
                onChangeText={(value) =>
                  setCurrentUser({
                    ...currentUser,
                    message: value,
                  })
                }
                value={currentUser.message}
                multiline
                numberOfLines={4}
                minHeight={100}
              />
            </View>

            {/* //! Don't allow ordering until all fields are filled out */}
            {/* Submit Button */}
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
                // onPress={sendFeedback}
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
          </ScrollView>
        </>
        {/* )} */}
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

export default FeedbackScreen;
