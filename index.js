/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import StoreContextProvider from './context/appContext';

const MainApp = () => (
  <StoreContextProvider>
    <App />
  </StoreContextProvider>
);

AppRegistry.registerComponent(appName, () => MainApp);
