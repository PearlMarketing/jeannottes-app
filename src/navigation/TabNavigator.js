import React from 'react';
import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { observer, inject } from 'mobx-react';
import { Ionicons, Feather } from '@expo/vector-icons';

import ShopNavigator from '../navigation/ShopNavigator';
import CartNavigator from '../navigation/CartNavigator';

const Tab = createBottomTabNavigator();

const TabNavigator = inject('shop')(
  observer(({ shop }) => {
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
          } else if (route.name === 'More') {
            return <Feather name='more-horizontal' size={size} color={color} />;
          }
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name='Order' component={ShopNavigator} />
      <Tab.Screen name='Cart' component={CartNavigator} options={{tabBarBadge: shop.cart.entries.length || null}} />
      <Tab.Screen name='More' component={ShopNavigator} />
    </Tab.Navigator>
  );
}));

export default TabNavigator;
