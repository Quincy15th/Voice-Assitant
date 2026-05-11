import { Platform } from 'react-native';

/**
 * QUAN TRỌNG:
 * 1. Nếu dùng Android Emulator: dùng '10.0.2.2'
 * 2. Nếu dùng iOS Simulator: dùng 'localhost'
 * 3. Nếu dùng MÁY THẬT (Expo Go): Bạn phải dùng IP của máy tính (VD: '192.168.1.5')
 */

// BẠN HÃY THAY '192.168.1.5' BẰNG IP IPv4 CỦA MÁY TÍNH BẠN
const YOUR_COMPUTER_IP = '10.0.2.2';

const BASE_URL = Platform.select({
  ios: 'http://localhost:3000',
  android: `http://${YOUR_COMPUTER_IP}:3000`,
  default: `http://${YOUR_COMPUTER_IP}:3000`,
});

export default BASE_URL;
