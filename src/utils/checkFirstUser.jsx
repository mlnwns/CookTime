import AsyncStorage from '@react-native-async-storage/async-storage';

export const checkFirstUser = async () => {
  try {
    const isFirstUser = await AsyncStorage.getItem('isFirstUser');
    if (isFirstUser === null) {
      await AsyncStorage.setItem('isFirstUser', 'false');
      return true;
    }
    return false;
  } catch (error) {
    console.error('AsyncStorage 에러:', error);
    return false;
  }
};
