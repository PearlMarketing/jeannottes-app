import React from 'react';
import { ActivityIndicator, View, Text } from 'react-native';

const Loader = () => (
  <View style={{
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  }}>
    <ActivityIndicator size='large' />
    <Text style={{
      marginTop: 20,
    }}>Loading...</Text>
  </View>
);

export default Loader;
