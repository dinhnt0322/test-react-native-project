import {NavigationContainer} from '@react-navigation/native';
import React, {useState} from 'react';
import {LogBox} from 'react-native';
import {UserInfo, UserInputContext} from './app/context';
import MainNavigator from './app/screens/MainNavigator';
LogBox.ignoreAllLogs(__DEV__);
const App = () => {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [searchKey, setSearchKey] = useState<string>('');
  return (
    <UserInputContext.Provider
      value={{users, setUsers, searchKey, setSearchKey}}>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </UserInputContext.Provider>
  );
};

export default App;
