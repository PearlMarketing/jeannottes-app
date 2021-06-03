import { values } from 'mobx';
import { types, getParent, flow } from 'mobx-state-tree';
import { SIZES } from '../constants';

import Service from '../services/services';

export const UserStore = types
  .model('UserStore', {
    isLoading: true,
    user: types.model({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    }),
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

    function loadUser(user) {
      const userData = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
      };
      updateUser(userData);
    }

    function updateUser(user) {
      const userData = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        isLoading: true,
      };
      self.user = userData;
    }

    function clearUser(product) {
      self.users.get(product.id).options = [];
    }

    return {
      loadUser,
      updateUser,
      clearUser,
    };
  });
