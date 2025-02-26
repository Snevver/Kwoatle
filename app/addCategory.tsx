import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import globalStyles from '../styles/globalStyles';

// Array of color options
// Maybe we can add a custom color picker ??
const colorOptions = ['#218690', '#76DAE5', '#4E9B8F', '#70C1B3', '#247BA0', '#50514F'];

export default function AddCategory() {
  const [category, setCategory] = useState('');
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const router = useRouter();

  const saveCategory = async () => {
    if (!category.trim()) return;

    try {
      const storedCategories = await AsyncStorage.getItem('categories');
      const categories = storedCategories ? JSON.parse(storedCategories) : [];

      const newCategory = {
        id: Date.now(),
        title: category,
        color: selectedColor,
        amountOfQuotes: 0,
      };

      categories.push(newCategory);
      await AsyncStorage.setItem('categories', JSON.stringify(categories));
      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>🡰</Text>
        </Pressable>
        <Text style={[globalStyles.text, styles.headerTitle]}>Add New Category</Text>
      </View>

      <View style={styles.form}>
        <Text style={[globalStyles.text,styles.label]}>Category Name</Text>
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
              style={[
                styles.colorOption,
                { backgroundColor: color },
                selectedColor === color && styles.selectedColorOption,
              ]}
              onPress={() => setSelectedColor(color)}
            />
          ))}
        </View>

        <Pressable 
          style={[styles.saveButton, { backgroundColor: selectedColor }]} 
          onPress={saveCategory}
        >
          <Text style={[globalStyles.text, styles.saveButtonText]}>Save Category</Text>
        </Pressable>
      </View>
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
  },
  selectedColorOption: {
    borderWidth: 3,
    borderColor: '#fff',
  },
  saveButton: {
    marginTop: 40,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});