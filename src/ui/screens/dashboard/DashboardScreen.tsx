import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { IRootStackParams } from '../../../navigation/Routes';

import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import { Image, Platform, ScrollView, Text, TextInput, TouchableOpacity } from 'react-native';
import PlatformName from '../../../business-logic/model/enums/PlatformName';
import FinderModule from '../../../business-logic/modules/FinderModule';
import IFile, { INewFile } from '../../../business-logic/model/IFile';
import DocumentServicePost from '../../../business-logic/services/DocumentService/DocumentService.post';
import { IDocumentActivityLogInput } from '../../../business-logic/model/IDocumentActivityLog';
import DocumentLogAction from '../../../business-logic/model/enums/DocumentLogAction';
import DocumentActivityLogsService from '../../../business-logic/services/DocumentActivityLogsService';
import {NativeModules} from 'react-native';
import DocumentServiceGet from '../../../business-logic/services/DocumentService/DocumentService.get';
import Utils from '../../../business-logic/utils/Utils';
import PDFViewer from './NewPDFViewer';
import NewPDFViewer from './NewPDFViewer';
import GladisTextInput from '../../components/TextInputs/GladisTextInput';
const { FilePickerModule } = NativeModules;

type DashboardScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.DashboardScreen>;

function DashboardScreen(props: DashboardScreenProps): any {
  const { navigation } = props;
  const [searchText, setSearchText] = useState<string>('');
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [dialogDescription, setDialogDescription] = useState<string>('');
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showErrorDialog, setShowErrorDialog] = useState<boolean>(false);
  // Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastIsShowingError, setToastIsShowingError] = useState<boolean>(false);
  
  const plusIcon = require('../../assets/images/plus.png');
  
  const { t } = useTranslation();

  const { currentUser, currentClient } = useAppSelector((state: RootState) => state.users);
  const { token } = useAppSelector((state: RootState) => state.tokens);

  // Test Display PDF ( TO BE REMOVED )
  const [documentID, setDocumentID] = useState<string>('');
  const [imagePaths, setImagePaths] = useState<string[] | null>(null);
  const [searchedDocumentName, setSearchedDocumentName] = useState<string>('');
  const [documentIDs, setDocumentIDs] = useState<string[]>([]);


  async function pickAFile() {
    const filename = 'test.pdf';
    let filePath: string = '';
    if (Platform.OS === PlatformName.Mac) {
      filePath = await FinderModule.getInstance().pickPDFFilePath();
      // await uploadFileToAPI(filePath, filename);
    } else if (Platform.OS === PlatformName.Android) {
      const file = await FilePickerModule.pickSingleFile(["application/pdf"]);
      filePath = file.uri;
    }
    await uploadFileToAPI(filePath, filename);
  }

  const uploadFileToAPI = async (filePath: string, fileName: string) => {
    try {
      const createdDocument = await DocumentServicePost.uploadNewFile(fileName, filePath, token);
      console.log("createdDocument", createdDocument);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  async function pickAMultiplePageFile() {
    const fileName = "multiple.pdf";
    let filePath: string = '';
    if (Platform.OS === PlatformName.Mac) {
      filePath = await FinderModule.getInstance().pickPDFFilePath();
    } else if (Platform.OS === PlatformName.Android) {
      const file = await FilePickerModule.pickSingleFile(["application/pdf"]);
      filePath = file.uri;
    }
    await uploadMultiplePageFileToAPI(filePath, fileName);
  }

  async function uploadMultiplePageFileToAPI(filePath: string, fileName: string) {
    try {
      const createdDocuments = await DocumentServicePost.uploadMultiplePageFile(fileName, filePath, token);
      console.log("createdDocuments", createdDocuments);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  }

  async function getLatestDocument() {
    try {
      const docs = await DocumentServiceGet.getAll(token);
      if (docs.length > 0) {
        setDocumentID(docs[0].id);
      }
    } catch (error) {
      console.log('error');
    }
  }

  async function getDocuments() {
    try {
      console.log("getDocuments");
      const docs = await DocumentServiceGet.getAllPages(searchedDocumentName, token);
      let ids = [];
      if (docs.length > 0) {
        for (const doc of docs) {
          ids.push(doc.id);
        }
      }
      setDocumentIDs(ids);
    } catch (error) {
      console.log('error');
    }
  }

  async function downloadDocument(id: string) : Promise<string> {
    try {
      const data = await DocumentServiceGet.download(id, token);
      return data
    } catch (error) {
      throw error;
    }
  }

  async function downloadDocuments() {
    // try {
    //   let data = await DocumentServiceGet.download(documentID, token);
    //   data = Utils.changeMimeType(data, 'application/pdf');
    //   console.log("data", data)
    //   setImagePath(data);
    // } catch (error) {
      
    // }
    if (documentIDs.length > 0) {
      let datas: string[] = [];
      for (const docID of documentIDs) {
        const data = await downloadDocument(docID);
        datas.push(data);
      }
      setImagePaths(datas);
    }
  }

  return (
    <>
      <TouchableOpacity onPress={pickAFile}>
        <Text>Pick PDF File Path</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={pickAMultiplePageFile}>
        <Text>Pick Multiple page PDF File</Text>
      </TouchableOpacity>
      <GladisTextInput
        value={searchedDocumentName}
        onValueChange={setSearchedDocumentName}
        placeholder='Search'
      />
      <TouchableOpacity onPress={getDocuments}>
        <Text>Get document</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={downloadDocuments}>
        <Text>Download docs</Text>
      </TouchableOpacity>
      {/* <ScrollView> */}
        {/* { imagePath && <Image style={{width: 210, height: 297 * 3}} resizeMode='contain' source={{uri: `data:application/pdf;base64,${imagePath}`}}/> } */}
      {/* </ScrollView> */}
      <NewPDFViewer pdfPages={imagePaths || []}/>
    </>
  )
}

export default DashboardScreen;