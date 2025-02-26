import React from "react";
import {
    View,
    Text,
    StatusBar,
    Pressable,
    Image,
    Dimensions,
    StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import globalStyles from "../styles/globalStyles";

export default function SplashScreen() {
    const router = useRouter();

    // Send the user to the dashboard
    const goToDashboard = () => {
        console.log("Start button pressed");
        router.push("/dashboard");
    };

    return (
        <>
            {/* Hide the status bar */}
            <StatusBar hidden={true} />

            <View style={styles.container}>
                {/* Background image */}
                <Image
                    source={require("../assets/images/background.png")}
                    style={styles.backgroundImage}
                    resizeMode="cover"
                />

                {/* Titel and quote */}
                <View style={styles.textContainer}>
                    <Text style={[globalStyles.text, styles.title]}>
                        Kwoatle
                    </Text>
                    <Text style={[globalStyles.text, styles.subtitle]}>
                        "Your daily dose of inspiration„
                    </Text>
                </View>

                {/* Start button */}
                <Pressable style={styles.startButton} onPress={goToDashboard}>
                    <Text style={[globalStyles.text, styles.buttonText]}>
                        Start
                    </Text>
                </Pressable>
            </View>
        </>
    );
}

// Styling
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#07263B",
        justifyContent: "center",
        alignItems: "center",
    },
    backgroundImage: {
        position: "absolute",
        width: "100%",
        height: "100%",
    },
    textContainer: {
        alignItems: "center",
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        marginBottom: 300,
    },
    title: {
        fontSize: 65,
    },
    subtitle: {
        fontSize: 20,
        textAlign: "center",
    },
    startButton: {
        position: "absolute",
        width: "80%",
        bottom: 0,
        height: 70,
        backgroundColor: "#218690",
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        marginBottom: 90,
    },
    buttonText: {
        fontSize: 40,
        color: "#fff",
    },
});