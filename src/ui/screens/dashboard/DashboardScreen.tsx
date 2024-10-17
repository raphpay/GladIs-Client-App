import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { IRootStackParams } from '../../../navigation/Routes';

import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import { Image, Platform, Text, TextInput, TouchableOpacity } from 'react-native';
import PlatformName from '../../../business-logic/model/enums/PlatformName';
import FinderModule from '../../../business-logic/modules/FinderModule';
import IFile, { INewFile } from '../../../business-logic/model/IFile';
import DocumentServicePost from '../../../business-logic/services/DocumentService/DocumentService.post';
import { IDocumentActivityLogInput } from '../../../business-logic/model/IDocumentActivityLog';
import DocumentLogAction from '../../../business-logic/model/enums/DocumentLogAction';
import DocumentActivityLogsService from '../../../business-logic/services/DocumentActivityLogsService';
import {NativeModules} from 'react-native';
import DocumentServiceGet from '../../../business-logic/services/DocumentService/DocumentService.get';
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
  const [imagePath, setImagePath] = useState<string>('');

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

  return (
    <>
      <TouchableOpacity onPress={pickAFile}>
        <Text>Pick PDF File Path</Text>
      </TouchableOpacity>
      {/* <TextInput
        value={documentID}
        onChangeText={setDocumentID}
      /> */}
    </>
  )
}

export default DashboardScreen;