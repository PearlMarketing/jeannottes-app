import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar,
  ScrollView,
  Touchable,
} from 'react-native';
import { Input } from 'react-native-elements';
import { observer, inject } from 'mobx-react';
import { useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
// import { isIphoneX } from 'react-native-iphone-x-helper';
import Header from '../../components/Header';
import Loader from '../../components/Loader';
import StyledTextInput from '../../components/TextInput';

import { icons, SIZES, COLORS, FONTS } from '../../constants';
import Service from '../../services/services';
import ShopToast from '../../components/ShopToast';
import secureStore from '../../services/secureStore';

const OrderDetailsScreen = inject('shop')(
  observer(({ shop, route, navigation }) => {
    let { order } = route.params;

    function FocusAwareStatusBar(props) {
      const isFocused = useIsFocused();
      return isFocused ? <StatusBar {...props} /> : null;
    }

    const RenderSeparator = () => (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#CED0CE',
        }}
      />
    );

    const LineItem = ({ item }) => (
      <>
        <View
          style={{
            width: '100%',
            backgroundColor: COLORS.white,
            color: COLORS.primary,
            paddingVertical: SIZES.padding,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View>
            <Text style={{ ...FONTS.h4 }}>{item.name}</Text>
            <View>
              {item.meta_data
                .filter((e) => e.key === '_tmcartepo_data')[0]
                .value.map((option, i) => (
                  <Text key={i}>
                    {option.name} : {option.value}
                    {/* {option.name}:{' '}
                {Array.isArray(option.value)
                  ? option.value.reduce(
                      (array, e) => array + e.name + '(' + e.qty + ') ',
                      ''
                    )
                  : option.value} */}
                  </Text>
                ))}
            </View>
          </View>
          <View>
            <Text
              style={{
                ...FONTS.h4,
                flexGrow: 0,
                flexShrink: 0,
                flexBasis: 'auto',
              }}
            >
              ${item.total}
            </Text>
          </View>
        </View>
        <View
          style={{
            paddingVertical: SIZES.padding,
          }}
        >
          <View
            style={{
              paddingTop: SIZES.padding,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TouchableOpacity
              style={{
                width: SIZES.width * 0.5,
                padding: SIZES.padding * 0.5,
                backgroundColor: COLORS.primary,
                alignItems: 'center',
                borderRadius: SIZES.radius * 2,
              }}
              onPress={() => {
                // Add selections to cart
                shop.cart.reorderProduct(item);
                ShopToast(item.name + ' added to cart!', navigation);
              }}
            >
              <Text style={{ color: COLORS.white, ...FONTS.h3 }}>
                Reorder Item
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );

    return (
      <SafeAreaView style={styles.container} edges={['top', 'right', 'left']}>
        <FocusAwareStatusBar barStyle='dark-content' />
        <Header
          route={route}
          navigation={navigation}
          dark
          title='Order Details'
        />
        {/* Line Items */}
        <FlatList
          style={{
            backgroundColor: COLORS.white,
            width: SIZES.width,
            paddingHorizontal: SIZES.padding * 2,
          }}
          ListHeaderComponent={
            <>
              <View
                style={{
                  marginVertical: 10,
                }}
              >
                <Text style={{ fontSize: 24 }}>Order Id: {order.id}</Text>
                <Text style={{ fontSize: 18 }}>
                  Order Date:{' '}
                  {new Date(order.date_created).toLocaleDateString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </Text>
                <Text style={{ fontSize: 18 }}>Total: ${order.total}</Text>
              </View>
              <View
                style={{
                  marginVertical: 10,
                }}
              >
                <Text style={{ fontSize: 24, textDecorationLine: 'underline' }}>
                  Items:
                </Text>
              </View>
            </>
          }
          data={order.line_items}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <LineItem key={item.id} item={item} />}
          ItemSeparatorComponent={RenderSeparator}
        />
      </SafeAreaView>
    );
  })
);

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
  },
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

export default OrderDetailsScreen;
