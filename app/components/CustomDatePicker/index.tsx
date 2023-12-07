import moment from 'moment';
import React, {
  Ref,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import DatePicker from 'react-native-date-picker';

export type RefCustomDatePicker = {
  value: number;
  onValidateInput: () => boolean;
  resetValue: () => void;
};

const CustomDatePicker = forwardRef(
  (
    {
      label,
      isRequire = false,
      placeholder,
    }: {label?: string; isRequire?: boolean; placeholder?: string},
    ref: Ref<RefCustomDatePicker>,
  ) => {
    const [date, setDate] = useState<Date | null>(null);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState('');

    const onCheckValue = useCallback(() => {
      if (isRequire && !date) {
        setError('This field is required');
        return false;
      }
      return true;
    }, [setError, date, isRequire]);
    const resetValue = useCallback(() => {
      setDate(null);
    }, [setDate]);
    useImperativeHandle(
      ref,
      () => {
        return {
          onValidateInput: onCheckValue,
          value: moment(date).unix(),
          resetValue,
        };
      },
      [date, onCheckValue, resetValue],
    );

    const styles = createStyle();
    const onConfirm = (date: Date) => {
      setOpen(false);
      setDate(date);
      setError('');
    };

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
            {date ? (
              moment(date).format('DD/MM/YYYY')
            ) : (
              <Text style={{opacity: 0.3}}>{placeholder}</Text>
            )}
          </Text>
        </Pressable>
        <View style={styles.errorContainer}>
          {error && <Text style={styles.error}>{error}</Text>}
        </View>
        <DatePicker
          modal
          open={open}
          date={date || new Date()}
          onConfirm={onConfirm}
          onCancel={() => {
            setOpen(false);
          }}
          mode="date"
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

export default CustomDatePicker;
