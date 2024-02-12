// src/Routes.tsx

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from 'react';

import AuthenticationResult from '../business-logic/model/AuthenticationResult';
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

export type IRootStackParams = {
  // Login Stack
  LoginScreen: undefined
  SignUpScreen: undefined,
  PasswordResetScreen: undefined,
  // Dashboard Stack
  FirstConnectionScreen: undefined,
  DashboardScreen: undefined,
  CategoriesScreen: { category: string },
  SubCategoryScreen: { category: string, subCategory: string },
  DocumentsScreen: { category: string, subCategory: string, documents: string },
}

let RootStack = createStackNavigator<IRootStackParams>();

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
      />
      <RootStack.Screen 
        name={NavigationRoutes.PasswordResetScreen}
        component={PasswordResetScreen}
      />
    </>
  )
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
  const dispatch = useAppDispatch();

  useEffect(() => {
    setIsLoggedIn(!!token);
  }, [token]);

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
