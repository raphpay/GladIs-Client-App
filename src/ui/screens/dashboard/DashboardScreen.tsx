import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';

import { IDashboardStackParams } from '../../../navigation/Routes';

type DashboardScreenProps = NativeStackScreenProps<IDashboardStackParams, 'DashboardScreen'>;

function DashboardScreen(props: DashboardScreenProps): any {

  const { navigation } = props;
  const { isAdmin, isFirstConnection, temporaryPassword } = props.route.params;

  useEffect(() => {
    if (isFirstConnection) {
      navigation.navigate('FirstConnectionScreen', { isAdmin, temporaryPassword })
    } else {
      if (isAdmin) {
        // TODO: Create constants
        navigation.navigate('DashboardAdminScreen', { isAdmin })
      } else {
        navigation.navigate('DashboardClientScreen', { isAdmin })
      }
    }
  }, []);


}

export default DashboardScreen;