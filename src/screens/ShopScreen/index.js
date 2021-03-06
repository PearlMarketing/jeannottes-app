import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { observer, inject } from 'mobx-react';

import { SIZES, COLORS, FONTS } from '../../constants';

import Loader from '../../components/Loader';

const ProductList = inject('shop')(
  observer(({ shop, navigation }) => {
    const Card = ({ item }) => (
      <TouchableOpacity
        style={{
          marginBottom: SIZES.padding * 0.5,
          width: SIZES.width * 0.5,
          paddingHorizontal: SIZES.padding * 0.5,
        }}
        onPress={() => {
          navigation.navigate('Product', {
            item,
            itemId: item.id,
          });
        }}
      >
        {/* Image */}
        <View
          style={{
            marginBottom: SIZES.padding,
          }}
        >
          <Image
            source={{ uri: item.images[0].src }}
            resizeMode='cover'
            style={{
              width: '100%',
              height: 200,
              borderRadius: SIZES.radius,
            }}
          />
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: 50,
              width: '100%',
              backgroundColor: COLORS.white,
              borderBottomRightRadius: SIZES.radius,
              borderBottomLeftRadius: SIZES.radius,
              ...styles.shadow,
              paddingVertical: SIZES.padding,
              paddingHorizontal: SIZES.padding * 2,
            }}
          >
            <Text style={{ ...FONTS.h4 }}>{item.name}</Text>
            {/* <Text style={{ ...FONTS.body4 }}>{item.short_description}</Text> */}
          </View>
        </View>
      </TouchableOpacity>
    );

    return (
      <SafeAreaView style={styles.container}>
        {shop.isLoading ? (
          <Loader />
        ) : (
          <FlatList
            data={shop.availableProducts}
            keyExtractor={(item) => `${item.id}`}
            renderItem={Card}
            horizontal={false}
            numColumns={2}
          />
        )}
      </SafeAreaView>
    );
  })
);
export default ProductList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray4,
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
});
