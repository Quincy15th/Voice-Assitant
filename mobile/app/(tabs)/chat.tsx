import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import chatService from "../../services/ChatService";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";
// Đảm bảo đường dẫn này đúng với cấu trúc file của bạn
import { useAuth } from "../(auth)/AuthContext";

export default function Chat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const { isSignedIn, isLoaded, signOut } = useAuth();
  const router = useRouter();

  // Kiểm tra quyền đăng nhập
  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      const t = setTimeout(() => router.replace("/(auth)"), 300);
      return () => clearTimeout(t);
    }
  }, [isLoaded, isSignedIn]);

  const [recording, setRecording] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    refreshHistory();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 200);
  }, [messages]);

  // Hiệu ứng sóng âm khi ghi âm
  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.4,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      scaleAnim.setValue(1);
    }
  }, [isRecording]);

  async function refreshHistory() {
    try {
      const res = await chatService.getHistory();
      const history = Array.isArray(res?.history)
        ? res.history
        : Array.isArray(res)
          ? res
          : [];
      setMessages(history);
    } catch (err) {
      console.error("Lỗi lấy lịch sử:", err);
    }
  }

  async function handleSend() {
    if (!text.trim()) return;
    await handleSendText(text);
    setText("");
  }

  async function handleSendText(message: string) {
    const userMessage = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await chatService.sendMessage(message);
      Speech.speak(res?.response || "", { language: "vi-VN" });
      await refreshHistory();
    } catch (err) {
      console.error("Lỗi gửi tin nhắn:", err);
    } finally {
      setLoading(false);
    }
  }

  // Ghi âm & STT
  async function startRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) return;
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error(err);
    }
  }

  async function stopRecording() {
    try {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      const formData = new FormData();
      formData.append("file", {
        uri,
        name: "voice.m4a",
        type: "audio/m4a",
      } as any);

      const res = await fetch("http://YOUR_SERVER/api/stt", {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      const data = await res.json();
      if (data.text) {
        setText(data.text);
        await handleSendText(data.text);
      }
    } catch (err) {
      console.error(err);
    }
  }

  function renderItem({ item }: any) {
    const isUser = item.role === "user";
    return (
      <View style={[styles.messageRow, isUser ? styles.userRow : styles.aiRow]}>
        <View
          style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}
        >
          <Text
            style={[
              styles.messageText,
              isUser ? styles.userText : styles.aiText,
            ]}
          >
            {item.content || item.message || item.response}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Ẩn Header hệ thống */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* HEADER TÙY CHỈNH: AVATAR + TITLE + LOGOUT */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarLetter}>A</Text>
          </View>
          <Text style={styles.title}>AI Assistant</Text>
        </View>

        <TouchableOpacity
          onPress={async () => {
            await signOut();
            router.replace("/(auth)");
          }}
        >
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 10 }}
        showsVerticalScrollIndicator={false}
      />

      {isRecording && (
        <Animated.View
          style={[styles.wave, { transform: [{ scale: scaleAnim }] }]}
        />
      )}

      {/* INPUT BOX */}
      <View style={styles.inputContainer}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Nhập tin nhắn..."
          style={styles.input}
        />
        <TouchableOpacity
          style={[styles.micButton, isRecording && styles.micActive]}
          onPressIn={startRecording}
          onPressOut={stopRecording}
        >
          <Text style={styles.micText}>🎤</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendText}>{loading ? "..." : "Gửi"}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FB" },
  header: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarLetter: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  title: { fontSize: 18, fontWeight: "700", color: "#111" },
  logout: { color: "#ff4d4f", fontWeight: "600", fontSize: 15 },

  // Chat Styles
  messageRow: { paddingHorizontal: 12, marginVertical: 4 },
  userRow: { alignItems: "flex-end" },
  aiRow: { alignItems: "flex-start" },
  bubble: { maxWidth: "78%", padding: 12, borderRadius: 18 },
  userBubble: { backgroundColor: "#4F46E5", borderBottomRightRadius: 4 },
  aiBubble: { backgroundColor: "#E5E7EB", borderBottomLeftRadius: 4 },
  messageText: { fontSize: 15, lineHeight: 20 },
  userText: { color: "#fff" },
  aiText: { color: "#111" },

  // Input Styles
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    fontSize: 15,
  },
  sendButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  sendText: { color: "#fff", fontWeight: "600" },
  micButton: {
    marginRight: 8,
    backgroundColor: "#10B981",
    padding: 10,
    borderRadius: 50,
  },
  micActive: { backgroundColor: "#EF4444" },
  micText: { color: "#fff", fontSize: 16 },
  wave: {
    position: "absolute",
    bottom: 90,
    alignSelf: "center",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(79,70,229,0.2)",
  },
});
