// src/Routes.tsx

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from 'react';

import AuthenticationResult from '../business-logic/model/AuthenticationResult';
import IPendingUser from '../business-logic/model/IPendingUser';
import NavigationRoutes from '../business-logic/model/enums/NavigationRoutes';
import AuthenticationService from '../business-logic/services/AuthenticationService';
import { useAppDispatch, useAppSelector } from '../business-logic/store/hooks';
import { removeToken, setToken } from '../business-logic/store/slices/tokenReducer';
import { setFirstConnection } from '../business-logic/store/slices/userReducer';
import { RootState } from '../business-logic/store/store';

import LoginScreen from '../ui/screens/authentification/LoginScreen';
import PasswordResetScreen from '../ui/screens/authentification/PasswordResetScreen';
import SignUpScreen from '../ui/screens/authentification/SignUpScreen';

import DashboardScreen from '../ui/screens/dashboard/DashboardScreen';
import FirstConnectionScreen from '../ui/screens/dashboard/FirstConnectionScreen';
import CategoriesScreen from '../ui/screens/documentManagement/CategoriesScreen';
import DocumentsScreen from '../ui/screens/documentManagement/DocumentsScreen';
import SubCategoryScreen from '../ui/screens/documentManagement/SubCategoryScreen';

import IModule from '../business-logic/model/IModule';
import ClientCreationScreen from '../ui/screens/clientManagement/ClientCreationScreen';
import PendingClientListScreen from '../ui/screens/clientManagement/PendingClientListScreen';

export type IRootStackParams = {
  // Login Stack
  LoginScreen: undefined
  SignUpScreen: undefined,
  PasswordResetScreen: undefined,
  // Dashboard Stack
  FirstConnectionScreen: undefined,
  DashboardScreen: undefined,
  CategoriesScreen: { module: IModule },
  SubCategoryScreen: { module: IModule, subCategory: string },
  DocumentsScreen: { module: IModule, subCategory: string, documents: string },
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
              name={NavigationRoutes.CategoriesScreen}
              component={CategoriesScreen}
              options={{headerShown: false}}
            />
            <RootStack.Screen
              name={NavigationRoutes.SubCategoryScreen}
              component={SubCategoryScreen}
              options={{headerShown: false}}
            />
            <RootStack.Screen
              name={NavigationRoutes.DocumentsScreen}
              component={DocumentsScreen}
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
        await AuthenticationService.getInstance()
          .checkAuthentication()
          .then((authResult: AuthenticationResult) => {
            setIsLoggedIn(!!authResult.token);
            dispatch(setFirstConnection(authResult.firstConnection));
            setIsFirstConnection(authResult.firstConnection);
            if (authResult.token != null) {
              dispatch(setToken(authResult.token));
            } else {
              dispatch(removeToken());
            }
          })
          .catch(() => {
            setIsLoggedIn(false);
          });
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
