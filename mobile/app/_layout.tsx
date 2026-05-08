import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "./(auth)/AuthContext";
import { ActivityIndicator, View } from "react-native";

function AppNavigator() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isSignedIn ? (
        // Đảm bảo tên này khớp với thư mục (tabs) của bạn
        <Stack.Screen name="(tabs)/chat" />
      ) : (
        <Stack.Screen name="(auth)/index" />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
