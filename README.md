# Hướng Dẫn Chạy Dự Án Spring Boot + ReactJS

## 1. Giới thiệu

Đây là dự án kết hợp **Spring Boot** và **ReactJS**. Dưới đây là hướng dẫn đầy đủ để bạn chạy dự án này trên máy cá nhân.

---

## 2. Yêu cầu hệ thống

- **Java** JDK 21 trở lên
- **Maven** 
- **Node.js**
- **npm** 
- **Git**

---

## 3. Chuẩn bị project

cấu trúc như sau:
```
```
DATN/
├── src/
│   ├── main/
│   │   ├── java/               # Mã nguồn backend (Spring Boot)
│   │   ├── resources/
│   │   │   ├── templates/      # Chứa code build của ReactJS (sau khi build)
│   │   │   ├── static/         # Tài nguyên tĩnh (ảnh, js, css nếu cần)
│   │   │   └── ...             # Các file cấu hình khác
│   └── test/
├── pom.xml                     # File cấu hình Maven
└── README.md
```
```

---

## 4. Hướng dẫn chạy Backend (Spring Boot)

1. **Cài đặt dependencies:**
    - Dùng Maven:
      ```bash
      cd backend
      mvn clean install
      ```
    - Hoặc dùng Gradle (nếu dùng Gradle):
      ```bash
      cd backend
      ./gradlew build
      ```

2. **Chạy ứng dụng:**
    - Với Maven:
      ```bash
      mvn spring-boot:run
      ```
    - Hoặc chạy file jar:
      ```bash
      java -jar target/ten-file.jar
      ```

3. **Kiểm tra:**  
   Mặc định Spring Boot chạy ở cổng `8080`, kiểm tra tại:  
   [http://localhost:8080](http://localhost:8080)

---

## 5. Hướng dẫn chạy Frontend (ReactJS)

1. **Cài đặt dependencies:**
    ```bash
    cd frontend
    npm install
    # hoặc
    yarn install
    ```

2. **Chạy ứng dụng:**
    ```bash
    npm start
    # hoặc
    yarn start
    ```

3. **Kiểm tra:**  
   Mặc định React chạy ở cổng `3000`, kiểm tra tại:  
   [http://localhost:3000](http://localhost:3000)

---

## 6. Kết nối Frontend và Backend

- Kiểm tra file cấu hình API URL ở React (thường là `.env` hoặc file cấu hình riêng).
- Đảm bảo các API gọi đúng địa chỉ backend, ví dụ:
  ```
  REACT_APP_API_URL=http://localhost:8080
  ```

---

## 7. Build sản phẩm

- **Backend**:
  ```bash
  mvn clean package
  # hoặc ./gradlew build
  ```
- **Frontend**:
  ```bash
  npm run build
  # hoặc yarn build
  ```

---

## 8. Một số lỗi thường gặp

- **Port bị chiếm**: Đổi port trong file `application.properties` (backend) hoặc `.env` (frontend).
- **Không gọi được API**: Kiểm tra CORS trong Spring Boot, hoặc cấu hình đúng API URL ở React.
- **Chưa cài đủ dependencies**: Đảm bảo đã chạy `mvn install` (backend) và `npm install` (frontend).

---

## 9. Liên hệ

Nếu có vấn đề, vui lòng tạo issue hoặc liên hệ trực tiếp với tác giả.

---