import React from 'react';
import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { Ionicons, Feather } from '@expo/vector-icons';

import ShopNavigator from '../navigation/ShopNavigator';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
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
      <Tab.Screen name='Cart' component={ShopNavigator} />
      <Tab.Screen name='More' component={ShopNavigator} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
