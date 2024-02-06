// src/Routes.tsx

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import React from 'react';
import { useTranslation } from 'react-i18next';

import LoginScreen from '../ui/screens/LoginScreen';
import SignUpScreen from '../ui/screens/SignUpScreen';

import DashboardAdminScreen from '../ui/screens/dashboard/DashboardAdminScreen';
import DashboardClientScreen from '../ui/screens/dashboard/DashboardClientScreen';
import DashboardScreen from '../ui/screens/dashboard/DashboardScreen';

import CategoriesScreen from '../ui/screens/CategoriesScreen';
import DocumentsScreen from '../ui/screens/DocumentsScreen';
import PasswordResetScreen from '../ui/screens/PasswordResetScreen';
import SubCategoryScreen from '../ui/screens/SubCategoryScreen';

export type IRootStackParams = {
  Home: undefined,
  DashboardStack: { isAdmin: boolean }
}

export type ILoginStackParams = {
  LoginScreen: undefined,
  SignUpScreen: undefined,
  PasswordResetScreen: { identifier: string },
  DashboardStack: IDashboardStackParams,
}

export type IDashboardStackParams = {
  DashboardScreen: { isAdmin: boolean },
  DashboardAdminScreen: { isAdmin: boolean },
  DashboardClientScreen: { isAdmin: boolean },
  CategoriesScreen: { isAdmin: boolean, category: string },
  SubCategoryScreen: { isAdmin: boolean, category: string, subCategory: string },
  DocumentsScreen: { isAdmin: boolean, category: string, subCategory: string, documents: string },
}

let HomeStack = createStackNavigator<ILoginStackParams>();
let RootStack = createStackNavigator<IRootStackParams>();
let DashboardStack = createStackNavigator<IDashboardStackParams>();

function Home() {
  const { t } = useTranslation();

  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name={'LoginScreen'}
        component={LoginScreen}
        options={{
          headerShown: false
        }}
      />
      <HomeStack.Screen
        name={'SignUpScreen'}
        component={SignUpScreen}
        options={{
          title: t('quotation.title')
        }}
      />
      <HomeStack.Screen
        name={'PasswordResetScreen'}
        component={PasswordResetScreen}
        options={{
          title: t('passwordReset.title')
        }}
      />
    </HomeStack.Navigator>
  )
}

function Dashboard() {
  return (
    <DashboardStack.Navigator>
      <DashboardStack.Screen
        name={'DashboardScreen'}
        component={DashboardScreen}
        options={{
          headerShown: false
        }}
      />
      <DashboardStack.Screen
        name={'DashboardAdminScreen'}
        component={DashboardAdminScreen}
        options={{
          headerShown: false
        }}
      />
      <DashboardStack.Screen
        name={'DashboardClientScreen'}
        component={DashboardClientScreen}
        options={{
          headerShown: false
        }}
      />
      <DashboardStack.Screen
        name={'CategoriesScreen'}
        component={CategoriesScreen}
        options={{
          headerShown: false
        }}
      />
      <DashboardStack.Screen
        name={'SubCategoryScreen'}
        component={SubCategoryScreen}
        options={{
          headerShown: false
        }}
      />
      <DashboardStack.Screen
        name={'DocumentsScreen'}
        component={DocumentsScreen}
        options={{
          headerShown: false
        }}
      />
    </DashboardStack.Navigator>
  )
}

export let Routes = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen
            name="Home"
            component={Home}
            options={{
              headerShown: false
            }}
          />
          <RootStack.Screen
            name="DashboardStack"
            component={Dashboard}
            options={{
              headerShown: false
            }}
          />
      </RootStack.Navigator>
    </NavigationContainer>
  )
}