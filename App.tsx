/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Platform, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FlashMessage from "react-native-flash-message";

import AppNavigator from './src/navigation/AppNavigator';
import store, { persistor } from './src/redux/store'
import { useAppTheme } from './src/theme/useAppTheme';


import { firebaseService } from './src/firebase/FirebaseService';
import { selectUser } from './src/redux/selector';

function AppContent() {
  const { isDark } = useAppTheme();
  const user = useSelector(selectUser);

  useEffect(() => {
    firebaseService.requestUserPermission();

    const unsubscribeForeground = firebaseService.listenToForegroundMessages();

    return () => {
      unsubscribeForeground();
    };
  }, []);

  useEffect(() => {
    if (user?._id) {
      firebaseService.syncTokenWithBackend(user._id);
      const unsubscribeRefresh = firebaseService.listenToTokenRefresh(user._id);
      return () => unsubscribeRefresh();
    }
  }, [user]);

  return (
    <SafeAreaProvider>
      <FlashMessage
        position="top"
        statusBarHeight={Platform.OS === "android" ? StatusBar.currentHeight : 44}
      />
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        translucent
        backgroundColor="transparent"
      />
      <AppNavigator />
    </SafeAreaProvider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
}

export default App;