import React, { useEffect } from 'react';
import { Appearance } from 'react-native';
import { Provider } from 'react-redux';
import store from './src/business-logic/store/store';
import './src/localization/i18n';
import { Routes } from './src/navigation/Routes';

function App(): React.JSX.Element {
  useEffect(() => {
    Appearance.setColorScheme('light');
  }, []);

  return (
    <Provider store={store}>
      <Routes />
    </Provider>
  );
}

export default App;
