import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MoreScreen from '../screens/MoreScreen';
import AccountScreen from '../screens/AccountScreen';
import FeedbackScreen from '../screens/FeedbackScreen';
import LoginScreen from '../screens/LoginScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import SetPasswordScreen from '../screens/SetPasswordScreen';

const Stack = createStackNavigator();

const MoreNavigator = ({ navigation }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={'Account'}
    >
      <Stack.Screen name='More' component={MoreScreen} />
      <Stack.Screen name='Account' component={AccountScreen} />
      <Stack.Screen name='Order Details' component={OrderDetailsScreen} />
      <Stack.Screen name='Login' component={LoginScreen} />
      <Stack.Screen name='Register' component={RegistrationScreen} />
      <Stack.Screen name='Feedback' component={FeedbackScreen} />
      <Stack.Screen name='Reset Password' component={ResetPasswordScreen} />
      <Stack.Screen name='Set Password' component={SetPasswordScreen} />
    </Stack.Navigator>
  );
};

export default MoreNavigator;
