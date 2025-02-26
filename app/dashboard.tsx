import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StatusBar, ScrollView, Image, Pressable, StyleSheet, TextInput, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globalStyles from '../styles/globalStyles';
import ConfirmationDialog from '../components/confirmationDialog';

// define the types in the category object
type Category = {
  id: number;
  title: string;
  color: string;
  amountOfQuotes: number;
};

const colorOptions = ['#218690', '#76DAE5', '#4E9B8F', '#70C1B3', '#247BA0', '#50514F'];

export default function Dashboard() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [editedCategoryName, setEditedCategoryName] = useState('');
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const router = useRouter();  

  const loadCategories = async () => {
    try {
      const storedCategories = await AsyncStorage.getItem('categories');
      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories([]);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);
  
  useFocusEffect(
    useCallback(() => {
      loadCategories();
      return () => {};
    }, [])
  );

  const goToAddCategory = () => {
    router.push('/addCategory');
  };

  const goToQuotesOverview = (categoryId: number) => {
    router.push({
      pathname: '/quotesOverview',
      params: { categoryId }
    });
  };

  const confirmDeleteCategory = (categoryId: number) => {
    setCategoryToDelete(categoryId);
    setDeleteDialogVisible(true);
  };

  const cancelDelete = () => {
    setDeleteDialogVisible(false);
    setCategoryToDelete(null);
  };

  const openEditModal = (category: Category) => {
    setCategoryToEdit(category);
    setEditedCategoryName(category.title);
    setSelectedColor(category.color);
    setEditModalVisible(true);
  };

  const cancelEdit = () => {
    setEditModalVisible(false);
    setCategoryToEdit(null);
    setEditedCategoryName('');
  };

  const saveEditedCategory = async () => {
    if (!categoryToEdit || !editedCategoryName.trim()) return;
    
    try {
      const storedCategories = await AsyncStorage.getItem('categories');
      if (storedCategories) {
        const categories = JSON.parse(storedCategories);
        const updatedCategories = categories.map((cat: Category) => {
          if (cat.id === categoryToEdit.id) {
            return {
              ...cat,
              title: editedCategoryName.trim(),
              color: selectedColor
            };
          }
          return cat;
        });
        
        await AsyncStorage.setItem('categories', JSON.stringify(updatedCategories));
        loadCategories();
        setEditModalVisible(false);
        setCategoryToEdit(null);
        setEditedCategoryName('');
      }
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const deleteCategory = async () => {
    if (categoryToDelete === null) return;
    
    try {
      const categoryId = categoryToDelete;
      setDeleteDialogVisible(false);
      setCategoryToDelete(null);
      
      // Delete the category
      const storedCategories = await AsyncStorage.getItem('categories');
      if (storedCategories) {
        const categories = JSON.parse(storedCategories);
        const updatedCategories = categories.filter((cat: Category) => cat.id !== categoryId);
        await AsyncStorage.setItem('categories', JSON.stringify(updatedCategories));
        
        // Also delete all quotes associated with this category
        const storedQuotes = await AsyncStorage.getItem('quotes');
        if (storedQuotes) {
          const quotes = JSON.parse(storedQuotes);
          const filteredQuotes = quotes.filter((quote: any) => quote.categoryId !== categoryId);
          await AsyncStorage.setItem('quotes', JSON.stringify(filteredQuotes));
        }
        
        loadCategories();
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <>
      <StatusBar hidden={true} />
      <View style={styles.mainContainer}>
        {/* Background image */}
        <View style={styles.backgroundContainer}>
          <Image
            source={require('../assets/images/background.png')}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={[globalStyles.text, { fontSize: 40, marginTop: -25 }]}>Kwoatle</Text>
        </View>

        {/* Scrollable list of categories */}
        <View style={styles.scrollableContainer}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
          {categories.length > 0 ? (
            categories.map((category) => (
              <Pressable 
                key={category.id} 
                onPress={() => goToQuotesOverview(category.id)}
              >
                <View style={[styles.categoryBox, { backgroundColor: category.color }]}>
                  <View style={styles.categoryContent}>
                    <Text style={[globalStyles.text, { fontSize: 30 }]}>{category.title}</Text>
                    <Text style={[globalStyles.text, styles.quoteCountText]}>
                      {category.amountOfQuotes} {category.amountOfQuotes === 1 ? 'quote' : 'quotes'}
                    </Text>
                  </View>
                  
                  <View style={styles.buttonContainer}>
                    {/* Edit button */}
                    <Pressable 
                      onPress={(e) => {
                        e.stopPropagation();
                        openEditModal(category);
                      }} 
                      style={[styles.actionButton, styles.editButton]}
                    >
                      <Text style={[globalStyles.text, { fontSize: 20 }]}>Edit</Text>
                    </Pressable>
                    
                    {/* Delete button */}
                    <Pressable 
                      onPress={(e) => {
                        e.stopPropagation();
                        confirmDeleteCategory(category.id);
                      }} 
                      style={[styles.actionButton, styles.deleteButton]}
                    >
                      <Text style={[globalStyles.text, { fontSize: 20 }]}>Delete</Text>
                    </Pressable>
                  </View>
                </View>
              </Pressable>
            ))
          ) : (
            <Text style={[globalStyles.text, styles.emptyText ]}>
              No categories yet. Add your first category!
            </Text>
          )}
          </ScrollView>
        </View>

        {/* Category add button */}
        <Pressable style={styles.addButton} onPress={goToAddCategory}>
          <Text style={[globalStyles.text, { fontSize: 50, marginBottom: 11 }]}>+</Text>
        </Pressable>

        {/* Confirmation Dialog */}
        <ConfirmationDialog
          visible={deleteDialogVisible}
          title="Delete Category"
          message="Are you sure you want to delete this category? All quotes in this category will also be deleted. This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={deleteCategory}
          onCancel={cancelDelete}
          color="#AA5555"
        />

        {/* Edit Category Modal */}
        <Modal
          visible={editModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={cancelEdit}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={[globalStyles.text, { fontSize: 30, marginBottom: 20}]}>Edit Category</Text>
              
              <Text style={[globalStyles.text, styles.modalLabel]}>Category Name</Text>
              <TextInput
                style={[globalStyles.text, styles.modalInput, { color: '#000' }]}
                value={editedCategoryName}
                onChangeText={setEditedCategoryName}
                placeholder="Enter category name"
                placeholderTextColor="#999"
              />

              <Text style={[globalStyles.text, styles.label, { marginBottom: 0 }]}>Category Color</Text>
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
              
              <View style={styles.modalButtonsContainer}>
                <Pressable 
                  style={[styles.modalButton, styles.modalCancelButton]} 
                  onPress={cancelEdit}
                >
                  <Text style={[globalStyles.text, { fontSize: 20 }]}>Cancel</Text>
                </Pressable>
                <Pressable 
                  style={[styles.modalButton, styles.modalSaveButton, { backgroundColor: selectedColor }]} 
                  onPress={saveEditedCategory}
                >
                  <Text style={[globalStyles.text, { fontSize: 20 }]}>Save</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}

// Styling
const styles = StyleSheet.create({
  mainContainer: { 
    flex: 1, 
    backgroundColor: '#07263B' 
  },
  backgroundContainer: { 
    flex: 1 
  },
  image: { 
    flex: 1, 
    width: '100%', 
    height: '100%' 
  },
  headerContainer: { 
    position: 'absolute', 
    top: 65, 
    left: 0, 
    right: 0, 
    alignItems: 'center' 
  },
  scrollableContainer: { 
    position: 'absolute', 
    top: 100, 
    left: 0, 
    right: 0, 
    bottom: 140,
    paddingHorizontal: 20 
  },
  categoryBox: {
    minHeight: 140,
    borderRadius: 15,
    marginBottom: 20,
    padding: 15,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  categoryText: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#ffffff' 
  },
  quoteCountText: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  actionButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 10,
    alignSelf: 'flex-start',
  },
  editButton: {
    backgroundColor: '#2186D0',
  },
  deleteButton: {
    backgroundColor: '#AA5555',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  emptyText: { 
    color: 'white', 
    textAlign: 'center', 
    marginTop: 40,
    fontSize: 18
  },
  addButton: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    height: 60,
    backgroundColor: '#218690',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#07263B',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  modalInput: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    margin: 5,
  },
  modalCancelButton: {
    backgroundColor: '#555',
  },
  modalSaveButton: {
    backgroundColor: '#218690',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
    marginTop: 20,
  },
  categoryContent: {
    flex: 1,
    marginBottom: 10,
  },
});