import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import globalStyles from '../styles/globalStyles';

// Array of color options
const colorOptions: string[] = ['#218690', '#76DAE5', '#4E9B8F', '#247BA0', '#50514F'];
// Placeholder for custom color
const CUSTOM_COLOR: string = 'custom';

export default function AddCategory() {
  const [category, setCategory] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>(colorOptions[0]);
  const [customColor, setCustomColor] = useState<string>('#000000');
  const [showColorInput, setShowColorInput] = useState<boolean>(false);
  const [hexInput, setHexInput] = useState<string>('#000000');
  const router = useRouter();

  const saveCategory = async (): Promise<void> => {
    if (!category.trim()) return;

    try {
      const storedCategories = await AsyncStorage.getItem('categories');
      const categories = storedCategories ? JSON.parse(storedCategories) : [];

      const newCategory = {
        id: Date.now(),
        title: category,
        color: selectedColor === CUSTOM_COLOR ? customColor : selectedColor,
        amountOfQuotes: 0,
      };

      categories.push(newCategory);
      await AsyncStorage.setItem('categories', JSON.stringify(categories));
      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleColorSelect = (color: string): void => {
    if (color === CUSTOM_COLOR) {
      setShowColorInput(true);
    } else {
      setSelectedColor(color);
    }
  };

  const confirmCustomColor = (): void => {
    // Validate hex code format
    const hexRegex = /^#([0-9A-F]{6})$/i;
    if (hexRegex.test(hexInput)) {
      setCustomColor(hexInput);
      setSelectedColor(CUSTOM_COLOR);
      setShowColorInput(false);
    } else {
      setCustomColor('#218690');
      setSelectedColor(CUSTOM_COLOR);
      setShowColorInput(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable 
          onPress={() => router.back()} 
          style={({pressed}) => [
            styles.backButton,
            pressed && {opacity: 0.8}
          ]}
        >
          <Text style={[styles.backButtonText, { fontSize: 35 }]}>←</Text>
        </Pressable>
        <Text style={[globalStyles.text, styles.label, { fontSize: 30 }]}>Add New Category</Text>
      </View>

      <View style={styles.form}>
        <Text style={[globalStyles.text, styles.label]}>Category Name</Text>
        <TextInput
          style={[globalStyles.text, styles.input, { color: '#000' }]}
          placeholder="Enter category name"
          placeholderTextColor="#999"
          value={category}
          onChangeText={setCategory}
        />

        <Text style={[globalStyles.text, styles.label]}>Choose Color</Text>
        <View style={styles.colorPicker}>
          {colorOptions.map((color) => (
            <Pressable
              key={color}
              style={({pressed}) => [
                styles.colorOption,
                { backgroundColor: color },
                selectedColor === color && styles.selectedColorOption,
                pressed && {opacity: 0.8}
              ]}
              onPress={() => handleColorSelect(color)}
            />
          ))}
          <View style={styles.customColorContainer}>
            <Text style={[globalStyles.text, styles.label]}>
              Or choose custom color
            </Text>
            <Pressable
              style={({pressed}) => [
                styles.customColorOption,
                { 
                  backgroundColor: selectedColor === CUSTOM_COLOR ? customColor : '#FFF',
                  borderWidth: 1,
                  borderColor: '#FFF'
                },
                selectedColor === CUSTOM_COLOR && styles.selectedColorOption,
                pressed && {opacity: 0.8}
              ]}
              onPress={() => handleColorSelect(CUSTOM_COLOR)}
            >
              <Text style={styles.customColorText}>+</Text>
            </Pressable>
          </View>
        </View>

        <Pressable 
          style={({pressed}) => [
            styles.saveButton, 
            { backgroundColor: selectedColor === CUSTOM_COLOR ? customColor : selectedColor },
            pressed && {opacity: 0.8}
          ]} 
          onPress={saveCategory}
        >
          <Text style={[globalStyles.text, styles.saveButtonText, { fontSize: 30 }]}>Save Category</Text>
        </Pressable>
      </View>

      {/* Custom Color Input Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showColorInput}
        onRequestClose={() => setShowColorInput(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Custom Color</Text>
            
            <View style={styles.colorPreview}>
              <View style={[styles.colorSample, { backgroundColor: hexInput }]} />
            </View>
            
            <Text style={styles.inputLabel}>Hex Code</Text>
            <TextInput
              style={styles.hexInput}
              value={hexInput}
              onChangeText={setHexInput}
              placeholder="#000000"
              placeholderTextColor="#999"
              autoCapitalize="characters"
            />
            
            <View style={styles.modalButtons}>
              <Pressable 
                style={({pressed}) => [
                  styles.modalButton, 
                  styles.cancelButton,
                  pressed && {opacity: 0.8}
                ]} 
                onPress={() => setShowColorInput(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
              <Pressable 
                style={({pressed}) => [
                  styles.modalButton, 
                  styles.confirmButton,
                  pressed && {opacity: 0.8}
                ]} 
                onPress={confirmCustomColor}
              >
                <Text style={styles.modalButtonText}>Confirm</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07263B',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 24,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  form: {
    flex: 1,
    padding: 20,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
    marginTop: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customColorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 120,
  },
  customColorText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  selectedColorOption: {
    borderWidth: 3,
    borderColor: '#fff',
  },
  saveButton: {
    marginTop: 50,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    height: 70,
    marginHorizontal: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#07263B',
  },
  colorPreview: {
    alignItems: 'center',
    marginBottom: 20,
  },
  colorSample: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#07263B',
    alignSelf: 'flex-start',
  },
  hexInput: {
    backgroundColor: '#f0f0f0',
    width: '100%',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 20,
    color: '#000',
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  modalButton: {
    padding: 12,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#555',
  },
  confirmButton: {
    backgroundColor: '#4E9B8F',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  customColorContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 0,
    marginRight: 100,
  },
});