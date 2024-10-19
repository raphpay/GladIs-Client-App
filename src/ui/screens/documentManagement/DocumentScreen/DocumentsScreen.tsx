import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Dimensions,
  NativeModules,
  Platform,
  TextInput,
  View,
} from 'react-native';
const { FilePickerModule } = NativeModules;

import { IRootStackParams } from '../../../../navigation/Routes';

import DocumentScreenManager from '../../../../business-logic/manager/documentManagement/DocumentScreenManager';
import IAction from '../../../../business-logic/model/IAction';
import IDocument, {
  DocumentStatus,
} from '../../../../business-logic/model/IDocument';
import DocumentLogAction from '../../../../business-logic/model/enums/DocumentLogAction';
import NavigationRoutes from '../../../../business-logic/model/enums/NavigationRoutes';
import PlatformName, {
  Orientation,
} from '../../../../business-logic/model/enums/PlatformName';
import UserType from '../../../../business-logic/model/enums/UserType';
import FinderModule from '../../../../business-logic/modules/FinderModule';
import CacheService from '../../../../business-logic/services/CacheService';
import DocumentServiceDelete from '../../../../business-logic/services/DocumentService/DocumentService.delete';
import DocumentServiceGet from '../../../../business-logic/services/DocumentService/DocumentService.get';
import DocumentServicePost from '../../../../business-logic/services/DocumentService/DocumentService.post';
import DocumentServicePut from '../../../../business-logic/services/DocumentService/DocumentService.put';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../../business-logic/store/hooks';
import {
  setIsUpdatingSurvey,
  setSMQScreenSource,
} from '../../../../business-logic/store/slices/smqReducer';
import { RootState } from '../../../../business-logic/store/store';
import Utils from '../../../../business-logic/utils/Utils';

import UploadingActivityIndicator from '../../../components/ActivityIndicator/UploadingActivityIndicator';
import AppContainer from '../../../components/AppContainer/AppContainer';
import IconButton from '../../../components/Buttons/IconButton';
import Dialog from '../../../components/Dialogs/Dialog';
import Pagination from '../../../components/Pagination';
import Toast from '../../../components/Toast';
import TooltipAction from '../../../components/TooltipAction';
import DocumentGrid from './DocumentGrid';

import DocumentRowManager from '../../../../business-logic/manager/documentManagement/DocumentRowManager';
import { Colors } from '../../../assets/colors/colors';
import styles from '../../../assets/styles/documentManagement/DocumentsScreenStyles';

type DocumentsScreenProps = NativeStackScreenProps<
  IRootStackParams,
  NavigationRoutes.DocumentsScreen
>;

function DocumentsScreen(props: DocumentsScreenProps): React.JSX.Element {
  // General
  const [searchText, setSearchText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [orientation, setOrientation] = useState<string>(Orientation.Landscape);
  // Dialog
  const [showDeleteConfimationDialog, setShowDeleteConfimationDialog] =
    useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showDocumentActionDialog, setShowDocumentActionDialog] =
    useState<boolean>(false);
  // Documents
  const [documents, setDocuments] = useState<IDocument[]>([]);
  const [documentName, setDocumentName] = useState<string>('');
  const [selectedDocument, setSelectedDocument] = useState<IDocument>();
  // Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastIsShowingError, setToastIsShowingError] =
    useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  const plusIcon = require('../../../assets/images/plus.png');

  const { t } = useTranslation();

  const { navigation } = props;
  const {
    previousScreen,
    currentScreen,
    documentsPath,
    processNumber,
    showGenerateSMQButton = true,
  } = props.route.params;

  const { module, documentListCount } = useAppSelector(
    (state: RootState) => state.appState,
  );
  const { currentClient, currentUser } = useAppSelector(
    (state: RootState) => state.users,
  );
  const { token } = useAppSelector((state: RootState) => state.tokens);
  const dispatch = useAppDispatch();

  const documentDestinationPath = Utils.removeWhitespace(
    `${currentClient?.companyName ?? 'noCompany'}/${documentsPath}/`,
  );
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
      onPress: () => navigateToDocumentManagementScreen(),
    },
    {
      title: processNumber
        ? `${t('documentsScreen.process')} ${processNumber}`
        : previousScreen,
      onPress: () => navigateBack(),
    },
  ];

  const basePopoverActions: IAction[] = [
    {
      title: t('components.dialog.documentActions.open'),
      onPress: () => navigateToDocument(selectedDocument as IDocument),
    },
    {
      title: t('components.dialog.documentActions.download'),
      onPress: () => download(selectedDocument as IDocument),
    },
    {
      title: t('components.dialog.documentActions.delete'),
      onPress: () => openDeleteDialog(),
      isDisabled: currentUser?.userType !== UserType.Admin,
      isDestructive: true,
    },
  ];
  const [popoverActions, setPopoverActions] =
    useState<IAction[]>(basePopoverActions);

  // Sync Methods
  function navigateToDashboard() {
    navigation.navigate(NavigationRoutes.DashboardScreen);
  }

  function navigateToDocumentManagementScreen() {
    navigation.navigate(NavigationRoutes.DocumentManagementScreen);
  }

  function navigateBack() {
    // Back to subcategories
    navigation.goBack();
  }

  function navigateToSMQSurvey() {
    dispatch(setSMQScreenSource(t(currentScreen)));
    dispatch(setIsUpdatingSurvey(false));
    navigation.navigate(NavigationRoutes.SMQSurveyStack);
  }

  function displayDocumentDialog(item: IDocument) {
    setSelectedDocument(item);
    let actions = [...basePopoverActions]; // Create a copy of the base actions array
    const newAction = {
      title:
        item.status !== DocumentStatus.APPROVED
          ? t('components.dialog.documentActions.approve')
          : t('components.dialog.documentActions.unapprove'),
      onPress:
        item.status !== DocumentStatus.APPROVED
          ? () => approveDocument(item)
          : () => unapproveDocument(item),
      isDisabled: currentUser?.userType === UserType.Employee,
    };

    const insertIndex = 2; // Specify the index where you want to insert the new action
    actions.splice(insertIndex, 0, newAction);

    setPopoverActions(actions);
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

  function determineAndSetOrientation() {
    let width = Dimensions.get('window').width;
    let height = Dimensions.get('window').height;

    if (width < height) {
      setOrientation(Orientation.Portrait);
    } else {
      setOrientation(Orientation.Landscape);
    }
  }

  function closeDialogs() {
    setShowDialog(false);
    setShowDocumentActionDialog(false);
    setShowDeleteConfimationDialog(false);
  }

  function openDeleteDialog() {
    closeDialogs();
    setShowDeleteConfimationDialog(true);
  }

  // Async Methods
  async function navigateToDocument(document: IDocument) {
    const files = await DocumentRowManager.getInstance().loadSubDocuments(
      document,
      token,
    );
    await DocumentRowManager.getInstance().logDocumentOpening(
      currentUser,
      currentClient,
      document,
      token,
    );
    navigation.navigate(NavigationRoutes.PDFScreen, {
      documentInputs: files,
      originalDocument: document,
    });
    closeDialogs();
  }

  async function pickAFile() {
    const fileName = `${documentName.replace(/\s/g, '_')}.pdf`;
    let filePath: string = '';
    if (Platform.OS === PlatformName.Mac) {
      filePath = await FinderModule.getInstance().pickPDFFilePath();
    } else if (Platform.OS === PlatformName.Android) {
      const file = await FilePickerModule.pickSingleFile(['application/pdf']);
      filePath = file.uri;
    }
    setIsUploading(true);

    const createdDocuments =
      await DocumentScreenManager.getInstance().uploadFileToAPI(
        filePath,
        fileName,
        documentDestinationPath,
        token,
      );
    await DocumentScreenManager.getInstance().recordDocumentActivity(
      DocumentLogAction.Creation,
      currentUser,
      currentClient,
      createdDocuments[0].id,
      token,
      true,
    );
    setDocumentName('');
    closeDialogs();
    await loadPaginatedDocuments();
    setIsUploading(false);
  }

  async function download(document: IDocument) {
    try {
      const cachedData = await CacheService.getInstance().retrieveValue<string>(
        document.id as string,
      );
      if (cachedData === null || cachedData == undefined) {
        let docData = await DocumentServiceGet.download(document.id, token);
        docData = Utils.changeMimeType(docData, 'application/pdf');
        await CacheService.getInstance().storeValue(
          document.id as string,
          docData,
        );
        DocumentScreenManager.getInstance().recordDocumentActivity(
          DocumentLogAction.Loaded,
          currentUser,
          currentClient,
          document.id,
          token,
          true,
        );
        displayToast(t('documentsScreen.downloadSuccess'));
      } else {
        displayToast(t('documentsScreen.alreadyDownloaded'));
      }
      closeDialogs();
    } catch (error) {
      displayToast(t(`errors.api.${error}`), true);
    }
  }

  async function approveDocument(document: IDocument) {
    try {
      await DocumentServicePut.updateStatus(
        document.id,
        DocumentStatus.APPROVED,
        token,
      );
      DocumentScreenManager.getInstance().recordDocumentActivity(
        DocumentLogAction.Approbation,
        currentUser,
        currentClient,
        document.id,
        token,
        true,
      );
      displayToast(t('documentsScreen.approvalSuccess'));
      closeDialogs();
      await loadPaginatedDocuments();
    } catch (error) {
      displayToast(t(`errors.api.${error}`), true);
    }
  }

  async function unapproveDocument(document: IDocument) {
    try {
      await DocumentServicePut.updateStatus(
        document.id,
        DocumentStatus.NONE,
        token,
      );
      DocumentScreenManager.getInstance().recordDocumentActivity(
        DocumentLogAction.Modification,
        currentUser,
        currentClient,
        document.id,
        token,
        true,
      );
      displayToast(t('documentsScreen.approvalSuccess'));
      closeDialogs();
      await loadPaginatedDocuments();
    } catch (error) {
      displayToast(t(`errors.api.${error}`), true);
    }
  }

  async function deleteDocument() {
    try {
      const documentID = selectedDocument?.id as string;
      await DocumentScreenManager.getInstance().recordDocumentActivity(
        DocumentLogAction.Deletion,
        currentUser,
        currentClient,
        documentID,
        token,
      );
      await DocumentServiceDelete.delete(documentID, token);
      closeDialogs();
      await loadPaginatedDocuments();
    } catch (error) {
      displayToast(t(`errors.api.${error}`), true);
    }
  }

  async function loadPaginatedDocuments() {
    try {
      setIsLoading(true);
      const paginatedOutput =
        await DocumentServicePost.getPaginatedDocumentsAtPath(
          documentDestinationPath,
          token,
          currentPage,
          docsPerPage,
        );
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

  useEffect(() => {
    determineAndSetOrientation();
    Dimensions.addEventListener('change', determineAndSetOrientation);
    return () => {};
  }, []);

  // Components
  function ToastContent() {
    return (
      <>
        {showToast && (
          <Toast
            message={toastMessage}
            isVisible={showToast}
            setIsVisible={setShowToast}
            isShowingError={toastIsShowingError}
          />
        )}
      </>
    );
  }

  function AddDocumentButton() {
    return (
      <>
        {currentUser?.userType == UserType.Admin && (
          <IconButton
            title={t('components.buttons.addDocument')}
            icon={plusIcon}
            onPress={addDocument}
            style={styles.smqButton}
          />
        )}
      </>
    );
  }

  function CreateSMQDocButton() {
    return (
      <>
        {currentUser?.userType !== UserType.Employee &&
          showGenerateSMQButton && (
            <IconButton
              title={t('systemQuality.createSMQDoc.button')}
              onPress={navigateToSMQSurvey}
              icon={plusIcon}
              style={styles.smqButton}
            />
          )}
      </>
    );
  }

  function AdminButtons() {
    const shouldHaveColumn =
      (Platform.OS === PlatformName.Android ||
        Platform.OS === PlatformName.IOS) &&
      orientation === Orientation.Portrait;

    return (
      <View style={{ flexDirection: shouldHaveColumn ? 'column' : 'row' }}>
        {CreateSMQDocButton()}
        {AddDocumentButton()}
      </View>
    );
  }

  function AddDocumentDialog() {
    return (
      <>
        {showDialog && (
          <Dialog
            title={t('components.dialog.addDocument.title')}
            confirmTitle={t('components.dialog.addDocument.confirmButton')}
            onConfirm={pickAFile}
            isCancelAvailable={true}
            onCancel={closeDialogs}
            isConfirmDisabled={documentName.length === 0}>
            <TextInput
              value={documentName}
              onChangeText={setDocumentName}
              placeholder={t('components.dialog.addDocument.placeholder')}
              style={styles.dialogInput}
            />
          </Dialog>
        )}
      </>
    );
  }

  function DeleteConfirmationDialog() {
    return (
      <>
        {showDeleteConfimationDialog && (
          <Dialog
            title={`${t('components.dialog.deleteDocument.title')} ${
              selectedDocument?.name
            }`}
            description={t('components.dialog.deleteDocument.description')}
            confirmTitle={t('components.dialog.deleteDocument.confirmButton')}
            onConfirm={deleteDocument}
            onCancel={closeDialogs}
            isConfirmAvailable={true}
            isCancelAvailable={true}
          />
        )}
      </>
    );
  }

  function TooltipActionContent() {
    return (
      <TooltipAction
        showDialog={showDocumentActionDialog}
        title={`${t('components.dialog.documentActions.title')} ${
          selectedDocument?.name
        }`}
        isConfirmAvailable={false}
        isCancelAvailable={true}
        onConfirm={() => {}}
        onCancel={() => setShowDocumentActionDialog(false)}
        popoverActions={popoverActions}
      />
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
        adminButton={AdminButtons()}>
        <>
          {isLoading ? (
            <ActivityIndicator size="large" color={Colors.primary} />
          ) : (
            <DocumentGrid
              documentsFiltered={documentsFiltered}
              showDocumentDialog={displayDocumentDialog}
            />
          )}
        </>
      </AppContainer>
      {ToastContent()}
      {TooltipActionContent()}
      {AddDocumentDialog()}
      {DeleteConfirmationDialog()}
      <UploadingActivityIndicator isUploading={isUploading} />
    </>
  );
}

export default DocumentsScreen;
