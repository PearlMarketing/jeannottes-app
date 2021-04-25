import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
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

import ProductInfo from './ProductInfo';
import ProductOptions from './ProductOptions';
import BreadOptions from './BreadOptions';
import SizePicker from './SizePicker';
import OptionPicker from './OptionPicker';

const ProductScreen = ({ route, navigation }) => {
  const [product, setProduct] = React.useState(null);
  const [productVariations, setProductVariations] = React.useState([]);
  const [productEPO, setProductEPO] = React.useState();
  const [sizeOptions, setSizeOptions] = React.useState([]);
  const [breadOptions, setBreadOptions] = React.useState([]);
  const [isLoadingProduct, setIsLoadingProduct] = React.useState(null);
  const [orderItems, setOrderItems] = React.useState([]);

  // Selected product options
  const [selectedOptions, setSelectedOptions] = React.useState([
    {
      option: 'Size',
      value: 'Small',
      price: 0,
    },
    {
      option: 'Bread',
      value: 'White Roll',
    },
    {
      option: 'Cheese',
      value: 'American',
    },
  ]);

  // show an array of options to populate picker
  const [pickerOption, setPickerOption] = React.useState(null);
  const [pickerValues, setPickerValues] = React.useState([]);
  const slideY = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // passes down selected item
    let { item } = route.params;
    setProduct(item);

    // loads product sizes
    setIsLoadingProduct(true);
    Service.ProductVariations(item.id)
      .then((res) => {
        let sizeList = [];
        res.data.map((variation) => {
          sizeList.push({
            id: variation.id,
            name: variation.attributes[0].option,
            price: parseFloat(variation.price),
          });
        });
        setSizeOptions(sizeList);

        const optionIndex = selectedOptions.findIndex(
          (e) => e.option === 'Size'
        );
        let updatedOption = [...selectedOptions];
        updatedOption[optionIndex] = {
          ...updatedOption[optionIndex],
          ...sizeList[0],
        };
        console.log(updatedOption);
        setSelectedOptions(updatedOption);
        // setSelectedOptions([
        //   ...selectedOptions,
        //   {
        //     option: 'Size',
        //     ...sizeList[0]
        //   }
        // ])
        // setSelectedVariation(variationsList[0]);
      })
      .finally(() => {
        setIsLoadingProduct(false);
      });

    // loads EPO
    Service.ProductEPO()
      .then((res) => {
        const standardEPO = res.data.filter((e) => e.id === 1773)[0].tm_meta
          .tmfbuilder;
        setProductEPO(standardEPO);
        let breadList = [];
        standardEPO.multiple_radiobuttons_options_title[0].map((option) => {
          breadList.push({ name: option });
        });
        setBreadOptions(breadList);
      })
      .finally(() => {
        // console.log(selectedOptions);
      });
  }, []);

  const showOptions = (productOptions, optionName) => {
    setPickerOption(optionName);
    setPickerValues(productOptions);
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
    <SafeAreaView style={styles.container} edges={['right', 'bottom', 'left']}>
      <FocusAwareStatusBar barStyle='light-content' />
      <Header route={route} navigation={navigation} />
      {isLoadingProduct ? (
        <Loader />
      ) : (
        <>
          <ProductInfo product={product} />
          {/* <ProductOptions
        product={product}
        productVariations={productVariations}
        showOptions={showOptions}
        optionLabel={'Size'}
        selectedVariation={selectedVariation}
      /> */}

          <BreadOptions
            product={product}
            productOptions={sizeOptions}
            showOptions={showOptions}
            selectedOptions={selectedOptions}
            optionLabel={'Choose Your Size'}
            optionName={'Size'}
          />
          <BreadOptions
            product={product}
            productOptions={breadOptions}
            showOptions={showOptions}
            selectedOptions={selectedOptions}
            optionLabel={'Choose Your Bread'}
            optionName={'Bread'}
          />

          {/* Picker */}
          {/* <SizePicker
        product={product}
        slideY={slideY}
        slideDown={slideDown}
        pickerValues={productVariations}
        setSelectedOptions={setSelectedOptions}
      /> */}
          <OptionPicker
            product={product}
            slideY={slideY}
            slideDown={slideDown}
            pickerOption={pickerOption}
            pickerValues={pickerValues}
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
          />
        </>
      )}
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

export default ProductScreen;
