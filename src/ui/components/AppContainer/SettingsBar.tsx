import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import { Colors } from '../../assets/colors/colors';
import styles from '../../assets/styles/components/AppContainerStyles';
import IconButton from '../IconButton';

type SettingsBarProps = {
  showSettings: boolean;
  showClientSettingsScreen: boolean;
};

function SettingsBar(props: SettingsBarProps): React.JSX.Element {

  const { showSettings, showClientSettingsScreen } = props;

  const { t } = useTranslation();
  const navigation = useNavigation();
  
  const settingsIcon = require('../../assets/images/gearshape.fill.png');

  // Sync Methods
  function navigateToSettings() {
    navigation.navigate(NavigationRoutes.SettingsScreen);
  }

  function navigateToClientSettings() {
    navigation.navigate(NavigationRoutes.ClientManagementStack);
  }

  // Components
  function SettingsButton() {
    return (
      <>
        {
          showSettings && (
            <IconButton
              title={t('settings.title')}
              icon={settingsIcon}
              onPress={navigateToSettings}
              backgroundColor={Colors.white}
              textColor={Colors.black}
              style={styles.settingsButton}
            />
          )
        }
      </>
    );
  }

  function ClientSettingsButton() {
    return (
      <>
        {
          showSettings &&  showClientSettingsScreen && (
            <IconButton 
              title={t('settings.clientSettings.title')}
              icon={settingsIcon}
              onPress={navigateToClientSettings}
              backgroundColor={Colors.white}
              textColor={Colors.black}
              style={styles.settingsButton}
            />
          )
        }
      </>
    );
  }

  return (
    <View style={styles.upperContainer}>
      {SettingsButton()}
      {ClientSettingsButton()}
    </View>
  );
}

export default SettingsBar;