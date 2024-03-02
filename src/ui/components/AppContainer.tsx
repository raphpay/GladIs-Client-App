import React from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, TouchableWithoutFeedback, View } from 'react-native';

import INavigationHistoryItem from '../../business-logic/model/INavigationHistoryItem';

import IconButton from './IconButton';
import SearchTextInput from './SearchTextInput';
import TopAppBar from './TopAppBar';

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
  additionalButton?: JSX.Element;
  dialogIsShown?: boolean;
  hideTooltip?: () => void
  setShowDialog?: React.Dispatch<React.SetStateAction<boolean>>;
};

function AppContainer(props: AppContainerProps): React.JSX.Element {
  const backIcon = require('../assets/images/arrow.uturn.left.png');
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
    additionalButton
  } = props;
  const { t } = useTranslation();

  function closeAll() {
    hideTooltip && hideTooltip();
    setShowDialog && setShowDialog(false)
  }

  return (
    <TouchableWithoutFeedback onPress={closeAll}>
      <SafeAreaView style={styles.container}>
          <View style={styles.innerContainer}>
            <View style={styles.innerComponentsContainer}>
              <View style={styles.searchInputContainer}>
                {adminButton}
                <SearchTextInput 
                  searchText={searchText}
                  setSearchText={setSearchText}
                  editable={!dialogIsShown}
                />
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
                additionalButton && (additionalButton)
              }
            </View>
          </View>
          <TopAppBar mainTitle={mainTitle} navigationHistoryItems={navigationHistoryItems} />
          {
            showDialog && (dialog)
          }
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

export default AppContainer;