import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ShopScreen from '../screens/ShopScreen';
import ProductScreen from '../screens/ProductScreen';
import SelectOptionsScreen from '../screens/SelectOptionsScreen';

const Stack = createStackNavigator();

const ShopNavigator = ({ navigation }) => {

  return (
      <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={"Shop"}
      >
        <Stack.Screen name="Shop" component={ShopScreen}  />
        <Stack.Screen name="Product" component={ProductScreen} />
        <Stack.Screen name="SelectOptions" component={SelectOptionsScreen} />
      </Stack.Navigator>
  );
};

export default ShopNavigator;
