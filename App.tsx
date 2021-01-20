import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  View,
} from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import styles from './src/styles';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import { AuthContextProvider } from './src/contexts/AuthContext';
import HomeScreen from './src/screens/HomeScreen';
import HeaderComponent from './src/components/HeaderComponent';
import { FirestoreContextProvider } from './src/contexts/FirestoreContext';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList, DrawerScreenProps } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamsList } from './src/types';
import CreationScreen from './src/screens/CreationScreen';

const App = () => {

  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    getToken()
  }, [])

  const getToken = async () => {
    const token = await AsyncStorage.getItem('MoneyTrackToken')
    setToken(token)
  }

  const AppDrawerStack = createDrawerNavigator();

  const CustomDrawerContent = (props: any) => {
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem label="Déconnexion" onPress={async () => {
          await AsyncStorage.multiRemove(['MoneyTrackToken', 'MoneyTrackUserUID', 'MoneyTrackFirstname', 'MoneyTrackLastname'])
          props.navigation.navigate('Login')
        }} />
      </DrawerContentScrollView>
    )
  }

  const MyAppDrawerStack = (props: any) => {
    return (
      <AppDrawerStack.Navigator
        drawerContent={props => <CustomDrawerContent {...props} />}
        drawerStyle={styles.drawer}
      >
        <AppDrawerStack.Screen name="Home" component={HomeScreen}
          options={{ drawerLabel: "Accueil" }} initialParams={{ token: token }}
        />
        <AppDrawerStack.Screen name="Creation" component={CreationScreen}
          options={{ drawerLabel: "Nouvelle dépense" }}
        />
      </AppDrawerStack.Navigator>
    )
  }

  const LogStack = createStackNavigator();
  const MyLogStack = () => {
    return (
      <LogStack.Navigator initialRouteName={token == "autolog" ? 'App' : 'Login'} headerMode="none">
        <LogStack.Screen name="Login" component={LoginScreen} />
        <LogStack.Screen name="Signup" component={SignupScreen} />
        <LogStack.Screen name="App" component={MyAppDrawerStack} />
      </LogStack.Navigator>
    )
  }

  return (
    <AuthContextProvider>
      <FirestoreContextProvider>
        <NavigationContainer>
          <StatusBar barStyle="dark-content" />
          <SafeAreaView style={styles.container}>
            <MyLogStack />
          </SafeAreaView>
        </NavigationContainer>
      </FirestoreContextProvider>
    </AuthContextProvider>
  );
};

export default App;
