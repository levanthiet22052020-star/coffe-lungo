import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
    email: string;
    name?: string;
    [key: string]: any;
}

interface UserContextType {
    user: User | null;
    loading: boolean;
    login: (userData: User) => Promise<void>;
    logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
    user: null,
    loading: true,
    login: async () => { },
    logout: async () => { }
});

interface UserProviderProps {
    children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const userData = await AsyncStorage.getItem("user");
            if (userData) {
                setUser(JSON.parse(userData));
            }
        } catch (error) {
            console.error("Error loading user:", error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (userData: User) => {
        try {
            await AsyncStorage.setItem("user", JSON.stringify(userData));
            setUser(userData);
        } catch (error) {
            console.error("Error saving user:", error);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem("user");
            setUser(null);
        } catch (error) {
            console.error("Error removing user:", error);
        }
    };

    return (
        <UserContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within UserProvider");
    }
    return context;
}
