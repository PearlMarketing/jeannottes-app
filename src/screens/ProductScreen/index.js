import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
// import { Dimensions } from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { observer, inject } from 'mobx-react';

import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ShopToast from '../../components/ShopToast';
import Header from '../../components/Header';
import Loader from '../../components/Loader';
import StyledTextInput from '../../components/TextInput';

import { SIZES, COLORS, FONTS } from '../../constants';

import ProductInfo from './ProductInfo';
import ProductOptions from './ProductOptions';
import OptionPicker from './OptionPicker';
import QuantityPicker from './QuantityPicker';
import TimePicker from './TimePicker';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import OptionButton from '../../components/OptionButton';

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

    // const [viewHeight, setViewHeight] = React.useState(0);
    // const windowHeight = Dimensions.get('window').height;

    // const bottomSheetModalRef = React.useRef(null);

    // variables
    // const snapPoints = React.useMemo(
    //   () => ['50%', windowHeight- 200],
    //   []
    // );

    // // callbacks
    // const handlePresentModalPress = React.useCallback(() => {
    //   bottomSheetModalRef.current?.present();
    // }, []);
    // const handleSheetChanges = React.useCallback((index) => {
    //   console.log('handleSheetChanges', index);
    // }, []);

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

    return (
      <SafeAreaView style={styles.container} edges={['right', 'left']}>
        {/* <BottomSheetModalProvider> */}
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
                        showOptions={showOptions}
                        // handlePresentModalPress={handlePresentModalPress}
                      />
                      {shop.availableOptions.map((item) => (
                        <ProductOptions
                          key={item.id}
                          item={item}
                          product={product}
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
                      {shop.selectionStore.selections?.get(product.id)
                        .quantity || 1}
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
                        {(
                          shop.selectionStore.selections
                            ?.get(product.id)
                            .options.filter((e) => e.name === 'Size').length &
                            (shop.selectionStore.selections
                              ?.get(product.id)
                              .subTotal.toFixed(2) >
                              0) &&
                          shop.selectionStore.selections?.get(product.id)
                            .subTotal *
                            shop.selectionStore.selections?.get(product.id)
                              .quantity
                        ).toFixed(2) || '---'}
                      </Text>
                    </>
                  ) : (
                    <Text style={{ color: COLORS.white, ...FONTS.h3 }}>
                      Currently Unavailable
                    </Text>
                  )}
                </TouchableOpacity>
              </View>

              {/* <BottomSheetModal
                ref={bottomSheetModalRef}
                index={0}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                style={{ zIndex: 10, elevation: 10 }}
              >
                <View
                  style={styles.contentContainer}
                >
                  <Text>Awesome 🎉</Text>
                </View>
              </BottomSheetModal> */}

              <OptionPicker
                product={product}
                slideY={slideY}
                slideDown={slideDown}
                pickerName={pickerName}
                pickerOptions={pickerOptions}
              />
              <QuantityPicker
                product={product}
                slideY={slideYQuantity}
                slideDown={slideDownQuantity}
              />
            </>
          )}
        {/* </BottomSheetModalProvider> */}
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
