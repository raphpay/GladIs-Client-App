import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { IRootStackParams } from '../../../navigation/Routes';

import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import { Platform, Text, TouchableOpacity } from 'react-native';
import PlatformName from '../../../business-logic/model/enums/PlatformName';
import FinderModule from '../../../business-logic/modules/FinderModule';
import IFile, { INewFile } from '../../../business-logic/model/IFile';
import DocumentServicePost from '../../../business-logic/services/DocumentService/DocumentService.post';
import { IDocumentActivityLogInput } from '../../../business-logic/model/IDocumentActivityLog';
import DocumentLogAction from '../../../business-logic/model/enums/DocumentLogAction';
import DocumentActivityLogsService from '../../../business-logic/services/DocumentActivityLogsService';

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

  async function pickAFile() {
    const filename = 'test.pdf';
    let filePath: string = '';
    filePath = await FinderModule.getInstance().pickPDFFilePath();
    console.log("filePath", filePath);
    await uploadFileToAPI(filePath, filename);
    // try {
    //   const file: IFile = { data, filename: filename}
    //   const createdDocument = await DocumentServicePost.upload(file, filename, 'test/path/', token);
    //   const logInput: IDocumentActivityLogInput = {
    //     action: DocumentLogAction.Creation,
    //     actorIsAdmin: true,
    //     actorID: currentUser?.id as string,
    //     clientID: currentClient?.id as string,
    //     documentID: createdDocument.id,
    //   }
    //   await DocumentActivityLogsService.getInstance().recordLog(logInput, token);
    // } catch (error) {
    //     console.log('error loading file')
    // }
  }

  const uploadFileToAPI = async (filePath: string, fileName: string) => {
    // const formData = new FormData();
    // formData.append('file', {
    //   uri: filePath,
    //   type: 'application/octet-stream', // Adjust the type based on your file
    //   name: fileName, 
    // });
  
    try {
      console.log("uploadFileToAPI", filePath);
      // const newFile: INewFile = {
      //   uri: filePath,
      //   type: 'application/octet-stream', // Adjust the type based on your file
      //   name: fileName, // Change the name accordingly
      // };
      const createdDocument = await DocumentServicePost.uploadNewFile(fileName, filePath, token);
      console.log("createdDocument", createdDocument);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <TouchableOpacity onPress={pickAFile}>
      <Text>Pick PDF File Path</Text>
    </TouchableOpacity>
  )
}

export default DashboardScreen;