import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import VoiceRecorder from "./components/VoiceRecorder";
import ChatMessages from "./components/ChatMessages";
import ControlPanel from "./components/ControlPanel";
import VoiceOverlay from "./components/VoiceOverlay";
import { chatService } from "./services/chatService";

// IMPORT CÁC COMPONENT XÁC THỰC
import { useAuth } from "./contexts/AuthContext";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";

function App() {
  const { isAuthenticated, user, logout } = useAuth();
  const [currentAuthView, setCurrentAuthView] = useState("signin");

  // --- STATE CHO PROFILE MENU ---
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  // --- CÁC STATE CŨ ---
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);
  const [selectedVoice, setSelectedVoice] = useState("alloy");
  const [autoPlay, setAutoPlay] = useState(true);
  const [transcript, setTranscript] = useState("");
  const [forceStopRecording, setForceStopRecording] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Effect để xử lý việc click ra ngoài vùng menu thì đóng menu lại
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const addMessage = (message) => {
    setMessages((prev) => [
      ...prev,
      { ...message, id: Date.now() + Math.random() },
    ]);
  };

  const speakText = (text) => {
    if (!text || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "vi-VN";
    const voices = window.speechSynthesis.getVoices();
    const viVoice =
      voices.find((v) => v.lang?.toLowerCase().includes("vi")) || null;
    if (viVoice) {
      utterance.voice = viVoice;
    }
    window.speechSynthesis.speak(utterance);
  };

  const handleVoiceMessage = async (audioBlob) => {
    setIsLoading(true);
    setError(null);
    setTranscript("");

    try {
      const userMessage = {
        type: "user",
        content: "Processing voice message...",
        timestamp: new Date().toISOString(),
        isVoice: true,
        isProcessing: true,
      };

      addMessage(userMessage);

      const transcription = await chatService.transcribeAudio(audioBlob);
      const text = transcription?.transcription || transcription?.text || "";

      setTranscript(text);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.isProcessing
            ? {
                ...msg,
                content: text || "Không nhận diện được giọng nói",
                isProcessing: false,
              }
            : msg,
        ),
      );

      if (!text.trim()) {
        throw new Error("Không nhận diện được giọng nói");
      }

      const chatResponse = await chatService.sendMessage(text);

      const assistantMessage = {
        type: "assistant",
        content: chatResponse.response,
        timestamp: chatResponse.timestamp,
        isVoice: true,
      };

      addMessage(assistantMessage);

      if (autoPlay) {
        speakText(chatResponse.response);
      }
    } catch (err) {
      setError(err.message || "Failed to process voice message");
      console.error("Voice message error:", err);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setIsRecording(false);
        setTranscript("");
      }, 500);
    }
  };

  const handleTextMessage = async (text) => {
    if (!text.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
      const userMessage = {
        type: "user",
        content: text,
        timestamp: new Date().toISOString(),
        isVoice: false,
      };
      addMessage(userMessage);

      const chatResponse = await chatService.sendMessage(text);

      const assistantMessage = {
        type: "assistant",
        content: chatResponse.response,
        timestamp: chatResponse.timestamp,
        isVoice: true,
      };
      addMessage(assistantMessage);

      if (autoPlay) {
        speakText(chatResponse.response);
      }
    } catch (err) {
      setError(err.message || "Failed to send message");
      console.error("Text message error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = async () => {
    try {
      await chatService.clearHistory();
      setMessages([]);
      setError(null);
      setTranscript("");
      window.speechSynthesis?.cancel();
    } catch (err) {
      setError("Failed to clear history");
      console.error("Clear history error:", err);
    }
  };

  const handlePlayResponse = async (message) => {
    try {
      speakText(message.content);
    } catch (err) {
      console.error("Failed to play response:", err);
      setError("Failed to play response");
    }
  };

  const handleStopVoiceOverlay = () => {
    setError(null);
    window.speechSynthesis?.cancel();
    setForceStopRecording(true);
    setTimeout(() => {
      setForceStopRecording(false);
    }, 100);
  };

  // Hàm lấy chữ cái đầu tiên của email/tên để làm Avatar
  const getInitials = (email) => {
    if (!email) return "U";
    return email.charAt(0).toUpperCase();
  };

  // ==========================================
  // GIAO DIỆN KHI CHƯA ĐĂNG NHẬP
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        {currentAuthView === "signin" ? (
          <SignIn onSwitchView={setCurrentAuthView} />
        ) : (
          <SignUp onSwitchView={setCurrentAuthView} />
        )}
      </div>
    );
  }

  // ==========================================
  // GIAO DIỆN CHÍNH (KHI ĐÃ ĐĂNG NHẬP THÀNH CÔNG)
  // ==========================================
  return (
    <div className="App">
      <header className="app-header">
        <h1>🎙️ AI Voice Chat</h1>

        {/* --- KHU VỰC AVATAR & DROPDOWN MENU --- */}
        <div className="profile-container" ref={profileMenuRef}>
          <button
            className="avatar-btn"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          >
            {getInitials(user?.email)}
          </button>

          {isProfileMenuOpen && (
            <div className="profile-dropdown">
              <div className="profile-dropdown-header">
                <p className="profile-email">
                  {user?.email || "user@example.com"}
                </p>
              </div>
              <ul className="profile-menu-list">
                <li>
                  <button
                    className="profile-menu-item logout-text"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      logout();
                    }}
                  >
                    Đăng xuất
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>

      <main className="app-main">
        <div className="chat-container">
          <ChatMessages
            messages={messages}
            isLoading={isLoading}
            onPlayResponse={handlePlayResponse}
          />
          <div ref={messagesEndRef} />
        </div>

        <div className="input-container">
          <VoiceRecorder
            onVoiceMessage={handleVoiceMessage}
            onTextMessage={handleTextMessage}
            isRecording={isRecording}
            setIsRecording={setIsRecording}
            isLoading={isLoading}
            forceStopRecording={forceStopRecording}
          />
        </div>

        <ControlPanel
          selectedVoice={selectedVoice}
          onVoiceChange={setSelectedVoice}
          autoPlay={autoPlay}
          onAutoPlayChange={setAutoPlay}
          onClearHistory={handleClearHistory}
          messageCount={messages.length}
        />
      </main>

      <VoiceOverlay
        open={isRecording || isLoading}
        isLoading={isLoading}
        transcript={transcript}
        onClose={handleStopVoiceOverlay}
      />

      {error && (
        <div className="error-notification">
          <p>{error}</p>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}
    </div>
  );
}

export default App;
