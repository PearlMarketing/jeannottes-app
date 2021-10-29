import { values } from 'mobx';
import { types, getParent, flow } from 'mobx-state-tree';
import { SIZES } from '../constants';

import secureStore from '../services/secureStore';

import Service from '../services/services';

export const User = types.model('User', {
  id: types.optional(types.number, 0),
  firstName: types.optional(types.string, ''),
  lastName: types.optional(types.string, ''),
  email: types.optional(types.string, ''),
  phone: types.optional(types.string, ''),
  nicename: types.optional(types.string, ''),
  displayName: types.optional(types.string, ''),
  billing: types.maybe(
    types.model({
      first_name: types.optional(types.string, ''),
      last_name: types.optional(types.string, ''),
      company: types.optional(types.string, ''),
      address_1: types.optional(types.string, ''),
      address_2: types.optional(types.string, ''),
      city: types.optional(types.string, ''),
      state: types.optional(types.string, ''),
      postcode: types.optional(types.string, ''),
      country: types.optional(types.string, ''),
      email: types.optional(types.string, ''),
      phone: types.optional(types.string, ''),
    })
  ),
});

export const UserStore = types
  .model('UserStore', {
    isLoading: true,
    user: User,
  })
  .views((self) => ({
    get shop() {
      return getParent(self);
    },
    get currentUser() {
      return self;
    },
  }))
  .actions((self) => {
    function markLoading(loading) {
      self.isLoading = loading;
    }

    // fetch user data from local storage to see if user is logged in
    const loadUser = flow(function* loadUser() {
      try {
        const user = JSON.parse(yield secureStore.get('token'));
        const wc = (yield Service.Customer(user.id)).data;
        self.user = {
          ...user,
          phone: user.phone || wc.billing.phone,
          billing: { ...wc.billing },
        };
      } catch (err) {
        console.log('No user token found in local storage', err);
      }
    });

    const logoutUser = flow(function* logoutUser() {
      try {
        self.clearUser();
        yield secureStore.remove('token');
      } catch (err) {
        console.log('Error trying to log out', err);
      }
    });

    //const signIn = async () => {
    //     Keyboard.dismiss()
    //     this.isLoadingLogin = true
    //     await Service.SetToken(toJS(this.login))
    //             .then(res => {
    //                 if (!res.data.success) {
    //                     showMessage({
    //                         type: "danger",
    //                         icon: "danger",
    //                         message: "Issue signing in",
    //                         description: res.data.code
    //                     })
    //                 } else {
    //                     Storage.setItem('profile', {token: res.data.data.token, user_id: res.data.data.id})
    //                     Service.PushToken({ username: toJS(this.login.username), password: toJS(this.login.password), installation_id: Constants.installationId, name_device: Constants.deviceName, platform: Platform.OS, push_token: Storage.getItem('push-token') }, res.data.data.token)
    //                     this.loadCustomerOrders(res.data.data.id)
    //                     this.loadCustomer(res.data.data.id)
    //                     navigator.navigate('Inside', {screen: 'More'})
    //                 }
    //             })
    //             .finally(() => {this.isLoadingLogin = false})

    //     await Store.init()
    // }

    // function loginUser() {
    //   // use WC API to log in user
    //   // first, take data that user submitted from login page

    //   // then connect to API through axios

    //   // validate if user exists

    //   // if user exists, validate password

    //   // if login info is valid, take response

    //   // use response to update user
    //   const userData = {
    //     firstName: '',
    //     lastName: '',
    //     email: '',
    //     phone: '',
    //   };
    //   updateUser(userData);
    // }

    // used during checkout to update the customer information before data is posts to Woocommerce
    function updateUser(user) {
      const userData = {
        ...self.user,
        ...user,
      };
      self.user = userData;
    }

    function clearUser() {
      self.user = {};

      // self.user.clear()
    }

    return {
      loadUser,
      updateUser,
      logoutUser,
      clearUser,
    };
  });
