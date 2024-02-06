import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';

import { IDashboardStackParams } from '../../../navigation/Routes';

type DashboardScreenProps = NativeStackScreenProps<IDashboardStackParams, 'DashboardScreen'>;

function DashboardScreen(props: DashboardScreenProps): any {

  const { params } = props.route;

  useEffect(() => {
    if (params.isAdmin) {
      // TODO: Create constants
      props.navigation.navigate('DashboardAdminScreen', { isAdmin: true })
    } else {
      props.navigation.navigate('DashboardClientScreen', { isAdmin: false })
    }
  }, []);
}

export default DashboardScreen;