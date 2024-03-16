// src/Routes.tsx

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from 'react';

import IArea from '../business-logic/model/IArea';
import IDocument from '../business-logic/model/IDocument';
import IPendingUser from '../business-logic/model/IPendingUser';
import NavigationRoutes from '../business-logic/model/enums/NavigationRoutes';
import UserType from '../business-logic/model/enums/UserType';
import AuthenticationService from '../business-logic/services/AuthenticationService';
import UserService from '../business-logic/services/UserService';
import { useAppDispatch, useAppSelector } from '../business-logic/store/hooks';
import { removeToken, setToken } from '../business-logic/store/slices/tokenReducer';
import { removeCurrentClient, removeCurrentUser, setCurrentClient, setCurrentUser } from '../business-logic/store/slices/userReducer';
import { RootState } from '../business-logic/store/store';

import LoginScreen from '../ui/screens/authentification/LoginScreen';
import SignUpScreen from '../ui/screens/authentification/SignUpScreen';

import DashboardScreen from '../ui/screens/dashboard/DashboardScreen';
// Document Management
import DocumentManagementScreen from '../ui/screens/documentManagement/DocumentManagementScreen';
import DocumentsScreen from '../ui/screens/documentManagement/DocumentsScreen';
import PDFScreen from '../ui/screens/documentManagement/PDFScreen';
import ProcessesScreen from '../ui/screens/documentManagement/ProcessesScreen';
import SystemQualityScreen from '../ui/screens/documentManagement/SystemQualityScreen';
import TechnicalDocAreaScreen from '../ui/screens/documentManagement/TechnicalDocAreaScreen';
import TechnicalDocumentationScreen from '../ui/screens/documentManagement/TechnicalDocumentationScreen';
// Tracking
import TrackingScreen from '../ui/screens/tracking/TrackingScreen';
// Client Creation
import ClientCreationScreen from '../ui/screens/clientManagement/ClientCreationScreen';
import PendingClientListScreen from '../ui/screens/clientManagement/PendingClientListScreen';
import ClientDashboardScreenFromAdmin from '../ui/screens/dashboard/ClientDashboardScreenFromAdmin';
// Client Management
import ClientEmployees from '../ui/screens/settings/ClientEmployees';
import ClientModules from '../ui/screens/settings/ClientModules';
import ClientSettingsScreenFromAdmin from '../ui/screens/settings/ClientSettingsScreenFromAdmin';
// Settings
import SettingsScreen from '../ui/screens/settings/SettingsScreen';

export type IRootStackParams = {
  // Login Stack
  LoginScreen: undefined
  SignUpScreen: undefined,
  // Dashboard Stack
  DashboardScreen: undefined,
  ClientDashboardScreenFromAdmin: undefined,
  // Document Management
  DocumentManagementScreen: undefined,
  SystemQualityScreen: undefined,
  TechnicalDocumentationScreen: undefined,
  TechnicalDocAreaScreen: { area: IArea },
  ProcessesScreen: { processNumber: number },
  DocumentsScreen: {
    previousScreen: string,
    currentScreen: string,
    documentsPath: string,
    processNumber: number | undefined,
    hideModulesRoute?: boolean,
  },
  PDFScreen: { documentInput: IDocument },
  // Tracking
  TrackingScreen: undefined,
  // Settings
  SettingsScreen: undefined,
}

export type IClientCreationStack = {
  // Client Creation
  ClientCreationStack: undefined;
  PendingClientListScreen: undefined;
  ClientCreationScreen: { pendingUser?: IPendingUser | null, loadPendingUsers: () => Promise<void>;};
}

export type IClientManagementParams = {
  ClientManagementStack: undefined,
  ClientSettingsScreenFromAdmin: undefined,
  ClientEmployees: undefined,
  ClientModules: undefined,
}

let RootStack = createStackNavigator<IRootStackParams>();
let ClientCreationStack = createStackNavigator<IClientCreationStack>();
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
    </>
  )
}

function ClientCreation() {
  return (
    <ClientCreationStack.Navigator>
      <ClientCreationStack.Screen
        name={NavigationRoutes.PendingClientListScreen}
        component={PendingClientListScreen}
        options={{headerShown: false}}
      />
      <ClientCreationStack.Screen
        name={NavigationRoutes.ClientCreationScreen}
        component={ClientCreationScreen}
        options={{headerShown: false}}
      />
    </ClientCreationStack.Navigator>
  );
}

function ClientManagement() {
  return (
    <ClientManagementStack.Navigator>
      <ClientManagementStack.Screen
        name={NavigationRoutes.ClientSettingsScreenFromAdmin}
        component={ClientSettingsScreenFromAdmin}
        options={{headerShown: false}}
      />
      <ClientManagementStack.Screen
        name={NavigationRoutes.ClientEmployees}
        component={ClientEmployees}
        options={{headerShown: false}}
      />
      <ClientManagementStack.Screen
        name={NavigationRoutes.ClientModules}
        component={ClientModules}
        options={{headerShown: false}}
      />
    </ClientManagementStack.Navigator>
  );
}

function DashboardStack() {
  return (
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
        name={NavigationRoutes.TechnicalDocumentationScreen}
        component={TechnicalDocumentationScreen}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name={NavigationRoutes.TechnicalDocAreaScreen}
        component={TechnicalDocAreaScreen}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name={NavigationRoutes.ProcessesScreen}
        component={ProcessesScreen}
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
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name={NavigationRoutes.TrackingScreen}
        component={TrackingScreen}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name={NavigationRoutes.SettingsScreen}
        component={SettingsScreen}
        options={{headerShown: false}}
      />
      <ClientCreationStack.Screen
        name={NavigationRoutes.ClientCreationStack}
        component={ClientCreation}
        options={{headerShown: false}}
      />
      <ClientManagementStack.Screen
        name={NavigationRoutes.ClientManagementStack}
        component={ClientManagement}
        options={{headerShown: false}}
      />
    </>
  )
}

export let Routes = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const { token } = useAppSelector((state: RootState) => state.tokens);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setIsLoggedIn(!!token);
  }, [token]);


  useEffect(() => {
    async function init() {
      if (token == null) {
        try {
          const token = await AuthenticationService.getInstance().checkAuthentication();
          setIsLoggedIn(!!token);
          if (token != null) {
            dispatch(setToken(token));
            const currentUser = await UserService.getInstance().getUserByID(token.user.id, token);
            dispatch(setCurrentUser(currentUser));
            if (currentUser.userType !== UserType.Admin) {
              dispatch(setCurrentClient(currentUser));
            }
          } else {
            dispatch(removeToken());
            dispatch(removeCurrentUser());
            dispatch(removeCurrentClient());
          }
        } catch (error) {
          console.log('User not authenticated', error);
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
            DashboardStack()
          ) : (
            LoginStack()
          )
        }
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
