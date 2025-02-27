import React, { useEffect, useState, useCallback, useRef } from "react";
import {
    View,
    Text,
    StatusBar,
    ScrollView,
    Image,
    Pressable,
    StyleSheet,
    TextInput,
    Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import globalStyles from "../styles/globalStyles";
import ConfirmationDialog from "../components/confirmationDialog";
import { Feather } from "@expo/vector-icons";
import Animated, {
    useAnimatedStyle,
    useAnimatedGestureHandler,
    useSharedValue,
    withTiming,
    runOnJS,
} from "react-native-reanimated";;
import { PanGestureHandler, LongPressGestureHandler, State, GestureHandlerRootView } from "react-native-gesture-handler";

// define the types in the category object
type Category = {
    id: number;
    title: string;
    color: string;
    amountOfQuotes: number;
    order?: number;
};

// Array of color options
const colorOptions: string[] = ['#218690', '#76DAE5', '#4E9B8F', '#247BA0', '#50514F'];
// Placeholder for custom color
const CUSTOM_COLOR: string = 'custom';

export default function Dashboard() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<number | null>(
        null
    );
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
    const [editedCategoryName, setEditedCategoryName] = useState("");
    const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
    const [customColor, setCustomColor] = useState<string>('#000000');
    const [showColorInput, setShowColorInput] = useState<boolean>(false);
    const [hexInput, setHexInput] = useState<string>('#000000');
    const [isReordering, setIsReordering] = useState(false);
    const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);
    const scrollViewRef = useRef<ScrollView>(null);
    const router = useRouter();

    const loadCategories = async () => {
        try {
            const storedCategories = await AsyncStorage.getItem("categories");
            if (storedCategories) {
                let parsedCategories = JSON.parse(storedCategories);
                
                // If categories don't have order property, add it
                if (parsedCategories.length > 0 && parsedCategories[0].order === undefined) {
                    parsedCategories = parsedCategories.map((cat: Category, index: number) => ({
                        ...cat,
                        order: index
                    }));
                    await AsyncStorage.setItem("categories", JSON.stringify(parsedCategories));
                }
                
                // Sort categories by order
                parsedCategories.sort((a: Category, b: Category) => 
                    (a.order !== undefined && b.order !== undefined) ? a.order - b.order : 0
                );
                
                setCategories(parsedCategories);
            } else {
                setCategories([]);
            }
        } catch (error) {
            console.error("Error loading categories:", error);
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
        router.push("/addCategory");
    };

    const goToQuotesOverview = (categoryId: number) => {
        if (isReordering) return;
        router.push({
            pathname: "/quotesOverview",
            params: { categoryId },
        });
    };

    const confirmDeleteCategory = (categoryId: number) => {
        if (isReordering) return;
        setCategoryToDelete(categoryId);
        setDeleteDialogVisible(true);
    };

    const cancelDelete = () => {
        setDeleteDialogVisible(false);
        setCategoryToDelete(null);
    };

    const openEditModal = (category: Category) => {
        if (isReordering) return;
        setCategoryToEdit(category);
        setEditedCategoryName(category.title);
        
        // Check if the category color is in our predefined colors
        if (colorOptions.includes(category.color)) {
            setSelectedColor(category.color);
        } else {
            // If not, it's a custom color
            setSelectedColor(CUSTOM_COLOR);
            setCustomColor(category.color);
            setHexInput(category.color);
        }
        
        setEditModalVisible(true);
    };

    const cancelEdit = () => {
        setEditModalVisible(false);
        setCategoryToEdit(null);
        setEditedCategoryName("");
        setShowColorInput(false);
    };

    const saveEditedCategory = async () => {
        if (!categoryToEdit || !editedCategoryName.trim()) return;

        try {
            const storedCategories = await AsyncStorage.getItem("categories");
            if (storedCategories) {
                const categories = JSON.parse(storedCategories);
                const updatedCategories = categories.map((cat: Category) => {
                    if (cat.id === categoryToEdit.id) {
                        return {
                            ...cat,
                            title: editedCategoryName.trim(),
                            color: selectedColor === CUSTOM_COLOR ? customColor : selectedColor,
                        };
                    }
                    return cat;
                });

                await AsyncStorage.setItem(
                    "categories",
                    JSON.stringify(updatedCategories)
                );
                loadCategories();
                setEditModalVisible(false);
                setCategoryToEdit(null);
                setEditedCategoryName("");
                setShowColorInput(false);
            }
        } catch (error) {
            console.error("Error updating category:", error);
        }
    };

    const deleteCategory = async () => {
        if (categoryToDelete === null) return;

        try {
            const categoryId = categoryToDelete;
            setDeleteDialogVisible(false);
            setCategoryToDelete(null);

            // Delete the category
            const storedCategories = await AsyncStorage.getItem("categories");
            if (storedCategories) {
                const categories = JSON.parse(storedCategories);
                const updatedCategories = categories.filter(
                    (cat: Category) => cat.id !== categoryId
                );
                
                // Update order values after deletion
                const reorderedCategories = updatedCategories.map((cat: Category, index: number) => ({
                    ...cat,
                    order: index
                }));
                
                await AsyncStorage.setItem(
                    "categories",
                    JSON.stringify(reorderedCategories)
                );

                // Also delete all quotes associated with this category
                const storedQuotes = await AsyncStorage.getItem("quotes");
                if (storedQuotes) {
                    const quotes = JSON.parse(storedQuotes);
                    const filteredQuotes = quotes.filter(
                        (quote: any) => quote.categoryId !== categoryId
                    );
                    await AsyncStorage.setItem(
                        "quotes",
                        JSON.stringify(filteredQuotes)
                    );
                }

                loadCategories();
            }
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

    const saveNewOrder = async () => {
        try {
            const updatedCategories = categories.map((cat, index) => ({
                ...cat,
                order: index
            }));
            
            await AsyncStorage.setItem("categories", JSON.stringify(updatedCategories));
            setIsReordering(false);
        } catch (error) {
            console.error("Error saving new order:", error);
        }
    };

    const moveCategory = (fromIndex: number, toIndex: number) => {
        if (fromIndex === toIndex) return;
        
        const newCategories = [...categories];
        const [movedItem] = newCategories.splice(fromIndex, 1);
        newCategories.splice(toIndex, 0, movedItem);
        setCategories(newCategories);
    };

    const onLongPress = (index: number) => {
        setIsReordering(true);
        setActiveItemIndex(index);
    };

    const handleColorSelect = (color: string): void => {
        if (color === CUSTOM_COLOR) {
            setSelectedColor(CUSTOM_COLOR);
            setShowColorInput(true);
        } else {
            setSelectedColor(color);
            setShowColorInput(false);
        }
    };

    const confirmCustomColor = (): void => {
        // Validate hex code format
        const hexRegex = /^#([0-9A-F]{6})$/i;
        if (hexRegex.test(hexInput)) {
            setCustomColor(hexInput);
            setShowColorInput(false);
        } else {
            setCustomColor('#218690');
        }
    };

    const CategoryItem = useCallback(
        ({ item, index }: { item: Category; index: number }) => {
            const y = useSharedValue(0);
            const itemHeight = 160;
            
            const panGesture = useAnimatedGestureHandler({
                onStart: (_, ctx: any) => {
                    ctx.startY = y.value;
                    runOnJS(setActiveItemIndex)(index);
                },
                onActive: (event, ctx: any) => {
                    y.value = ctx.startY + event.translationY;
                    
                    // Calculate possible new index
                    const newIndex = Math.max(
                        0,
                        Math.min(
                            Math.round((ctx.startY + event.translationY) / itemHeight) + index,
                            categories.length - 1
                        )
                    );
                    
                    if (newIndex !== index && newIndex >= 0 && newIndex < categories.length) {
                        runOnJS(moveCategory)(index, newIndex);
                        runOnJS(setActiveItemIndex)(newIndex);
                    }
                },
                onEnd: () => {
                    y.value = withTiming(0);
                },
            });
            
            const animatedStyle = useAnimatedStyle(() => {
                return {
                    transform: [{ translateY: y.value }],
                    zIndex: activeItemIndex === index ? 1 : 0,
                };
            });

            const onHandlerStateChange = (event: any) => {
                if (event.nativeEvent.state === State.ACTIVE) {
                    onLongPress(index);
                }
            };
            
            if (isReordering) {
                return (
                    <PanGestureHandler onGestureEvent={panGesture}>
                        <Animated.View style={[animatedStyle]}>
                            <View
                                style={[
                                    styles.categoryBox,
                                    { backgroundColor: item.color },
                                    activeItemIndex === index && styles.activeReorderItem,
                                    isReordering && styles.reorderingItem
                                ]}
                            >
                                <View style={styles.categoryContent}>
                                    <Text
                                        style={[
                                            globalStyles.text,
                                            { fontSize: 30 },
                                        ]}
                                    >
                                        {item.title}
                                    </Text>
                                    <Text
                                        style={[
                                            globalStyles.text,
                                            styles.quoteCountText,
                                        ]}
                                    >
                                        {item.amountOfQuotes}{" "}
                                        {item.amountOfQuotes === 1
                                            ? "quote"
                                            : "quotes"}
                                    </Text>
                                </View>
                                <View style={styles.reorderIndicatorContainer}>
                                    <Feather name="menu" size={24} color="#fff" />
                                </View>
                            </View>
                        </Animated.View>
                    </PanGestureHandler>
                );
            }

            return (
                <LongPressGestureHandler
                    onHandlerStateChange={onHandlerStateChange}
                    minDurationMs={500}
                >
                    <View>
                        <Pressable
                            onPress={() => goToQuotesOverview(item.id)}
                        >
                            <View
                                style={[
                                    styles.categoryBox,
                                    { backgroundColor: item.color },
                                ]}
                            >
                                <View style={styles.categoryContent}>
                                    <Text
                                        style={[
                                            globalStyles.text,
                                            { fontSize: 30 },
                                        ]}
                                    >
                                        {item.title}
                                    </Text>
                                    <Text
                                        style={[
                                            globalStyles.text,
                                            styles.quoteCountText,
                                        ]}
                                    >
                                        {item.amountOfQuotes}{" "}
                                        {item.amountOfQuotes === 1
                                            ? "quote"
                                            : "quotes"}
                                    </Text>
                                </View>

                                <View style={styles.buttonContainer}>
                                    {/* Edit button */}
                                    <Pressable
                                        onPress={(e) => {
                                            e.stopPropagation();
                                            openEditModal(item);
                                        }}
                                        style={[
                                            styles.actionButton,
                                            styles.editButton,
                                        ]}
                                    >
                                        <Feather name="edit-2" size={14} color="#fff" style={{marginRight: 5}} />
                                        <Text style={[globalStyles.text, styles.actionButtonText]}>
                                            Edit
                                        </Text>

                                    </Pressable>

                                    {/* Delete button */}
                                    <Pressable
                                        onPress={(e) => {
                                            e.stopPropagation();
                                            confirmDeleteCategory(
                                                item.id
                                            );
                                        }}
                                        style={[
                                            styles.actionButton,
                                            styles.deleteButton,
                                        ]}
                                    >
                                        <Feather name="trash-2" size={14} color="#fff" style={{marginRight: 5}} />
                                        <Text style={[globalStyles.text, styles.actionButtonText]}>
                                            Delete
                                        </Text>
                                    </Pressable>
                                </View>
                            </View>
                        </Pressable>
                    </View>
                </LongPressGestureHandler>
            );
        },
        [isReordering, categories, activeItemIndex]
    );

    return (
        <>
            <StatusBar hidden={true} />
            <GestureHandlerRootView style={{ flex: 1 }}>
                <View style={styles.mainContainer}>
                    {/* Background image */}
                    <View style={styles.backgroundContainer}>
                        <Image
                            source={require("../assets/images/background.png")}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    </View>

                    {/* Header */}
                    <View style={styles.headerContainer}>
                        <Text
                            style={[
                                globalStyles.text,
                                { fontSize: 40, marginTop: -25 },
                            ]}
                        >
                            Kwoatle
                        </Text>
                        <Text
                            style={[
                                globalStyles.text,
                                { fontSize: 25, color: '#cfcfcf' },
                            ]}
                        >
                            Categories
                        </Text>
                    </View>

                    {/* Scrollable list of categories */}
                    <View style={styles.scrollableContainer}>
                        <ScrollView
                            ref={scrollViewRef}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 20 }}
                            scrollEnabled={!isReordering}
                        >
                            {categories.length > 0 ? (
                                categories.map((category, index) => (
                                    <CategoryItem key={category.id} item={category} index={index} />
                                ))
                            ) : (
                                <Text style={[globalStyles.text, styles.emptyText]}>
                                    No categories yet. Add your first category!
                                </Text>
                            )}
                        </ScrollView>
                    </View>

                    {/* Category add button or Done button when reordering */}
                    <Pressable 
                        style={[
                            styles.addButton, 
                            isReordering && styles.doneButton
                        ]} 
                        onPress={isReordering ? saveNewOrder : goToAddCategory}
                    >
                        <Text
                            style={[
                                globalStyles.text,
                                isReordering 
                                    ? { fontSize: 24 } 
                                    : { fontSize: 50, marginBottom: 11 },
                            ]}
                        >
                            {isReordering ? "Done" : "+"}
                        </Text>
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
                                <Text
                                    style={[
                                        globalStyles.text,
                                        { fontSize: 30, marginBottom: 20 },
                                    ]}
                                >
                                    Edit Category
                                </Text>

                                <Text
                                    style={[globalStyles.text, styles.modalLabel]}
                                >
                                    Category Name
                                </Text>
                                <TextInput
                                    style={[
                                        globalStyles.text,
                                        styles.modalInput,
                                        { color: "#000" },
                                    ]}
                                    value={editedCategoryName}
                                    onChangeText={setEditedCategoryName}
                                    placeholder="Enter category name"
                                    placeholderTextColor="#999"
                                />

                                <Text
                                    style={[
                                        globalStyles.text,
                                        styles.label,
                                        { marginBottom: 5 },
                                    ]}
                                >
                                    Category Color
                                </Text>
                                <View style={styles.colorPicker}>
                                    {colorOptions.map((color) => (
                                        <Pressable
                                            key={color}
                                            style={[
                                                styles.colorOption,
                                                { backgroundColor: color },
                                                selectedColor === color &&
                                                    styles.selectedColorOption,
                                            ]}
                                            onPress={() => handleColorSelect(color)}
                                        />
                                    ))}
                                </View>

                                <View style={styles.customColorContainer}>
                                    <Text style={[globalStyles.text, { fontSize: 16, marginTop: 15, marginBottom: 5 }]}>
                                        Or choose custom color
                                    </Text>
                                    <View style={styles.customColorRow}>
                                        <Pressable
                                            style={[
                                                styles.customColorOption,
                                                { 
                                                    backgroundColor: customColor,
                                                    borderWidth: 1,
                                                    borderColor: '#FFF'
                                                },
                                                selectedColor === CUSTOM_COLOR && styles.selectedColorOption,
                                            ]}
                                            onPress={() => handleColorSelect(CUSTOM_COLOR)}
                                        >
                                            <Text style={styles.customColorText}>+</Text>
                                        </Pressable>
                                        
                                        {showColorInput && (
                                            <View style={styles.hexInputContainer}>
                                                <TextInput
                                                    style={styles.hexInput}
                                                    value={hexInput}
                                                    onChangeText={setHexInput}
                                                    placeholder="#RRGGBB"
                                                    placeholderTextColor="#999"
                                                    autoCapitalize="characters"
                                                    maxLength={7}
                                                />
                                                <View style={styles.confirmColorButtonContainer}>
                                                    <Pressable 
                                                        style={styles.confirmColorButton}
                                                        onPress={confirmCustomColor}
                                                    >
                                                        <Text style={[globalStyles.text, styles.applyButton, { color: '#fff' }]}>Apply</Text>
                                                    </Pressable>
                                                </View>
                                            </View>
                                        )}
                                    </View>
                                </View>

                                <View style={styles.modalButtonsContainer}>
                                    <Pressable
                                        style={[
                                            styles.modalButton,
                                            styles.modalCancelButton,
                                        ]}
                                        onPress={cancelEdit}
                                    >
                                        <Text
                                            style={[
                                                globalStyles.text,
                                                { fontSize: 20 },
                                            ]}
                                        >
                                            Cancel
                                        </Text>
                                    </Pressable>
                                    <Pressable
                                        style={[
                                            styles.modalButton,
                                            styles.modalSaveButton,
                                            { backgroundColor: selectedColor === CUSTOM_COLOR ? customColor : selectedColor },
                                        ]}
                                        onPress={saveEditedCategory}
                                    >
                                        <Text
                                            style={[
                                                globalStyles.text,
                                                { fontSize: 20 },
                                            ]}
                                        >
                                            Save
                                        </Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
            </GestureHandlerRootView>
        </>
    );
}

// Styling
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#07263B",
    },
    backgroundContainer: {
        flex: 1,
    },
    image: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    headerContainer: {
        position: "absolute",
        top: 65,
        left: 0,
        right: 0,
        alignItems: "center",
    },
    scrollableContainer: {
        position: "absolute",
        top: 130,
        left: 0,
        right: 0,
        bottom: 140,
        paddingHorizontal: 20,
    },
    categoryBox: {
        minHeight: 140,
        borderRadius: 15,
        marginBottom: 20,
        padding: 15,
        justifyContent: "space-between",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    categoryText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#ffffff",
    },
    quoteCountText: {
        fontSize: 16,
        color: "#ffffff",
        opacity: 0.9,
    },
    buttonContainer: {
        flexDirection: "row",
        marginTop: 10,
    },
    actionButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginRight: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    editButton: {
        backgroundColor: "#2186D0",
    },
    deleteButton: {
        backgroundColor: "#AA5555",
    },
    actionButtonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
    emptyText: {
        color: "white",
        textAlign: "center",
        marginTop: 40,
        fontSize: 18,
    },
    addButton: {
        position: "absolute",
        bottom: 60,
        left: 20,
        right: 20,
        height: 60,
        backgroundColor: "#218690",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
    },
    doneButton: {
        backgroundColor: "#218690",
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "80%",
        backgroundColor: "#07263B",
        borderRadius: 10,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 20,
        textAlign: "center",
    },
    modalLabel: {
        color: "#fff",
        fontSize: 16,
        marginBottom: 10,
    },
    modalInput: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 8,
        fontSize: 16,
        marginBottom: 20,
    },
    modalButtonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    modalButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        margin: 5,
    },
    modalCancelButton: {
        backgroundColor: "#555",
    },
    modalSaveButton: {
        backgroundColor: "#218690",
    },
    modalButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    colorPicker: {
        flexDirection: "row",
        flexWrap: "wrap",
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
        borderColor: "#fff",
    },
    label: {
        color: "#fff",
        fontSize: 16,
        marginBottom: 10,
        marginTop: 20,
    },
    categoryContent: {
        flex: 1,
        marginBottom: 10,
    },
    reorderingItem: {
        opacity: 0.9,
    },
    activeReorderItem: {
        borderWidth: 2,
        borderColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 6,
        elevation: 8,
    },
    reorderIndicatorContainer: {
        alignItems: "flex-end",
        marginTop: 10,
    },
    instructionsContainer: {
        position: "absolute",
        top: 110,
        left: 0,
        right: 0,
        alignItems: "center",
    },
    instructionsText: {
        color: "#76DAE5",
        fontSize: 14,
    },
    customColorContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginTop: 5,
        width: '100%',
    },
    customColorRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        width: '100%',
    },
    customColorText: {
        color: '#000',
        fontSize: 20,
        fontWeight: 'bold',
    },
    customColorOption: {
        width: 40,
        height: 40,
        borderRadius: 20,
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    hexInputContainer: {
        flexDirection: 'column',
        marginLeft: 10,
        flex: 1,
    },
    hexInput: {
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: 5,
        width: '100%',
        marginBottom: 8,
        color: '#000',
    },
    confirmColorButtonContainer: {
        width: '100%',
    },
    confirmColorButton: {
        backgroundColor: '#218690',
        padding: 8,
        borderRadius: 5,
        alignItems: 'center',
    },
    applyButton: {
        margin: 0,
    },
});