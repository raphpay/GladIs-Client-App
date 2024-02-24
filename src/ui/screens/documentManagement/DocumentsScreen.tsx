import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { IRootStackParams } from '../../../navigation/Routes';

import { IDocument } from '../../../business-logic/model/IModule';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import UserType from '../../../business-logic/model/enums/UserType';
import DocumentService from '../../../business-logic/services/DocumentService';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import AppIcon from '../../components/AppIcon';
import ContentUnavailableView from '../../components/ContentUnavailableView';
import IconButton from '../../components/IconButton';
import SearchTextInput from '../../components/SearchTextInput';

import backIcon from '../../assets/images/arrow.uturn.left.png';
import plusIcon from '../../assets/images/plus.png';
import styles from '../../assets/styles/documentManagement/DocumentsScreenStyles';

type DocumentsScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.DocumentsScreen>;

function DocumentsScreen(props: DocumentsScreenProps): React.JSX.Element {
  const [searchText, setSearchText] = useState<string>('');
  const [documents, setDocuments] = useState<IDocument[]>([]);
  const { t } = useTranslation();
  const { navigation } = props;
  const { previousScreen, currentScreen, documentsPath, processNumber } = props.route.params;
  const { module } = useAppSelector((state: RootState) => state.appState);
  const { currentClient, currentUser } = useAppSelector((state: RootState) => state.users);

  function navigateToDashboard() {
    navigation.navigate(NavigationRoutes.DashboardScreen)
  }

  function navigateToCategories() {
    navigation.navigate(NavigationRoutes.DocumentManagementScreen);
  }

  function navigateBack() {
    // Back to subcategories
    navigation.goBack();
  }

  function navigateToDocument(doc: IDocument) {
    navigation.navigate(NavigationRoutes.PDFScreen, { documentInput: doc });
  }

  // TODO: change styles names
  function DocumentRow(item: IDocument) {
    return (
      <TouchableOpacity onPress={() => navigateToDocument(item)}>
        <View style={styles.subCategoryLineContainer}>
          <View style={styles.subCategoryLineRow}>
            <Image source={require('../../assets/images/PDF_file_icon.png')}/>
            <View style={styles.subCategoryTextContainer}>
              <Text>
                {item.name}
              </Text>
            </View>
            <Image source={require('../../assets/images/ellipsis.png')}/>
          </View>
          <View style={styles.separator}/>
        </View>
      </TouchableOpacity>
    );
  }

  function addDocument() {
    // TODO: Handle document pick
  }

  useEffect(() => {
    async function init() {
      const docs = await DocumentService.getInstance().getDocumentsAtDirectory(`${currentClient?.companyName ?? ""}/${documentsPath}/`);
      setDocuments(docs);
    }
    init();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.innerContainer}>
          <View style={styles.innerComponentsContainer}>
            <View style={styles.searchInputContainer}>
              {
                currentUser?.userType === UserType.Admin && (
                  <IconButton
                    title={t('components.buttons.addDocument')}
                    icon={plusIcon}
                    onPress={addDocument}
                  />
                )
              }
              <SearchTextInput
                searchText={searchText}
                setSearchText={setSearchText}
              />
            </View>
            {
              documents.length !== 0 ? (
                <FlatList
                  data={documents}
                  renderItem={(renderItem) => DocumentRow(renderItem.item)}
                  keyExtractor={(item) => item.id}
                />
              ) : (
                <ContentUnavailableView 
                  title={t('documentsScreen.noDocs.title')}
                  message={currentUser?.userType === UserType.Admin ? t('documentsScreen.noDocs.message.admin') : t('documentsScreen.noDocs.message.client')}
                  image={(
                    <Image source={require('../../assets/images/doc.fill.png')} />
                  )}
                />
              )
            }
          </View>
          <View style={styles.backButtonContainer}>
            <IconButton
              title={t('components.buttons.back')}
              icon={backIcon}
              onPress={navigateBack}
            />
          </View>
        </View>
        <View style={styles.topContainer}>
          <AppIcon style={styles.appIcon} />
          <View>
            <View style={styles.navigationHistoryContainer}>
              <TouchableOpacity onPress={navigateToDashboard}>
                <Text style={styles.navigationHistory}>
                  {t('dashboard.title')}
                </Text>
              </TouchableOpacity>
              <Image source={require('../../assets/images/chevron.right.png')}/>
              <TouchableOpacity onPress={navigateToCategories}>
                <Text style={styles.navigationHistory}>
                  {t(`modules.${module?.name}`)}
                </Text>
              </TouchableOpacity>
              <Image source={require('../../assets/images/chevron.right.png')}/>
              <TouchableOpacity onPress={navigateBack}>
                {
                  processNumber ? (
                    <Text style={styles.navigationHistory}>
                      {`${t('documentsScreen.process')} ${processNumber}`}
                    </Text>
                  ) : (
                    <Text style={styles.navigationHistory}>
                      {t(`documentsScreen.${previousScreen}`)}
                    </Text>
                  )
                }
              </TouchableOpacity>
              <Image source={require('../../assets/images/chevron.right.png')}/>
            </View>
            <Text style={styles.currentPageTitle}>
              {t(`documentsScreen.${currentScreen}`)}
            </Text>
          </View>
        </View>
      </SafeAreaView>
  );
}

export default DocumentsScreen;
