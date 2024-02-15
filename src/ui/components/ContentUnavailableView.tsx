import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  Text,
  View
} from 'react-native';

import styles from '../assets/styles/components/ContentUnavailableViewStyles';

// TODO: Make this component reusable
function ContentUnavailableView(): React.JSX.Element {

  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/person.2.fill.png')}/>
      <Text style={styles.title}>{t('unavailableView.adminDashboard.title')}</Text>
      <Text style={styles.message}>{t('unavailableView.adminDashboard.message')}</Text>
    </View>
  );
}

export default ContentUnavailableView;