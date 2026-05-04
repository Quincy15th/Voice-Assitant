import React, { useState, useRef, useEffect } from "react";
import "./VoiceRecorder.css";

const VoiceRecorder = ({
  onVoiceMessage,
  onTextMessage,
  isRecording,
  setIsRecording,
  isLoading,
  forceStopRecording,
}) => {
  const [textInput, setTextInput] = useState("");
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasPermission, setHasPermission] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    // Check for microphone permission
    navigator.permissions.query({ name: "microphone" }).then((result) => {
      setHasPermission(result.state === "granted");
    });
  }, []);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      setRecordingTime(0);
    }

    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  useEffect(() => {
    if (forceStopRecording) {
      stopRecording();
    }
  }, [forceStopRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      setHasPermission(true);

      const recorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      const chunks = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        onVoiceMessage(audioBlob);
        setAudioChunks([]);

        // Stop all tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      setMediaRecorder(recorder);
      setAudioChunks(chunks);
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      setHasPermission(false);
      alert(
        "Microphone access is required for voice recording. Please enable microphone permissions.",
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (textInput.trim() && !isLoading) {
      onTextMessage(textInput.trim());
      setTextInput("");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="voice-recorder">
      <form onSubmit={handleTextSubmit} className="text-input-form">
        <div className="input-group">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Type your message or use voice..."
            className="text-input"
            disabled={isLoading || isRecording}
          />
          <button
            type="submit"
            className="send-button"
            disabled={!textInput.trim() || isLoading || isRecording}
          >
            📤
          </button>
        </div>
      </form>

      <div className="voice-controls">
        <div className="recording-info">
          {isRecording && (
            <div className="recording-status">
              <span className="recording-dot"></span>
              <span className="recording-text">
                Recording: {formatTime(recordingTime)}
              </span>
            </div>
          )}
          {hasPermission === false && (
            <div className="permission-warning">
              Microphone access required for voice recording
            </div>
          )}
        </div>

        <button
          className={`record-button ${isRecording ? "recording" : ""}`}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isLoading || hasPermission === false}
          title={isRecording ? "Stop recording" : "Start voice recording"}
        >
          {isRecording ? "⏹️" : "🎤"}
        </button>

        {isLoading && (
          <div className="loading-indicator">
            <div className="typing-indicator">
              <span>●</span>
              <span>●</span>
              <span>●</span>
            </div>
            <span>Processing...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceRecorder;
