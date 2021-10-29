// Sample Data for testing
const sampleOrderData = {
  payment_method: 'cod',
  payment_method_title: 'Cash',
  set_paid: true,
  billing: {
    first_name: 'Culver',
    last_name: 'Lau',
    address_1: '',
    address_2: '',
    city: '',
    state: '',
    postcode: '',
    country: '',
    email: 'culver@pearlmarketing.com',
    phone: '(555) 555-5555',
  },
  shipping: {
    first_name: '',
    last_name: '',
    address_1: '',
    address_2: '',
    city: '',
    state: '',
    postcode: '',
    country: '',
  },
  line_items: [
    {
      product_id: 1698,
      variation_id: 1699,
      quantity: 1,
      subtotal: '6.98',
      meta_data: [
        {
          key: '_tmcartepo_data',
          value: [
            {
              mode: 'builder',
              element: {
                type: '',
              },
              name: 'Choose Your Bread',
              value: 'White Roll',
              price: 0,
              section: '',
              quantity: 1,
            },
            {
              mode: 'builder',
              element: {
                type: '',
              },
              name: 'Choose Your Cheese',
              value: 'Provolone',
              price: 0,
              section: '',
              quantity: 1,
            },
            {
              mode: 'builder',
              element: {
                type: '',
              },
              name: 'Optional Vegetables',
              value: 'Lettuce',
              price: 0,
              section: '',
              quantity: 1,
            },
            {
              mode: 'builder',
              element: {
                type: '',
              },
              name: 'Optional Vegetables',
              value: 'Tomatoes',
              price: 0,
              section: '',
              quantity: 1,
            },
            {
              mode: 'builder',
              element: {
                type: '',
              },
              name: 'Special instructions',
              value: 'This is a test! DO NOT MAKE ME',
              price: 0,
              section: '',
              quantity: 1,
            },
          ],
        },
        {
          key: '_tm_epo',
          value: [1],
        },
      ],
    },
  ],
  shipping_lines: [],
};