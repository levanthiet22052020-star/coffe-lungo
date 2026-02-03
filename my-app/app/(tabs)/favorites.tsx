import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
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

const defaultImage = require("../../assets/images/coffee1.png");

export default function FavoritesScreen() {
    const { user } = useUser();
    const [favorites, setFavorites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.email) {
            fetchFavorites();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchFavorites = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/favorites/${user?.email}`);
            setFavorites(response.data || []);
        } catch (error) {
            console.error("Error fetching favorites:", error);
        } finally {
            setLoading(false);
        }
    };

    const removeFavorite = async (productId: string) => {
        try {
            await axiosInstance.delete(`/favorites/${user?.email}/${productId}`);
            setFavorites(favorites.filter(f => f.productId !== productId));
        } catch (error) {
            console.error("Error removing favorite:", error);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                <ActivityIndicator size="large" color="#D17842" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity>
                    <Ionicons name="grid" size={24} color="#52555A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Favorites</Text>
                <Image
                    source={require("../../assets/images/avatar.png")}
                    style={styles.avatar}
                />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {favorites.length === 0 ? (
                    <View style={{ alignItems: "center", marginTop: 50 }}>
                        <Text style={{ color: "#AEAEAE", fontSize: 16 }}>No favorites yet</Text>
                    </View>
                ) : (
                    favorites.map((item) => (
                        <View key={item.productId} style={styles.favoriteCard}>
                            <View style={styles.imageContainer}>
                                <Image
                                    source={item.image ? { uri: item.image } : defaultImage}
                                    style={styles.favoriteImage}
                                />
                                <TouchableOpacity
                                    style={styles.heartButton}
                                    onPress={() => removeFavorite(item.productId)}
                                >
                                    <Ionicons name="heart" size={20} color="#FF0000" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.cardContent}>
                                <View style={styles.cardHeader}>
                                    <View>
                                        <Text style={styles.itemName}>{item.name}</Text>
                                        <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                                    </View>
                                    <View style={styles.tagsContainer}>
                                        {(item.tags || []).map((tag: string, index: number) => (
                                            <View key={index} style={styles.tag}>
                                                <Text style={styles.tagText}>{tag}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>

                                <View style={styles.ratingRow}>
                                    <Ionicons name="star" size={18} color="#D17842" />
                                    <Text style={styles.rating}>{item.rating || "4.5"}</Text>
                                    <Text style={styles.ratingCount}>({item.ratingCount || "0"})</Text>
                                    <View style={styles.roastBadge}>
                                        <Text style={styles.roastText}>{item.roasted || "Medium Roasted"}</Text>
                                    </View>
                                </View>

                                <View style={styles.descriptionContainer}>
                                    <Text style={styles.descriptionTitle}>Description</Text>
                                    <Text style={styles.descriptionText}>{item.description || "No description available."}</Text>
                                </View>
                            </View>
                        </View>
                    ))
                )}
                <View style={{ height: 100 }} />
            </ScrollView>
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
    favoriteCard: {
        backgroundColor: "#252A32",
        borderRadius: 25,
        overflow: "hidden",
        marginBottom: 20,
    },
    imageContainer: {
        position: "relative",
    },
    favoriteImage: {
        width: "100%",
        height: 250,
    },
    heartButton: {
        position: "absolute",
        top: 15,
        right: 15,
        backgroundColor: "#0C0F14",
        width: 34,
        height: 34,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    cardContent: {
        padding: 20,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 15,
    },
    itemName: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 20,
        color: "#FFFFFF",
    },
    itemSubtitle: {
        fontFamily: "Poppins_400Regular",
        fontSize: 12,
        color: "#AEAEAE",
    },
    tagsContainer: {
        flexDirection: "row",
    },
    tag: {
        backgroundColor: "#0C0F14",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginLeft: 10,
    },
    tagText: {
        fontFamily: "Poppins_400Regular",
        fontSize: 10,
        color: "#AEAEAE",
    },
    ratingRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    rating: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 16,
        color: "#FFFFFF",
        marginLeft: 8,
    },
    ratingCount: {
        fontFamily: "Poppins_400Regular",
        fontSize: 10,
        color: "#AEAEAE",
        marginLeft: 5,
    },
    roastBadge: {
        backgroundColor: "#0C0F14",
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginLeft: "auto",
    },
    roastText: {
        fontFamily: "Poppins_400Regular",
        fontSize: 10,
        color: "#AEAEAE",
    },
    descriptionContainer: {
        backgroundColor: "#0C0F14",
        borderRadius: 15,
        padding: 15,
    },
    descriptionTitle: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 14,
        color: "#AEAEAE",
        marginBottom: 10,
    },
    descriptionText: {
        fontFamily: "Poppins_400Regular",
        fontSize: 12,
        color: "#FFFFFF",
        lineHeight: 20,
    },
});
