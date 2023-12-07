/* eslint-disable react/no-unstable-nested-components */
import {TransitionPresets} from '@react-navigation/stack';
import React, {useContext, useEffect, useState} from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {UserInputContext} from '../../context';
import axiosServices from '../../services/AxiosServices';
import {RootStackScreenProps} from '../MainNavigator';

const UserList = ({navigation}: RootStackScreenProps<'UserList'>) => {
  const styles = createStyle();
  const {users, searchKey, setUsers} = useContext(UserInputContext);
  const [isRefresh, setIsRefresh] = useState(false);
  const navigationOptions = {
    ...TransitionPresets.SlideFromRightIOS,
    headerStyle: {
      backgroundColor: '#FFFFFF',
    },

    headerLeft: () => (
      <Pressable onPress={navigation.goBack} style={styles.headerButton}>
        <Text style={{fontSize: 30}}>‹</Text>
      </Pressable>
    ),
    headerTitle: () => <Text style={styles.headerTitle}>User List</Text>,
  };

  const updateNavBar = () => {
    navigation.setOptions(navigationOptions);
  };

  useEffect(() => {
    updateNavBar();
  }, []);
  const onAddNewUser = () => {
    navigation.navigate('UserInput');
  };

  const refreshUserList = async () => {
    setIsRefresh(true);
    const rawData = await axiosServices.POST({
      route: 'https://search.ofac-api.com/v3',
      body: {
        apiKey: 'c604aea8-72a4-41bc-aca3-f6988677e209',
        minScore: 95,
        source: ['SDN'],
        cases: [
          {
            name: searchKey,
          },
        ],
      },
    });
    const responseUser = rawData.data?.matches[searchKey].map(item => ({
      fullName: item.fullName,
      firstName: item.firstName,
      lastName: item.lastName,
      id: item.uid,
      birthDay: item.dob,
      nation: '',
    }));

    !!setUsers && setUsers(responseUser);
    setIsRefresh(false);
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefresh} onRefresh={refreshUserList} />
        }>
        <Text style={styles.title}>List of User</Text>
        <View style={{borderWidth: 1}}>
          <View style={styles.headerContainer}>
            <View style={[{flex: 4}, styles.center]}>
              <Text style={styles.headerText}>Full Name</Text>
            </View>
            <View
              style={[
                {flex: 3, borderLeftWidth: 1, borderRightWidth: 1},
                styles.center,
              ]}>
              <Text style={styles.headerText}>Birth day</Text>
            </View>
            <View style={[{flex: 3}, styles.center]}>
              <Text style={styles.headerText}>Nation</Text>
            </View>
          </View>
          {users?.map((item, index) => {
            return (
              <View
                style={[
                  styles.itemContainer,
                  {
                    borderBottomWidth: index === users.length - 1 ? 0 : 1,
                  },
                ]}
                key={item.id}>
                <View style={[{flex: 4}, styles.center]}>
                  <Text style={styles.itemText}>{item.fullName}</Text>
                </View>
                <View
                  style={[
                    {flex: 3, borderLeftWidth: 1, borderRightWidth: 1},
                    styles.center,
                  ]}>
                  <Text style={styles.itemText}>{item.birthDay}</Text>
                </View>
                <View style={[{flex: 3}, styles.center]}>
                  <Text style={styles.itemText} numberOfLines={1}>
                    {item.nation}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
      <View style={styles.btnContainer}>
        <Pressable style={styles.button} onPress={onAddNewUser}>
          <Text style={styles.btnText}>Add New User</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default UserList;

const createStyle = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      paddingVertical: 20,
    },
    title: {
      fontSize: 20,
      lineHeight: 24,
      color: '#000000',
      alignSelf: 'center',
      textTransform: 'uppercase',
      marginBottom: 40,
    },
    formContainer: {
      marginTop: 20,
    },
    button: {
      width: '100%',
      height: 44,
      backgroundColor: '#105CBB',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 4,
    },
    btnText: {
      color: '#FFFFFF',
      lineHeight: 20,
      fontSize: 18,
      fontWeight: '600',
    },
    btnContainer: {
      height: 100,
      paddingHorizontal: 16,
      justifyContent: 'center',
      backgroundColor: '#FFFFFF',
    },
    center: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 5,
    },
    headerText: {
      color: 'black',
      fontWeight: '600',
      lineHeight: 18,
      fontSize: 16,
    },
    itemContainer: {
      width: '100%',
      height: 40,
      flexDirection: 'row',
    },
    itemText: {
      color: 'black',
      lineHeight: 14,
      fontSize: 12,
    },
    headerContainer: {
      width: '100%',
      height: 40,
      flexDirection: 'row',
      borderBottomWidth: 1,
    },
    headerButton: {
      marginLeft: 16,
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {fontSize: 20, lineHeight: 24, fontWeight: '600'},
  });
