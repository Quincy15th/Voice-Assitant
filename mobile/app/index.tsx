import { Redirect } from "expo-router";
import { useAuth } from "./(auth)/AuthContext";
import { Text, View } from "react-native";

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Đang tải...</Text>
      </View>
    );
  }

  // Nếu đã đăng nhập thì vào thẳng Chat, ngược lại ra màn hình Welcome
  return isSignedIn ? (
    <Redirect href="/(tabs)/chat" />
  ) : (
    <Redirect href="/(auth)" />
  );
}
