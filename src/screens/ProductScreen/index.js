import React, { useState } from 'react';
import {
  View,
  // KeyboardAvoidingView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  StatusBar,
  ScrollView,
  FlatList,
  Button,
  Platform,
} from 'react-native';
import { Input } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { observer, inject } from 'mobx-react';
import { useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ShopToast from '../../components/ShopToast';
// import Toast from 'react-native-root-toast'
// import { Ionicons } from '@expo/vector-icons';
// import { isIphoneX } from 'react-native-iphone-x-helper';
import Header from '../../components/Header';
import Loader from '../../components/Loader';
import StyledTextInput from '../../components/TextInput';

import { icons, SIZES, COLORS, FONTS } from '../../constants';
// import Service from '../../services/services';

import ProductInfo from './ProductInfo';
import ProductOptions from './ProductOptions';
import OptionPicker from './OptionPicker';
import QuantityPicker from './QuantityPicker';
import TimePicker from './TimePicker';

const ProductScreen = inject('shop')(
  observer(({ shop, route, navigation }) => {
    const [product, setProduct] = React.useState(null);

    // show an array of options to populate picker
    const [pickerName, setPickerName] = React.useState(null);
    const [pickerOptions, setPickerOptions] = React.useState([]);
    const slideY = React.useRef(new Animated.Value(0)).current;
    const slideYQuantity = React.useRef(new Animated.Value(0)).current;

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [specialInstructions, setSpecialInstructions] = useState('');

    const showDatePicker = () => {
      setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
      setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
      // console.warn('A date has been picked: ', date);
      shop.selectionStore.addOption(product, {
        name: 'Pickup Time',
        value: date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        }),
        // price: 0,
        // id: 0
      });
      hideDatePicker();
    };

    React.useEffect(() => {
      // passes down selected item
      let { item } = route.params;

      // check if variations are loaded
      if (shop.productStore.products.get(item.id).type === 'variable') {
        if (shop.productStore.products.get(item.id).loadedVariations) {
          console.log('variations already loaded');
        } else {
          shop.variationStore.loadVariations(item.id, item.name);
        }
      }

      // check if selection exist
      if (!shop.selectionStore.selections?.get(item.id)) {
        // if not, create new selection for product
        shop.selectionStore.addSelection(item);
      }

      setProduct(item);
    }, []);

    const showOptions = (options, name) => {
      setPickerName(name);
      setPickerOptions(options);
      Animated.timing(slideY, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    };

    const showQuantity = () => {
      Animated.timing(slideYQuantity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    };

    const slideDown = () => {
      Animated.timing(slideY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    };

    const slideDownQuantity = () => {
      Animated.timing(slideYQuantity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    };

    function FocusAwareStatusBar(props) {
      const isFocused = useIsFocused();
      return isFocused ? <StatusBar {...props} /> : null;
    }

    return (
      <SafeAreaView style={styles.container} edges={['right', 'left']}>
        <FocusAwareStatusBar barStyle='light-content' />
        <Header route={route} navigation={navigation} transparent />
        {!product?.id ? (
          <Loader />
        ) : !shop.productStore.products.get(product.id).loadedVariations ? (
          <Loader />
        ) : (
          <>
            <KeyboardAwareScrollView>
              <View
                style={{
                  paddingBottom: 10,
                }}
              >
                <ProductInfo product={product} />

                {product?.purchasable ? (
                  <>
                    <ProductOptions
                      item={
                        shop.availableVariations.filter(
                          (e) => e.id === product.id
                        )[0]
                      }
                      product={product}
                      // selectedOptions={selectedOptions}
                      // setSelectedOptions={setSelectedOptions}
                      showOptions={showOptions}
                    />
                    {shop.availableOptions.map((item) => (
                      <ProductOptions
                        key={item.id}
                        item={item}
                        product={product}
                        // selectedOptions={selectedOptions}
                        // setSelectedOptions={setSelectedOptions}
                        showOptions={showOptions}
                        navigation={navigation}
                      />
                    ))}

                    {/* Time Picker */}
                    <TimePicker
                      product={product}
                      title='Pickup Time (Optional)'
                      onPress={showDatePicker}
                    />
                    <DateTimePickerModal
                      isVisible={isDatePickerVisible}
                      mode='time'
                      onConfirm={handleConfirm}
                      onCancel={hideDatePicker}
                    />

                    <View
                      style={{
                        width: SIZES.width,
                        paddingHorizontal: SIZES.padding * 2,
                      }}
                    >
                      <StyledTextInput
                        label='Special Instructions'
                        onChangeText={setSpecialInstructions}
                      />
                    </View>
                  </>
                ) : (
                  <Text>
                    This product is not available for purchase right now
                  </Text>
                )}
              </View>
            </KeyboardAwareScrollView>

            {/* Bottom Order Button Bar */}
            <View
              style={{
                paddingHorizontal: SIZES.padding * 2,
                paddingVertical: SIZES.padding,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: SIZES.width,
                backgroundColor: 'white',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: -3,
                },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                elevation: 1,
              }}
            >
              {product?.purchasable && (
                <TouchableOpacity
                  style={{
                    // backgroundColor: COLORS.primary,
                    // width: '100%',
                    marginRight: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    ...styles.shadow,
                    borderColor: COLORS.primary,
                    borderWidth: 1,
                    borderRadius: SIZES.radius * 2,
                  }}
                  onPress={() => {
                    showQuantity();
                  }}
                >
                  <Text style={{ color: COLORS.primary, ...FONTS.h3 }}>
                    {shop.selectionStore.selections?.get(product.id).quantity ||
                      1}
                    x
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                disabled={!product.purchasable}
                style={{
                  backgroundColor: product.purchasable
                    ? COLORS.primary
                    : '#777',
                  // width: '100%',
                  flexGrow: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  ...styles.shadow,
                  borderRadius: SIZES.radius * 2,
                }}
                onPress={() => {
                  if (
                    shop.selectionStore.selections
                      .get(product.id)
                      .options.filter((e) => e.name === 'Size').length
                  ) {
                    // Add special instructions to selection options
                    specialInstructions.length &&
                      shop.selectionStore.addOption(product, {
                        name: 'Special Instructions',
                        value: specialInstructions,
                        // price: 0,
                        // id: 0
                      });

                    // Add selections to cart
                    shop.cart.addProduct(
                      shop.selectionStore.selections.get(product.id)
                    );
                    shop.selectionStore.clearSelections(product);
                    ShopToast(product.name + ' added to cart!');
                    navigation.navigate('Shop');
                  } else {
                    ShopToast('Please select Size');
                  }
                }}
              >
                {product.purchasable ? (
                  <>
                    <Text style={{ color: COLORS.white, ...FONTS.h3 }}>
                      Add To Order
                    </Text>
                    <Text style={{ color: COLORS.white, ...FONTS.h3 }}>
                      $
                      {(shop.selectionStore.selections
                        ?.get(product.id)
                        .options.filter((e) => e.name === 'Size').length &
                        (shop.selectionStore.selections
                          ?.get(product.id)
                          .subTotal.toFixed(2) >
                          0) &&
                        shop.selectionStore.selections
                          ?.get(product.id)
                          .subTotal.toFixed(2) *
                          shop.selectionStore.selections?.get(product.id)
                            .quantity) ||
                        '---'}
                    </Text>
                  </>
                ) : (
                  <Text style={{ color: COLORS.white, ...FONTS.h3 }}>
                    Currently Unavailable
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            <OptionPicker
              product={product}
              slideY={slideY}
              slideDown={slideDown}
              pickerName={pickerName}
              pickerOptions={pickerOptions}
              // selectedOptions={selectedOptions}
              // setSelectedOptions={setSelectedOptions}
            />
            <QuantityPicker
              product={product}
              slideY={slideYQuantity}
              slideDown={slideDownQuantity}
              // pickerName={pickerName}
              // pickerOptions={pickerOptions}
              // selectedOptions={selectedOptions}
              // setSelectedOptions={setSelectedOptions}
            />
          </>
        )}
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

export default ProductScreen;
