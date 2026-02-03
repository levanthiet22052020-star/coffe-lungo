import axios from "axios";
import { Platform } from "react-native";

const getBaseURL = () => {
    if (Platform.OS === "web") {
        return "http://localhost:3000/api";
    } else if (Platform.OS === "android") {
        return "http://10.0.2.2:3000/api";
    } else {
        return "http://localhost:3000/api";
    }
};

export const axiosInstance = axios.create({
    baseURL: getBaseURL(),
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    config => {
        // Thêm token xác thực vào header nếu cần
        const token = "your-auth-token"; // Lấy token từ nơi lưu trữ của bạn
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Thêm interceptor để xử lý lỗi chung
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        // Xử lý lỗi ở đây (ví dụ: hiển thị thông báo lỗi)
        console.error("API Error:", error.response ? error.response.data : error.message);
        return Promise.reject(error);
    }
);

// Sử dụng axiosInstance để thực hiện các yêu cầu API trong ứng dụng của bạn