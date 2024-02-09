// src/Routes.tsx

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import React from 'react';
import { useTranslation } from 'react-i18next';

import LoginScreen from '../ui/screens/authentification/LoginScreen';
import PasswordResetScreen from '../ui/screens/authentification/PasswordResetScreen';
import SignUpScreen from '../ui/screens/authentification/SignUpScreen';

import DashboardAdminScreen from '../ui/screens/dashboard/DashboardAdminScreen';
import DashboardClientScreen from '../ui/screens/dashboard/DashboardClientScreen';

import AdminFirstConnectionScreen from '../ui/screens/dashboard/AdminFirstConnectionScreen';
import ClientFirstConnectionScreen from '../ui/screens/dashboard/ClientFirstConnectionScreen';
import CategoriesScreen from '../ui/screens/documentManagement/CategoriesScreen';
import DocumentsScreen from '../ui/screens/documentManagement/DocumentsScreen';
import SubCategoryScreen from '../ui/screens/documentManagement/SubCategoryScreen';

export type IRootStackParams = {
  Home: undefined,
  AdminDashboardStack: IAdminDashboardStackParams,
  ClientDashboardStack: IClientDashboardStackParams,
}

export type IAuthenticationStackParams = {
  LoginScreen: undefined,
  SignUpScreen: undefined,
  PasswordResetScreen: undefined,
  AdminDashboardStack: IAdminDashboardStackParams,
  ClientDashboardStack: IClientDashboardStackParams,
}

export type IAdminDashboardStackParams = {
  DashboardAdminScreen: undefined,
  AdminFirstConnectionScreen: { temporaryPassword: string},
  CategoriesScreen: { isAdmin: boolean, category: string },
  SubCategoryScreen: { isAdmin: boolean, category: string, subCategory: string },
  DocumentsScreen: { isAdmin: boolean, category: string, subCategory: string, documents: string },
}

export type IClientDashboardStackParams = {
  DashboardClientScreen: undefined,
  ClientFirstConnectionScreen: { isAdmin: boolean, temporaryPassword?: string},
  CategoriesScreen: { isAdmin: boolean, category: string },
  SubCategoryScreen: { isAdmin: boolean, category: string, subCategory: string },
  DocumentsScreen: { isAdmin: boolean, category: string, subCategory: string, documents: string },
}

let AuthenticationStack = createStackNavigator<IAuthenticationStackParams>();
let RootStack = createStackNavigator<IRootStackParams>();
let AdminDashboardStack = createStackNavigator<IAdminDashboardStackParams>();
let ClientDashboardStack = createStackNavigator<IClientDashboardStackParams>();

function Home() {
  const { t } = useTranslation();

  return (
    <AuthenticationStack.Navigator>
      <AuthenticationStack.Screen
        name={'LoginScreen'}
        component={LoginScreen}
        options={{
          headerShown: false
        }}
      />
      <AuthenticationStack.Screen
        name={'SignUpScreen'}
        component={SignUpScreen}
        options={{
          title: t('quotation.title')
        }}
      />
      <AuthenticationStack.Screen
        name={'PasswordResetScreen'}
        component={PasswordResetScreen}
        options={{
          title: t('passwordReset.title')
        }}
      />
    </AuthenticationStack.Navigator>
  )
}

function AdminDashboard() {
  return (
    <AdminDashboardStack.Navigator>
      <AdminDashboardStack.Screen
        name={'AdminFirstConnectionScreen'}
        component={AdminFirstConnectionScreen}
        options={{
          headerShown: false
        }}
      />
      <AdminDashboardStack.Screen
        name={'DashboardAdminScreen'}
        component={DashboardAdminScreen}
        options={{
          headerShown: false
        }}
      />
      <AdminDashboardStack.Screen
        name={'CategoriesScreen'}
        component={CategoriesScreen}
        options={{
          headerShown: false
        }}
      />
      <AdminDashboardStack.Screen
        name={'SubCategoryScreen'}
        component={SubCategoryScreen}
        options={{
          headerShown: false
        }}
      />
      <AdminDashboardStack.Screen
        name={'DocumentsScreen'}
        component={DocumentsScreen}
        options={{
          headerShown: false
        }}
      />
    </AdminDashboardStack.Navigator>
  )
}

function ClientDashboard() {
  return (
    <ClientDashboardStack.Navigator>
      <ClientDashboardStack.Screen
        name={'ClientFirstConnectionScreen'}
        component={ClientFirstConnectionScreen}
        options={{
          headerShown: false
        }}
      />
      <ClientDashboardStack.Screen
        name={'DashboardClientScreen'}
        component={DashboardClientScreen}
        options={{
          headerShown: false
        }}
      />
      <ClientDashboardStack.Screen
        name={'CategoriesScreen'}
        component={CategoriesScreen}
        options={{
          headerShown: false
        }}
      />
      <ClientDashboardStack.Screen
        name={'SubCategoryScreen'}
        component={SubCategoryScreen}
        options={{
          headerShown: false
        }}
      />
      <ClientDashboardStack.Screen
        name={'DocumentsScreen'}
        component={DocumentsScreen}
        options={{
          headerShown: false
        }}
      />
    </ClientDashboardStack.Navigator>
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
            name="AdminDashboardStack"
            component={AdminDashboard}
            options={{
              headerShown: false
            }}
          />
          <RootStack.Screen
            name="ClientDashboardStack"
            component={ClientDashboard}
            options={{
              headerShown: false
            }}
          />
      </RootStack.Navigator>
    </NavigationContainer>
  )
}