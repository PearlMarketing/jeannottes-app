import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MoreScreen from '../screens/MoreScreen';
import AccountScreen from '../screens/AccountScreen';
import FeedbackScreen from '../screens/FeedbackScreen';
import LoginScreen from '../screens/LoginScreen';
import RegistrationScreen from '../screens/RegistrationScreen';

const Stack = createStackNavigator();

const MoreNavigator = ({ navigation }) => {

  return (
      <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={"More"}
      >
        <Stack.Screen name="More" component={MoreScreen}  />
        <Stack.Screen name="Account" component={AccountScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegistrationScreen} />
        <Stack.Screen name="Feedback" component={FeedbackScreen} />
      </Stack.Navigator>
  );
};

export default MoreNavigator;
