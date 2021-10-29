import * as SecureStore from 'expo-secure-store';

// Saves secure store key
async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
}

// Retrieves secure store key
async function get(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
  } else {
    return;
  }
}

// Removes secure store key
async function remove(key) {
  await SecureStore.deleteItemAsync(key);
}

const secureStore = { save, get, remove };

export default secureStore;
