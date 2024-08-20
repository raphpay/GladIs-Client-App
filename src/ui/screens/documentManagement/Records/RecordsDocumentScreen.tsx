import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Platform, Text, TouchableOpacity, View } from 'react-native';

import DocumentLogAction from '../../../../business-logic/model/enums/DocumentLogAction';
import NavigationRoutes from '../../../../business-logic/model/enums/NavigationRoutes';
import UserType from '../../../../business-logic/model/enums/UserType';
import IAction from '../../../../business-logic/model/IAction';
import IDocument from '../../../../business-logic/model/IDocument';
import { IDocumentActivityLogInput } from '../../../../business-logic/model/IDocumentActivityLog';
import IProcessus from '../../../../business-logic/model/IProcessus';
import CacheService from '../../../../business-logic/services/CacheService';
import DocumentActivityLogsService from '../../../../business-logic/services/DocumentActivityLogsService';
import DocumentService from '../../../../business-logic/services/DocumentService';
import UserServiceRead from '../../../../business-logic/services/UserService.read';
import { useAppDispatch, useAppSelector } from '../../../../business-logic/store/hooks';
import { setDocumentListCount } from '../../../../business-logic/store/slices/appStateReducer';
import { setIsUpdatingSurvey, setSMQScreenSource } from '../../../../business-logic/store/slices/smqReducer';
import { RootState } from '../../../../business-logic/store/store';
import Utils from '../../../../business-logic/utils/Utils';

import { IRootStackParams } from '../../../../navigation/Routes';

import AppContainer from '../../../components/AppContainer/AppContainer';
import Grid from '../../../components/Grid/Grid';
import Toast from '../../../components/Toast';
import TooltipAction from '../../../components/TooltipAction';
import DocumentGrid from '../DocumentScreen/DocumentGrid';

import PlatformName, { Orientation } from '../../../../business-logic/model/enums/PlatformName';
import { Colors } from '../../../assets/colors/colors';
import styles from '../../../assets/styles/documentManagement/ProcessesScreenStyles';
import IconButton from '../../../components/Buttons/IconButton';
import Pagination from '../../../components/Pagination';

type RecordsDocumentScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.RecordsDocumentScreen>;

function RecordsDocumentScreen(props: RecordsDocumentScreenProps): React.JSX.Element {

  // General
  const [searchText, setSearchText] = useState<string>('');
  const [folders, setFolders] = useState<IProcessus[]>([]);
  const [orientation, setOrientation] = useState<string>(Orientation.Landscape);
  // Documents
  const [documents, setDocuments] = useState<IDocument[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<IDocument>();
  // Dialog
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showDocumentActionDialog, setShowDocumentActionDialog] = useState<boolean>(false);
  // Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastIsShowingError, setToastIsShowingError] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { navigation } = props;
  const { currentProcessus, currentScreen, documentsPath } = props.route.params;

  const { currentUser, currentClient } = useAppSelector((state: RootState) => state.users);
  const { documentListCount } = useAppSelector((state: RootState) => state.appState);
  const { token } = useAppSelector((state: RootState) => state.tokens);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const documentsFiltered = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchText.toLowerCase()),
  );
  const path = `${currentClient?.companyName ?? ""}/${documentsPath}/`;
  const docsPerPage = 8;
  const plusIcon = require('../../../assets/images/plus.png');

  const popoverActions: IAction[] = [
    {
      title: t('components.dialog.documentActions.open'),
      onPress: () => navigateToDocument(selectedDocument as IDocument),
    },
    {
      title: t('components.dialog.documentActions.download'),
      onPress: () => download(selectedDocument as IDocument),
    }
  ];

  // Sync Methods
  function navigateBack() {
    // Back to subcategories
    navigation.goBack();
  }

  function navigateTo(item: IProcessus) {
    navigation.navigate(NavigationRoutes.DocumentsScreen, {
      previousScreen: 'Records',
      processNumber: currentProcessus.number,
      currentScreen: item.title,
      documentsPath: `${currentProcessus.title}/records/${item.title}`
    });
    dispatch(setDocumentListCount(documentListCount + 1));
  }

  function navigateToSMQSurvey() {
    dispatch(setSMQScreenSource(t(currentScreen)));
    dispatch(setIsUpdatingSurvey(false));
    navigation.navigate(NavigationRoutes.SMQSurveyStack);
  }

  function showDocumentDialog(item: IDocument) {
    setSelectedDocument(item);
    setShowDocumentActionDialog(true);
  }

  function displayToast(message: string, isError: boolean = false) {
    setShowToast(true);
    setToastIsShowingError(isError);
    setToastMessage(message);
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

  async function loadFolders() {
    try {
      const userID = currentClient?.id as string;
      const processus = await UserServiceRead.getRecordsFolders(userID, token);
      if (processus.length !== 0) {
        setFolders(processus);
      }
    } catch (error) {
      console.log('Error getting records folders:', error);
    }
  }

  // Lifecycle Methods
  useEffect(() => {
    async function init() {
      await loadFolders();
    }
    init();
  }, []);

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

  function FolderGridItem(item: IProcessus) {
    return (
      <TouchableOpacity onPress={() => navigateTo(item)}>
        <View style={styles.processusContainer}>
          <Text style={styles.categoryTitle}>{item.title}</Text>
        </View>
      </TouchableOpacity>
    )
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

  function AddDocumentButton() {
    return (
      <>
        {
          currentUser?.userType == UserType.Admin && (
            <IconButton
              title={t('components.buttons.addDocument')}
              icon={plusIcon}
              onPress={() => setShowDialog(true)}
              style={styles.smqButton}
            />
          )
        }
      </>
    );
  }

  function AdminButtons() {
    const shouldHaveColumn = (
        Platform.OS === PlatformName.Android ||
        Platform.OS === PlatformName.IOS
      ) && orientation === Orientation.Portrait;
    
    return (
      <View style={{ flexDirection: shouldHaveColumn ? 'column' : 'row' }}>
        {CreateSMQDocButton()}
        {AddDocumentButton()}
      </View>
    )
  }

  return (
    <>
      <AppContainer
        mainTitle={'Records'}
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
            folders && folders.length !== 0 && (
              <Grid
                data={folders}
                renderItem={(renderItem) => FolderGridItem(renderItem.item)}
              />
            )
          }
          {
            isLoading ? (
              <ActivityIndicator size="large" color={Colors.primary} />
            ) : (
              <DocumentGrid documentsFiltered={documentsFiltered} showDocumentDialog={showDocumentDialog} />
            )
          }
        </>
      </AppContainer>
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

export default RecordsDocumentScreen;
