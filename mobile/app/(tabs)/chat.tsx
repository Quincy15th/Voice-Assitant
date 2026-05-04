import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from "react-native";
import chatService from "../../services/ChatService";
import { useAuth } from "@clerk/clerk-expo";

export default function Chat() {
  const [messages, setMessages] = useState<
    Array<{
      role?: string;
      type?: string;
      content?: string;
      message?: string;
      response?: string;
    }>
  >([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const { signOut } = useAuth();

  useEffect(() => {
    refreshHistory();
  }, []);

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
      console.error("Failed to get history", err);
    }
  }

  async function handleSend() {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await chatService.sendMessage(text);
      // server returns latest assistant response; re-fetch history
      await refreshHistory();
      setText("");
    } catch (err) {
      console.error("Send failed", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Voice Assistant</Text>
        <Button title="Sign out" onPress={() => signOut()} />
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item, idx) => String(idx)}
        renderItem={({ item }) => {
          if (!item) {
            return null;
          }

          return (
            <View style={styles.messageRow}>
              <Text style={styles.messageAuthor}>
                {item.role || item.type || "message"}
              </Text>
              <Text style={styles.messageText}>
                {item.content || item.message || item.response}
              </Text>
            </View>
          );
        }}
      />

      <View style={styles.inputRow}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type a message"
          style={styles.input}
        />
        <Button title={loading ? "..." : "Send"} onPress={handleSend} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: { fontSize: 18, fontWeight: "600" },
  messageRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  messageAuthor: { fontSize: 12, color: "#666" },
  messageText: { fontSize: 16 },
  inputRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 8,
    marginRight: 8,
    borderRadius: 4,
  },
});
