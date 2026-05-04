import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import VoiceRecorder from "./components/VoiceRecorder";
import ChatMessages from "./components/ChatMessages";
import ControlPanel from "./components/ControlPanel";
import VoiceOverlay from "./components/VoiceOverlay";
import { chatService } from "./services/chatService";
import { SignedIn, SignedOut, SignIn, UserButton } from "@clerk/clerk-react";

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);
  const [selectedVoice, setSelectedVoice] = useState("alloy");
  const [autoPlay, setAutoPlay] = useState(true);
  const [transcript, setTranscript] = useState("");

  // thêm state này để báo VoiceRecorder dừng ghi âm
  const [forceStopRecording, setForceStopRecording] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  // nút tạm dừng trong overlay sẽ gọi hàm này
  const handleStopVoiceOverlay = () => {
    setError(null);
    window.speechSynthesis?.cancel();

    setForceStopRecording(true);

    setTimeout(() => {
      setForceStopRecording(false);
    }, 100);
  };

  return (
    <>
      <SignedOut>
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 100 }}
        >
          <SignIn />
        </div>
      </SignedOut>

      <SignedIn>
        <div className="App">
          <header className="app-header">
            <h1>🎙️ AI Voice Chat</h1>
            <UserButton />
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
      </SignedIn>
    </>
  );
}

export default App;
