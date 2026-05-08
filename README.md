<<<<<<< HEAD
# Voice-Assitant
## frontend

cd frontend
npm start

## backend

cd backend
npm start

## mobile

cd mobile
npx expo start -c
=======
# 🎙️ AI Voice Chat Application

A full-stack voice chat application powered by OpenAI's cutting-edge AI models. Features real-time speech-to-text, intelligent conversational AI, and text-to-speech capabilities.

## ✨ Features

- 🎤 **Voice Recording**: High-quality voice message recording with real-time feedback
- 🔊 **Text-to-Speech**: Multiple AI voice options (Alloy, Echo, Fable, Onyx, Nova, Shimmer)
- 💬 **Chat Interface**: Beautiful, responsive chat interface with message history
- 🤖 **AI Assistant**: Powered by GPT-3.5 Turbo for intelligent conversations
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- ⚙️ **Customizable Settings**: Voice selection, auto-play, and conversation management
- 🔐 **Secure API**: RESTful backend with proper error handling and file management

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js
- **OpenAI API** (GPT-3.5 Turbo, Whisper, TTS)
- **Multer** for file upload handling
- **CORS** enabled for cross-origin requests

### Frontend
- **React 18** with hooks and modern patterns
- **CSS3** with animations and responsive design
- **Web Audio API** for voice recording
- **Axios** for HTTP requests

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- OpenAI API key
- Modern web browser with microphone support

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Add your OpenAI API key to `.env`:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3001
   NODE_ENV=development
   ```

5. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
voice-chat-app/
├── backend/
│   ├── server.js              # Main server file
│   ├── package.json           # Backend dependencies
│   ├── .env.example          # Environment template
│   └── uploads/              # Temporary audio files
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── VoiceRecorder.js
│   │   │   ├── ChatMessages.js
│   │   │   └── ControlPanel.js
│   │   ├── services/         # API services
│   │   │   └── chatService.js
│   │   ├── App.js           # Main React component
│   │   └── index.js         # React entry point
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
└── README.md               # This file
```

## 🔧 API Endpoints

### Chat Operations
- `POST /api/chat` - Send message and get AI response
- `GET /api/history` - Get conversation history
- `DELETE /api/history` - Clear conversation history

### Audio Processing
- `POST /api/stt` - Convert speech to text (Whisper)
- `POST /api/tts` - Convert text to speech (OpenAI TTS)

### Health Check
- `GET /health` - Server health status

## 🎮 Usage

1. **Voice Messages**: Click the microphone button to start recording, click again to stop
2. **Text Messages**: Type in the input field and press Enter or click send
3. **Settings**: Click the settings button to customize voice, auto-play, and manage history
4. **Audio Playback**: Click the speaker icon on AI responses to hear them spoken

## 🔒 Security Features

- Input validation and sanitization
- File upload restrictions (size, type)
- Temporary file cleanup
- CORS configuration
- Environment variable protection

## 🌐 Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

**Note**: Microphone access is required for voice recording functionality.

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes |
| `PORT` | Backend server port | No (default: 3001) |
| `NODE_ENV` | Environment mode | No (default: development) |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

**Microphone not working:**
- Ensure browser permissions are granted
- Check if microphone is being used by other applications
- Try refreshing the page

**API errors:**
- Verify OpenAI API key is correct and has sufficient credits
- Check network connectivity
- Ensure backend server is running

**Audio playback issues:**
- Check browser audio permissions
- Verify speakers/headphones are working
- Try different voice options in settings

