import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, View } from 'react-native';

import IAction from '../../business-logic/model/IAction';
import NavigationRoutes from '../../business-logic/model/enums/NavigationRoutes';
import UserType from '../../business-logic/model/enums/UserType';
import { useAppSelector } from '../../business-logic/store/hooks';
import { RootState } from '../../business-logic/store/store';

import IconButton from './IconButton';
import TopAppBar from './TopAppBar';

import { Colors } from '../assets/colors/colors';
import styles from '../assets/styles/components/AppContainerStyles';

type AppContainerProps = {
  mainTitle: string;
  navigationHistoryItems?: IAction[];
  searchText?: string;
  setSearchText?: React.Dispatch<React.SetStateAction<string>>;
  showBackButton?: boolean;
  showDialog?: boolean;
  navigateBack?: () => void;
  children: JSX.Element;
  extraTopAppBarButton?: JSX.Element;
  extraBottomButton?: JSX.Element;
  dialog?: JSX.Element;
  additionalComponent?: JSX.Element;
  dialogIsShown?: boolean;
  hideTooltip?: () => void
  setShowDialog?: React.Dispatch<React.SetStateAction<boolean>>;
  showSearchText: boolean;
  showSettings: boolean;
  searchTextPlaceholder?: string;
};

function AppContainer(props: AppContainerProps): React.JSX.Element {
  const backIcon = require('../assets/images/arrowshape.turn.up.left.png');
  const settingsIcon = require('../assets/images/gearshape.fill.png');
  
  const {
    mainTitle,
    navigationHistoryItems,
    showBackButton,
    navigateBack,
    children,
    extraTopAppBarButton,
    hideTooltip,
    setShowDialog,
    extraBottomButton,
    showSettings,
    showSearchText,
    searchText,
    setSearchText,
    searchTextPlaceholder,
    showDialog,
    dialog,
    dialogIsShown,
  } = props;

  const { t } = useTranslation();
  const navigation = useNavigation();

  const { currentUser, currentClient } = useAppSelector((state: RootState) => state.users);

  const [showClientSettingsScreen, setShowClientSettingsScreen] = useState<boolean>(false);

  // Sync Methods
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

  // Lifecycle Methods
  useEffect(() => {
    if (currentUser?.userType == UserType.Admin && currentClient !== undefined) {
      setShowClientSettingsScreen(true);
    } else {
      setShowClientSettingsScreen(false);
    }
  }, [currentClient, currentUser]);

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
          showSettings && showClientSettingsScreen && (
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

  function BackButton() {
    return (
      <>
        {
          showBackButton && (
            <IconButton
              title={t('components.buttons.back')}
              icon={backIcon}
              onPress={navigateBack ? navigateBack : {}}
              style={styles.backButton}
            />
          )
        }
      </>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.upperContainer}>
          {SettingsButton()}
          {ClientSettingsButton()}
        </View>
        <TopAppBar
          mainTitle={mainTitle}
          navigationHistoryItems={navigationHistoryItems}
          extraButton={extraTopAppBarButton}
          showSearchText={showSearchText}
          searchText={searchText}
          setSearchText={setSearchText}
          searchTextPlaceholder={searchTextPlaceholder}
        />
        <View style={styles.children}>
          {children}
        </View>
        {BackButton()}
        { extraBottomButton && extraBottomButton }
      </ScrollView>
    </SafeAreaView>
  );
}

export default AppContainer;