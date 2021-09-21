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

import * as Linking from 'expo-linking';
// import { isIphoneX } from 'react-native-iphone-x-helper';
import Header from '../../components/Header';
import Loader from '../../components/Loader';
import StyledTextInput from '../../components/TextInput';

import { validateEmail } from '../../services/helpers';

import { icons, SIZES, COLORS, FONTS } from '../../constants';
import Service from '../../services/services';
import ShopToast from '../../components/ShopToast';

const FeedbackScreen = inject('shop')(
  observer(({ shop, route, navigation }) => {
    const [currentUser, setCurrentUser] = React.useState({
      email: '',
      message: '',
    });

    const sendFeedback = async () => {
      if (currentUser.email === '') {
        console.log('missing email');
        ShopToast('Please enter an email address.');
      } else if (currentUser.message === '') {
        console.log('missing message');
        ShopToast('Please enter a message.');
      } else if (!validateEmail(currentUser.email)) {
        // not a valid email
        console.log('email not valid');
        ShopToast('Email address not valid. Please enter a valid email.');
      } else {
        try {
          // passes validation
          const feedbackData = {
            email: currentUser.email,
            message: currentUser.message,
          };
          const testData = {
            email: 'culverlau@gmail.com',
            message: 'This is a test',
          };
          console.log(feedbackData);
          // const response = await Service.CreateCustomer(customerData);
          // console.log(response);

          ShopToast('Thank you, feedback was successfully sent.');
          setCurrentUser({
            email: '',
            message: '',
          });
          navigation.navigate('More');
        } catch (error) {
          ShopToast(
            'An error occured while sending feedback. Please try again.'
          );
          console.error('Failed to send feedback', error);
        }
      }
    };

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
          <View
            style={{
              backgroundColor: COLORS.white,
              width: SIZES.width,
              paddingHorizontal: SIZES.padding * 2,
              // paddingHorizontal: SIZES.padding * 2,
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
                textAlign: 'center'
              }}
            >
              For all feedback and questions, or to report a bug, please contact{' '}
              <Text
                onPress={() =>
                  Linking.openURL('mailto:info@pearlmarketing.com')
                }
              >
                info@pearlmarketing.com
              </Text>
            </Text>
            {/* Checkout Fields */}
            {/* <View
              style={{
                // width: SIZES.width,
                marginVertical: 8,
                // paddingHorizontal: SIZES.padding * 2,
              }}
            >
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
            </View> */}

            {/* //! Don't allow ordering until all fields are filled out */}
            {/* Submit Button */}
            {/* <View
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
                onPress={sendFeedback}
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
            </View> */}
          </View>
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
