import axios from "axios";

// Log baseURL để kiểm tra khi chạy dev/build
console.log("API BASE URL:", process.env.REACT_APP_MAIN_URL);

// Nếu biến môi trường không có giá trị, cảnh báo để dễ debug
if (!process.env.REACT_APP_MAIN_URL) {
    console.warn("⚠️ REACT_APP_MAIN_URL is not set. Axios will not work correctly!");
}

const instanceAPIMain = axios.create({
    baseURL: process.env.REACT_APP_MAIN_URL?.trim() || "http://localhost:8080", // fallback nếu env bị thiếu
    timeout: 30000,
    responseType: "json",
    headers: {
        "Content-Type": "application/json",
    },
});

if (!process.env.REACT_APP_MAIN_URL) {
    instanceAPIMain.interceptors.request.use((config) => {
        console.warn(
            "[AXIOS] Đang sử dụng fallback baseURL http://localhost:8080. Kiểm tra biến môi trường REACT_APP_MAIN_URL!"
        );
        return config;
    });
}

export default instanceAPIMain;