import React, { useEffect } from 'react';
import { Appearance } from 'react-native';
import './src/localization/i18n';
import { Routes } from './src/navigation/Routes';

function App(): React.JSX.Element {
  useEffect(() => {
     Appearance.setColorScheme('light');
  }, []);

  return ( <Routes /> );
}

export default App;
