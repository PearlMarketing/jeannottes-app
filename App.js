// if (__DEV__) {
//   import('./ReactotronConfig').then(() => console.log('Reactotron Configured'));
// }
import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootSiblingParent } from 'react-native-root-siblings';
import AppLoading from 'expo-app-loading';
import {
  useFonts,
  Roboto_100Thin,
  Roboto_100Thin_Italic,
  Roboto_300Light,
  Roboto_300Light_Italic,
  Roboto_400Regular,
  Roboto_400Regular_Italic,
  Roboto_500Medium,
  Roboto_500Medium_Italic,
  Roboto_700Bold,
  Roboto_700Bold_Italic,
  Roboto_900Black,
  Roboto_900Black_Italic,
} from '@expo-google-fonts/roboto';

import { Provider } from 'mobx-react';

import TabNavigator from './src/navigation/TabNavigator';

import { ShopStore } from './src/models/ShopStore';

// import Amplify from 'aws-amplify'
// import config from './src/aws-exports'
// import { Text } from 'react-native';
// Amplify.configure(config)


const fetcher = (url) => window.fetch(url).then((response) => response.json());
const shop = ShopStore.create(
  {},
  {
    fetch: fetcher,
    alert: (m) => console.log(m), // Noop for demo: window.alert(m)
  }
);

const Stack = createStackNavigator();

const App = () => {
  let [fontsLoaded] = useFonts({
    Roboto_100Thin,
    Roboto_100Thin_Italic,
    Roboto_300Light,
    Roboto_300Light_Italic,
    Roboto_400Regular,
    Roboto_400Regular_Italic,
    Roboto_500Medium,
    Roboto_500Medium_Italic,
    Roboto_700Bold,
    Roboto_700Bold_Italic,
    Roboto_900Black,
    Roboto_900Black_Italic,
  });

  if (!fontsLoaded) {
    return (
      <SafeAreaProvider>
        <AppLoading />
      </SafeAreaProvider>
    );
  } else {
    return (
      <Provider shop={shop}>
        <SafeAreaProvider>
          <RootSiblingParent>
            <NavigationContainer>
              <Stack.Navigator
                screenOptions={{
                  headerShown: false,
                }}
                initialRouteName={'Tabs'}
              >
                <Stack.Screen name='Tabs' component={TabNavigator} />
              </Stack.Navigator>
            </NavigationContainer>
          </RootSiblingParent>
        </SafeAreaProvider>
      </Provider>
    );
  }
};

export default App;
