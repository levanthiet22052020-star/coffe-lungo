import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { axiosInstance } from "../../until/AxiosHelper";
import { useUser } from "../../context/UserContext";

const categories = ["All", "Cappuccino", "Espresso", "Americano", "Macchiato", "Latte"];

const defaultCoffeeImage = require("../../assets/images/coffee1.png");
const defaultBeanImage = require("../../assets/images/bean1.png");

export default function HomeScreen() {
    const router = useRouter();
    const { user } = useUser();
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchText, setSearchText] = useState("");
    const [coffeeData, setCoffeeData] = useState<any[]>([]);
    const [beanData, setBeanData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [coffeeRes, beanRes] = await Promise.all([
                axiosInstance.get("/coffees"),
                axiosInstance.get("/beans")
            ]);
            setCoffeeData(coffeeRes.data);
            setBeanData(beanRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (item: any, type: string) => {
        if (!user?.email) {
            Alert.alert("Please login", "You need to login to add items to cart.");
            return;
        }
        try {
            await axiosInstance.post("/cart/add", {
                userEmail: user.email,
                item: {
                    productId: item._id,
                    productType: type,
                    name: item.name,
                    subtitle: item.special_ingredient || "With Steamed Milk",
                    roasted: item.roasted,
                    image: item.image,
                    sizes: [{ size: "M", price: item.price || 4.20, quantity: 1 }]
                }
            });
            Alert.alert("Success", "Added to cart!");
        } catch (error) {
            console.error("Error adding to cart:", error);
            Alert.alert("Error", "Failed to add to cart.");
        }
    };

    const filteredCoffees = activeCategory === "All"
        ? coffeeData
        : coffeeData.filter((item: any) => item.category === activeCategory || item.name === activeCategory);

    const renderCoffeeCard = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.coffeeCard}
            onPress={() =>
                router.push({
                    pathname: "/CoffeeDetailsScreen",
                    params: { id: item._id, name: item.name },
                })
            }
        >
            <Image source={item.image ? { uri: item.image } : defaultCoffeeImage} style={styles.coffeeImage} />
            <View style={styles.ratingBadge}>
                <Ionicons name="star" size={10} color="#D17842" />
                <Text style={styles.ratingText}>{item.average_rating || "4.5"}</Text>
            </View>
            <Text style={styles.coffeeName}>{item.name}</Text>
            <Text style={styles.coffeeSubtitle}>{item.special_ingredient || "With Steamed Milk"}</Text>
            <View style={styles.priceRow}>
                <Text style={styles.price}>
                    <Text style={styles.dollarSign}>$ </Text>
                    {item.price?.toFixed(2) || "4.20"}
                </Text>
                <TouchableOpacity style={styles.addButton} onPress={() => handleAddToCart(item, "coffee")}>
                    <Ionicons name="add" size={16} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    const renderBeanCard = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.coffeeCard}
            onPress={() =>
                router.push({
                    pathname: "/BeanDetailsScreen",
                    params: { id: item._id, name: item.name },
                })
            }
        >
            <Image source={item.image ? { uri: item.image } : defaultBeanImage} style={styles.coffeeImage} />
            <Text style={styles.coffeeName}>{item.name}</Text>
            <Text style={styles.coffeeSubtitle}>{item.roasted || "Medium Roasted"}</Text>
            <View style={styles.priceRow}>
                <Text style={styles.price}>
                    <Text style={styles.dollarSign}>$ </Text>
                    {item.price?.toFixed(2) || "4.20"}
                </Text>
                <TouchableOpacity style={styles.addButton} onPress={() => handleAddToCart(item, "bean")}>
                    <Ionicons name="add" size={16} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                <ActivityIndicator size="large" color="#D17842" />
                <Text style={{ color: "#FFFFFF", marginTop: 10 }}>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <TouchableOpacity>
                    <Ionicons name="grid" size={24} color="#52555A" />
                </TouchableOpacity>
                <Image
                    source={require("../../assets/images/avatar.png")}
                    style={styles.avatar}
                />
            </View>

            <Text style={styles.title}>Find the best{"\n"}coffee for you</Text>

            <View style={styles.searchBox}>
                <Ionicons name="search" size={20} color="#52555A" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Find Your Coffee..."
                    placeholderTextColor="#52555A"
                    value={searchText}
                    onChangeText={setSearchText}
                />
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryContainer}
            >
                {categories.map((cat) => (
                    <TouchableOpacity
                        key={cat}
                        onPress={() => setActiveCategory(cat)}
                        style={styles.categoryButton}
                    >
                        <Text
                            style={[
                                styles.categoryText,
                                activeCategory === cat && styles.categoryActive,
                            ]}
                        >
                            {cat}
                        </Text>
                        {activeCategory === cat && <View style={styles.categoryDot} />}
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <FlatList
                data={filteredCoffees}
                renderItem={renderCoffeeCard}
                keyExtractor={(item: any) => item._id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.coffeeList}
            />

            <Text style={styles.sectionTitle}>Coffee beans</Text>

            <FlatList
                data={beanData}
                renderItem={renderBeanCard}
                keyExtractor={(item: any) => item._id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.coffeeList}
            />

            <View style={{ height: 100 }} />
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
        marginBottom: 25,
    },
    avatar: {
        width: 35,
        height: 35,
        borderRadius: 12,
    },
    title: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 28,
        color: "#FFFFFF",
        marginBottom: 25,
    },
    searchBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#141921",
        borderRadius: 15,
        paddingHorizontal: 20,
        height: 50,
        marginBottom: 25,
    },
    searchInput: {
        flex: 1,
        marginLeft: 15,
        fontFamily: "Poppins_400Regular",
        fontSize: 14,
        color: "#FFFFFF",
    },
    categoryContainer: {
        marginBottom: 20,
    },
    categoryButton: {
        marginRight: 20,
        alignItems: "center",
    },
    categoryText: {
        fontFamily: "Poppins_400Regular",
        fontSize: 14,
        color: "#52555A",
    },
    categoryActive: {
        color: "#D17842",
    },
    categoryDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#D17842",
        marginTop: 5,
    },
    coffeeList: {
        paddingVertical: 10,
    },
    coffeeCard: {
        backgroundColor: "#252A32",
        borderRadius: 23,
        padding: 12,
        marginRight: 20,
        width: 150,
    },
    coffeeImage: {
        width: "100%",
        height: 126,
        borderRadius: 16,
        marginBottom: 10,
    },
    ratingBadge: {
        position: "absolute",
        top: 12,
        right: 12,
        backgroundColor: "rgba(0,0,0,0.7)",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderTopRightRadius: 16,
        borderBottomLeftRadius: 20,
    },
    ratingText: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 10,
        color: "#FFFFFF",
        marginLeft: 5,
    },
    coffeeName: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 14,
        color: "#FFFFFF",
    },
    coffeeSubtitle: {
        fontFamily: "Poppins_400Regular",
        fontSize: 10,
        color: "#AEAEAE",
        marginBottom: 10,
    },
    priceRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    price: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 15,
        color: "#FFFFFF",
    },
    dollarSign: {
        color: "#D17842",
    },
    addButton: {
        backgroundColor: "#D17842",
        width: 28,
        height: 28,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    sectionTitle: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 16,
        color: "#FFFFFF",
        marginTop: 20,
        marginBottom: 5,
    },
});
