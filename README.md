# Voice Assistant - Trợ lý Ảo Giọng nói

Một dự án trợ lý ảo giọng nói hoàn chỉnh với khả năng xử lý ngôn ngữ tự nhiên, chuyển đổi giọng nói và giao diện web hiện đại.

## 🏗️ Kiến trúc Tổng quan

Dự án được xây dựng theo kiến trúc microservices với 3 thành phần chính:

```
voice-assistant/
├── ai-services/          # Microservice AI (Python/Flask)
├── backend/              # API Backend (Node.js/Express)
└── frontend/             # Giao diện Web (React/Vite)
```

## 🚀 Tính năng Chính

### 🤖 AI Services (Port 5000)
- **Chuyển đổi Giọng nói thành Văn bản (STT)**: Sử dụng mô hình Whisper
- **Chuyển đổi Văn bản thành Giọng nói (TTS)**: Sử dụng Google Text-to-Speech
- **Phân loại Ý định**: Phân loại ý định người dùng với Machine Learning
- **Truy xuất FAQ**: Tìm kiếm ngữ nghĩa cho câu hỏi thường gặp

### 🔧 Backend API (Port 3000)
- **Xác thực người dùng**: JWT-based authentication
- **Trò chuyện giọng nói**: Xử lý audio real-time
- **Trò chuyện văn bản**: Chat-based communication
- **LLM Integration**: Kết nối với Language Model (Gemma-3-4B) cho AI responses
- **Nhắc nhở thông minh**: Smart reminders với background workers
- **Lịch sử trò chuyện**: Lưu trữ và truy xuất cuộc hội thoại
- **Real-time communication**: Socket.IO cho cập nhật real-time
- **Weather Integration**: Lấy thông tin thời tiết thực tế

### 🎨 Frontend (Port 5173)
- **Giao diện hiện đại**: React + Vite + TailwindCSS
- **Responsive design**: Tương thích trên mọi thiết bị
- **Real-time updates**: Kết nối Socket.IO client
- **Voice recording**: Ghi âm và xử lý audio
- **User authentication**: Đăng nhập/đăng ký người dùng

## 🛠️ Công nghệ Sử dụng

### AI Services
- **Backend**: Flask
- **STT**: Faster-Whisper (model medium)
- **TTS**: Google Text-to-Speech (gTTS)
- **ML**: scikit-learn, Sentence Transformers
- **Ngôn ngữ**: Python

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL + Sequelize ORM
- **Real-time**: Socket.IO
- **Authentication**: JWT
- **Security**: Helmet, CORS, bcrypt
- **LLM**: Gemma-3-4B integration
- **Weather API**: OpenWeatherMap integration

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Real-time**: Socket.IO Client
- **Icons**: React Icons

## 📦 Cài đặt và Cấu hình

### Yêu cầu hệ thống
- Node.js 18+
- Python 3.8+
- PostgreSQL 12+
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd voice-assistant
```

### 2. Cài đặt AI Services
```bash
cd ai-services
pip install flask faster-whisper gtts sentence-transformers scikit-learn pandas numpy joblib

# Huấn luyện mô hình
python ml/train_intent.py
python ml/build_faq_embeddings.py
```

### 3. Cài đặt Backend
```bash
cd ../backend
npm install

# Tạo file .env
cp .env.example .env
# Chỉnh sửa các biến môi trường trong .env
```

### 4. Cài đặt Frontend
```bash
cd ../frontend
npm install
```

### 5. Cấu hình Database
```bash
# Tạo database PostgreSQL
createdb voice_assistant

# Backend sẽ tự động tạo bảng khi chạy ở development mode
```

## 🚀 Chạy ứng dụng

### Method 1: Chạy từng service riêng biệt

```bash
# Terminal 1: AI Services
cd ai-services
python app.py

# Terminal 2: Backend
cd backend
npm run dev

# Terminal 3: Frontend
cd frontend
npm run dev
```

### Method 2: Chạy đồng thời (sử dụng concurrent hoặc npm-run-all)

```bash
# Cài đặt concurrently
npm install -g concurrently

# Chạy tất cả services
concurrently "cd ai-services && python app.py" "cd backend && npm run dev" "cd frontend && npm run dev"
```

## 🌐 Truy cập ứng dụng

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **AI Services**: http://localhost:5000
- **API Documentation**: http://localhost:3000/api-docs

## 📡 API Endpoints

### AI Services
- `POST /stt/transcribe` - Chuyển đổi giọng nói thành văn bản
- `POST /tts/speak` - Chuyển đổi văn bản thành giọng nói
- `POST /intent/predict` - Phân loại ý định người dùng
- `POST /faq` - Truy xuất câu trả lời FAQ

### Backend
- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `POST /api/assistant/voice-chat` - Trò chuyện giọng nói
- `POST /api/assistant/chat` - Trò chuyện văn bản với LLM
- `GET /api/weather` - Lấy thông tin thời tiết
- `GET /api/history` - Lấy lịch sử trò chuyện

## 🔐 Authentication

Sử dụng JWT tokens cho xác thực:
```bash
# Header cho API requests
Authorization: Bearer <your-jwt-token>
```

## 🗄️ Cấu trúc Database

### Models chính
- **Users**: Thông tin người dùng
- **Conversations**: Lịch sử trò chuyện
- **Reminders**: Nhắc nhở thông minh

## 🔧 Development

### Scripts hữu ích
```bash
# Backend
npm run dev        # Development mode
npm start          # Production mode

# Frontend
npm run dev        # Development server
npm run build      # Build for production
npm run preview    # Preview production build

# AI Services
python app.py      # Start Flask server
```

### Environment Variables
```bash
# Backend (.env)
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://username:password@localhost:5432/voice_assistant
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:5173

# LLM Configuration
LLM_URL=http://127.0.0.1:1234/v1/chat/completions
LLM_MODEL=google/gemma-3-4b

# Weather API
WEATHER_API_KEY=your_openweathermap_api_key
WEATHER_CITY=Hanoi

# Frontend (.env)
VITE_API_URL=http://localhost:3000
VITE_AI_SERVICE_URL=http://localhost:5000
```

## 🧪 Testing

### AI Services
```bash
# Test STT
curl -X POST -F "audio=@test.wav" http://localhost:5000/stt/transcribe

# Test TTS
curl -X POST -H "Content-Type: application/json" -d '{"text":"Xin chào"}' http://localhost:5000/tts/speak
```

### Backend
```bash
# Test health check
curl http://localhost:3000/health

# Test authentication
curl -X POST -H "Content-Type: application/json" -d '{"username":"test","password":"test"}' http://localhost:3000/api/auth/login

# Test LLM chat
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <token>" -d '{"message":"Xin chào"}' http://localhost:3000/api/assistant/chat

# Test weather API
curl -X GET -H "Authorization: Bearer <token>" "http://localhost:3000/api/weather?city=Hanoi"
```

## 📊 Monitoring & Logging

- **Backend**: Morgan cho HTTP logging, custom logging cho application events
- **AI Services**: Flask logging với structured output
- **Frontend**: Console logging và error tracking

## 🛡️ Security

- JWT-based authentication
- CORS configuration
- Helmet.js security headers
- Input validation
- Password hashing với bcrypt


## 🚀 Deployment

### Production Environment Variables
```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://prod_user:password@db_host:5432/voice_assistant
JWT_SECRET=production-secret-key
CORS_ORIGIN=https://yourdomain.com
```

### Docker (khuyến nghị)
```dockerfile
# Tạo Dockerfile cho từng service
# Sử dụng docker-compose cho orchestration
```

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Create Pull Request

## 📝 Todo List

- [ ] Docker containerization
- [ ] Automated testing setup
- [ ] CI/CD pipeline
- [ ] Rate limiting implementation
- [ ] Advanced error handling
- [ ] Performance monitoring
- [ ] Internationalization (i18n)
- [ ] Mobile app development

## 📄 License

Dự án được cấp phép theo MIT License.


## 🔍 Troubleshooting

### Common Issues

1. **Port conflicts**: Đảm bảo các ports 3000, 5000, 5173 đang available
2. **Database connection**: Kiểm tra PostgreSQL đang chạy và connection string đúng
3. **CORS errors**: Xác nhận CORS_ORIGIN trong .env khớp với frontend URL
4. **AI models**: Đảm bảo đã huấn luyện models trước khi chạy AI services

### Debug Mode
```bash
# Backend debug
DEBUG=* npm run dev

# AI Services debug
FLASK_ENV=development python app.py
```

## 📚 Additional Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [Express.js Guide](https://expressjs.com/en/guide/)
- [React Documentation](https://react.dev/)
- [Socket.IO Documentation](https://socket.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
