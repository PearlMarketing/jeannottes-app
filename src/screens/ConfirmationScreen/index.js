import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { isIphoneX } from 'react-native-iphone-x-helper';
import Header from '../../components/Header';
import Loader from '../../components/Loader';

import { icons, SIZES, COLORS, FONTS } from '../../constants';
import Service from '../../services/services';

const ConfirmationScreen = ({ route, navigation }) => {
  const [orderItems, setOrderItems] = React.useState(null);

  React.useEffect(() => {
    // // passes down selected item
    // let { item } = route.params;
    // setProduct(item);
  }, []);

  function FocusAwareStatusBar(props) {
    const isFocused = useIsFocused();
    return isFocused ? <StatusBar {...props} /> : null;
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top', 'right', 'bottom', 'left']}
    >
      <FocusAwareStatusBar barStyle='dark-content' />
      <Header
        route={route}
        navigation={navigation}
        dark
        title='Order Confirmation'
      />
      {/* {isLoadingProduct ? (
        <Loader />
      ) : ( */}
      <>
        <View
          style={{
            paddingHorizontal: SIZES.padding * 2,
          }}
        >
          <Text>
            Your order has been submitted. Here are the details of your order.
          </Text>
        </View>
      </>
      {/* )} */}
    </SafeAreaView>
  );
};

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

export default ConfirmationScreen;
