import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Platform,
  TextInput
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';

import { IRootStackParams } from '../../../../navigation/Routes';

import IAction from '../../../../business-logic/model/IAction';
import IDocument, { DocumentStatus } from '../../../../business-logic/model/IDocument';
import { IDocumentActivityLogInput } from '../../../../business-logic/model/IDocumentActivityLog';
import IFile from '../../../../business-logic/model/IFile';
import DocumentLogAction from '../../../../business-logic/model/enums/DocumentLogAction';
import NavigationRoutes from '../../../../business-logic/model/enums/NavigationRoutes';
import PlatformName from '../../../../business-logic/model/enums/PlatformName';
import UserType from '../../../../business-logic/model/enums/UserType';
import FinderModule from '../../../../business-logic/modules/FinderModule';
import CacheService from '../../../../business-logic/services/CacheService';
import DocumentActivityLogsService from '../../../../business-logic/services/DocumentActivityLogsService';
import DocumentService from '../../../../business-logic/services/DocumentService';
import { useAppDispatch, useAppSelector } from '../../../../business-logic/store/hooks';
import { setSMQScreenSource } from '../../../../business-logic/store/slices/appStateReducer';
import { RootState } from '../../../../business-logic/store/store';
import Utils from '../../../../business-logic/utils/Utils';

import AppContainer from '../../../components/AppContainer/AppContainer';
import IconButton from '../../../components/Buttons/IconButton';
import Dialog from '../../../components/Dialogs/Dialog';
import Pagination from '../../../components/Pagination';
import Toast from '../../../components/Toast';
import TooltipAction from '../../../components/TooltipAction';

import { Colors } from '../../../assets/colors/colors';
import styles from '../../../assets/styles/documentManagement/DocumentsScreenStyles';
import DocumentGrid from './DocumentGrid';

type DocumentsScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.DocumentsScreen>;

function DocumentsScreen(props: DocumentsScreenProps): React.JSX.Element {
  const [searchText, setSearchText] = useState<string>('');
  const [documents, setDocuments] = useState<IDocument[]>([]);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showDocumentActionDialog, setShowDocumentActionDialog] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastIsShowingError, setToastIsShowingError] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [documentName, setDocumentName] = useState<string>('');
  const [selectedDocument, setSelectedDocument] = useState<IDocument>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const plusIcon = require('../../../assets/images/plus.png');
  
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
  const dispatch = useAppDispatch();

  const path = `${currentClient?.companyName ?? ""}/${documentsPath}/`;
  const docsPerPage = 8;
  
  const documentsFiltered = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  const navigationHistoryItems: IAction[] = [
    {
      title: t('dashboard.title'),
      onPress: () => navigateToDashboard(),
    },
    {
      title: t(`modules.${module?.name}`),
      onPress: () => navigateToDocumentManagementScreen()
    },
    {
      title: processNumber ? `${t('documentsScreen.process')} ${processNumber}` : previousScreen,
      onPress: () => navigateBack()
    }
  ];

  const popoverActions: IAction[] = [
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
      isDisabled: currentUser?.userType === UserType.Employee,
    }
  ];

  // Sync Methods
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

  function showDocumentDialog(item: IDocument) {
    setSelectedDocument(item);
    setShowDocumentActionDialog(true);
  }

  function addDocument() {
    setShowDialog(true);
  }

  function displayToast(message: string, isError: boolean = false) {
    setShowToast(true);
    setToastIsShowingError(isError);
    setToastMessage(message);
  }

  function navigateToSMQSurvey() {
    dispatch(setSMQScreenSource(t(currentScreen)));
    navigation.navigate(NavigationRoutes.SMQSurveyStack);
  }

  // Async Methods
  async function navigateToDocument(doc: IDocument) {
    try {
      const logInput: IDocumentActivityLogInput = {
        action: DocumentLogAction.Visualisation,
        actorIsAdmin: currentUser?.userType == UserType.Admin,
        actorID: currentUser?.id as string,
        clientID: currentClient?.id as string,
        documentID: doc.id,
      }
      await DocumentActivityLogsService.getInstance().recordLog(logInput, token);
      navigation.navigate(NavigationRoutes.PDFScreen, { documentInput: doc });
    } catch (error) {
      console.log('Error recording log for document:', doc.id, error);
    }
  }

  async function pickAFile() {
    const filename = `${documentName.replace(/\s/g, "_")}.pdf`;
    let data: string = '';
    if (Platform.OS !== PlatformName.Mac) {
      const doc = await DocumentPicker.pickSingle({ type: DocumentPicker.types.pdf })
      data = await Utils.getFileBase64FromURI(doc.uri) as string;
    } else {
      data = await FinderModule.getInstance().pickPDF();
    }
    try {
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
      setDocumentName('');
      setShowDialog(false);
      await loadPaginatedDocuments();
    } catch (error) {
      displayToast(t(`errors.api.${error}`), true);
    }
  }

  async function download(document: IDocument) {
    try {
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
        displayToast(t('documentsScreen.downloadSuccess'));
      } else {
        displayToast(t('documentsScreen.alreadyDownloaded'));
      }
      setShowDocumentActionDialog(false);
    } catch (error) {
      displayToast(t(`errors.api.${error}`), true);
    }
  }

  async function approveDocument(document: IDocument) {
    try {
      await DocumentService.getInstance().updateStatus(document.id, DocumentStatus.APPROVED, token);
      const logInput: IDocumentActivityLogInput = {
        action: DocumentLogAction.Approbation,
        actorIsAdmin: true,
        actorID: currentUser?.id as string,
        clientID: currentClient?.id as string,
        documentID: document.id,
      }
      await DocumentActivityLogsService.getInstance().recordLog(logInput, token);
      displayToast(t('documentsScreen.approvalSuccess'));
      setShowDocumentActionDialog(false);
    } catch (error) {
      displayToast(t(`errors.api.${error}`), true);
    }
  }

  async function loadPaginatedDocuments() {
    try {
      setIsLoading(true);
      const paginatedOutput = await DocumentService.getInstance().getPaginatedDocumentsAtPath(path, token, currentPage, docsPerPage);
      setDocuments(paginatedOutput.documents);
      setTotalPages(paginatedOutput.pageCount);
      setIsLoading(false); 
    } catch (error) {
      console.log('Error getting paginated documents:', error);
    }
  }

  // Lifecycle Methods
  useEffect(() => {
    async function init() {
      await loadPaginatedDocuments();
    }
    init();
  }, []);

  useEffect(() => {
    async function init() {
      await loadPaginatedDocuments();
    }
    init();
  }, [currentPage]);

  useEffect(() => {
    async function init() {
      await loadPaginatedDocuments();
    }
    init();
  }, [documentListCount]);

  // Components
  function ToastContent() {
    return (
      <>
        {
          showToast && (
            <Toast
              message={toastMessage}
              isVisible={showToast}
              setIsVisible={setShowToast}
              isShowingError={toastIsShowingError}
            />
          )
        }
      </>
    );
  }

  function AddDocumentButton() {
    return (
      <>
        {
          currentUser?.userType == UserType.Admin && (
            <IconButton
              title={t('components.buttons.addDocument')}
              icon={plusIcon}
              onPress={addDocument}
            />
          )
        }
      </>
    );
  }

  function CreateSMQDocButton() {
    return (
      <>
        {
          currentUser?.userType !== UserType.Employee && (
            <IconButton 
              title={t('systemQuality.createSMQDoc.button')}
              onPress={navigateToSMQSurvey}
              icon={plusIcon}
              style={styles.smqButton}
            />
          )
        }
      </>
    )
  }

  function AdminButtons() {
    return (
      <>
        {CreateSMQDocButton()}
        {AddDocumentButton()}
      </>
    )
  }

  function AddDocumentDialog() {
    return (
      <>
        {
          showDialog && (
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
          )
        }
      </>
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
        showSettings={true}
        additionalComponent={
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page: number) => setCurrentPage(page)}
          />
        }
        adminButton={AdminButtons()}
      >
        <>
          {
            isLoading ? (
              <ActivityIndicator size="large" color={Colors.primary} />
            ) : (
              <DocumentGrid documentsFiltered={documentsFiltered} showDocumentDialog={showDocumentDialog} />
            )
          }
        </>
      </AppContainer>
      {AddDocumentDialog()}
      <TooltipAction
        showDialog={showDocumentActionDialog}
        title={`${t('components.dialog.documentActions.title')} ${selectedDocument?.name}`}
        isConfirmAvailable={false}
        isCancelAvailable={true}
        onConfirm={() => {}}
        onCancel={() => setShowDocumentActionDialog(false)}
        popoverActions={popoverActions}
      />
      {ToastContent()}
    </>
  );
}

export default DocumentsScreen;
