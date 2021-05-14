function editOrder(action, menuId, price) {
  let orderList = orderItems.slice();
  let item = orderList.filter((a) => a.menuId == menuId);

  if (action == '+') {
    if (product.length > 0) {
      let newQty = item[0].qty + 1;
      item[0].qty = newQty;
      item[0].total = item[0].qty * price;
    } else {
      const newItem = {
        menuId: menuId,
        qty: 1,
        price: price,
        total: price,
      };
      orderList.push(newItem);
    }
    setOrderItems(orderList);
  } else {
    if (product.length > 0) {
      if (item[0]?.qty > 0) {
        let newQty = item[0].qty - 1;
        item[0].qty = newQty;
        item[0].total = newQty * price;
      }
    }
    setOrderItems(orderList);
  }
}

function getOrderQty(menuId) {
  let orderItem = orderItems.filter((a) => a.menuId == menuId);
  if (orderItem.length > 0) {
    return orderItem[0].qty;
  } else {
    return 0;
  }
}

function getBasketItemCount() {
  let itemCount = orderItems.reduce((a, b) => a + (b.qty || 0), 0);

  return itemCount;
}

function sumOrder() {
  let total = orderItems.reduce((a, b) => a + (b.total || 0), 0);

  return total.toFixed(2);
}

function renderOrder() {
  return (
    <View>
      {renderDots()}
      <View
        style={{
          backgroundColor: COLORS.white,
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: SIZES.padding * 2,
            paddingHorizontal: SIZES.padding * 3,
            borderBottomColor: COLORS.lightGray2,
            borderBottomWidth: 1,
          }}
        >
          <Text
            style={{
              ...FONTS.h3,
            }}
          >
            {getBasketItemCount()} Items in cart
          </Text>
          <Text
            style={{
              ...FONTS.h3,
            }}
          >
            ${sumOrder()}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: SIZES.padding * 2,
            paddingHorizontal: SIZES.padding * 3,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
            }}
          >
            <Image
              source={icons.pin}
              resizeMode='contain'
              style={{
                width: 20,
                height: 20,
                tintColor: COLORS.darkgray,
              }}
            />
            <Text
              style={{
                marginLeft: SIZES.padding,
                ...FONTS.h4,
              }}
            >
              Locations
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
            }}
          >
            <Image
              source={icons.master_card}
              resizeMode='contain'
              style={{
                width: 20,
                height: 20,
                tintColor: COLORS.darkgray,
              }}
            />
            <Text
              style={{
                marginLeft: SIZES.padding,
                ...FONTS.h4,
              }}
            >
              8888
            </Text>
          </View>
        </View>

        {/* Order Button */}
        <View
          style={{
            padding: SIZES.padding * 2,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TouchableOpacity
            style={{
              width: SIZES.width * 0.9,
              padding: SIZES.padding,
              backgroundColor: COLORS.primary,
              alignItems: 'center',
              borderRadius: SIZES.radius,
            }}
            onPress={() =>
              navigation.navigate('Home', {
                product: product,
              })
            }
          >
            <Text style={{ color: COLORS.white, ...FONTS.h2 }}>Order</Text>
          </TouchableOpacity>
        </View>
      </View>

      {isIphoneX() && (
        <View
          style={{
            position: 'absolute',
            bottom: -34,
            left: 0,
            right: 0,
            height: 34,
            backgroundColor: COLORS.white,
          }}
        ></View>
      )}
    </View>
  );
}