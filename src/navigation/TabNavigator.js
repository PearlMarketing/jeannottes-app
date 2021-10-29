import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { observer, inject } from 'mobx-react';
import { Ionicons } from '@expo/vector-icons';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ShopNavigator from './ShopNavigator';
import CartNavigator from './CartNavigator';
import MoreNavigator from './MoreNavigator';
import FeedbackScreen from '../screens/FeedbackScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = inject('shop')(
  observer(({ shop }) => {
    const insets = useSafeAreaInsets();
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            if (route.name === 'Order') {
              return (
                <Ionicons
                  name={focused ? 'restaurant' : 'restaurant-outline'}
                  size={size}
                  color={color}
                />
              );
            } else if (route.name === 'Cart') {
              return (
                <Ionicons
                  name={focused ? 'cart' : 'cart-outline'}
                  size={size}
                  color={color}
                />
              );
            } else if (route.name === 'Account / Reorder') {
              return (
                <Ionicons
                  name='reload'
                  size={size}
                  color={color}
                />
              );
            } else if (route.name === 'Account') {
              return (
                <Ionicons
                  name={focused ? 'person' : 'person-outline'}
                  size={size}
                  color={color}
                />
              );
            } else if (route.name === 'Feedback') {
              return (
                <Ionicons
                  name={focused ? 'help-circle' : 'help-circle-outline'}
                  size={size}
                  color={color}
                />
              );
            }
          },
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          style: {
            height: 60 + insets.bottom,
          },
          tabStyle: {
            height: 60,
          },
        }}
      >
        <Tab.Screen name='Order' component={ShopNavigator} />
        <Tab.Screen
          name='Cart'
          component={CartNavigator}
          options={{
            tabBarBadge: shop.cart.entries.length || null,
            unmountOnBlur: true,
          }}
        />
        <Tab.Screen name='Account / Reorder' component={MoreNavigator} />
        <Tab.Screen name='Feedback' component={FeedbackScreen} />
      </Tab.Navigator>
    );
  })
);

export default TabNavigator;
