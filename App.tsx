import {NavigationContainer} from '@react-navigation/native';
import React, {useState} from 'react';
import {LogBox} from 'react-native';
import {UserInfo, UserInputContext} from './app/context';
import MainNavigator from './app/screens/MainNavigator';
LogBox.ignoreAllLogs(__DEV__);
const App = () => {
  const [users, setUsers] = useState<UserInfo[]>([]);
  return (
    <UserInputContext.Provider value={{users, setUsers}}>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </UserInputContext.Provider>
  );
};

export default App;
