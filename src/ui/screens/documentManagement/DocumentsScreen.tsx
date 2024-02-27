import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';

import { IRootStackParams } from '../../../navigation/Routes';

import IDocument from '../../../business-logic/model/IDocument';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import UserType from '../../../business-logic/model/enums/UserType';
import DocumentService from '../../../business-logic/services/DocumentService';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import AppIcon from '../../components/AppIcon';
import ContentUnavailableView from '../../components/ContentUnavailableView';
import Dialog from '../../components/Dialog';
import IconButton from '../../components/IconButton';
import SearchTextInput from '../../components/SearchTextInput';

import IFile from '../../../business-logic/model/IFile';
import FinderModule from '../../../business-logic/modules/FinderModule';
import backIcon from '../../assets/images/arrow.uturn.left.png';
import plusIcon from '../../assets/images/plus.png';
import styles from '../../assets/styles/documentManagement/DocumentsScreenStyles';

type DocumentsScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.DocumentsScreen>;

function DocumentsScreen(props: DocumentsScreenProps): React.JSX.Element {
  const [searchText, setSearchText] = useState<string>('');
  const [documents, setDocuments] = useState<IDocument[]>([]);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [documentName, setDocumentName] = useState<string>('');
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

  async function getFileBase64FromURI(uri: string): Promise<string> {
    return new Promise((resolve, reject) => {
      fetch(uri)
        .then(response => response.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64String = reader.result.split(',')[1]; // Extract base64 string from data URL
            resolve(base64String);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
        .catch(error => reject(error));
    });
  }

  async function addDocument() {
    setShowDialog(true);
  }

  async function pickAFile() {
    const path = `${currentClient?.companyName ?? ""}/${documentsPath}/`;
    const filename = documentName.replace(/\s/g, "_");
    let data: string = '';
    if (Platform.OS !== 'macos') {
      const doc = await DocumentPicker.pickSingle({ type: DocumentPicker.types.pdf })
      data = await getFileBase64FromURI(doc.uri) as string;
    } else {
      data = await FinderModule.getInstance().pickPDF();
    }
    const file: IFile = { data, filename: filename}
    await DocumentService.getInstance().upload(file, filename, path)
    setShowDialog(false);
    await loadDocuments();
  }

  async function loadDocuments() {
    const path = `${currentClient?.companyName ?? ""}/${documentsPath}/`;
    const docs = await DocumentService.getInstance().getDocumentsAtPath(path);
    setDocuments(docs);
  }

  useEffect(() => {
    async function init() {
      loadDocuments();
    }
    init();
  }, []);

  function DocumentRow(item: IDocument) {
    return (
      <View style={styles.documentLineContainer}>
        <View style={styles.documentLineRow}>
          <TouchableOpacity onPress={() => navigateToDocument(item)}>
            <View style={styles.documentButton}>
              <Image source={require('../../assets/images/PDF_file_icon.png')}/>
              <View style={styles.documentTextContainer}>
                <Text>
                  {item.name}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Image source={require('../../assets/images/ellipsis.png')}/>
          </TouchableOpacity>
        </View>
        <View style={styles.separator}/>
      </View>
    );
  }

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
      {
        showDialog && (
          <Dialog
            title={t('components.dialog.addDocument.title')}
            confirmTitle={t('components.dialog.addDocument.confirmButton')}
            onConfirm={pickAFile}
            onCancel={() => setShowDialog(false)}
            isConfirmDisabled={documentName.length === 0}
          >
            <TextInput 
              value={documentName}
              onChangeText={setDocumentName}
              placeholder={t('components.dialog.addDocument.placeholder')}
              style={styles.dialogInput}
            />
          </Dialog>
        )
      }
    </SafeAreaView>
  );
}

export default DocumentsScreen;
