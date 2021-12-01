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

import { SIZES, COLORS, FONTS } from '../../constants';
import Service from '../../services/services';
import ShopToast from '../../components/ShopToast';
import RenderSeparator from '../../components/RenderSeparator';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';

const MoreScreen = inject('shop')(
  observer(({ shop, route, navigation }) => {
    return (
      <SafeAreaView
        style={styles.container}
        edges={['top', 'right', 'bottom', 'left']}
      >
        <FocusAwareStatusBar barStyle='dark-content' />
        <Header route={route} navigation={navigation} dark title='More' />
        {/* {isLoadingProduct ? (
        <Loader />
      ) : ( */}
        <>
          <View
            style={{
              backgroundColor: COLORS.white,
              width: SIZES.width,
              paddingHorizontal: SIZES.padding * 2,
            }}
          >
            <RenderSeparator />
            <TouchableOpacity
              style={styles.item}
              onPress={() => {
                navigation.navigate('Account');
              }}
            >
              {/* Icon */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingHorizontal: 5,
                }}
              >
                <Ionicons name='person' size={32} />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    ...FONTS.body3,
                  }}
                >
                  My Account
                </Text>
              </View>
            </TouchableOpacity>
            <RenderSeparator />
            {/* <TouchableOpacity
              style={styles.item}
              onPress={() => {
                navigation.navigate('Feedback');
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingHorizontal: 5,
                }}
              >
                <Ionicons name='chatbubble' size={32} />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    ...FONTS.body3,
                  }}
                >
                  Give Feedback / Report A Bug
                </Text>
              </View>
            </TouchableOpacity>
            <RenderSeparator /> */}
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
    paddingVertical: 10,
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

export default MoreScreen;
