import React from 'react';
import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';
import globalStyles from '../styles/globalStyles';

type ConfirmationDialogProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  color?: string;
};

export default function ConfirmationDialog({
  visible,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  color = '#218690'
}: ConfirmationDialogProps) {
  if (!visible) return null;
  
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable 
        style={styles.centeredView}
        onPress={onCancel}
      >
        <Pressable 
          style={styles.modalView}
          onPress={(e) => e.stopPropagation()}
        >
          <Text style={[globalStyles.text, styles.titleText]}>{title}</Text>
          <Text style={[globalStyles.text, styles.modalText]}>{message}</Text>
          
          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={[globalStyles.text, styles.buttonText]}>{cancelText}</Text>
            </Pressable>
            
            <Pressable
              style={[styles.button, styles.confirmButton, { backgroundColor: color }]}
              onPress={onConfirm}
            >
              <Text style={[globalStyles.text, styles.buttonText]}>{confirmText}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// Styling
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#07263B',
    borderRadius: 10,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '80%',
  },
  titleText: {
    fontSize: 30,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    borderRadius: 8,
    padding: 12,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center', // Centers the text horizontally
    justifyContent: 'center', // Centers the text vertically
  },
  cancelButton: {
    backgroundColor: '#5A5A5A',
  },
  confirmButton: {
    backgroundColor: '#AA5555',
  },
  buttonText: {
    fontSize: 20,
    textAlign: 'center',
  },
});