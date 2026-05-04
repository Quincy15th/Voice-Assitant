import axios from "axios";

const API_BASE_URL = "http://10.0.2.2:3001"; // emulator
// const API_BASE_URL = "http://192.168.1.xx:3001"; // phone thật

export async function transcribeAudio(audioUri) {
  const formData = new FormData();

  formData.append("audio", {
    uri: audioUri,
    name: "recording.m4a",
    type: "audio/m4a",
  });

  const response = await axios.post(`${API_BASE_URL}/api/stt`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    timeout: 60000,
  });

  return response.data;
}
