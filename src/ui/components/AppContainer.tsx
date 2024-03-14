import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, TouchableWithoutFeedback, View } from 'react-native';

import INavigationHistoryItem from '../../business-logic/model/INavigationHistoryItem';
import NavigationRoutes from '../../business-logic/model/enums/NavigationRoutes';
import UserType from '../../business-logic/model/enums/UserType';
import { useAppSelector } from '../../business-logic/store/hooks';
import { RootState } from '../../business-logic/store/store';

import IconButton from './IconButton';
import SearchTextInput from './SearchTextInput';
import TopAppBar from './TopAppBar';

import { Colors } from '../assets/colors/colors';
import styles from '../assets/styles/components/AppContainerStyles';

type AppContainerProps = {
  mainTitle: string;
  navigationHistoryItems?: INavigationHistoryItem[];
  searchText?: string;
  setSearchText?: React.Dispatch<React.SetStateAction<string>>;
  showBackButton?: boolean;
  showDialog?: boolean;
  navigateBack?: () => void;
  children: JSX.Element;
  adminButton?: JSX.Element;
  dialog?: JSX.Element;
  additionalComponent?: JSX.Element;
  dialogIsShown?: boolean;
  hideTooltip?: () => void
  setShowDialog?: React.Dispatch<React.SetStateAction<boolean>>;
  showSearchText: boolean;
  showSettings: boolean;
};

function AppContainer(props: AppContainerProps): React.JSX.Element {
  // TODO: Improve icons resolution
  const backIcon = require('../assets/images/arrow.uturn.left.png');
  const settingsIcon = require('../assets/images/gearshape.fill.png');
  const {
    mainTitle,
    navigationHistoryItems,
    searchText,
    setSearchText,
    showBackButton,
    showDialog,
    navigateBack,
    children,
    adminButton,
    dialog,
    dialogIsShown,
    hideTooltip,
    setShowDialog,
    additionalComponent,
    showSearchText,
    showSettings,
  } = props;

  const { t } = useTranslation();
  const navigation = useNavigation();

  const { currentUser, currentClient } = useAppSelector((state: RootState) => state.users);

  const [showClientSettingsScreen, setShowClientSettingsScreen] = useState<boolean>(false);

  function closeAll() {
    hideTooltip && hideTooltip();
    setShowDialog && setShowDialog(false)
  }

  function navigateToSettings() {
    navigation.navigate(NavigationRoutes.SettingsScreen);
  }

  function navigateToClientSettings() {
    navigation.navigate(NavigationRoutes.ClientManagementStack);
  }

  useEffect(() => {
    if (currentUser?.userType == UserType.Admin && currentClient !== undefined) {
      setShowClientSettingsScreen(true);
    } else {
      setShowClientSettingsScreen(false);
    }
  }, [currentClient, currentUser]);

  return (
    <TouchableWithoutFeedback onPress={closeAll}>
      <SafeAreaView style={styles.container}>
        <View style={styles.upperContainer}>
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
        </View>
        <View style={styles.innerContainer}>
          <View style={styles.innerComponentsContainer}>
            <View style={styles.searchInputContainer}>
              {adminButton}
              {
                showSearchText && (
                  <SearchTextInput 
                    searchText={searchText}
                    setSearchText={setSearchText}
                    editable={!dialogIsShown}
                  />
                )
              }
            </View>
            {children}
          </View>
          <View style={styles.backButtonContainer}>
            {
              showBackButton && (
                <IconButton
                  title={t('components.buttons.back')}
                  icon={backIcon}
                  onPress={navigateBack}
                />
              )
            }
            {
              additionalComponent && (additionalComponent)
            }
          </View>
        </View>
        <TopAppBar
          mainTitle={mainTitle}
          navigationHistoryItems={navigationHistoryItems}
        />
        {
          showDialog && (dialog)
        }
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

export default AppContainer;