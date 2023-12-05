import React from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
const countries: {
  name: string;
  code: string;
}[] = require('../assets/countries.json');

const SCREEN_HEIGHT = Dimensions.get('window').height;

const CountryModal = ({
  isVisibleModal,
  setIsVisibleModal,
  onConfirm,
  selectedCountry,
}: {
  isVisibleModal: boolean;
  setIsVisibleModal: (value: boolean) => void;
  onConfirm?: (value: string) => void;
  selectedCountry: string;
}) => {
  const onClose = () => {
    setIsVisibleModal(false);
  };

  const styles = createStyle();

  return (
    <Modal
      style={styles.container}
      isVisible={isVisibleModal}
      backdropOpacity={0.5}
      propagateSwipe={true}
      backdropTransitionOutTiming={0}
      onModalHide={onClose}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection={['down']}>
      <View style={styles.modalHeader} />
      <View style={styles.modalContainer}>
        <ScrollView>
          {countries.map(item => (
            <Pressable
              style={styles.itemContainer}
              onPress={() => onConfirm && onConfirm(item.name)}
              key={item.code}>
              <Text>{item.name}</Text>
              {item.name === selectedCountry && <Text>✔</Text>}
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
};

const createStyle = () =>
  StyleSheet.create({
    modalHeader: {
      width: 45,
      height: 8,
      backgroundColor: '#FFFFFF',
      borderRadius: 4,
      margin: 5,
      alignSelf: 'center',
    },
    modalContainer: {
      backgroundColor: '#FFFFFF',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      height: SCREEN_HEIGHT - 60,
      paddingTop: 20,
    },
    itemContainer: {
      height: 65,
      paddingHorizontal: 16,
      borderBottomColor: '#00000030',
      borderBottomWidth: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
    },
    container: {
      justifyContent: 'flex-end',
      margin: 0,
    },
  });

export default CountryModal;
