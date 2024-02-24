// src/Routes.tsx

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from 'react';

import { IDocument } from '../business-logic/model/IModule';
import IPendingUser from '../business-logic/model/IPendingUser';
import NavigationRoutes from '../business-logic/model/enums/NavigationRoutes';
import UserType from '../business-logic/model/enums/UserType';
import AuthenticationService from '../business-logic/services/AuthenticationService';
import UserService from '../business-logic/services/UserService';
import { useAppDispatch, useAppSelector } from '../business-logic/store/hooks';
import { removeToken, setToken } from '../business-logic/store/slices/tokenReducer';
import { removeCurrentClient, removeCurrentUser, setCurrentClient, setCurrentUser, setFirstConnection } from '../business-logic/store/slices/userReducer';
import { RootState } from '../business-logic/store/store';

import LoginScreen from '../ui/screens/authentification/LoginScreen';
import PasswordResetScreen from '../ui/screens/authentification/PasswordResetScreen';
import SignUpScreen from '../ui/screens/authentification/SignUpScreen';

import DashboardScreen from '../ui/screens/dashboard/DashboardScreen';
import FirstConnectionScreen from '../ui/screens/dashboard/FirstConnectionScreen';
import DocumentManagementScreen from '../ui/screens/documentManagement/DocumentManagementScreen';
import DocumentsScreen from '../ui/screens/documentManagement/DocumentsScreen';
import PDFScreen from '../ui/screens/documentManagement/PDFScreen';
import ProcessusScreen from '../ui/screens/documentManagement/ProcessusScreen';
import SystemQualityScreen from '../ui/screens/documentManagement/SystemQualityScreen';

import ClientCreationScreen from '../ui/screens/clientManagement/ClientCreationScreen';
import PendingClientListScreen from '../ui/screens/clientManagement/PendingClientListScreen';
import ClientDashboardScreenFromAdmin from '../ui/screens/dashboard/ClientDashboardScreenFromAdmin';

export type IRootStackParams = {
  // Login Stack
  LoginScreen: undefined
  SignUpScreen: undefined,
  PasswordResetScreen: undefined,
  // Dashboard Stack
  FirstConnectionScreen: undefined,
  DashboardScreen: undefined,
  ClientDashboardScreenFromAdmin: undefined,
  DocumentManagementScreen: undefined,
  SystemQualityScreen: undefined,
  ProcessusScreen: { processusNumber: number },
  DocumentsScreen: { previousScreen: string, currentScreen: string },
  PDFScreen: { documentInput: IDocument },
}

export type IClientManagementParams = {
  // Client Creation
  ClientManagementStack: undefined;
  PendingClientListScreen: undefined;
  ClientCreationScreen: { pendingUser?: IPendingUser | null};
}

let RootStack = createStackNavigator<IRootStackParams>();
let ClientManagementStack = createStackNavigator<IClientManagementParams>();

function LoginStack() {
  return (
    <>
      <RootStack.Screen 
        name={NavigationRoutes.LoginScreen}
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <RootStack.Screen 
        name={NavigationRoutes.SignUpScreen}
        component={SignUpScreen}
        options={{headerShown: false}}
      />
      <RootStack.Screen 
        name={NavigationRoutes.PasswordResetScreen}
        component={PasswordResetScreen}
        options={{headerShown: false}}
      />
    </>
  )
}

function ClientManagement() {
  return (
    <ClientManagementStack.Navigator>
      <ClientManagementStack.Screen
        name={NavigationRoutes.PendingClientListScreen}
        component={PendingClientListScreen}
        options={{headerShown: false}}
      />
      <ClientManagementStack.Screen
        name={NavigationRoutes.ClientCreationScreen}
        component={ClientCreationScreen}
        options={{headerShown: false}}
      />
    </ClientManagementStack.Navigator>
  );
}

function DashboardStack(firstConnection: boolean) {
  return (
    <>
      {
        firstConnection ? (
          <RootStack.Screen
            name={NavigationRoutes.FirstConnectionScreen}
            component={FirstConnectionScreen}
            options={{headerShown: false}}
          />
        ) : (
          <>
            <RootStack.Screen
              name={NavigationRoutes.DashboardScreen}
              component={DashboardScreen}
              options={{headerShown: false}}
            />
            <RootStack.Screen
              name={NavigationRoutes.ClientDashboardScreenFromAdmin}
              component={ClientDashboardScreenFromAdmin}
              options={{headerShown: false}}
            />
            <RootStack.Screen
              name={NavigationRoutes.DocumentManagementScreen}
              component={DocumentManagementScreen}
              options={{headerShown: false}}
            />
            <RootStack.Screen
              name={NavigationRoutes.SystemQualityScreen}
              component={SystemQualityScreen}
              options={{headerShown: false}}
            />
            <RootStack.Screen
              name={NavigationRoutes.ProcessusScreen}
              component={ProcessusScreen}
              options={{headerShown: false}}
            />
            <RootStack.Screen
              name={NavigationRoutes.DocumentsScreen}
              component={DocumentsScreen}
              options={{headerShown: false}}
            />
            <RootStack.Screen
              name={NavigationRoutes.PDFScreen}
              component={PDFScreen}
            />
            <ClientManagementStack.Screen
              name={NavigationRoutes.ClientManagementStack}
              component={ClientManagement}
              options={{headerShown: false}}
            />
          </>
        )
      }
    </>
  )
}

export let Routes = () => {

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isFirstConnection, setIsFirstConnection] = useState<boolean>(false);

  const { token } = useAppSelector((state: RootState) => state.tokens);
  const { firstConnection } = useAppSelector((state: RootState) => state.users);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setIsLoggedIn(!!token);
  }, [token]);

  useEffect(() => {
     setIsFirstConnection(firstConnection)
  }, [firstConnection]);

  useEffect(() => {
    async function init() {
      if (token == null) {
        const authResult = await AuthenticationService.getInstance().checkAuthentication();
        setIsLoggedIn(!!authResult.token);
        dispatch(setFirstConnection(authResult.firstConnection));
        setIsFirstConnection(authResult.firstConnection);
        if (authResult.token != null) {
          dispatch(setToken(authResult.token));
          const currentUser = await UserService.getInstance().getUserByID(authResult.token.user.id, authResult.token);
          dispatch(setCurrentUser(currentUser));
          if (currentUser.userType !== UserType.Admin) {
            dispatch(setCurrentClient(currentUser));
          }
        } else {
          dispatch(removeToken());
          dispatch(removeCurrentUser());
          dispatch(removeCurrentClient());
        }
      }
    }
    init();
  }, []);

  return (
    <NavigationContainer>
      <RootStack.Navigator>
        {
          isLoggedIn ? (
            DashboardStack(isFirstConnection)
          ) : (
            LoginStack()
          )
        }
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
