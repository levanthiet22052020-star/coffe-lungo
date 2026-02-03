import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const paymentMethods = [
    { id: "wallet", name: "Wallet", icon: "wallet", balance: "$ 100.50" },
    { id: "google", name: "Google Pay", icon: "logo-google", balance: null },
    { id: "apple", name: "Apple Pay", icon: "logo-apple", balance: null },
    { id: "amazon", name: "Amazon Pay", icon: "logo-amazon", balance: null },
];

export default function PaymentScreen() {
    const router = useRouter();
    const [selectedMethod, setSelectedMethod] = useState("credit");

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="#52555A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Payment</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableOpacity
                    style={[
                        styles.creditCardContainer,
                        selectedMethod === "credit" && styles.selectedMethod,
                    ]}
                    onPress={() => setSelectedMethod("credit")}
                >
                    <Text style={styles.creditCardLabel}>Credit Card</Text>
                    <View style={styles.creditCard}>
                        <View style={styles.cardHeader}>
                            <View style={styles.chipIcon}>
                                <View style={styles.chipLine} />
                                <View style={styles.chipLine} />
                                <View style={styles.chipLine} />
                            </View>
                            <Text style={styles.visaText}>VISA</Text>
                        </View>
                        <Text style={styles.cardNumber}>
                            3897  8923  6745  4638
                        </Text>
                        <View style={styles.cardFooter}>
                            <View>
                                <Text style={styles.cardLabel}>Card Holder Name</Text>
                                <Text style={styles.cardValue}>Robert Evans</Text>
                            </View>
                            <View>
                                <Text style={styles.cardLabel}>Expiry Date</Text>
                                <Text style={styles.cardValue}>02/30</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>

                {paymentMethods.map((method) => (
                    <TouchableOpacity
                        key={method.id}
                        style={[
                            styles.paymentMethod,
                            selectedMethod === method.id && styles.selectedMethod,
                        ]}
                        onPress={() => setSelectedMethod(method.id)}
                    >
                        <Ionicons
                            name={method.icon as any}
                            size={24}
                            color={method.id === "wallet" ? "#D17842" : "#FFFFFF"}
                        />
                        <Text style={styles.methodName}>{method.name}</Text>
                        {method.balance && (
                            <Text style={styles.methodBalance}>{method.balance}</Text>
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={styles.footer}>
                <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>Price</Text>
                    <Text style={styles.price}>
                        <Text style={styles.dollarSign}>$ </Text>4.20
                    </Text>
                </View>
                <TouchableOpacity style={styles.payButton}>
                    <Text style={styles.payButtonText}>Pay from Credit Card</Text>
                </TouchableOpacity>
            </View>
        </View>
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
        marginBottom: 25,
    },
    headerTitle: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 20,
        color: "#FFFFFF",
    },
    creditCardContainer: {
        marginBottom: 15,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: "transparent",
        padding: 15,
    },
    selectedMethod: {
        borderColor: "#D17842",
    },
    creditCardLabel: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 14,
        color: "#FFFFFF",
        marginBottom: 10,
    },
    creditCard: {
        backgroundColor: "#262B33",
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: "#D17842",
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 30,
    },
    chipIcon: {
        backgroundColor: "#D17842",
        width: 40,
        height: 30,
        borderRadius: 6,
        justifyContent: "center",
        paddingHorizontal: 5,
    },
    chipLine: {
        height: 2,
        backgroundColor: "#FFFFFF",
        marginVertical: 2,
        opacity: 0.5,
    },
    visaText: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 18,
        color: "#FFFFFF",
        fontStyle: "italic",
    },
    cardNumber: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 18,
        color: "#FFFFFF",
        letterSpacing: 3,
        marginBottom: 30,
    },
    cardFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    cardLabel: {
        fontFamily: "Poppins_400Regular",
        fontSize: 10,
        color: "#AEAEAE",
    },
    cardValue: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 14,
        color: "#FFFFFF",
    },
    paymentMethod: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#252A32",
        borderRadius: 20,
        padding: 18,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: "transparent",
    },
    methodName: {
        flex: 1,
        fontFamily: "Poppins_600SemiBold",
        fontSize: 14,
        color: "#FFFFFF",
        marginLeft: 15,
    },
    methodBalance: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 14,
        color: "#FFFFFF",
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 20,
    },
    priceContainer: {
        marginRight: 30,
    },
    priceLabel: {
        fontFamily: "Poppins_400Regular",
        fontSize: 12,
        color: "#AEAEAE",
    },
    price: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 20,
        color: "#FFFFFF",
    },
    dollarSign: {
        color: "#D17842",
    },
    payButton: {
        flex: 1,
        backgroundColor: "#D17842",
        borderRadius: 20,
        paddingVertical: 18,
        alignItems: "center",
    },
    payButtonText: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 14,
        color: "#FFFFFF",
    },
});
