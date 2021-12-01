import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { observer, inject } from 'mobx-react';

import { Text } from 'react-native-elements';
import { COLORS, FONTS, SIZES } from '../constants';
import Service from '../services/services';
import RenderSeparator from './RenderSeparator';
import { useNavigation } from '@react-navigation/native';
import Loader from './Loader';

const RecentOrders = inject('shop')(
  observer(({ shop, route }) => {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [loadOrders, setLoadOrders] = React.useState(false);
    const [recentOrders, setRecentOrders] = React.useState([]);

    // TODO: Add pagination to recent orders

    const fetchOrders = async () => {
      setIsLoading(true);
      const { data } = await Service.CustomerOrders(
        shop.user['id'],
        page + 1,
        10
      );
      setRecentOrders((prev) => prev.concat(data));
      setPage((prev) => prev + 1);
      setIsLoading(false);
    };

    // Fetches from Wordpress website
    React.useEffect(() => {
      if (loadOrders) {
        fetchOrders();
      }
    }, [loadOrders]);

    // if User is logged in, start loading user past orders
    React.useEffect(() => {
      if (shop.user.email && !loadOrders) {
        setLoadOrders(true);
      }
    }, [shop.user.email]);

    return (
      <>
        {!recentOrders.length ? (
          <Loader />
        ) : (
          <>
            {recentOrders.map((order) => (
              <View key={order.id}>
                <View style={{ paddingVertical: SIZES.padding }}>
                  <View
                    style={{
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}
                  >
                    <View>
                      <Text>Order Id: {order.id}</Text>
                      <Text>
                        Order Date:{' '}
                        {new Date(order.date_created).toLocaleDateString(
                          'en-US',
                          {
                            hour: 'numeric',
                            minute: '2-digit',
                          }
                        )}
                      </Text>
                      <Text>
                        Items:{' '}
                        {order.line_items.map(
                          (item, i) => (i ? ', ' : '') + item.parent_name
                        )}
                      </Text>
                    </View>
                    <View>
                      <Text style={{ fontSize: 16 }}>${order.total}</Text>
                    </View>
                  </View>

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
                      onPress={() =>
                        navigation.navigate('Order Details', {
                          order: order,
                        })
                      }
                    >
                      <Text style={{ color: COLORS.white, ...FONTS.h3 }}>
                        View Details
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <RenderSeparator />
              </View>
            ))}
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
                  backgroundColor: isLoading ? '#777' : COLORS.primary,
                  alignItems: 'center',
                  borderRadius: SIZES.radius * 2,
                }}
                disabled={isLoading}
                onPress={fetchOrders}
              >
                <Text style={{ color: COLORS.white, ...FONTS.h3 }}>
                  {isLoading ? 'Loading...' : 'Load More Orders'}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </>
    );
  })
);

export default RecentOrders;
