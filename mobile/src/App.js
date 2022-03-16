import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Register from './screens/Register';
import Login from './screens/Login';
import Home from './screens/Home';
import Profile from './screens/Profile';
import ServerSettingsModal from './screens/ServerSettingsModal';
import CustomNavigationBar from './components/CustomNavigationBar';
import CreateInstance from './screens/CreateInstance/CreateInstance';
import EditAction from './screens/EditAction';
import EditReaction from './screens/EditReaction';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          header: CustomNavigationBar,
        }}>
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Create instance" component={CreateInstance} />
        <Stack.Screen name="Edit action" component={EditAction} />
        <Stack.Screen name="Edit reaction" component={EditReaction} />
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen
            name="Server settings"
            component={ServerSettingsModal}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
