import { Poppins_400Regular, Poppins_600SemiBold, useFonts } from "@expo-google-fonts/poppins";
import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { UserProvider } from "../context/UserContext";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0C0F14" }}>
        <ActivityIndicator size="large" color="#D17842" />
      </View>
    );
  }

  return (
    <UserProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="LoginScreen" />
        <Stack.Screen name="RegisterScreen" />
        <Stack.Screen name="WelcomeScreen" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="CoffeeDetailsScreen" />
        <Stack.Screen name="BeanDetailsScreen" />
        <Stack.Screen name="PaymentScreen" />
        <Stack.Screen name="PersonalDetailsScreen" />
      </Stack>
    </UserProvider>
  );
}
