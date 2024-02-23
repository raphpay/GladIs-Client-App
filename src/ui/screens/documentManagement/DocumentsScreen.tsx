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

import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import { IDocument } from '../../../business-logic/model/IModule';
import DocumentService from '../../../business-logic/services/DocumentService';

import AppIcon from '../../components/AppIcon';
import IconButton from '../../components/IconButton';
import SearchTextInput from '../../components/SearchTextInput';

import backIcon from '../../assets/images/arrow.uturn.left.png';
import styles from '../../assets/styles/documentManagement/DocumentsScreenStyles';

type DocumentsScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.DocumentsScreen>;

function DocumentsScreen(props: DocumentsScreenProps): React.JSX.Element {
  const [searchText, setSearchText] = useState<string>('');
  const [documents, setDocuments] = useState<IDocument[]>([]);
  const { t } = useTranslation();
  const { navigation } = props;
  const { module, previousScreen, currentScreen } = props.route.params;

  function navigateToDashboard() {
    navigation.navigate(NavigationRoutes.DashboardScreen)
  }

  function navigateToCategories() {
    navigation.navigate(NavigationRoutes.DocumentManagementScreen, { module: module });
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

  useEffect(() => {
    async function init() {
      // TODO: Find a way to customize this
      // Work with redux to get track of the path ?
      const docs = await DocumentService.getInstance().getDocumentsAtDirectory('Acme.inc/systemQuality/qualityManual/');
      setDocuments(docs);
    }
    init();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.innerContainer}>
          <View style={styles.innerComponentsContainer}>
            <View style={styles.searchInputContainer}>
              <SearchTextInput
                searchText={searchText}
                setSearchText={setSearchText}
              />
            </View>
            <FlatList
              data={documents}
              renderItem={(renderItem) => DocumentRow(renderItem.item)}
              keyExtractor={(item) => item.id}
            />
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
                  {t(`modules.${module.name}`)}
                </Text>
              </TouchableOpacity>
              <Image source={require('../../assets/images/chevron.right.png')}/>
              <TouchableOpacity onPress={navigateBack}>
                <Text style={styles.navigationHistory}>
                  {previousScreen}
                </Text>
              </TouchableOpacity>
              <Image source={require('../../assets/images/chevron.right.png')}/>
            </View>
            <Text style={styles.currentPageTitle}>
              {currentScreen}
            </Text>
          </View>
        </View>
      </SafeAreaView>
  );
}

export default DocumentsScreen;
