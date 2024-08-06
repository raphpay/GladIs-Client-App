import React, { useEffect, useState } from 'react';
import {
  Image,
  Platform,
  StyleProp,
  Text,
  View,
  ViewStyle
} from 'react-native';

import IDocument from '../../business-logic/model/IDocument';
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
  const [showClientName, setShowClientName] = useState<boolean>(false);

  const { currentClient, currentUser } = useAppSelector((state: RootState) => state.users);
  const { token } = useAppSelector((state: RootState) => state.tokens);

  const gladisLogo = require('../assets/images/Logo-Gladis_Vertical-Couleur1-Fond-Transparent_Square.png')
  const androidLogoStyles = Platform.OS === PlatformName.Android && styles.androidLogo;;

  // Async Methods
  async function getLogoDocument(): Promise<IDocument | undefined> {
    if (currentClient) {
      const company = currentClient.companyName;
      const docs = await DocumentService.getInstance().getDocumentsAtPath(`${company}/logos/`, token);
      const logo = docs[0];
      return logo;
    }
  }
  
  async function loadLogoFromAPI() {
    const logoDoc = await getLogoDocument();
    if (logoDoc) {
      const logoData = await DocumentService.getInstance().download(logoDoc.id, token);
      await CacheService.getInstance().storeValue(`${currentClient?.id}/logo`, logoData)
      await CacheService.getInstance().storeValue(`${currentClient?.id}/logo-lastModified`, logoDoc.lastModified);
      displayLogo(logoData);
    } else {
      setLogoURI('');
    }
  }

  async function loadLogo() {
    if (currentClient) {
      const cachedLastModified = await CacheService.getInstance().retrieveValue(`${currentClient.id}/logo-lastModified`);
      const logoDoc = await getLogoDocument();
      if (logoDoc) {
        if (logoDoc.lastModified === cachedLastModified) {
          const cachedLogo = await CacheService.getInstance().retrieveValue(`${currentClient.id}/logo`);
          if (cachedLogo) {
            displayLogo(cachedLogo as string);
          } else {
            await loadLogoFromAPI();
          }
        } else {
          await loadLogoFromAPI();
        }
      } else {
        setLogoURI('');
      }
    } else {
      setLogoURI('');
    }
  }

  async function displayLogo(data: string) {
    Platform.OS === PlatformName.Mac ? setLogoURI(`data:image/png;base64,${data}`) : setLogoURI(data);
  }

  // Lifecycle Methods
  useEffect(() => {
    async function init() {
      await loadLogo();
      setShowClientName(currentClient !== currentUser);
    }
    init();
  }, [currentClient]);

  // Component
  return (
    <View style={[styles.container, style]}>
      <View style={styles.imageContainer}>
        {
          logoURI ? (
            <Image
              source={{uri: logoURI}}
              style={[styles.logo, androidLogoStyles]}
            />
          ) : (
            <Image
              source={gladisLogo}
              style={[styles.image, androidLogoStyles]}
            />
          )
        }
      </View>
      {
        currentClient && showClientName && (
          <>
            <Text style={[styles.clientName, { paddingTop: 4 }]}>{currentClient.firstName}</Text>
            <Text style={styles.clientName}>{currentClient.lastName}</Text>
          </>
        )
      }
    </View>
  );
}

export default AppIcon;