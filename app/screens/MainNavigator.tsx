import {
  StackScreenProps,
  TransitionPresets,
  createStackNavigator,
} from '@react-navigation/stack';
import React from 'react';
import UserInput from './UserInput';
import UserList from './UserList';

export type RootStackParamList = {
  UserInput: undefined;
  UserList: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

const MainNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={'UserInput'}
      screenOptions={{
        ...TransitionPresets.ModalSlideFromBottomIOS,
        headerBackTitleVisible: false,
        headerTitleAllowFontScaling: false,
        headerBackAllowFontScaling: false,
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen
        name={'UserInput'}
        component={UserInput}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name={'UserList'}
        component={UserList}
        options={{
          ...TransitionPresets.ModalSlideFromBottomIOS,
        }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;
