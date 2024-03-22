import React, { useEffect, useState } from 'react';
import {
  Image,
  Platform,
  StyleProp,
  View,
  ViewStyle
} from 'react-native';

import PlatformName from '../../business-logic/model/enums/PlatformName';
import CacheService from '../../business-logic/services/CacheService';
import DocumentService from '../../business-logic/services/DocumentService';
import { useAppSelector } from '../../business-logic/store/hooks';
import { RootState } from '../../business-logic/store/store';

import styles from '../assets/styles/components/AppIconStyles';

type AppIconProps = {
  style?: StyleProp<ViewStyle>;
};

function AppIcon(props: AppIconProps): React.JSX.Element {

  const { style } = props;

  const [logoURI, setLogoURI] = useState<string>('');

  const { currentClient } = useAppSelector((state: RootState) => state.users);
  const { token } = useAppSelector((state: RootState) => state.tokens);

  async function loadLogoFromAPI() {
    if (currentClient) {
      const company = currentClient.companyName;
      const docs = await DocumentService.getInstance().getDocumentsAtPath(`${company}/logos/`, token);
      const logo = docs[0];
      if (logo && logo.id) {
        const logoData = await DocumentService.getInstance().download(logo.id, token);
        await CacheService.getInstance().storeValue(`${currentClient.id}/logo`, logoData)
        displayLogo(logoData);
      }
    } else {
      setLogoURI('');
    }
  }

  async function loadLogo() {
    if (currentClient) {
      const cachedLogo = await CacheService.getInstance().retrieveValue(`${currentClient.id}/logo`);
      if (cachedLogo) {
        displayLogo(cachedLogo as string);
      } else {
        await loadLogoFromAPI();
      }
    } else {
      setLogoURI('');
    }
  }

  async function displayLogo(data: string) {
    Platform.OS === PlatformName.Mac ? setLogoURI(`data:image/png;base64,${data}`) : setLogoURI(data);
  }

  useEffect(() => {
    async function init() {
      await loadLogo();
    }
    init();
  }, [currentClient]);

  return (
    <View style={[styles.container, style]}>
      {
        logoURI ? (
          <Image
            source={{uri: logoURI}}
            style={styles.logo}
          />
        ) : (
          <Image
            source={require('../assets/images/Logo-Gladis_Vertical-Couleur1-Fond-Transparent.png')}
            style={styles.image}
          />
        )
      }
    </View>
  );
}

export default AppIcon;