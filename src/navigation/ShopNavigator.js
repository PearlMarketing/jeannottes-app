import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ShopScreen from '../screens/ShopScreen';

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
      </Stack.Navigator>
  );
};

export default ShopNavigator;
