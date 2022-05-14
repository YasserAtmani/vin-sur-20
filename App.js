import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import TestScreen from './screens/TestScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfilScreen from './screens/ProfilScreen';
import DetailsVinScreen from './screens/DetailsVinScreen';
import AdminDetails from './screens/AdminDetails';
import ScanScreen from './screens/ScanScreen';
import ADMIN1_UID from './screens/config';
import {Icon} from 'react-native-elements';
const admin_uid = ADMIN1_UID;

import {
  createDrawerNavigator,
  DrawerItemList,
  DrawerItem,
  DrawerContentScrollView,
  DrawerContent,
} from '@react-navigation/drawer';
import {auth} from './firebase';
import {SafeAreaView, LogBox} from 'react-native';
import AdminHomeScreen from './screens/AdminHomeScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

LogBox.ignoreLogs([
  'AsyncStorage has been extracted from react-native core',
  'If you want to use Reanimated 2',
]);

function Menu() {
  if (auth.currentUser.uid === admin_uid) {
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#6d152e',
          tabBarShowLabel: false,
          showIcon: true,
          tabBarStyle: {
            backgroundColor: '#fff',
            paddingBottom: 10,
            paddingTop: 10,
            height: 75,
          },
        }}>
        <Tab.Screen
          name="Accueil admin"
          component={AdminHomeScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({color, focused}) => {
              return (
                <Icon
                  name={focused ? 'home' : 'home-outline'}
                  type="ionicon"
                  size={30}
                  color={color}
                />
              );
            },
          }}
        />
        <Tab.Screen
          name="Scan"
          component={ScanScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({focused}) => {
              let bgcolor = focused ? '#6d152e' : '#fff';
              let iconColor = focused ? '#fff' : '#6d152e';
              return (
                <View
                  style={{
                    height: 70,
                    width: 70,
                    backgroundColor: bgcolor,
                    borderRadius: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 50,

                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 12,
                    },
                    shadowOpacity: 1,
                    shadowRadius: 5.0,

                    elevation: 15,
                  }}>
                  <Icon
                    name="scan-outline"
                    type="ionicon"
                    size={35}
                    color={iconColor}
                    style={{
                      marginLeft: 1,
                    }}
                  />
                </View>
              );
            },
          }}
        />
        <Tab.Screen
          name="Profil"
          component={ProfilScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({color, focused}) => {
              return (
                <Icon
                  name={focused ? 'person' : 'person-outline'}
                  type="ionicon"
                  size={30}
                  color={color}
                />
              );
            },
          }}
        />
      </Tab.Navigator>
    );
  }
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#6d152e',
        tabBarShowLabel: false,
        showIcon: true,
        tabBarStyle: {
          backgroundColor: '#fff',
          paddingBottom: 10,
          paddingTop: 10,
          height: 75,
        },
      }}>
      <Tab.Screen
        name="Accueil user"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({color, focused}) => {
            return (
              <Icon
                name={focused ? 'home' : 'home-outline'}
                type="ionicon"
                size={30}
                color={color}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Scan"
        component={ScanScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => {
            let bgcolor = focused ? '#6d152e' : '#fff';
            let iconColor = focused ? '#fff' : '#6d152e';
            return (
              <View
                style={{
                  height: 70,
                  width: 70,
                  backgroundColor: bgcolor,
                  borderRadius: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 50,

                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 12,
                  },
                  shadowOpacity: 1,
                  shadowRadius: 5.0,

                  elevation: 15,
                }}>
                <Icon
                  name="scan-outline"
                  type="ionicon"
                  size={35}
                  color={iconColor}
                  style={{
                    marginLeft: 1,
                  }}
                />
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Profil"
        component={ProfilScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({color, focused}) => {
            return (
              <Icon
                name={focused ? 'person' : 'person-outline'}
                type="ionicon"
                size={30}
                color={color}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={'Login'}>
        <Stack.Screen
          options={{headerShown: false}}
          name="Menu"
          component={Menu}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Register"
          component={RegisterScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Détails user"
          component={DetailsVinScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Détails Admin"
          component={AdminDetails}
        />
      </Stack.Navigator>
    </NavigationContainer>
    // <NavigationContainer>
    //   <Drawer.Navigator>
    //     <Drawer.Screen name="Home" component={HomeScreen} />
    //     <Drawer.Screen name="Test" component={TestScreen} />
    //   </Drawer.Navigator>
    // </NavigationContainer>
  );
}

const Drawer = createDrawerNavigator();
const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonLogout: {
    backgroundColor: '#ff2137',
    width: '100%',
    padding: 5,
  },
  buttonLogoutText: {
    justifyContent: 'center',
    alignItems: 'center',
    color: 'rgba(0, 0, 0, .5)',
  },
  label: {
    margin: 16,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 1)',
  },
  iconContainer: {
    marginHorizontal: 16,
    width: 24,
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default App;
