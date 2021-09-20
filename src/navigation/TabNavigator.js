import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { observer, inject } from 'mobx-react';
import { Ionicons, Feather } from '@expo/vector-icons';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ShopNavigator from './ShopNavigator';
import CartNavigator from './CartNavigator';
import MoreNavigator from './MoreNavigator';
import AccountScreen from '../screens/AccountScreen';
import { Pressable } from 'react-native';

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
                  style={
                    {
                      // padding:10
                    }
                  }
                />
              );
            } else if (route.name === 'Cart') {
              return (
                <Ionicons
                  name={focused ? 'cart' : 'cart-outline'}
                  size={size}
                  color={color}
                  style={
                    {
                      // padding:10
                    }
                  }
                />
              );
            } else if (route.name === 'Reorder') {
              return (
                <Ionicons
                  name='reload'
                  size={size}
                  color={color}
                  style={
                    {
                      // padding:10
                    }
                  }
                />
              );
            } else if (route.name === 'More') {
              return (
                <Feather
                  name='more-horizontal'
                  size={size}
                  color={color}
                  style={
                    {
                      // padding:10
                    }
                  }
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
        <Tab.Screen name='Reorder' component={AccountScreen} />
        <Tab.Screen name='More' component={MoreNavigator} />
      </Tab.Navigator>
    );
  })
);

export default TabNavigator;
