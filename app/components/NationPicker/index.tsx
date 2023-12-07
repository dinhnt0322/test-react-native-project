import React, {
  Ref,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import axiosServices from '../../services/AxiosServices';
import {parseNationInfo} from '../../services/axiosParser';
import CountryModal from '../CountryModal';
import {NationType} from '../types';

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
    const [selectedNation, setSelectedNation] = useState<NationType | null>(
      null,
    );
    const [open, setOpen] = useState(false);
    const [error, setError] = useState('');
    const [isLoadingNations, setIsLoadingNation] = useState(true);
    const [nations, setNations] = useState<NationType[]>([]);

    const getNationList = useCallback(async () => {
      const rawNations = await axiosServices.GET({
        route: 'https://restcountries.com/v3.1/all',
        body: {
          fields: 'name,flag,cca3',
        },
      });
      const responseNations = parseNationInfo(rawNations.data);
      setNations(responseNations);
      setIsLoadingNation(false);
    }, []);

    const onCheckValue = useCallback(() => {
      if (isRequire && !selectedNation) {
        setError('This field is required');
        return false;
      }
      return true;
    }, [setError, selectedNation, isRequire]);

    const resetValue = useCallback(() => {
      setSelectedNation(null);
    }, [setSelectedNation]);

    const onConfirm = (value: NationType) => {
      setSelectedNation(value);
      setOpen(false);
      setError('');
    };

    const styles = createStyle();
    const onSelectCountry = () => {
      !isLoadingNations && setOpen(true);
    };

    useEffect(() => {
      getNationList();
    }, [getNationList]);

    useImperativeHandle(
      ref,
      () => {
        return {
          onValidateValue: onCheckValue,
          value: selectedNation?.name || '',
          resetValue,
        };
      },
      [selectedNation, onCheckValue, resetValue],
    );

    return (
      <View style={{marginBottom: 10}}>
        {!!label && (
          <Text style={styles.title}>
            {label} {isRequire && <Text style={{color: 'red'}}>*</Text>}
          </Text>
        )}
        <Pressable style={styles.inputStyle} onPress={onSelectCountry}>
          <Text>
            {selectedNation ? (
              `${selectedNation.flag} ${selectedNation.name}`
            ) : (
              <Text style={{opacity: 0.3}}>
                {isLoadingNations ? 'Fetching nations list...' : placeholder}
              </Text>
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
          selectedNation={selectedNation}
          nations={nations}
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
