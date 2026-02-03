import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useUser } from "../../context/UserContext";

const menuItems = [
    { id: "1", title: "Personal Details", icon: "person-outline", route: "/PersonalDetailsScreen" },
    { id: "2", title: "Address", icon: "location-outline", route: null },
    { id: "3", title: "Payment Method", icon: "card-outline", route: "/PaymentScreen" },
    { id: "4", title: "About", icon: "information-circle-outline", route: null },
    { id: "5", title: "Help", icon: "help-circle-outline", route: null },
    { id: "6", title: "Log out", icon: "log-out-outline", route: "logout" },
];

export default function SettingsScreen() {
    const router = useRouter();
    const { logout } = useUser();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleMenuPress = (item: typeof menuItems[0]) => {
        if (item.route === "logout") {
            setShowLogoutModal(true);
        } else if (item.route) {
            router.push(item.route as any);
        }
    };

    const handleLogout = async () => {
        setShowLogoutModal(false);
        await logout();
        router.replace("/LoginScreen");
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="#52555A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Setting</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.menuList}>
                {menuItems.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.menuItem}
                        onPress={() => handleMenuPress(item)}
                    >
                        <Ionicons
                            name={item.icon as any}
                            size={22}
                            color="#D17842"
                            style={styles.menuIcon}
                        />
                        <Text style={styles.menuTitle}>{item.title}</Text>
                        <Ionicons name="chevron-forward" size={20} color="#52555A" />
                    </TouchableOpacity>
                ))}
            </View>

            <Modal
                visible={showLogoutModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowLogoutModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Are you sure want to logout!</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.modalButtonNo}
                                onPress={() => setShowLogoutModal(false)}
                            >
                                <Text style={styles.modalButtonNoText}>No</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalButtonYes}
                                onPress={handleLogout}
                            >
                                <Text style={styles.modalButtonYesText}>Yes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
        marginBottom: 40,
    },
    headerTitle: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 20,
        color: "#FFFFFF",
    },
    menuList: {
        marginTop: 20,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 18,
    },
    menuIcon: {
        marginRight: 20,
    },
    menuTitle: {
        flex: 1,
        fontFamily: "Poppins_400Regular",
        fontSize: 16,
        color: "#FFFFFF",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.7)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#252A32",
        borderRadius: 20,
        padding: 30,
        width: "80%",
        alignItems: "center",
    },
    modalText: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 16,
        color: "#FFFFFF",
        marginBottom: 25,
        textAlign: "center",
    },
    modalButtons: {
        flexDirection: "row",
        alignItems: "center",
    },
    modalButtonNo: {
        paddingHorizontal: 30,
        paddingVertical: 12,
    },
    modalButtonNoText: {
        fontFamily: "Poppins_400Regular",
        fontSize: 14,
        color: "#AEAEAE",
    },
    modalButtonYes: {
        backgroundColor: "#D17842",
        borderRadius: 15,
        paddingHorizontal: 40,
        paddingVertical: 12,
        marginLeft: 15,
    },
    modalButtonYesText: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 14,
        color: "#FFFFFF",
    },
});
