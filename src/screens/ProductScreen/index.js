import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  StatusBar,
  ScrollView,
  FlatList,
} from 'react-native';
import { observer, inject } from 'mobx-react';
import { useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { Ionicons } from '@expo/vector-icons';
// import { isIphoneX } from 'react-native-iphone-x-helper';
import Header from '../../components/Header';
import Loader from '../../components/Loader';

import { icons, SIZES, COLORS, FONTS } from '../../constants';
// import Service from '../../services/services';

import ProductInfo from './ProductInfo';
import ProductOptions from './ProductOptions';
import OptionPicker from './OptionPicker';

const ProductScreen = inject('shop')(
  observer(({ shop, route, navigation }) => {
    const [product, setProduct] = React.useState(null);

    // Selected product options
    const [selectedOptions, setSelectedOptions] = React.useState([
      {
        option: 'Size',
        value: 'Small',
      },
      {
        option: 'Choose Your Bread',
        value: 'White Roll',
      },
      {
        option: 'Choose Your Cheese',
        value: 'American',
      },
    ]);

    // show an array of options to populate picker
    const [pickerName, setPickerName] = React.useState(null);
    const [pickerOptions, setPickerOptions] = React.useState([]);
    const slideY = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
      // passes down selected item
      let { item } = route.params;

      // check if variations are loaded
      if (shop.productStore.products.get(item.id).type === 'variable') {
        if (shop.productStore.products.get(item.id).loadedVariations) {
          console.log('variations already loaded');
        } else {
          shop.variationStore.loadVariations(item);
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

    const slideDown = () => {
      Animated.timing(slideY, {
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
      <SafeAreaView
        style={styles.container}
        edges={['right', 'bottom', 'left']}
      >
        <FocusAwareStatusBar barStyle='light-content' />
        <Header route={route} navigation={navigation} />
        {!product?.id ? (
          <Loader />
        ) : !shop.productStore.products.get(product.id).loadedVariations ? (
          <Loader />
        ) : (
          <>
            <ScrollView>
              <View
                style={{
                  paddingBottom: 10,
                }}
              >
                <ProductInfo product={product} />
                <ProductOptions
                  item={
                    shop.availableVariations.filter(
                      (e) => e.id === product.id
                    )[0]
                  }
                  product={product}
                  selectedOptions={selectedOptions}
                  setSelectedOptions={setSelectedOptions}
                  showOptions={showOptions}
                />
                {shop.availableOptions.map((item) => (
                  <ProductOptions
                    key={item.id}
                    item={item}
                    product={product}
                    selectedOptions={selectedOptions}
                    setSelectedOptions={setSelectedOptions}
                    showOptions={showOptions}
                    navigation={navigation}
                  />
                ))}
                {/* <FlatList
                  data={shop.availableOptions}
                  keyExtractor={(item) => `${item.id}`}
                  renderItem={({item}) => <ProductOptions item={item} selectedOptions={selectedOptions} />}
                /> */}

                {/* <BreadOptions
                  product={product}
                  productOptions={breadOptions}
                  showOptions={showOptions}
                  selectedOptions={selectedOptions}
                  optionLabel={'Choose Your Bread'}
                  optionName={'Bread'}
                /> */}
              </View>
            </ScrollView>

            {/* Order Button */}
            <View
              style={{
                paddingHorizontal: SIZES.padding * 2,
                paddingVertical: SIZES.padding,
                alignItems: 'center',
                justifyContent: 'center',
                width: SIZES.width,
                backgroundColor: 'white',
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: COLORS.primary,
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  ...styles.shadow,
                  borderRadius: SIZES.radius * 2,
                }}
                onPress={() => {
                  shop.cart.addProduct(shop.selectionStore.selections?.get(product.id));
                  shop.selectionStore.clearSelections(product);
                  navigation.navigate('Shop');
                }}
              >
                <Text style={{ color: COLORS.white, ...FONTS.h3 }}>
                  Add To Order
                </Text>
                <Text style={{ color: COLORS.white, ...FONTS.h3 }}>
                  $
                  {(shop.selectionStore.selections
                    ?.get(product.id)
                    .subTotal.toFixed(2) > 0 &&
                    shop.selectionStore.selections
                      ?.get(product.id)
                      .subTotal.toFixed(2)) ||
                    '---'}
                </Text>
              </TouchableOpacity>
            </View>

            <OptionPicker
              product={product}
              slideY={slideY}
              slideDown={slideDown}
              pickerName={pickerName}
              pickerOptions={pickerOptions}
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
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
