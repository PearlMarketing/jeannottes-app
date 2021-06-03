import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar,
  Animated,
} from 'react-native';
import { observer, inject } from 'mobx-react';
import { useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import Header from '../../components/Header';
import Loader from '../../components/Loader';

import { icons, SIZES, COLORS, FONTS } from '../../constants';
import Service from '../../services/services';

const CartScreen = inject('shop')(
  observer(({ shop, route, navigation }) => {
    function FocusAwareStatusBar(props) {
      const isFocused = useIsFocused();
      return isFocused ? <StatusBar {...props} /> : null;
    }

    const renderRightActions = (item) => {
      return (
        <TouchableOpacity
          style={{
            // width: 80,
            backgroundColor: '#D11A2A',
            justifyContent: 'center',
          }}
          onPress={() => {
            shop.cart.remove(item);
          }}
        >
          <Animated.Text style={[styles.actionText]}>Delete</Animated.Text>
        </TouchableOpacity>
      );
    };

    const LineItem = ({ item }) => (
      <Swipeable
        renderRightActions={() => renderRightActions(item)}
        containerStyle={{ backgroundColor: COLORS.white }}
        overshootRight='false'
        containerStyle={{}}
      >
        <View
          style={{
            width: '100%',
            backgroundColor: COLORS.white,
            color: COLORS.primary,
            paddingVertical: SIZES.padding,
            paddingHorizontal: SIZES.padding * 2,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View>
            <Text style={{ ...FONTS.h4 }}>{item.name}</Text>
            <View>
              {item.options.map((option, i) => (
                <Text key={i}>
                  {option.name}:{' '}
                  {Array.isArray(option.value)
                    ? option.value.join(', ')
                    : option.value}
                </Text>
              ))}
            </View>
          </View>
          <View>
            <Text
              style={{
                ...FONTS.h4,
                flexGrow: 0,
                flexShrink: 0,
                flexBasis: 'auto',
              }}
            >
              ${item.subTotal.toFixed(2)}
            </Text>
          </View>
        </View>
      </Swipeable>
    );

    const RenderSeparator = () => (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#CED0CE',
        }}
      />
    );

    const LineTotal = ({ text, total }) => (
      <View
        style={{
          width: SIZES.width,
        }}
      >
        <View
          style={{
            width: '100%',
            backgroundColor: COLORS.white,
            color: COLORS.primary,
            paddingVertical: SIZES.padding,
            paddingHorizontal: SIZES.padding * 2,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <Text style={{ ...FONTS.h4 }}>
            {text}: ${total}
          </Text>
        </View>
      </View>
    );

    return (
      <SafeAreaView
        style={styles.container}
        edges={['top', 'right', 'bottom', 'left']}
      >
        <FocusAwareStatusBar barStyle='dark-content' />
        <Header route={route} navigation={navigation} dark title='Cart' />
        {/* {isLoadingProduct ? (
        <Loader />
      ) : ( */}
        <>
          {/* Line Items */}
          <FlatList
            // style={{
            //   flexGrow: 0,
            // }}
            data={shop.cart.entries}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <LineItem key={item.id} item={item} />}
            ItemSeparatorComponent={RenderSeparator}
            ListFooterComponent={
              <>
                <RenderSeparator />
                <LineTotal text='Subtotal' total={shop.cart.total.toFixed(2)} />
                <RenderSeparator />
              </>
            }
          />

          {/* Order Button */}
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
                // TODO: only allow if there are items in cart
                navigation.navigate('Checkout', {
                  // product: product,
                  // selectedOptions: selectedOptions,
                });
              }}
            >
              <Text
                style={{
                  color: COLORS.white,
                  ...FONTS.h3,
                }}
              >
                Checkout
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
        </>
        {/* )} */}
      </SafeAreaView>
    );
  })
);

const styles = StyleSheet.create({
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
  actionText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    alignSelf: 'flex-end',
  },
});

export default CartScreen;
