import moment from 'moment';
import React, {useContext} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {UserInputContext} from '../../context';
import {RootStackScreenProps} from '../MainNavigator';

const UserList = ({route, navigation}: RootStackScreenProps<'UserList'>) => {
  const styles = createStyle();
  const {users} = useContext(UserInputContext);
  const onAddNewUser = () => {
    navigation.navigate('UserInput');
  };
  return (
    <View style={{flex: 1}}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
                  <Text style={styles.itemText}>
                    {moment(moment.unix(item.birthDay)).format('DD/MM/YYYY')}
                  </Text>
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
          <Text style={styles.btnText}>Add & View List User</Text>
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
  });
