import moment from 'moment';
import React, {useContext, useRef} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import CustomDatePicker, {
  RefCustomDatePicker,
} from '../../components/CustomDatePicker';
import CustomTextInput, {
  RefCustomInput,
} from '../../components/CustomTextInput';
import NationPicker, {RefNationPicker} from '../../components/NationPicker';
import {UserInputContext} from '../../context';
import {RootStackScreenProps} from '../MainNavigator';

const UserInput = ({route, navigation}: RootStackScreenProps<'UserInput'>) => {
  const styles = createStyle();
  const nameRef = useRef<RefCustomInput>(null);
  const birthDayRef = useRef<RefCustomDatePicker>(null);
  const countryRef = useRef<RefNationPicker>(null);
  const {setUsers} = useContext(UserInputContext);

  const onSubmit = () => {
    if (!nameRef.current || !birthDayRef.current || !countryRef.current) {
      return;
    }
    const isNameValidated = nameRef.current.onValidateInput();
    const isBirthDayValidated = birthDayRef.current.onValidateInput();
    const isCountryValidated = countryRef.current.onValidateValue();
    if (!isNameValidated || !isBirthDayValidated || !isCountryValidated) {
      return;
    }

    const selectedUser = {
      id: moment().unix().toString(),
      fullName: nameRef.current.value,
      birthDay: birthDayRef.current.value,
      nation: countryRef.current.value,
    };
    !!setUsers && setUsers(state => [...state, selectedUser]);
    nameRef.current.resetValue();
    birthDayRef.current.resetValue();
    countryRef.current.resetValue();
    navigation.navigate('UserList');
  };
  return (
    <View style={{flex: 1}}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Enter user information</Text>
        <View style={styles.formContainer}>
          <CustomTextInput
            label={'Full Name'}
            isRequire
            placeholder="Enter your name"
            ref={nameRef}
          />
          <CustomDatePicker
            label="Birthday"
            placeholder="Select your birthday"
            isRequire
            ref={birthDayRef}
          />
          <NationPicker
            label="Nation"
            placeholder="Select your nation"
            isRequire
            ref={countryRef}
          />
        </View>
      </ScrollView>
      <View style={styles.btnContainer}>
        <Pressable style={styles.button} onPress={onSubmit}>
          <Text style={styles.btnText}>Add New User</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default UserInput;

const createStyle = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      padding: 16,
    },
    title: {
      fontSize: 20,
      lineHeight: 24,
      color: '#000000',
      alignSelf: 'center',
      textTransform: 'uppercase',
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
  });
