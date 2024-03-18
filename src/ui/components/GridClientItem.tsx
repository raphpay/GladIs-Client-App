import React, { useEffect, useState } from 'react';
import {
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import IUser from '../../business-logic/model/IUser';
import DocumentService from '../../business-logic/services/DocumentService';
import { useAppSelector } from '../../business-logic/store/hooks';
import { RootState } from '../../business-logic/store/store';

import PlatformName from '../../business-logic/model/enums/PlatformName';
import { Colors } from '../assets/colors/colors';
import styles from '../assets/styles/components/FlatListClientItemStyles';

type GridClientItemProps = {
  client: IUser;
  onPress: (user: IUser) => void
};

function GridClientItem(props: GridClientItemProps): React.JSX.Element {

  const { client, onPress } = props;
  const [logoURI, setLogoURI] = useState<string>('');

  const { token } = useAppSelector((state: RootState) => state.tokens);

  const clientContainerStyles = () => {
    return {
      ...styles.clientContainer,
      backgroundColor: logoURI ? '' : Colors.primary,
    };
  }
  
  async function loadLogo() {
    const company = client.companyName as string;
    const docs = await DocumentService.getInstance().getDocumentsAtPath(`${company}/logos/`, token);
    const logo = docs[0];
    if (logo && logo.id) {
      const logoData = await DocumentService.getInstance().download(logo.id as string, token);
      Platform.OS == PlatformName.Mac ? setLogoURI(`data:image/png;base64,${logoData}`) :  setLogoURI(logoData);
    }
  }

  useEffect(() => {
    async function init() {
      await loadLogo();
    }
    init();
  }, []);

  return (
    <TouchableOpacity onPress={() => onPress(client)} style={clientContainerStyles()}>
        <View style={styles.clientLogo}>
          {
            logoURI && (
              <Image
                style={styles.logo}
                source={{uri: logoURI}}
              />
            )
          }
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.clientNameText}>{client.username}</Text>
        </View>
      </TouchableOpacity>
  );
}

export default GridClientItem;