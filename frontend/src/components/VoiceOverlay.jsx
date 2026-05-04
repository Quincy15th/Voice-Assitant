import React, { useEffect, useRef } from "react";
import SiriWave from "siriwave";
import "./VoiceOverlay.css";

export default function VoiceOverlay({
  open,
  isLoading,
  transcript = "",
  onClose,
}) {
  const waveContainerRef = useRef(null);
  const waveRef = useRef(null);

  useEffect(() => {
    if (!open || !waveContainerRef.current) return;

    waveRef.current = new SiriWave({
      container: waveContainerRef.current,
      width: 420,
      height: 120,
      style: "ios9",
      amplitude: 0.6,
      speed: 0.12,
      autostart: true,
    });

    return () => {
      if (waveRef.current) {
        waveRef.current.dispose();
        waveRef.current = null;
      }
    };
  }, [open]);

  useEffect(() => {
    if (!waveRef.current) return;

    if (isLoading) {
      waveRef.current.setAmplitude(0.3);
      waveRef.current.setSpeed(0.07);
    } else {
      waveRef.current.setAmplitude(1);
      waveRef.current.setSpeed(0.18);
    }
  }, [isLoading]);

  if (!open) return null;

  return (
    <div className="voice-overlay">
      <div className="voice-overlay-backdrop" onClick={onClose} />

      <div className="voice-overlay-card">
        {/* Close */}
        <button className="voice-overlay-close" onClick={onClose}>
          ×
        </button>

        {/* Mic */}
        <div className="voice-overlay-mic">🎤</div>

        {/* Title */}
        <h2 className="voice-overlay-title">
          {isLoading ? "Đang xử lý..." : "Đang nghe bạn nói..."}
        </h2>

        {/* Subtitle */}
        <p className="voice-overlay-subtitle">
          {transcript?.trim()
            ? transcript
            : isLoading
              ? "Đang gửi âm thanh và chờ phản hồi"
              : "Hãy nói sau tiếng bíp hoặc giữ im lặng để dừng"}
        </p>

        {/* Wave */}
        <div className="voice-wave-wrapper">
          <div ref={waveContainerRef} />
        </div>

        {/* Stop button */}
        {!isLoading && (
          <button className="voice-overlay-stop" onClick={onClose}>
            ⏹ Tạm dừng
          </button>
        )}
      </div>
    </div>
  );
}
