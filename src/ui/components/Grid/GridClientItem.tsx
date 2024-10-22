import React, { useEffect, useState } from 'react';
import {
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import PlatformName from '../../../business-logic/model/enums/PlatformName';
import IUser from '../../../business-logic/model/IUser';
import DocumentServiceGet from '../../../business-logic/services/DocumentService/DocumentService.get';
import DocumentServicePost from '../../../business-logic/services/DocumentService/DocumentService.post';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import { Colors } from '../../assets/colors/colors';
import styles from '../../assets/styles/components/GridClientItemStyles';

type GridClientItemProps = {
  client: IUser;
  onPress: (user: IUser) => void
};

function GridClientItem(props: GridClientItemProps): React.JSX.Element {
  const { client, onPress } = props;
  const [logoURI, setLogoURI] = useState<string>('');

  const { token } = useAppSelector((state: RootState) => state.tokens);
  const gladisLogo = require('../../assets/images/Logo-Gladis_Vertical-Couleur1-Fond-Transparent_Square.png')

  const clientContainerStyles = () => ({
    ...styles.container,
    backgroundColor: logoURI ? 'white' : Colors.inactive,
  });

  async function loadLogo() {
    const company = client.companyName as string;
    const docs = await DocumentServicePost.getDocumentsAtPath(`${company}/logos/`, token);
    const logo = docs[0];
    if (logo && logo.id) {
      const logoData = await DocumentServiceGet.download(logo.id as string, token);
      Platform.OS == PlatformName.Mac ? setLogoURI(`data:image/png;base64,${logoData}`) : setLogoURI(logoData);
    }
  }

  useEffect(() => {
    loadLogo();
  }, []);

  return (
    <TouchableOpacity onPress={() => onPress(client)} style={clientContainerStyles()}>
      <View style={styles.blueBox}>
        {logoURI ? (
          <Image
            style={styles.logo}
            source={{uri: logoURI}}
            resizeMode="cover"
          />
        ) : (
          <Image
            source={gladisLogo}
            style={styles.gladisLogo}
          />
        )}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">{client.firstName}</Text>
        <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">{client.lastName}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default GridClientItem;