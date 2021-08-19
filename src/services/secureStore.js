import * as SecureStore from 'expo-secure-store';

async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
}

async function get(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    // alert("🔐 Here's your value 🔐 \n" + result);
    return result;
  } else {
    // alert('No values stored under that key.');
    return;
  }
}

async function remove(key) {
  await SecureStore.deleteItemAsync(key);
}

const secureStore = { save, get, remove };

export default secureStore;
