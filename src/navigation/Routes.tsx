// src/Routes.tsx

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from 'react';

import IArea from '../business-logic/model/IArea';
import IDocument from '../business-logic/model/IDocument';
import IForm from '../business-logic/model/IForm';
import IPendingUser from '../business-logic/model/IPendingUser';
import NavigationRoutes from '../business-logic/model/enums/NavigationRoutes';
import UserType from '../business-logic/model/enums/UserType';
import AuthenticationService from '../business-logic/services/AuthenticationService';
import UserService from '../business-logic/services/UserService';
import { useAppDispatch, useAppSelector } from '../business-logic/store/hooks';
import { removeToken, setToken } from '../business-logic/store/slices/tokenReducer';
import { removeCurrentClient, removeCurrentUser, setCurrentClient, setCurrentUser, setIsAdmin } from '../business-logic/store/slices/userReducer';
import { RootState } from '../business-logic/store/store';

import LoginScreen from '../ui/screens/authentification/LoginScreen';
import SignUpScreen from '../ui/screens/authentification/SignUpScreen';

import DashboardScreen from '../ui/screens/dashboard/DashboardScreen';
// Document Management
import DocumentManagementScreen from '../ui/screens/documentManagement/DocumentManagementScreen';
import DocumentsScreen from '../ui/screens/documentManagement/DocumentScreen/DocumentsScreen';
import PDFScreen from '../ui/screens/documentManagement/PDFScreen';
import ProcessesScreen from '../ui/screens/documentManagement/ProcessesScreen';
import SystemQualityScreen from '../ui/screens/documentManagement/SystemQualityScreen';
import TechnicalDocAreaScreen from '../ui/screens/documentManagement/TechnicalDocAreaScreen';
import TechnicalDocumentationScreen from '../ui/screens/documentManagement/TechnicalDocumentationScreen';
// Tracking
import TrackingScreen from '../ui/screens/tracking/TrackingScreen';
// Client Creation
import AdminCreationScreen from '../ui/screens/clientManagement/AdminCreationScreen';
import ClientCreationScreen from '../ui/screens/clientManagement/ClientCreationScreen';
import PendingClientListScreen from '../ui/screens/clientManagement/PendingClientListScreen';
import ClientDashboardScreenFromAdmin from '../ui/screens/dashboard/ClientDashboardScreenFromAdmin';
// Client Management
import ClientEmployees from '../ui/screens/settings/ClientEmployees';
import ClientModules from '../ui/screens/settings/ClientModules';
import ClientSettingsScreenFromAdmin from '../ui/screens/settings/ClientSettingsScreenFromAdmin';
// Settings
import SettingsScreen from '../ui/screens/settings/SettingsScreen';
// Reminders
import RemindersScreen from '../ui/screens/reminders/RemindersScreen';
// Password Reset
import PasswordResetScreen from '../ui/screens/dashboard/PasswordResetScreen';
// Survey
import SurveysScreen from '../ui/screens/dashboard/SurveysScreen';
// Chat
import MessagesScreen from '../ui/screens/chat/MessagesScreen';
// SMQ Survey
import SMQGeneralScreen from '../ui/screens/smqSurvey/SMQGeneral/SMQGeneralScreen';
// Forms
import FormEditionScreen from '../ui/screens/documentManagement/Forms/FormEditionScreen';
import FormsDocumentScreen from '../ui/screens/documentManagement/Forms/FormsDocumentScreen';

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
    showGenerateSMQButton?: boolean,
  },
  PDFScreen: { documentInput: IDocument },
  // Tracking
  TrackingScreen: undefined,
  // Settings
  SettingsScreen: undefined,
  // Reminders
  RemindersScreen: undefined,
  // Password Reset
  PasswordResetScreen: undefined,
  // Chat
  MessagesScreen: undefined,
  // SMQ Surveys
  SurveysScreen: undefined,
  // Forms
  FormsDocumentScreen: { documentPath: string },
  FormEditionScreen: { form? : IForm, documentPath: string },
}

export type IClientCreationStack = {
  // Client Creation
  ClientCreationStack: undefined;
  PendingClientListScreen: undefined;
  ClientCreationScreen: { pendingUser?: IPendingUser | null };
  AdminCreationScreen: undefined;
}

export type IClientManagementParams = {
  ClientManagementStack: undefined,
  ClientSettingsScreenFromAdmin: undefined,
  ClientEmployees: undefined,
  ClientModules: undefined,
}

export type ISMQSurveyParams = {
  SMQGeneralScreen: undefined,
  SMQRegulatoryAffairsScreen: undefined,
}

let RootStack = createStackNavigator<IRootStackParams>();
let ClientCreationStack = createStackNavigator<IClientCreationStack>();
let ClientManagementStack = createStackNavigator<IClientManagementParams>();
let SMQSurveyStack = createStackNavigator<ISMQSurveyParams>();

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
      <ClientCreationStack.Screen
        name={NavigationRoutes.AdminCreationScreen}
        component={AdminCreationScreen}
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

function SMQSurvey() {
  return (
    <SMQSurveyStack.Navigator>
      <SMQSurveyStack.Screen
        name={NavigationRoutes.SMQGeneralScreen}
        component={SMQGeneralScreen}
        options={{headerShown: false}}
      />
    </SMQSurveyStack.Navigator>
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
      <RootStack.Screen
        name={NavigationRoutes.RemindersScreen}
        component={RemindersScreen}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name={NavigationRoutes.PasswordResetScreen}
        component={PasswordResetScreen}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name={NavigationRoutes.MessagesScreen}
        component={MessagesScreen}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name={NavigationRoutes.SurveysScreen}
        component={SurveysScreen}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name={NavigationRoutes.FormsDocumentScreen}
        component={FormsDocumentScreen}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name={NavigationRoutes.FormEditionScreen}
        component={FormEditionScreen}
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
      <SMQSurveyStack.Screen
        name={NavigationRoutes.SMQSurveyStack}
        component={SMQSurvey}
        options={{headerShown: false}}
      />
    </>
  )
}

export let Routes = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const { token } = useAppSelector((state: RootState) => state.tokens);
  const dispatch = useAppDispatch();

  async function checkAuthentication() {
    if (token == null) {
      try {
        const token = await AuthenticationService.getInstance().checkAuthentication();
        setIsLoggedIn(!!token);
        if (token != null) {
          dispatch(setToken(token));
          const currentUser = await UserService.getInstance().getUserByID(token.user.id, token);
          dispatch(setCurrentUser(currentUser));
          dispatch(setIsAdmin(currentUser.userType === UserType.Admin));
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

  useEffect(() => {
    setIsLoggedIn(!!token);
  }, [token]);

  useEffect(() => {
    async function init() {
      await checkAuthentication(); 
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
