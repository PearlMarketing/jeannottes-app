import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { observer, inject } from 'mobx-react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';

import { SIZES, COLORS, FONTS } from '../../constants';
import Checkbox from './Checkbox';
import Quantity from './Quantity';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import RouteButton from '../../components/RouteButton';

const SelectOptionsScreen = inject('shop')(
  observer(({ shop, route, navigation }) => {
    const product = route.params.product;
    const option = route.params.item;

    return (
      <SafeAreaView style={styles.container} edges={['top', 'right', 'left']}>
        <FocusAwareStatusBar barStyle='dark-content' />
        <Header
          route={route}
          navigation={navigation}
          dark
          title={`Select ` + option.name}
        />

        <ScrollView>
          <View
            style={{
              paddingBottom: 10,
            }}
          >
            {option.options.map((item, i) =>
              item.isQty ? (
                <Quantity
                  key={i}
                  product={product}
                  option={option}
                  item={item}
                />
              ) : (
                <Checkbox
                  key={i}
                  product={product}
                  option={option}
                  item={item}
                />
              )
            )}
          </View>
        </ScrollView>

        <RouteButton
          onPress={() => {
            navigation.navigate('Product');
          }}
        >
          Done
        </RouteButton>
      </SafeAreaView>
    );
  })
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray2,
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

export default SelectOptionsScreen;
