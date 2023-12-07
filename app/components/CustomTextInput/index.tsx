import React, {
  Ref,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';

export type RefCustomInput = {
  onValidateInput: () => boolean;
  value: string;
  resetValue: () => void;
};
const CustomTextInput = forwardRef(
  (
    {
      label,
      isRequire = false,
      placeholder,
    }: {label?: string; isRequire?: boolean; placeholder?: string},
    ref: Ref<RefCustomInput>,
  ) => {
    const [value, setValue] = useState('');
    const [error, setError] = useState('');
    const styles = createStyle();
    const onCheckValue = useCallback(() => {
      if (isRequire && !value) {
        setError('This field is required');
        return false;
      }
      return true;
    }, [setError, value, isRequire]);
    const resetValue = useCallback(() => {
      setValue('');
    }, [setValue]);
    useImperativeHandle(
      ref,
      () => {
        return {
          onValidateInput: onCheckValue,
          value: value,
          resetValue,
        };
      },
      [value, onCheckValue, resetValue],
    );
    const onChangeText = (inputValue: string) => {
      setError('');
      setValue(inputValue);
    };
    return (
      <View style={{marginBottom: 10}}>
        {!!label && (
          <Text style={styles.title}>
            {label} {isRequire && <Text style={{color: 'red'}}>*</Text>}
          </Text>
        )}
        <TextInput
          style={styles.inputStyle}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
        />
        <View style={styles.errorContainer}>
          {error && <Text style={styles.error}>{error}</Text>}
        </View>
      </View>
    );
  },
);

export default CustomTextInput;

const createStyle = () =>
  StyleSheet.create({
    title: {
      fontSize: 14,
      lineHeight: 16,
      color: '#000000',
      marginBottom: 5,
    },
    error: {
      fontSize: 10,
      lineHeight: 12,
      color: 'red',
    },
    errorContainer: {
      height: 12,
    },
    inputStyle: {
      backgroundColor: '#F9F9F9',
      padding: 8,
      marginBottom: 2,
      borderRadius: 4,
    },
  });
