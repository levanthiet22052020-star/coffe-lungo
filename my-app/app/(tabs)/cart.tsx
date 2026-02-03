import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { axiosInstance } from "../../until/AxiosHelper";
import { useUser } from "../../context/UserContext";

const defaultCoffeeImage = require("../../assets/images/coffee1.png");
const defaultBeanImage = require("../../assets/images/bean1.png");

export default function CartScreen() {
    const router = useRouter();
    const { user } = useUser();
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            if (user?.email) {
                fetchCart();
            } else {
                setLoading(false);
            }
        }, [user])
    );

    const fetchCart = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/cart/${user?.email}`);
            setItems(response.data.items || []);
        } catch (error) {
            console.error("Error fetching cart:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (itemIndex: number, sizeIndex: number, delta: number) => {
        const newItems = [...items];
        const item = newItems[itemIndex];
        const newQuantity = Math.max(0, item.sizes[sizeIndex].quantity + delta);

        if (newQuantity === 0) {
            item.sizes.splice(sizeIndex, 1);
            if (item.sizes.length === 0) {
                newItems.splice(itemIndex, 1);
            }
        } else {
            item.sizes[sizeIndex].quantity = newQuantity;
        }

        setItems(newItems);

        try {
            await axiosInstance.post("/cart", {
                userEmail: user?.email,
                items: newItems
            });
        } catch (error) {
            console.error("Error updating cart:", error);
        }
    };

    const calculateTotal = () => {
        let total = 0;
        items.forEach((item) => {
            item.sizes.forEach((size: any) => {
                total += size.price * size.quantity;
            });
        });
        return total.toFixed(2);
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                <ActivityIndicator size="large" color="#D17842" />
            </View>
        );
    }

    const renderCartItem = (item: any, itemIndex: number) => (
        <View key={item.productId || itemIndex} style={styles.cartItem}>
            <View style={styles.cartItemHeader}>
                <Image
                    source={item.image ? { uri: item.image } : (item.productType === "bean" ? defaultBeanImage : defaultCoffeeImage)}
                    style={styles.itemImage}
                />
                <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                    {item.roasted ? (
                        <View style={styles.roastBadge}>
                            <Text style={styles.roastText}>{item.roasted}</Text>
                        </View>
                    ) : null}
                </View>
            </View>
            {item.sizes.map((sizeItem: any, sizeIdx: number) => (
                <View key={sizeIdx} style={styles.sizeRow}>
                    <View style={styles.sizeBadge}>
                        <Text style={styles.sizeText}>{sizeItem.size}</Text>
                    </View>
                    <Text style={styles.sizePrice}>
                        <Text style={styles.dollarSign}>$ </Text>
                        {sizeItem.price?.toFixed(2)}
                    </Text>
                    <View style={styles.quantityContainer}>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => updateQuantity(itemIndex, sizeIdx, -1)}
                        >
                            <Ionicons name="remove" size={14} color="#FFFFFF" />
                        </TouchableOpacity>
                        <View style={styles.quantityBox}>
                            <Text style={styles.quantityText}>{sizeItem.quantity}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => updateQuantity(itemIndex, sizeIdx, 1)}
                        >
                            <Ionicons name="add" size={14} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity>
                    <Ionicons name="grid" size={24} color="#52555A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Cart</Text>
                <Image
                    source={require("../../assets/images/avatar.png")}
                    style={styles.avatar}
                />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
                {items.length === 0 ? (
                    <View style={{ alignItems: "center", marginTop: 50 }}>
                        <Text style={{ color: "#AEAEAE", fontSize: 16 }}>Your cart is empty</Text>
                    </View>
                ) : (
                    items.map((item, index) => renderCartItem(item, index))
                )}
            </ScrollView>

            <View style={styles.footer}>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Total Price</Text>
                    <Text style={styles.totalPrice}>
                        <Text style={styles.dollarSign}>$ </Text>
                        {calculateTotal()}
                    </Text>
                </View>
                <TouchableOpacity
                    style={styles.payButton}
                    onPress={() => router.push("/PaymentScreen")}
                >
                    <Text style={styles.payButtonText}>Pay</Text>
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
    avatar: {
        width: 35,
        height: 35,
        borderRadius: 12,
    },
    cartItem: {
        backgroundColor: "#252A32",
        borderRadius: 23,
        padding: 15,
        marginBottom: 15,
    },
    cartItemHeader: {
        flexDirection: "row",
        marginBottom: 10,
    },
    itemImage: {
        width: 100,
        height: 100,
        borderRadius: 16,
    },
    itemInfo: {
        marginLeft: 15,
        flex: 1,
        justifyContent: "center",
    },
    itemName: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 16,
        color: "#FFFFFF",
    },
    itemSubtitle: {
        fontFamily: "Poppins_400Regular",
        fontSize: 10,
        color: "#AEAEAE",
    },
    roastBadge: {
        backgroundColor: "#0C0F14",
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 8,
        alignSelf: "flex-start",
        marginTop: 10,
    },
    roastText: {
        fontFamily: "Poppins_400Regular",
        fontSize: 10,
        color: "#AEAEAE",
    },
    sizeRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
    },
    sizeBadge: {
        backgroundColor: "#0C0F14",
        borderRadius: 8,
        width: 60,
        height: 35,
        justifyContent: "center",
        alignItems: "center",
    },
    sizeText: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 14,
        color: "#FFFFFF",
    },
    sizePrice: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 16,
        color: "#FFFFFF",
        marginLeft: 15,
        flex: 1,
    },
    dollarSign: {
        color: "#D17842",
    },
    quantityContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    quantityButton: {
        backgroundColor: "#D17842",
        width: 28,
        height: 28,
        borderRadius: 7,
        justifyContent: "center",
        alignItems: "center",
    },
    quantityBox: {
        backgroundColor: "#0C0F14",
        borderRadius: 7,
        width: 50,
        height: 28,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 15,
        borderWidth: 1,
        borderColor: "#D17842",
    },
    quantityText: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 14,
        color: "#FFFFFF",
    },
    scrollView: {
        flex: 1,
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15,
        paddingBottom: 90,
        backgroundColor: "#0C0F14",
    },
    totalContainer: {
        flex: 1,
    },
    totalLabel: {
        fontFamily: "Poppins_400Regular",
        fontSize: 12,
        color: "#AEAEAE",
    },
    totalPrice: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 20,
        color: "#FFFFFF",
    },
    payButton: {
        backgroundColor: "#D17842",
        borderRadius: 20,
        paddingHorizontal: 60,
        paddingVertical: 18,
    },
    payButtonText: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 16,
        color: "#FFFFFF",
    },
});
