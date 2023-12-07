/* eslint-disable react/no-unstable-nested-components */
import {TransitionPresets} from '@react-navigation/stack';
import React, {useContext, useEffect, useRef} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import CustomDatePicker, {
  RefCustomDatePicker,
} from '../../components/CustomDatePicker';
import CustomTextInput, {
  RefCustomInput,
} from '../../components/CustomTextInput';
import NationPicker, {RefNationPicker} from '../../components/NationPicker';
import {UserInputContext} from '../../context';
import axiosServices from '../../services/AxiosServices';
import {RootStackScreenProps} from '../MainNavigator';

const UserInput = ({navigation}: RootStackScreenProps<'UserInput'>) => {
  const styles = createStyle();
  const nameRef = useRef<RefCustomInput>(null);
  const birthDayRef = useRef<RefCustomDatePicker>(null);
  const countryRef = useRef<RefNationPicker>(null);
  const {setUsers, setSearchKey} = useContext(UserInputContext);

  const navigationOptions = {
    ...TransitionPresets.SlideFromRightIOS,
    headerStyle: {
      backgroundColor: '#FFFFFF',
    },
    headerRight: () => (
      <Pressable
        onPress={() => {
          navigation.navigate('UserList');
        }}
        style={styles.headerButton}>
        <Text style={{fontSize: 28}}>☲</Text>
      </Pressable>
    ),
    headerTitle: () => <Text style={styles.headerTitle}>Input User</Text>,
  };

  const updateNavBar = () => {
    navigation.setOptions(navigationOptions);
  };

  useEffect(() => {
    updateNavBar();
  }, []);

  const onSubmit = async () => {
    if (!nameRef.current || !birthDayRef.current || !countryRef.current) {
      return;
    }
    const isNameValidated = nameRef.current.onValidateInput();
    const isBirthDayValidated = birthDayRef.current.onValidateInput();
    const isCountryValidated = countryRef.current.onValidateValue();
    if (!isNameValidated || !isBirthDayValidated || !isCountryValidated) {
      return;
    }

    nameRef.current.resetValue();
    birthDayRef.current.resetValue();
    countryRef.current.resetValue();

    const searchName = nameRef.current.value;
    const rawData = await axiosServices.POST({
      route: 'https://search.ofac-api.com/v3',
      body: {
        apiKey: 'c604aea8-72a4-41bc-aca3-f6988677e209',
        minScore: 95,
        source: ['SDN'],
        cases: [
          {
            name: nameRef.current.value,
          },
        ],
      },
    });
    const responseUser = rawData.data?.matches[searchName].map(item => ({
      fullName: item.fullName,
      firstName: item.firstName,
      lastName: item.lastName,
      id: item.uid,
      birthDay: item.dob,
      nation: '',
    }));

    !!setUsers && setUsers(responseUser);
    !!setSearchKey && setSearchKey(searchName);
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
          <Text style={styles.btnText}>Add & View List User</Text>
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
    headerButton: {
      marginRight: 16,
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {fontSize: 20, lineHeight: 24, fontWeight: '600'},
  });
