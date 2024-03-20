import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';

import { IRootStackParams } from '../../../navigation/Routes';

import IDocument, { DocumentStatus } from '../../../business-logic/model/IDocument';
import { IDocumentActivityLogInput } from '../../../business-logic/model/IDocumentActivityLog';
import IFile from '../../../business-logic/model/IFile';
import INavigationHistoryItem from '../../../business-logic/model/INavigationHistoryItem';
import DocumentLogAction from '../../../business-logic/model/enums/DocumentLogAction';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import PlatformName from '../../../business-logic/model/enums/PlatformName';
import UserType from '../../../business-logic/model/enums/UserType';
import FinderModule from '../../../business-logic/modules/FinderModule';
import CacheService from '../../../business-logic/services/CacheService';
import DocumentActivityLogsService from '../../../business-logic/services/DocumentActivityLogsService';
import DocumentService from '../../../business-logic/services/DocumentService';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';
import Utils from '../../../business-logic/utils/Utils';

import AppContainer from '../../components/AppContainer';
import ContentUnavailableView from '../../components/ContentUnavailableView';
import Dialog from '../../components/Dialog';
import Grid from '../../components/Grid';
import IconButton from '../../components/IconButton';

import styles from '../../assets/styles/documentManagement/DocumentsScreenStyles';
// TODO: Create a refactor interface
import { ITooltipAction } from '../../components/Tooltip';

type DocumentsScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.DocumentsScreen>;

function DocumentsScreen(props: DocumentsScreenProps): React.JSX.Element {
  const [searchText, setSearchText] = useState<string>('');
  const [documents, setDocuments] = useState<IDocument[]>([]);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showDocumentActionDialog, setShowDocumentActionDialog] = useState<boolean>(false);
  const [documentName, setDocumentName] = useState<string>('');
  const [selectedDocument, setSelectedDocument] = useState<IDocument>();

  const plusIcon = require('../../assets/images/plus.png');
  const docIcon = require('../../assets/images/doc.fill.png');
  
  const { t } = useTranslation();
  
  const { navigation } = props;
  const {
    previousScreen,
    currentScreen,
    documentsPath,
    processNumber,
  } = props.route.params;

  const { module, documentListCount } = useAppSelector((state: RootState) => state.appState);
  const { currentClient, currentUser } = useAppSelector((state: RootState) => state.users);
  const { token } = useAppSelector((state: RootState) => state.tokens);

  const ellipsisIcon = require('../../assets/images/ellipsis.png');
  
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
      title: processNumber ? `${t('documentsScreen.process')} ${processNumber}` : previousScreen,
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

  async function navigateToDocument(doc: IDocument) {
    const logInput: IDocumentActivityLogInput = {
      action: DocumentLogAction.Visualisation,
      actorIsAdmin: currentUser?.userType == UserType.Admin,
      actorID: currentUser?.id as string,
      clientID: currentClient?.id as string,
      documentID: doc.id,
    }
    await DocumentActivityLogsService.getInstance().recordLog(logInput, token);
    navigation.navigate(NavigationRoutes.PDFScreen, { documentInput: doc });
  }

  async function addDocument() {
    setShowDialog(true);
  }

  function showDocumentDialog(item: IDocument) {
    setSelectedDocument(item);
    setShowDocumentActionDialog(true);
  }

  async function pickAFile() {
    const path = `${currentClient?.companyName ?? ""}/${documentsPath}/`;
    const filename = `${documentName.replace(/\s/g, "_")}.pdf`;
    let data: string = '';
    if (Platform.OS !== PlatformName.Mac) {
      const doc = await DocumentPicker.pickSingle({ type: DocumentPicker.types.pdf })
      data = await Utils.getFileBase64FromURI(doc.uri) as string;
    } else {
      data = await FinderModule.getInstance().pickPDF();
    }
    const file: IFile = { data, filename: filename}
    const createdDocument = await DocumentService.getInstance().upload(file, filename, path, token);
    const logInput: IDocumentActivityLogInput = {
      action: DocumentLogAction.Creation,
      actorIsAdmin: true,
      actorID: currentUser?.id as string,
      clientID: currentClient?.id as string,
      documentID: createdDocument.id,
    }
    await DocumentActivityLogsService.getInstance().recordLog(logInput, token);
    setShowDialog(false);
    await loadDocuments();
  }

  async function loadDocuments() {
    const path = `${currentClient?.companyName ?? ""}/${documentsPath}/`;
    const docs = await DocumentService.getInstance().getDocumentsAtPath(path, token);
    setDocuments(docs);
  }

  useEffect(() => {
    async function init() {
      await loadDocuments();
    }
    init();
  }, []);

  useEffect(() => {
    async function init() {
      await loadDocuments();
    }
    init();
  }, [documentListCount]);

  async function download(document: IDocument) {
    const cachedData = await CacheService.getInstance().retrieveValue<string>(document.id as string);
    if (cachedData === null || cachedData == undefined) {
      let docData = await DocumentService.getInstance().download(document.id, token);
      docData = Utils.changeMimeType(docData, 'application/pdf');
      await CacheService.getInstance().storeValue(document.id as string, docData);
      const logInput: IDocumentActivityLogInput = {
        action: DocumentLogAction.Loaded,
        actorIsAdmin: true,
        actorID: currentUser?.id as string,
        clientID: currentClient?.id as string,
        documentID: document.id,
      }
      await DocumentActivityLogsService.getInstance().recordLog(logInput, token);
    }
    setShowDocumentActionDialog(false);
  }

  async function approveDocument(document: IDocument) {
    await DocumentService.getInstance().updateStatus(document.id, DocumentStatus.APPROVED, token);
    const logInput: IDocumentActivityLogInput = {
      action: DocumentLogAction.Approbation,
      actorIsAdmin: true,
      actorID: currentUser?.id as string,
      clientID: currentClient?.id as string,
      documentID: document.id,
    }
    await DocumentActivityLogsService.getInstance().recordLog(logInput, token);
    setShowDocumentActionDialog(false);
  }

  const popoverActions: ITooltipAction[] = [
    {
      title: t('components.dialog.documentActions.open'),
      onPress: () => navigateToDocument(selectedDocument as IDocument),
    },
    {
      title: t('components.dialog.documentActions.download'),
      onPress: () => download(selectedDocument as IDocument),
    },
    {
      title: t('components.dialog.documentActions.approve'),
      onPress: () => approveDocument(selectedDocument as IDocument),
    }
  ];

  function documentActionDialog() {
    return (
      <>
        {
          showDocumentActionDialog && (
            <Dialog
              title={`${t('components.dialog.documentActions.title')} ${selectedDocument?.name}`}
              isConfirmAvailable={false}
              isCancelAvailable={true}
              onConfirm={() => {}}
              onCancel={() => setShowDocumentActionDialog(false)}
            >
              <>
                {popoverActions.map((action: ITooltipAction, index: number) => (
                  <TouchableOpacity key={index} style={styles.popoverButton} onPress={action.onPress}>
                    <Text style={styles.popoverButtonText}>{action.title}</Text>
                  </TouchableOpacity>
                ))}
              </>
            </Dialog>
          )
        }
      </>
    )
  }

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
          <TouchableOpacity style={styles.actionButton} onPress={() => showDocumentDialog(item)}>
            <Image style={styles.ellipsisIcon} source={ellipsisIcon}/>
          </TouchableOpacity>
        </View>
        <View style={styles.separator}/>
      </View>
    );
  }

  return (
    <>
      <AppContainer
        mainTitle={t(currentScreen)}
        navigationHistoryItems={navigationHistoryItems}
        searchText={searchText}
        setSearchText={setSearchText}
        showBackButton={true}
        showSearchText={true}
        navigateBack={navigateBack}
        showDialog={showDialog}
        showSettings={true}
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
            isCancelAvailable={true}
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
            <Grid
              data={documentsFiltered}
              renderItem={(renderItem) => DocumentRow(renderItem.item)}
            />
          ) : (
            <ContentUnavailableView 
              title={t('documentsScreen.noDocs.title')}
              message={currentUser?.userType === UserType.Admin ? t('documentsScreen.noDocs.message.admin') : t('documentsScreen.noDocs.message.client')}
              image={docIcon}
            />
          )
        }
      </AppContainer>
      {documentActionDialog()}
    </>
  );
}

export default DocumentsScreen;
