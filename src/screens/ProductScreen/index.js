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
  FlatList
} from 'react-native';
import { observer, inject } from 'mobx-react';
import { useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { Ionicons } from '@expo/vector-icons';
// import { isIphoneX } from 'react-native-iphone-x-helper';
import Header from '../../components/Header';
import Loader from '../../components/Loader';

import { icons, SIZES, COLORS, FONTS } from '../../constants';
import Service from '../../services/services';

import ProductInfo from './ProductInfo';
import BreadOptions from './BreadOptions';
import ProductOptions from './ProductOptions'
import OptionPicker from './OptionPicker';

const ProductScreen = inject('shop')(
  observer(({ shop, route, navigation }) => {
    // const [productId, setProductId] = React.useState(null)
    const [product, setProduct] = React.useState(null);

    // Selected product options
    const [selectedOptions, setSelectedOptions] = React.useState([
      {
        option: 'Size',
        value: 'Small',
        price: 0,
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
      setProduct(item);
      shop.variationStore.loadVariations(item)

    //   // loads product sizes
    //   setIsLoadingProduct(true);
    //   Service.ProductVariations(item.id)
    //     .then((res) => {
    //       let sizeList = [];
    //       res.data.map((variation) => {
    //         sizeList.push({
    //           id: variation.id,
    //           name: variation.attributes[0].option,
    //           price: parseFloat(variation.price),
    //         });
    //       });
    //       setSizeOptions(sizeList);

    //       const optionIndex = selectedOptions.findIndex(
    //         (e) => e.option === 'Size'
    //       );
    //       let updatedOption = [...selectedOptions];
    //       updatedOption[optionIndex] = {
    //         ...updatedOption[optionIndex],
    //         ...sizeList[0],
    //       };
    //       setSelectedOptions(updatedOption);
    //     })
    //     .finally(() => {
    //       setIsLoadingProduct(false);
    //     });

    //   // loads EPO
    //   Service.ProductEPO()
    //     .then((res) => {
    //       const standardEPO = res.data.filter((e) => e.id === 1773)[0].tm_meta
    //         .tmfbuilder;
    //       let breadList = [];
    //       standardEPO.multiple_radiobuttons_options_title[0].map((option) => {
    //         breadList.push({ name: option });
    //       });
    //       setBreadOptions(breadList);
    //       let cheeseList = [];
    //       standardEPO.multiple_radiobuttons_options_title[1].map((option) => {
    //         cheeseList.push({ name: option });
    //       });
    //       setCheeseOptions(cheeseList);
    //     })
    //     .finally(() => {
    //       // console.log(selectedOptions);
    //     });
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
        {shop.isLoading ? (
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
                {shop.availableOptions.map((item) => (
                  <ProductOptions key={item.id} item={item} selectedOptions={selectedOptions} showOptions={showOptions} />
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
                  shop.cart.addProduct(product, selectedOptions);
                  navigation.navigate('Shop');
                }}
              >
                <Text style={{ color: COLORS.white, ...FONTS.h3 }}>
                  Add To Order
                </Text>
                <Text style={{ color: COLORS.white, ...FONTS.h3 }}>$7.99</Text>
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
