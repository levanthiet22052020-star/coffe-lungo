import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function PersonalDetailsScreen() {
    const router = useRouter();
    const [name, setName] = useState("Nguyen Van A");
    const [email, setEmail] = useState("vana@gmail.com");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="#52555A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Setting</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.avatarContainer}>
                <Image
                    source={require("../assets/images/avatar.png")}
                    style={styles.avatar}
                />
            </View>

            <View style={styles.form}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholderTextColor="#52555A"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholderTextColor="#52555A"
                        keyboardType="email-address"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Password"
                        placeholderTextColor="#52555A"
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                        style={styles.eyeButton}
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        <Ionicons
                            name={showPassword ? "eye-outline" : "eye-off-outline"}
                            size={20}
                            color="#52555A"
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Re-type password"
                        placeholderTextColor="#52555A"
                        secureTextEntry={!showConfirmPassword}
                    />
                    <TouchableOpacity
                        style={styles.eyeButton}
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        <Ionicons
                            name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                            size={20}
                            color="#52555A"
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0C0F14",
        paddingHorizontal: 20,
        paddingTop: 50,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 30,
    },
    headerTitle: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 20,
        color: "#FFFFFF",
    },
    avatarContainer: {
        alignItems: "center",
        marginBottom: 40,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 20,
    },
    form: {
        marginBottom: 30,
    },
    inputContainer: {
        backgroundColor: "#0C0F14",
        borderWidth: 1,
        borderColor: "#252A32",
        borderRadius: 15,
        marginBottom: 15,
        flexDirection: "row",
        alignItems: "center",
    },
    input: {
        flex: 1,
        fontFamily: "Poppins_400Regular",
        fontSize: 14,
        color: "#FFFFFF",
        paddingHorizontal: 20,
        paddingVertical: 18,
    },
    eyeButton: {
        paddingHorizontal: 20,
    },
    saveButton: {
        backgroundColor: "#D17842",
        borderRadius: 20,
        paddingVertical: 18,
        alignItems: "center",
    },
    saveButtonText: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 16,
        color: "#FFFFFF",
    },
});
