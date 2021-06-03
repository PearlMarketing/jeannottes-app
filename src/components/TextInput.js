import React from 'react';
import {  ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';

import { SIZES, COLORS } from '../constants';

const StyledTextInput = (props) => (
  <TextInput
    style={{
      backgroundColor: COLORS.white,
      borderRadius: SIZES.radius,
      marginVertical: 5,
      ...styles.shadow,
    }}
    outlineColor={COLORS.white}
    mode='outlined'
    {...props}
  />
);;

export default StyledTextInput

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  select: {},
});
