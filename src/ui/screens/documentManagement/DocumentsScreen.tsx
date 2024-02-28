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
import IFile from '../../../business-logic/model/IFile';
import INavigationHistoryItem from '../../../business-logic/model/INavigationHistoryItem';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import UserType from '../../../business-logic/model/enums/UserType';
import FinderModule from '../../../business-logic/modules/FinderModule';
import DocumentService from '../../../business-logic/services/DocumentService';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import ContentUnavailableView from '../../components/ContentUnavailableView';
import Dialog from '../../components/Dialog';
import IconButton from '../../components/IconButton';
import SearchTextInput from '../../components/SearchTextInput';
import TopAppBar from '../../components/TopAppBar';

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

  const navigationHistoryItems: INavigationHistoryItem[] = [
    {
      title: t('dashboard.title'),
      action: () => navigateToDashboard,
    },
    {
      title: t(`modules.${module?.name}`),
      action: () => navigateToDocumentManagementScreen()
    },
    {
      title: processNumber ? `${t('documentsScreen.process')} ${processNumber}` : t(`documentsScreen.${previousScreen}`),
      action: () => navigateBack()
    }
  ]

  function navigateToDashboard() {
    navigation.navigate(NavigationRoutes.DashboardScreen)
  }

  function navigateToDocumentManagementScreen() {
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
      <TopAppBar 
        mainTitle={t(`documentsScreen.${currentScreen}`)}
        navigationHistoryItems={navigationHistoryItems}
      />
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
