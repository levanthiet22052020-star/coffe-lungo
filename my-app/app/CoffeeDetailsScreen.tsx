import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { axiosInstance } from "../until/AxiosHelper";
import { useUser } from "../context/UserContext";

const defaultImage = require("../assets/images/coffee1.png");

export default function CoffeeDetailsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { user } = useUser();
    const [selectedSize, setSelectedSize] = useState("S");
    const [isFavorite, setIsFavorite] = useState(false);
    const [coffee, setCoffee] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const sizes = ["S", "M", "L"];

    useEffect(() => {
        fetchCoffeeDetails();
    }, [params.id]);

    const fetchCoffeeDetails = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/coffees/${params.id}`);
            setCoffee(response.data);
            setIsFavorite(response.data.favourite || false);
        } catch (error) {
            console.error("Error fetching coffee details:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!user?.email) {
            Alert.alert("Please login", "You need to login to add items to cart.");
            return;
        }
        try {
            const priceMap: any = { "S": coffee.price || 4.20, "M": (coffee.price || 4.20) + 1, "L": (coffee.price || 4.20) + 2 };
            await axiosInstance.post("/cart/add", {
                userEmail: user.email,
                item: {
                    productId: coffee._id,
                    productType: "coffee",
                    name: coffee.name,
                    subtitle: coffee.special_ingredient || "With Steamed Milk",
                    roasted: coffee.roasted,
                    image: coffee.image,
                    sizes: [{ size: selectedSize, price: priceMap[selectedSize], quantity: 1 }]
                }
            });
            Alert.alert("Success", "Added to cart!");
        } catch (error) {
            console.error("Error adding to cart:", error);
            Alert.alert("Error", "Failed to add to cart.");
        }
    };

    const handleToggleFavorite = async () => {
        if (!user?.email) {
            Alert.alert("Please login", "You need to login to add favorites.");
            return;
        }
        try {
            if (isFavorite) {
                await axiosInstance.delete(`/favorites/${user.email}/${coffee._id}`);
                setIsFavorite(false);
            } else {
                await axiosInstance.post("/favorites", {
                    userEmail: user.email,
                    productId: coffee._id,
                    productType: "coffee",
                    name: coffee.name,
                    subtitle: coffee.special_ingredient || "With Steamed Milk",
                    description: coffee.description,
                    image: coffee.image,
                    rating: coffee.average_rating,
                    ratingCount: coffee.ratings_count,
                    roasted: coffee.roasted,
                    tags: ["Coffee", coffee.ingredients || "Milk"]
                });
                setIsFavorite(true);
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                <ActivityIndicator size="large" color="#D17842" />
                <Text style={{ color: "#FFFFFF", marginTop: 10 }}>Loading...</Text>
            </View>
        );
    }

    if (!coffee) {
        return (
            <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                <Text style={{ color: "#FFFFFF" }}>Coffee not found</Text>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
                    <Text style={{ color: "#D17842" }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <ImageBackground
                    source={coffee.image ? { uri: coffee.image } : defaultImage}
                    style={styles.headerImage}
                >
                    <View style={styles.headerButtons}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => router.back()}
                        >
                            <Ionicons name="chevron-back" size={20} color="#AEAEAE" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.heartButton}
                            onPress={handleToggleFavorite}
                        >
                            <Ionicons
                                name={isFavorite ? "heart" : "heart-outline"}
                                size={20}
                                color={isFavorite ? "#FF0000" : "#AEAEAE"}
                            />
                        </TouchableOpacity>
                    </View>
                </ImageBackground>

                <View style={styles.content}>
                    <View style={styles.infoHeader}>
                        <View style={styles.titleSection}>
                            <Text style={styles.title}>{coffee.name}</Text>
                            <Text style={styles.subtitle}>{coffee.special_ingredient || "With Steamed Milk"}</Text>
                        </View>
                        <View style={styles.tagsSection}>
                            <View style={styles.tag}>
                                <Ionicons name="cafe" size={16} color="#D17842" />
                                <Text style={styles.tagText}>{coffee.type || "Coffee"}</Text>
                            </View>
                            <View style={styles.tag}>
                                <Ionicons name="water" size={16} color="#D17842" />
                                <Text style={styles.tagText}>{coffee.ingredients || "Milk"}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.ratingRow}>
                        <Ionicons name="star" size={20} color="#D17842" />
                        <Text style={styles.rating}>{coffee.average_rating || "4.5"}</Text>
                        <Text style={styles.ratingCount}>({coffee.ratings_count || "6,879"})</Text>
                        <View style={styles.roastBadge}>
                            <Text style={styles.roastText}>{coffee.roasted || "Medium Roasted"}</Text>
                        </View>
                    </View>

                    <View style={styles.descriptionSection}>
                        <Text style={styles.descriptionTitle}>Description</Text>
                        <Text style={styles.descriptionText}>
                            {coffee.description || "Cappuccino is a latte made with more foam than steamed milk, often with a sprinkle of cocoa powder or cinnamon on top."}
                        </Text>
                    </View>

                    <Text style={styles.sizeLabel}>Size</Text>
                    <View style={styles.sizeContainer}>
                        {sizes.map((size) => (
                            <TouchableOpacity
                                key={size}
                                style={[
                                    styles.sizeButton,
                                    selectedSize === size && styles.sizeButtonActive,
                                ]}
                                onPress={() => setSelectedSize(size)}
                            >
                                <Text
                                    style={[
                                        styles.sizeButtonText,
                                        selectedSize === size && styles.sizeButtonTextActive,
                                    ]}
                                >
                                    {size}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>Price</Text>
                    <Text style={styles.price}>
                        <Text style={styles.dollarSign}>$ </Text>{coffee.price?.toFixed(2) || "4.20"}
                    </Text>
                </View>
                <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
                    <Text style={styles.addButtonText}>Add to Cart</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0C0F14",
    },
    headerImage: {
        width: "100%",
        height: 450,
    },
    headerButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 50,
    },
    backButton: {
        backgroundColor: "#0C0F14",
        width: 35,
        height: 35,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    heartButton: {
        backgroundColor: "#0C0F14",
        width: 35,
        height: 35,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    infoHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 15,
    },
    titleSection: {},
    title: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 24,
        color: "#FFFFFF",
    },
    subtitle: {
        fontFamily: "Poppins_400Regular",
        fontSize: 14,
        color: "#AEAEAE",
    },
    tagsSection: {
        flexDirection: "row",
    },
    tag: {
        backgroundColor: "#141921",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginLeft: 10,
        alignItems: "center",
    },
    tagText: {
        fontFamily: "Poppins_400Regular",
        fontSize: 10,
        color: "#AEAEAE",
        marginTop: 3,
    },
    ratingRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
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
        backgroundColor: "#141921",
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginLeft: "auto",
    },
    roastText: {
        fontFamily: "Poppins_400Regular",
        fontSize: 10,
        color: "#AEAEAE",
    },
    descriptionSection: {
        marginBottom: 20,
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
        lineHeight: 22,
    },
    sizeLabel: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 14,
        color: "#AEAEAE",
        marginBottom: 10,
    },
    sizeContainer: {
        flexDirection: "row",
        marginBottom: 30,
    },
    sizeButton: {
        flex: 1,
        backgroundColor: "#141921",
        borderRadius: 10,
        paddingVertical: 12,
        marginRight: 15,
        alignItems: "center",
        borderWidth: 2,
        borderColor: "transparent",
    },
    sizeButtonActive: {
        borderColor: "#D17842",
    },
    sizeButtonText: {
        fontFamily: "Poppins_400Regular",
        fontSize: 16,
        color: "#AEAEAE",
    },
    sizeButtonTextActive: {
        color: "#D17842",
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: "#0C0F14",
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
    addButton: {
        flex: 1,
        backgroundColor: "#D17842",
        borderRadius: 20,
        paddingVertical: 18,
        alignItems: "center",
    },
    addButtonText: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 16,
        color: "#FFFFFF",
    },
});
