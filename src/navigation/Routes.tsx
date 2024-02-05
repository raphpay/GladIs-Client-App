// src/Routes.tsx

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import React from 'react';


import LoginScreen from '../ui/screens/LoginScreen';
import SignUpScreen from '../ui/screens/SignUpScreen';

import CategoriesScreen from '../ui/screens/CategoriesScreen';

import DashboardAdminScreen from '../ui/screens/dashboard/DashboardAdminScreen';
import DashboardClientScreen from '../ui/screens/dashboard/DashboardClientScreen';
import DashboardScreen from '../ui/screens/dashboard/DashboardScreen';

export type IRootStackParams = {
  Home: undefined,
  DashboardStack: { isAdmin: boolean }
}

export type ILoginStackParams = {
  LoginScreen: undefined,
  SignUpScreen: undefined,
  DashboardStack: undefined
}

export type IDashboardStackParams = {
  DashboardScreen: { isAdmin: boolean },
  CategoriesScreen: { category: string },
  DashboardAdminScreen: undefined,
  DashboardClientScreen: undefined,
}

let HomeStack = createStackNavigator<ILoginStackParams>();
let RootStack = createStackNavigator<IRootStackParams>();
let DashboardStack = createStackNavigator<IDashboardStackParams>();

function Home() {
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