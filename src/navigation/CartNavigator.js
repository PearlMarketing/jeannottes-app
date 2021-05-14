import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import ConfirmationScreen from '../screens/ConfirmationScreen';

const Stack = createStackNavigator();

const CartNavigator = ({ navigation }) => {

  return (
      <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={"Cart"}
      >
        <Stack.Screen name="Cart" component={CartScreen}  />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
      </Stack.Navigator>
  );
};

export default CartNavigator;
