import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  SafeAreaView,
  View
} from 'react-native';

import INavigationHistoryItem from '../../business-logic/model/INavigationHistoryItem';

import IconButton from './IconButton';
import SearchTextInput from './SearchTextInput';
import TopAppBar from './TopAppBar';

import backIcon from '../assets/images/arrow.uturn.left.png';
import styles from '../assets/styles/components/AppContainerStyles';

type AppContainerProps = {
  mainTitle: string;
  navigationHistoryItems?: INavigationHistoryItem[];
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  navigateBack?: () => void;
  children: JSX.Element;
  showBackButton?: boolean;
  adminButton?: JSX.Element;
};

function AppContainer(props: AppContainerProps): React.JSX.Element {

  const {
    mainTitle,
    navigationHistoryItems,
    searchText,
    setSearchText,
    children,
    navigateBack,
    showBackButton,
    adminButton
  } = props;
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.innerComponentsContainer}>
          <View style={styles.searchInputContainer}>
            {adminButton}
            <SearchTextInput 
              searchText={searchText}
              setSearchText={setSearchText}
            />
          </View>
          {children}
        </View>
        {
          showBackButton && (
            <View style={styles.backButtonContainer}>
              <IconButton
                title={t('components.buttons.back')}
                icon={backIcon}
                onPress={navigateBack}
              />
            </View>
          )
        }
      </View>
      <TopAppBar mainTitle={mainTitle} navigationHistoryItems={navigationHistoryItems} />
    </SafeAreaView>
  );
}

export default AppContainer;