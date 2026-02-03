import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { axiosInstance } from "../until/AxiosHelper";
import { useUser } from "../context/UserContext";

export default function LoginScreen() {
    const router = useRouter();
    const { login } = useUser();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [loading, setLoading] = useState(false);

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

    async function handleDangNhap() {
        let hasError = false;

        if (email.length === 0 || !email.includes("@") || !email.includes(".")) {
            setEmailError("Please enter a valid email address");
            hasError = true;
        }

        if (password.length === 0) {
            setPasswordError("Password is required");
            hasError = true;
        } else {
            setPasswordError("");
        }

        if (!hasError) {
            setLoading(true);
            try {
                const response = await axiosInstance.post("/login", {
                    email: email,
                    password: password
                });

                if (response.data) {
                    await login(response.data.user);
                    router.replace("/(tabs)");
                }
            } catch (error: any) {
                const errorMessage = error.response?.data?.error || "Login failed. Please try again.";
                setPasswordError(errorMessage);
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Image source={require("../assets/images/logo.png")} style={styles.logo} />

            <Text style={styles.title}>Welcome to Lungo !!</Text>
            <Text style={styles.subtitle}>Login to Continue</Text>

            <View style={styles.inputBox}>
                <TextInput
                    style={styles.input}
                    placeholder="Email Address"
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

            <TouchableOpacity
                style={[styles.signInButton, loading && styles.signInButtonDisabled]}
                onPress={handleDangNhap}
                disabled={loading}
            >
                <Text style={styles.signInText}>{loading ? "Loading..." : "Sign In"}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.googleButton}>
                <Text style={styles.googleIcon}>G</Text>
                <Text style={styles.googleText}>Sign in with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/RegisterScreen")}>
                <Text style={styles.linkText}>
                    Don't have account? Click <Text style={styles.linkOrange}>Register</Text>
                </Text>
            </TouchableOpacity>

            <TouchableOpacity>
                <Text style={styles.linkText}>
                    Forget Password? Click <Text style={styles.linkOrange}>Reset</Text>
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
    signInButton: {
        width: "100%",
        height: 55,
        backgroundColor: "#D17842",
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15,
        marginBottom: 15,
    },
    signInButtonDisabled: {
        backgroundColor: "#8B5A2B",
    },
    signInText: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 16,
        color: "#FFFFFF",
    },
    googleButton: {
        width: "100%",
        height: 55,
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 30,
    },
    googleIcon: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 18,
        color: "#4285F4",
        marginRight: 10,
    },
    googleText: {
        fontFamily: "Poppins_400Regular",
        fontSize: 14,
        color: "#000000",
    },
    linkText: {
        fontFamily: "Poppins_400Regular",
        fontSize: 12,
        color: "#828282",
        marginBottom: 15,
    },
    linkOrange: {
        color: "#D17842",
    },
});
