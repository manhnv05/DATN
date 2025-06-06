import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true // Cho phép gửi credentials như cookie, dùng cho CORS (nếu backend cho phép)
});

// Nếu backend luôn cần Basic Auth, hãy bỏ comment đoạn sau:
instance.interceptors.request.use(config => {
    config.auth = { username: 'admin', password: '123456' };
    return config;
});

instance.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error);
        if (error.response) {
            console.error('Error Data:', error.response.data);
            console.error('Error Status:', error.response.status);
        }
        return Promise.reject(error);
    }
);

export default instance;