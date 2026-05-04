import * as Speech from "expo-speech";

export function speakText(text) {
  if (!text) return;
  Speech.speak(text, {
    language: "vi-VN",
    rate: 0.95,
    pitch: 1.0,
  });
}

export function stopSpeaking() {
  Speech.stop();
}
