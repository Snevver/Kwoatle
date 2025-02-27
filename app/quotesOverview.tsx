import React, { useEffect, useState, useRef, createRef } from "react";
import {
    View,
    Text,
    StatusBar,
    Pressable,
    Image,
    ScrollView,
    StyleSheet,
    Modal,
    TextInput,
    Share,
    ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import globalStyles from "../styles/globalStyles";
import ConfirmationDialog from "../components/confirmationDialog";
import ViewShot from "react-native-view-shot";
import { Feather } from "@expo/vector-icons";

type Quote = {
    id: number;
    text: string;
    author: string;
    categoryId: number;
    dateAdded: string;
};

type Category = {
    id: number;
    title: string;
    color: string;
    amountOfQuotes: number;
};

export default function QuotesOverview() {
    const router = useRouter();
    const { categoryId } = useLocalSearchParams();
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [category, setCategory] = useState<Category | null>(null);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [quoteToDelete, setQuoteToDelete] = useState<number | null>(null);
    const [isSharing, setIsSharing] = useState<number | null>(null);

    // Ref for each quote
    const quoteRefs = useRef<{ [key: number]: React.RefObject<ViewShot> }>({});

    // Edit quote state
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [quoteToEdit, setQuoteToEdit] = useState<Quote | null>(null);
    const [editedQuoteText, setEditedQuoteText] = useState("");
    const [editedQuoteAuthor, setEditedQuoteAuthor] = useState("");

    useEffect(() => {
        loadCategoryAndQuotes();
    }, [categoryId]);

    useEffect(() => {
        // Maak refs aan voor elke quote
        quotes.forEach(quote => {
            if (!quoteRefs.current[quote.id]) {
                quoteRefs.current[quote.id] = createRef<ViewShot>();
            }
        });
    }, [quotes]);

    const loadCategoryAndQuotes = async () => {
        if (!categoryId) {
            router.back();
            return;
        }

        try {
            // Load category details
            const storedCategories = await AsyncStorage.getItem("categories");
            if (storedCategories) {
                const categories = JSON.parse(storedCategories) as Category[];
                const currentCategory = categories.find(
                    (cat) => cat.id === Number(categoryId)
                );
                if (currentCategory) {
                    setCategory(currentCategory);
                }
            }

            // Load quotes for this category
            const storedQuotes = await AsyncStorage.getItem("quotes");
            if (storedQuotes) {
                const allQuotes = JSON.parse(storedQuotes) as Quote[];
                const categoryQuotes = allQuotes.filter(
                    (quote) => quote.categoryId === Number(categoryId)
                );
                setQuotes(categoryQuotes);
            } else {
                setQuotes([]);
            }
        } catch (error) {
            console.error("Error loading data:", error);
        }
    };

    const shareQuote = async (quote: Quote) => {
        try {
            const ref = quoteRefs.current[quote.id];
            if (!ref?.current) return;
            
            // Show loading indicator for this specific quote
            setIsSharing(quote.id);
            
            // Capture the quote view
            const uri = ref.current && ref.current.capture ? await ref.current.capture() : null;
            if (!uri) {
                setIsSharing(null);
                return;
            }
            
            // Share the image with enhanced message
            await Share.share({
                url: uri,
                message: `"${quote.text}" \n— ${quote.author}\n\nShared from Kwoatle`,
                title: "Share Inspiring Quote"
            });
            
            setIsSharing(null);
        } catch (error) {
            setIsSharing(null);
            console.error("Error sharing quote:", error);
        }
    };

    const goToAddQuote = () => {
        if (categoryId) {
            router.push({
                pathname: "/addQuote",
                params: { categoryId },
            });
        }
    };

    const openEditModal = (quote: Quote) => {
        setQuoteToEdit(quote);
        setEditedQuoteText(quote.text);
        setEditedQuoteAuthor(quote.author);
        setEditModalVisible(true);
    };

    const cancelEdit = () => {
        setEditModalVisible(false);
        setQuoteToEdit(null);
        setEditedQuoteText("");
        setEditedQuoteAuthor("");
    };

    const saveEditedQuote = async () => {
        if (!quoteToEdit || !editedQuoteText.trim()) return;

        try {
            const storedQuotes = await AsyncStorage.getItem("quotes");
            if (storedQuotes) {
                const allQuotes = JSON.parse(storedQuotes) as Quote[];
                const updatedQuotes = allQuotes.map((quote) => {
                    if (quote.id === quoteToEdit.id) {
                        return {
                            ...quote,
                            text: editedQuoteText.trim(),
                            author: editedQuoteAuthor.trim() || "Unknown",
                        };
                    }
                    return quote;
                });

                await AsyncStorage.setItem(
                    "quotes",
                    JSON.stringify(updatedQuotes)
                );
                loadCategoryAndQuotes();
                setEditModalVisible(false);
                setQuoteToEdit(null);
                setEditedQuoteText("");
                setEditedQuoteAuthor("");
            }
        } catch (error) {
            console.error("Error updating quote:", error);
        }
    };

    const confirmDeleteQuote = (id: number) => {
        setQuoteToDelete(id);
        setDeleteDialogVisible(true);
    };

    const cancelDelete = () => {
        setDeleteDialogVisible(false);
        setQuoteToDelete(null);
    };

    const deleteQuote = async () => {
        if (quoteToDelete === null) return;

        try {
            const id = quoteToDelete;
            setDeleteDialogVisible(false);
            setQuoteToDelete(null);

            const storedQuotes = await AsyncStorage.getItem("quotes");
            if (!storedQuotes) return;

            let allQuotes: Quote[] = JSON.parse(storedQuotes);
            const foundQuote = allQuotes.find((quote) => quote.id === id);

            if (!foundQuote) return;

            // Remove the quote from the list
            allQuotes = allQuotes.filter((quote) => quote.id !== id);
            await AsyncStorage.setItem("quotes", JSON.stringify(allQuotes));

            // Update category's amountOfQuotes
            const storedCategories = await AsyncStorage.getItem("categories");
            if (storedCategories) {
                let categories: Category[] = JSON.parse(storedCategories);
                const categoryIndex = categories.findIndex(
                    (cat) => cat.id === foundQuote.categoryId
                );

                if (
                    categoryIndex !== -1 &&
                    categories[categoryIndex].amountOfQuotes > 0
                ) {
                    categories[categoryIndex].amountOfQuotes -= 1;
                    await AsyncStorage.setItem(
                        "categories",
                        JSON.stringify(categories)
                    );
                    setCategory(categories[categoryIndex]);
                }
            }

            // Update state after deletion
            setQuotes(
                allQuotes.filter(
                    (quote) => quote.categoryId === Number(categoryId)
                )
            );
        } catch (error) {
            console.error("Error deleting quote:", error);
        }
    };

    // Add date
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        } catch (e) {
            return "Unknown date";
        }
    };

    const renderQuoteItem = (item: Quote) => {
        if (!quoteRefs.current[item.id]) {
            quoteRefs.current[item.id] = createRef<ViewShot>();
        }

        return (
            <View
                style={[
                    styles.quoteCard,
                    { backgroundColor: category?.color || "#76DAE5" },
                ]}
            >
                <ViewShot
                    ref={quoteRefs.current[item.id]}
                    options={{ format: "png", quality: 0.9 }}
                    style={styles.quoteContent}
                >
                    <Text style={[globalStyles.text, styles.quoteText]}>
                        "{item.text}"
                    </Text>

                    <View style={styles.quoteDetails}>
                        <Text
                            style={[
                                globalStyles.text,
                                { fontSize: 18, paddingBottom: 5 },
                            ]}
                        >
                            — {item.author || "Unknown"}
                        </Text>

                        <Text style={[globalStyles.text, styles.quoteDate]}>
                            Added:{" "}
                            {item.dateAdded
                                ? formatDate(item.dateAdded)
                                : "Unknown date"}
                        </Text>
                    </View>
                    
                    <View style={styles.watermark}>
                        <Text style={styles.watermarkText}>Kwoatle</Text>
                    </View>
                </ViewShot>

                <View style={styles.buttonContainer}>
                    {/* Share button with enhanced styling */}
                    <Pressable
                        onPress={() => shareQuote(item)}
                        style={[
                            styles.actionButton, 
                            styles.shareButton,
                            isSharing === item.id && styles.sharingInProgress
                        ]}
                        disabled={isSharing === item.id}
                        testID={`share-quote-${item.id}`}
                    >
                        {isSharing === item.id ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <>
                                <Feather name="share-2" size={14} color="#fff" style={{marginRight: 5}} />
                                <Text style={[globalStyles.text, styles.actionButtonText]}>
                                    Share
                                </Text>
                            </>
                        )}
                    </Pressable>

                    {/* Edit button */}
                    <Pressable
                        onPress={() => openEditModal(item)}
                        style={[styles.actionButton, styles.editButton]}
                        testID={`edit-quote-${item.id}`}
                    >
                        <Feather name="edit-2" size={14} color="#fff" style={{marginRight: 5}} />
                        <Text style={[globalStyles.text, styles.actionButtonText]}>
                            Edit
                        </Text>
                    </Pressable>

                    {/* Delete button */}
                    <Pressable
                        onPress={() => confirmDeleteQuote(item.id)}
                        style={[styles.actionButton, styles.deleteButton]}
                        testID={`delete-quote-${item.id}`}
                    >
                        <Feather name="trash-2" size={14} color="#fff" style={{marginRight: 5}} />
                        <Text style={[globalStyles.text, styles.actionButtonText]}>
                            Delete
                        </Text>
                    </Pressable>
                </View>
            </View>
        );
    };

    const goBack = () => {
        router.push("/dashboard");
    };

    const EmptyListComponent = () => (
        <View style={styles.emptyState}>
            <Text style={[globalStyles.text, styles.emptyStateText]}>
                No quotes yet. Add your first quote!
            </Text>
        </View>
    );

    return (
        <>
            <StatusBar hidden={true} />
            <View style={styles.container}>
                {/* Background image */}
                <View style={styles.backgroundContainer}>
                    <Image
                        source={require("../assets/images/background.png")}
                        style={styles.backgroundImage}
                        resizeMode="cover"
                    />
                </View>

                <View style={styles.header}>
                    <Pressable onPress={goBack} style={styles.backButton}>
                        <Text
                            style={[
                                styles.backButtonText,
                                { fontSize: 35, marginBottom: 12 },
                            ]}
                        >
                            ←
                        </Text>
                    </Pressable>
                    <View style={{ flexShrink: 1, maxWidth: "80%" }}>
                        <Text
                            style={[
                                globalStyles.text,
                                { fontSize: 40, flexWrap: "wrap", textAlign: "center" },
                            ]}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {category?.title || "Quotes"}
                        </Text>
                    </View>
                </View>


                {/* Content area */}
                <View style={styles.scrollableContainer}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    >
                        {quotes.length === 0 ? (
                            <EmptyListComponent />
                        ) : (
                            quotes.map((quote) => (
                                <React.Fragment key={quote.id}>
                                    {renderQuoteItem(quote)}
                                </React.Fragment>
                            ))
                        )}
                    </ScrollView>
                </View>

                {/* Add button */}
                <Pressable style={styles.addButton} onPress={goToAddQuote}>
                    <Text style={[globalStyles.text, { fontSize: 50 }]}>+</Text>
                </Pressable>

                {/* Confirmation Dialog */}
                <ConfirmationDialog
                    visible={deleteDialogVisible}
                    title="Delete Quote"
                    message="Are you sure you want to delete this quote? This action cannot be undone."
                    confirmText="Delete"
                    cancelText="Cancel"
                    onConfirm={deleteQuote}
                    onCancel={cancelDelete}
                    color="#AA5555"
                />

                {/* Edit Quote Modal */}
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
                                    { fontSize: 35, marginBottom: 15 },
                                ]}
                            >
                                Edit Quote
                            </Text>

                            <Text style={[globalStyles.text, { fontSize: 20 }]}>
                                Quote Text
                            </Text>
                            <TextInput
                                style={[
                                    globalStyles.text,
                                    styles.modalInputMultiline,
                                    { color: "#000" },
                                ]}
                                value={editedQuoteText}
                                onChangeText={setEditedQuoteText}
                                placeholder="Enter quote text"
                                placeholderTextColor="#999"
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                            />

                            <Text style={[globalStyles.text, { fontSize: 20 }]}>
                                Quote Author
                            </Text>
                            <TextInput
                                style={[
                                    globalStyles.text,
                                    styles.modalInput,
                                    { color: "#000" },
                                ]}
                                value={editedQuoteAuthor}
                                onChangeText={setEditedQuoteAuthor}
                                placeholder="E.g. John Doe"
                                placeholderTextColor="#999"
                            />

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
                                        {
                                            backgroundColor:
                                                category?.color || "#218690",
                                        },
                                    ]}
                                    onPress={saveEditedQuote}
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
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#07263B",
    },
    backgroundContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
    },
    backgroundImage: {
        width: "100%",
        height: "100%",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 20,
    },
    backButton: {
        marginRight: 10,
    },
    backButtonText: {
        color: "#fff",
        fontSize: 24,
    },
    scrollableContainer: {
        position: "absolute",
        top: 100,
        left: 0,
        right: 0,
        bottom: 140,
        paddingHorizontal: 20,
    },
    quoteCard: {
        padding: 20,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    quoteContent: {
        padding: 5,
        borderRadius: 8,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        position: "relative",
    },
    quoteText: {
        color: "#fff",
        fontSize: 18,
        lineHeight: 24,
        marginBottom: 12,
    },
    quoteDetails: {
        marginBottom: 10,
    },
    quoteAuthor: {
        color: "#fff",
        fontSize: 16,
        marginBottom: 4,
        fontStyle: "italic",
    },
    quoteDate: {
        color: "#fff",
        fontSize: 14,
        opacity: 0.8,
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
    shareButton: {
        backgroundColor: "#4CAF50",
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
    sharingInProgress: {
        opacity: 0.7,
    },
    watermark: {
        position: "absolute",
        bottom: 5,
        right: 5,
        opacity: 0.6
    },
    watermarkText: {
        color: "#fff",
        fontSize: 10,
        fontStyle: "italic"
    },
    emptyState: {
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
        height: 200,
    },
    emptyStateText: {
        color: "#fff",
        textAlign: "center",
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
    modalInputMultiline: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 8,
        fontSize: 16,
        marginBottom: 20,
        minHeight: 120,
        textAlignVertical: "top",
    },
    modalButtonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
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
});