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
import { observer, inject } from 'mobx-react';
import { useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { isIphoneX } from 'react-native-iphone-x-helper';
import Header from '../../components/Header';
import Loader from '../../components/Loader';

import { icons, SIZES, COLORS, FONTS } from '../../constants';
import Checkbox from './Checkbox';
import Quantity from './Quantity';
// import Service from '../../services/services';

const SelectOptionsScreen = inject('shop')(
  observer(({ shop, route, navigation }) => {
    const product = route.params.product;
    const option = route.params.item;

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
          title={`Select ` + option.name}
        />
        {/* {isLoadingProduct ? (
        <Loader />
      ) : ( */}
        <>
          {/* <View
            style={{
              // paddingTop: SIZES.padding,
              paddingBottom: SIZES.padding,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                marginVertical: 10,
                ...FONTS.h2,
                color: COLORS.primary,
              }}
            >
              Select {option.name}
            </Text>
          </View> */}

          <ScrollView>
            <View
              style={{
                paddingBottom: 10,
              }}
            >
              {option.options.map((item, i) =>
                item.isQty ? (
                  <Quantity
                    key={i}
                    product={product}
                    option={option}
                    item={item}
                  />
                ) : (
                  <Checkbox
                    key={i}
                    product={product}
                    option={option}
                    item={item}
                  />
                )
              )}
            </View>
          </ScrollView>

          <View
            style={{
              padding: SIZES.padding * 2,
              alignItems: 'center',
              justifyContent: 'center',
              // position: 'absolute',
              width: SIZES.width,
              bottom: 0,
              paddingBottom: isIphoneX ? 30 : 0,
              // backgroundColor: 'white',
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
                navigation.navigate('Product', {
                  // product: product,
                  // selectedOptions: selectedOptions,
                });
              }}
            >
              <Ionicons
                name='arrow-back'
                style={{
                  color: COLORS.white,
                  position: 'absolute',
                  left: 20,
                  // ...FONTS.h3,
                }}
                size={26}
              />
              <Text
                style={{
                  color: COLORS.white,
                  ...FONTS.h3,
                }}
              >
                Done
              </Text>
            </TouchableOpacity>
          </View>
        </>
        {/* )} */}
      </SafeAreaView>
    );
  })
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray2,
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

export default SelectOptionsScreen;
