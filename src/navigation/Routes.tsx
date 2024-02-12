// src/Routes.tsx

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from 'react';

import IToken from '../business-logic/model/IToken';
import AuthenticationService from '../business-logic/services/AuthenticationService';
import { useAppDispatch, useAppSelector } from '../business-logic/store/hooks';
import { removeToken, setToken } from '../business-logic/store/slices/tokenReducer';
import { RootState } from '../business-logic/store/store';

import LoginScreen from '../ui/screens/authentification/LoginScreen';
import PasswordResetScreen from '../ui/screens/authentification/PasswordResetScreen';
import SignUpScreen from '../ui/screens/authentification/SignUpScreen';

import DashboardScreen from '../ui/screens/dashboard/DashboardScreen';
import CategoriesScreen from '../ui/screens/documentManagement/CategoriesScreen';
import DocumentsScreen from '../ui/screens/documentManagement/DocumentsScreen';
import SubCategoryScreen from '../ui/screens/documentManagement/SubCategoryScreen';

export type IRootStackParams = {
  // Login Stack
  LoginScreen: undefined
  SignUpScreen: undefined,
  PasswordResetScreen: undefined,
  // Dashboard Stack
  DashboardScreen: undefined
  CategoriesScreen: { category: string },
  SubCategoryScreen: { subCategory: string }
  DocumentsScreen: { documents: string }
}

let RootStack = createStackNavigator<IRootStackParams>();

function LoginStack() {
  return (
    <>
      <RootStack.Screen 
        name='LoginScreen'
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <RootStack.Screen 
        name='SignUpScreen'
        component={SignUpScreen}
        options={{headerShown: false}}
      />
      <RootStack.Screen 
        name='PasswordResetScreen'
        component={PasswordResetScreen}
        options={{headerShown: false}}
      />
    </>
  )
}

function DashboardStack() {
  return (
    <>
      <RootStack.Screen
        name='DashboardScreen'
        component={DashboardScreen}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name={'CategoriesScreen'}
        component={CategoriesScreen}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name={'SubCategoryScreen'}
        component={SubCategoryScreen}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name={'DocumentsScreen'}
        component={DocumentsScreen}
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
        await AuthenticationService.getInstance()
          .checkAuthentication()
          .then((authToken: IToken | null) => {
            setIsLoggedIn(!!authToken);
            if (authToken != null) {
              dispatch(setToken(authToken));
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
            DashboardStack()
          ) : (
            LoginStack()
          )
        }
      </RootStack.Navigator>
    </NavigationContainer>
  )
}