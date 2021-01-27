import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  View,
} from 'react-native'
import { CommonActions, DrawerActions, DrawerNavigationState, NavigationContainer, ParamListBase } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import styles from './src/styles';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import { AuthContextProvider } from './src/contexts/AuthContext';
import HomeScreen from './src/screens/HomeScreen';
import HeaderComponent from './src/components/HeaderComponent';
import { FirestoreContextProvider } from './src/contexts/FirestoreContext';
import { createDrawerNavigator, DrawerContentOptions, DrawerContentScrollView, DrawerItem, DrawerItemList, DrawerScreenProps } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamsList } from './src/types';
import CreationScreen from './src/screens/CreationScreen';
import HeaderDrawerComponent from './src/components/HeaderDrawerComponent';
import { DrawerDescriptorMap, DrawerNavigationHelpers } from '@react-navigation/drawer/lib/typescript/src/types';
import { Props } from 'react-native-tab-view/lib/typescript/src/TabBarItem';
import DrawerItemCustom from './src/components/DrawerItemCustom';
import StatisticsScreen from './src/screens/StatisticsScreen';
import ExpensesScreen from './src/screens/ExpensesScreen';

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

  type PropsDrawer = Omit<DrawerContentOptions, 'contentContainerStyle' | 'style'> & {
    state: DrawerNavigationState<ParamListBase>;
    navigation: DrawerNavigationHelpers;
    descriptors: DrawerDescriptorMap;
  };

  const CustomDrawerContent: React.FC<PropsDrawer> = ({ state, descriptors, navigation }) => {
    return (
      <DrawerContentScrollView contentContainerStyle={{ flex: 1, justifyContent: 'space-between' }} {...state} {...descriptors} {...navigation}>
        <View>
          <HeaderDrawerComponent handleDrawer={() => navigation.toggleDrawer()} />
          {
            state.routes.map((route, i) => {
              const focused = i === state.index
              const { drawerLabel } = descriptors[route.key].options;
              return <DrawerItemCustom key={route.key} focused={focused} title={drawerLabel} onPress={() => {
                navigation.dispatch({
                  ...(focused ? DrawerActions.closeDrawer() : CommonActions.navigate(route.name)),
                  target: state.key
                })
              }} />
            })
          }
        </View>
        <View style={{ backgroundColor: '#202020', borderTopColor: '#fff', borderTopWidth: 3 }}>
          <DrawerItemCustom title={"Déconnexion"} onPress={async () => {
            await AsyncStorage.multiRemove(['MoneyTrackToken', 'MoneyTrackUserUID', 'MoneyTrackFirstname', 'MoneyTrackLastname'])
            navigation.navigate('Login')
          }} />
        </View>
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
        <AppDrawerStack.Screen name="Expenses" component={ExpensesScreen}
          options={{ drawerLabel: "Mes dépenses" }}
        />
        <AppDrawerStack.Screen name="Creation" component={CreationScreen}
          options={{ drawerLabel: "Nouvelle dépense" }}
        />
        <AppDrawerStack.Screen name="Stats" component={StatisticsScreen}
          options={{ drawerLabel: "Mes stats" }}
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
