import AsyncStorage from '@react-native-async-storage/async-storage';

const SERVER_URL_KEY = '@server_url';
const SERVER_URL_DEFAULT = 'http://10.0.2.2:8080';

const TOKEN_KEY = '@token';

const USERNAME_KEY = '@username';

const EXP_KEY = '@exp';

const getItem = async (key, defaultValue) => {
  const val = await AsyncStorage.getItem(key);
  return val || defaultValue;
};

const setItem = async (key, value) => {
  await AsyncStorage.setItem(key, value);
};

const buildItem = (key, defaultValue) => {
  return {
    set: async value => setItem(key, value),
    get: async () => getItem(key, defaultValue || null),
  };
};

export const serverUrl = buildItem(SERVER_URL_KEY, SERVER_URL_DEFAULT);
export const token = buildItem(TOKEN_KEY);
export const username = buildItem(USERNAME_KEY);
export const exp = buildItem(EXP_KEY);
