import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextType = {
  isSignedIn: boolean;
  isLoaded: boolean;
  user: any;
  signIn: (token: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Kiểm tra token lưu trong máy khi mở app
    const loadStorageData = async () => {
      try {
        const savedUser = await AsyncStorage.getItem("@user");
        if (savedUser) setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadStorageData();
  }, []);

  const signIn = async (token: string, userData: any) => {
    await AsyncStorage.setItem("@token", token);
    await AsyncStorage.setItem("@user", JSON.stringify(userData));
    setUser(userData);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem("@token");
    await AsyncStorage.removeItem("@user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isSignedIn: !!user, isLoaded, user, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
export default function AuthContextDummy() {
  return null;
}
