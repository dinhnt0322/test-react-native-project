import React, {
  Ref,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import CountryModal from './CountryModal';

export type RefNationPicker = {
  value: string;
  onValidateValue: () => boolean;
  resetValue: () => void;
};

const NationPicker = forwardRef(
  (
    {
      label,
      isRequire = false,
      placeholder,
    }: {label?: string; isRequire?: boolean; placeholder?: string},
    ref: Ref<RefNationPicker>,
  ) => {
    const [selectedCountry, setSelectedCountry] = useState('');
    const [open, setOpen] = useState(false);
    const [error, setError] = useState('');

    const onCheckValue = useCallback(() => {
      if (isRequire && !selectedCountry) {
        setError('This field is required');
        return false;
      }
      return true;
    }, [setError, selectedCountry, isRequire]);
    const resetValue = useCallback(() => {
      setSelectedCountry('');
    }, [setSelectedCountry]);
    useImperativeHandle(
      ref,
      () => {
        return {
          onValidateValue: onCheckValue,
          value: selectedCountry,
          resetValue,
        };
      },
      [selectedCountry, onCheckValue, resetValue],
    );

    const onConfirm = (value: string) => {
      setSelectedCountry(value);
      setOpen(false);
      setError('');
    };

    const styles = createStyle();

    return (
      <View style={{marginBottom: 10}}>
        {!!label && (
          <Text style={styles.title}>
            {label} {isRequire && <Text style={{color: 'red'}}>*</Text>}
          </Text>
        )}
        <Pressable
          style={styles.inputStyle}
          onPress={() => {
            setOpen(true);
          }}>
          <Text>
            {selectedCountry ? (
              selectedCountry
            ) : (
              <Text style={{opacity: 0.3}}>{placeholder}</Text>
            )}
          </Text>
        </Pressable>
        <View style={styles.errorContainer}>
          {error && <Text style={styles.error}>{error}</Text>}
        </View>
        <CountryModal
          isVisibleModal={open}
          setIsVisibleModal={setOpen}
          onConfirm={onConfirm}
          selectedCountry={selectedCountry}
        />
      </View>
    );
  },
);

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

export default NationPicker;
