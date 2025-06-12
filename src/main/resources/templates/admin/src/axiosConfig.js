import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8080',
    // headers: { 'Content-Type': 'application/json' }, // Không cần mặc định nếu dùng upload file nhiều
    withCredentials: true // Nếu backend cho phép, còn không thì có thể xóa đi
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