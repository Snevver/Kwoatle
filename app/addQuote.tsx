import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useLocalSearchParams } from "expo-router";
import globalStyles from "../styles/globalStyles";

type Category = {
    id: number;
    title: string;
    color: string;
    amountOfQuotes: number;
};

export default function AddQuote() {
    const [quoteText, setQuoteText] = useState("");
    const [quoteAuthor, setQuoteAuthor] = useState("");
    const [category, setCategory] = useState<Category | null>(null);
    const router = useRouter();
    const { categoryId } = useLocalSearchParams();

    useEffect(() => {
        if (!categoryId) {
            router.back();
            return;
        }

        // Load category details
        const loadCategory = async () => {
            try {
                const storedCategories = await AsyncStorage.getItem(
                    "categories"
                );
                if (storedCategories) {
                    const categories = JSON.parse(storedCategories);
                    const currentCategory = categories.find(
                        (cat: Category) => cat.id === Number(categoryId)
                    );

                    if (currentCategory) {
                        setCategory(currentCategory);
                    } else {
                        router.back();
                    }
                }
            } catch (error) {
                console.error("Error loading category:", error);
            }
        };

        loadCategory();
    }, [categoryId]);

    const saveQuote = async () => {
        if (!quoteText.trim() || !categoryId) return;

        try {
            // Save the new quote
            const storedQuotes = await AsyncStorage.getItem("quotes");
            const quotes = storedQuotes ? JSON.parse(storedQuotes) : [];

            const newQuote = {
                id: Date.now(),
                text: quoteText,
                author: quoteAuthor.trim() || "Unknown",
                categoryId: Number(categoryId),
                dateAdded: new Date().toISOString(),
            };

            quotes.push(newQuote);
            await AsyncStorage.setItem("quotes", JSON.stringify(quotes));

            // Update the category's quote count
            const storedCategories = await AsyncStorage.getItem("categories");
            if (storedCategories) {
                const categories = JSON.parse(storedCategories);
                const updatedCategories = categories.map((cat: Category) => {
                    if (cat.id === Number(categoryId)) {
                        return {
                            ...cat,
                            amountOfQuotes: cat.amountOfQuotes + 1,
                        };
                    }
                    return cat;
                });

                await AsyncStorage.setItem(
                    "categories",
                    JSON.stringify(updatedCategories)
                );
            }

            // Navigate back to quotes overview
            router.push({
                pathname: "/quotesOverview",
                params: { categoryId },
            });
        } catch (error) {
            console.error("Error saving quote:", error);
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
                    <Text style={[styles.backButtonText, { fontSize: 35, marginBottom: 12 }]}>
                        ←
                    </Text>
                </Pressable>
                <View style={{ flexShrink: 1, maxWidth: "80%" }}>
                    <Text
                        style={[
                            globalStyles.text,
                            { fontSize: 30, flexWrap: "wrap", textAlign: "center" },
                        ]}
                        numberOfLines={3}
                        ellipsizeMode="tail"
                    >
                        Add quote to {category?.title || "Category"}
                    </Text>
                </View>
            </View>


            <View style={styles.form}>
                <Text style={[globalStyles.text, styles.label]}>
                    Enter your quote
                </Text>
                <TextInput
                    style={[globalStyles.text, styles.input, { color: "#000" }]}
                    placeholder="Type your quote here"
                    placeholderTextColor="#999"
                    value={quoteText}
                    onChangeText={setQuoteText}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                />

                <Text
                    style={[globalStyles.text, styles.label, { marginTop: 40 }]}
                >
                    Enter the author of the quote
                </Text>
                <TextInput
                    style={[
                        globalStyles.text,
                        styles.authorInput,
                        { color: "#000" },
                    ]}
                    placeholder="E.g. John Doe"
                    placeholderTextColor="#999"
                    value={quoteAuthor}
                    onChangeText={setQuoteAuthor}
                />

                <Pressable
                    style={({pressed}) => [
                        styles.saveButton,
                        { backgroundColor: category?.color || "#218690" },
                        pressed && {opacity: 0.8}
                    ]}
                    onPress={saveQuote}
                >
                    <Text style={[globalStyles.text, { fontSize: 25 }]}>
                        Save quote
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

// Styling
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#07263B",
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
    headerTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    form: {
        flex: 1,
        padding: 20,
    },
    label: {
        color: "#fff",
        fontSize: 16,
        marginBottom: 10,
    },
    input: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 8,
        fontSize: 16,
        minHeight: 150,
    },
    authorInput: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 8,
        fontSize: 16,
        marginBottom: 15,
    },
    saveButton: {
        marginTop: 30,
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
    },
    saveButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
});
