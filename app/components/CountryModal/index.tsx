import React, {useCallback, useRef} from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import {NationType} from '../types';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const CountryModal = ({
  isVisibleModal,
  setIsVisibleModal,
  onConfirm,
  selectedNation,
  nations,
}: {
  isVisibleModal: boolean;
  setIsVisibleModal: (value: boolean) => void;
  onConfirm?: (value: NationType) => void;
  selectedNation: NationType | null;
  nations: NationType[];
}) => {
  const flatListRef = useRef<FlatList>(null);
  const onClose = () => {
    setIsVisibleModal(false);
  };

  const styles = createStyle();

  // useEffect(() => {
  //   if (selectedNation && isVisibleModal) {
  //     setTimeout(() => {
  //       flatListRef.current?.scrollToItem({
  //         animated: true,
  //         item: selectedNation,
  //       });
  //     }, 600);
  //   }
  // }, [selectedNation, isVisibleModal]);
  const getItemLayout = useCallback(
    (data, index: number) => ({
      length: 65,
      offset: 65 * index,
      index,
    }),
    [],
  );
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
        <FlatList
          ref={flatListRef}
          data={nations}
          initialScrollIndex={
            nations.findIndex(item => item.id === selectedNation?.id) - 5
          }
          windowSize={70}
          initialNumToRender={20}
          maxToRenderPerBatch={25}
          renderItem={({item}) => (
            <Pressable
              style={styles.itemContainer}
              onPress={() => onConfirm && onConfirm(item)}
              key={item.id}>
              <Text>{`${item.flag} ${item.name}`}</Text>
              {item.id === selectedNation?.id && <Text>✔</Text>}
            </Pressable>
          )}
          keyExtractor={item => item.id}
          getItemLayout={getItemLayout}
        />
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
