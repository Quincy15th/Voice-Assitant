import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, Stack } from "expo-router"; // Thêm Stack ở đây

export default function AuthHome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Ẩn tiêu đề mặc định của hệ thống để giao diện sạch sẽ hơn */}
      <Stack.Screen options={{ headerShown: false }} />

      <Text style={styles.title}>Welcome</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(auth)/sign-in")}
      >
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.outline]}
        onPress={() => router.push("/(auth)/sign-up")}
      >
        <Text style={[styles.buttonText, { color: "#000" }]}>Đăng ký</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#000",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
});
