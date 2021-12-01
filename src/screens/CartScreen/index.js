import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
} from 'react-native';
import { observer, inject } from 'mobx-react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import Header from '../../components/Header';

import { SIZES, COLORS, FONTS } from '../../constants';
import RenderSeparator from '../../components/RenderSeparator';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import RouteButton from '../../components/RouteButton';

const CartScreen = inject('shop')(
  observer(({ shop, route, navigation }) => {
    const renderRightActions = (item) => {
      return (
        <TouchableOpacity
          style={{
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
          <View style={{ flexShrink: 1 }}>
            <Text style={{ ...FONTS.h4 }}>{item.name}</Text>
            <View>
              <Text key={i}>Quantity: {item.quantity}</Text>
              {item.options.map((option, i) => (
                <Text key={i}>
                  {/* Displays options for each cart item */}
                  {option.name}:{' '}
                  {Array.isArray(option.value)
                    ? // If option item has multiple qty, add multiplier text next to it (i.e. extra meats)
                      option.value.reduce(
                        (array, e, i) =>
                          array +
                          (i !== 0 ? ', ' : '') +
                          e.name +
                          (e.qty > 1 ? '(' + e.qty + ')' : ''),
                        ''
                      )
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

        {/* Check if items are in cart & show message if cart is empty */}
        {!shop.cart.entries.length ? (
          <View
            style={{
              paddingHorizontal: SIZES.padding * 2,
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
                paddingVertical: 20,
              }}
            >
              No Items in Cart
            </Text>

            <RouteButton
              onPress={() => {
                navigation.navigate('Shop');
              }}
            >
              Order Items
            </RouteButton>
          </View>
        ) : (
          <>
            {/* Line Items */}
            <FlatList
              data={shop.cart.entries}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <LineItem key={item.id} item={item} />}
              ItemSeparatorComponent={RenderSeparator}
              ListFooterComponent={
                <>
                  <RenderSeparator />
                  <LineTotal
                    text='Subtotal'
                    total={shop.cart.total.toFixed(2)}
                  />
                  <RenderSeparator />
                </>
              }
            />
            {/* Order Button */}
            <RouteButton
              onPress={() => {
                navigation.navigate('Checkout');
              }}
            >
              Checkout
            </RouteButton>
          </>
        )}
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
