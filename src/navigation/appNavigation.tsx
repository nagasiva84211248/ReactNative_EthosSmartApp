import React, { useEffect } from 'react'
import ToastProvider from 'react-native-toast-notifications'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from '../screens/loginScreen'
import { NavigationContainer } from '@react-navigation/native'
import SyncScreen from '../screens/syncScreen'
import { createDatabaseTables } from '../services/dbServices'
import HomeScreen from '../screens/HomeScreen'
import EdetailProductList from '../screens/EdetailProductList'

export type RootStackParamList = {
  login: any;
  sync: any;
  home:any;
  edetailProductList:any
};
const Stack = createNativeStackNavigator<RootStackParamList>()
export default function AppNavigation() {
  console.log("AppNavigation");
  // do create local DB tables 
  useEffect(() => {
    createDatabaseTables();
  }, []);
  // do create local DB tables 
  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName='login' screenOptions={{ headerShown: false }}>
          <Stack.Screen name='login' component={LoginScreen}></Stack.Screen>
          <Stack.Screen name='sync' component={SyncScreen}></Stack.Screen>
          <Stack.Screen name='home' component={HomeScreen}></Stack.Screen>
          <Stack.Screen name='edetailProductList' component={EdetailProductList}></Stack.Screen>

        </Stack.Navigator>
      </NavigationContainer>
  )
}