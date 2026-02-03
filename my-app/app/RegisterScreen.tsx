import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { axiosInstance } from "../until/AxiosHelper";

export default function RegisterScreen() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [rePasswordError, setRePasswordError] = useState("");

    function kiemTraEmail(text: string) {
        setEmail(text);
        if (text.length > 0) {
            if (text.includes("@") && text.includes(".")) {
                setEmailError("");
            } else {
                setEmailError("Please enter a valid email address");
            }
        } else {
            setEmailError("");
        }
    }

    async function handleDangKy() {
        let hasError = false;

        if (name.length === 0) {
            setNameError("Name is required");
            hasError = true;
        } else {
            setNameError("");
        }

        if (email.length === 0 || !email.includes("@") || !email.includes(".")) {
            setEmailError("Please enter a valid email address");
            hasError = true;
        } else {
            setEmailError("");
        }

        if (password.length === 0) {
            setPasswordError("Password is required");
            hasError = true;
        } else {
            setPasswordError("");
        }

        if (rePassword.length === 0) {
            setRePasswordError("Please re-type your password");
            hasError = true;
        } else if (password !== rePassword) {
            setRePasswordError("Passwords do not match");
            hasError = true;
        } else {
            setRePasswordError("");
        }

        if (!hasError) {
            setLoading(true);
            try {
                const response = await axiosInstance.post("/register", {
                    name: name,
                    email: email,
                    password: password
                });

                if (response.data) {
                    Alert.alert("Success", "Registration successful!", [
                        { text: "OK", onPress: () => router.push("/LoginScreen") }
                    ]);
                }
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
                Alert.alert("Error", errorMessage);
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Image source={require("../assets/images/logo.png")} style={styles.logo} />

            <Text style={styles.title}>Welcome to Lungo !!</Text>
            <Text style={styles.subtitle}>Register to Continue</Text>

            <View style={styles.inputBox}>
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    placeholderTextColor="#52555A"
                    value={name}
                    onChangeText={(text) => {
                        setName(text);
                        setNameError("");
                    }}
                />
            </View>
            {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

            <View style={styles.inputBox}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#52555A"
                    value={email}
                    onChangeText={kiemTraEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

            <View style={styles.inputBox}>
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#52555A"
                    value={password}
                    onChangeText={(text) => {
                        setPassword(text);
                        setPasswordError("");
                    }}
                    secureTextEntry={!showPassword}
                />
                <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
                    <Text style={styles.eyeText}>{showPassword ? "Hide" : "Show"}</Text>
                </TouchableOpacity>
            </View>
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

            <View style={styles.inputBox}>
                <TextInput
                    style={styles.input}
                    placeholder="Re-type password"
                    placeholderTextColor="#52555A"
                    value={rePassword}
                    onChangeText={(text) => {
                        setRePassword(text);
                        setRePasswordError("");
                    }}
                    secureTextEntry={!showRePassword}
                />
                <TouchableOpacity style={styles.eyeButton} onPress={() => setShowRePassword(!showRePassword)}>
                    <Text style={styles.eyeText}>{showRePassword ? "Hide" : "Show"}</Text>
                </TouchableOpacity>
            </View>
            {rePasswordError ? <Text style={styles.errorText}>{rePasswordError}</Text> : null}

            <TouchableOpacity
                style={[styles.registerButton, loading && styles.registerButtonDisabled]}
                onPress={handleDangKy}
                disabled={loading}
            >
                <Text style={styles.registerText}>{loading ? "Loading..." : "Register"}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/LoginScreen")}>
                <Text style={styles.linkText}>
                    You have an account? Click <Text style={styles.linkOrange}>Sign In</Text>
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0C0F14",
    },
    content: {
        padding: 20,
        paddingTop: 60,
        alignItems: "center",
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    title: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 20,
        color: "#FFFFFF",
        marginBottom: 8,
    },
    subtitle: {
        fontFamily: "Poppins_400Regular",
        fontSize: 12,
        color: "#828282",
        marginBottom: 30,
    },
    inputBox: {
        width: "100%",
        marginBottom: 5,
    },
    input: {
        width: "100%",
        height: 50,
        backgroundColor: "#0C0F14",
        borderWidth: 1,
        borderColor: "#252A32",
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingRight: 60,
        fontFamily: "Poppins_400Regular",
        fontSize: 14,
        color: "#FFFFFF",
    },
    eyeButton: {
        position: "absolute",
        right: 15,
        top: 15,
    },
    eyeText: {
        fontFamily: "Poppins_400Regular",
        fontSize: 12,
        color: "#52555A",
    },
    errorText: {
        fontFamily: "Poppins_400Regular",
        fontSize: 12,
        color: "#FF0000",
        alignSelf: "flex-start",
        marginBottom: 10,
    },
    registerButton: {
        width: "100%",
        height: 55,
        backgroundColor: "#D17842",
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15,
        marginBottom: 20,
    },
    registerButtonDisabled: {
        backgroundColor: "#8B5A2B",
    },
    registerText: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 16,
        color: "#FFFFFF",
    },
    linkText: {
        fontFamily: "Poppins_400Regular",
        fontSize: 12,
        color: "#828282",
    },
    linkOrange: {
        color: "#D17842",
    },
});
