import React, { useEffect, useState } from 'react';
import { SafeAreaView, TouchableWithoutFeedback, View } from 'react-native';

import IAction from '../../../business-logic/model/IAction';
import UserType from '../../../business-logic/model/enums/UserType';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import SearchTextInput from '../SearchTextInput';
import TopAppBar from '../TopAppBar';

import styles from '../../assets/styles/components/AppContainerStyles';
import BackButton from './BackButton';
import SettingsBar from './SettingsBar';

type AppContainerProps = {
  mainTitle: string;
  navigationHistoryItems?: IAction[];
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
  searchTextPlaceholder?: string;
};

function AppContainer(props: AppContainerProps): React.JSX.Element {
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
    searchTextPlaceholder,
  } = props;

  const { currentUser, currentClient } = useAppSelector((state: RootState) => state.users);

  const [showClientSettingsScreen, setShowClientSettingsScreen] = useState<boolean>(false);

  // Sync Methods
  function closeAll() {
    hideTooltip && hideTooltip();
    setShowDialog && setShowDialog(false)
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
  function SearchTextInputContent() {
    return (
      <>
        {
          showSearchText && (
            <SearchTextInput
              searchText={searchText}
              setSearchText={setSearchText}
              editable={!dialogIsShown}
              placeholder={searchTextPlaceholder}
            />
          )
        }
      </>
    );
  }

  function ChildrenContent() {
    return (
      <View style={styles.innerContainer}>
        <View style={styles.innerComponentsContainer}>
          <View style={styles.searchInputContainer}>
            {adminButton}
            {SearchTextInputContent()}
          </View>
          {children}
        </View>
        <View style={styles.backButtonContainer}>
          <BackButton 
            showBackButton={showBackButton}
            navigateBack={navigateBack}
          />
          {additionalComponent && (
            <View style={styles.additionalComponent}>
              {additionalComponent}
            </View>
          )}
        </View>
      </View>
    )
  }

  return (
    <TouchableWithoutFeedback style={styles.container} onPress={closeAll}>
      <SafeAreaView style={styles.container}>
        <SettingsBar
          showSettings={showSettings}
          showClientSettingsScreen={showClientSettingsScreen}
        />
        <TopAppBar
          mainTitle={mainTitle}
          navigationHistoryItems={navigationHistoryItems}
        />
        {ChildrenContent()}
        {showDialog && (dialog)}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

export default AppContainer;