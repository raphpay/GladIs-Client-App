import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  Image,
  Platform,
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

import AppContainer from '../../components/AppContainer';
import ContentUnavailableView from '../../components/ContentUnavailableView';
import Dialog from '../../components/Dialog';
import IconButton from '../../components/IconButton';

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
  const documentsFiltered = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchText.toLowerCase()),
  );
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
                <Text style={styles.documentText}>
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
    <AppContainer
      mainTitle={t(`documentsScreen.${currentScreen}`)}
      navigationHistoryItems={navigationHistoryItems}
      searchText={searchText}
      setSearchText={setSearchText}
      showBackButton={true}
      navigateBack={navigateBack}
      showDialog={showDialog}
      adminButton={
        currentUser?.userType == UserType.Admin ? (
          <IconButton
            title={t('components.buttons.addDocument')}
            icon={plusIcon}
            onPress={addDocument}
          />
        ) : undefined
      }
      dialog={
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
      }
    >
      {
        documentsFiltered.length !== 0 ? (
          <FlatList
            data={documentsFiltered}
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
    </AppContainer>
  );
}

export default DocumentsScreen;
