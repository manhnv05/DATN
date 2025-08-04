# StageWise Setup Guide (CLI Version)

## Cài đặt StageWise CLI cho dự án

### 1. Cài đặt Extension (Tùy chọn)
- Cài đặt StageWise extension trong code editor của bạn (tùy chọn):
  - Cursor: `cursor:extension/stagewise.stagewise-vscode-extension`
  - VS Code: `vscode:extension/stagewise.stagewise-vscode-extension`

### 2. Sử dụng StageWise CLI
StageWise đã được nâng cấp từ package-based sang CLI-based. Không cần cấu hình trong code nữa.

#### **Cách sử dụng:**

**A. Chạy StageWise CLI:**
```bash
# Trong thư mục fashionshop-ui
npx stagewise
```

**B. Chế độ bridge (nếu muốn dùng extension IDE):**
```bash
npx stagewise -b
```

**C. Nếu dùng pnpm:**
```bash
pnpm dlx stagewise
```

### 3. Cấu hình (Tùy chọn)
Tạo file `stagewise.config.js` trong thư mục gốc nếu cần cấu hình nâng cao:

```javascript
module.exports = {
  // Cấu hình cho StageWise CLI
  port: 3000,
  host: 'localhost',
  debug: true
};
```

## Sử dụng StageWise CLI

1. **Chạy ứng dụng React:**
   ```bash
   npm start
   ```

2. **Chạy StageWise CLI trong terminal khác:**
   ```bash
   npx stagewise
   ```

3. **Mở browser và truy cập ứng dụng**
4. **StageWise sẽ tự động kết nối và hiển thị interface**

## Lưu ý quan trọng

- StageWise CLI chạy độc lập với ứng dụng React
- Không cần cấu hình trong code React nữa
- CLI sẽ tự động phát hiện và kết nối với ứng dụng
- Extension IDE vẫn có thể sử dụng với chế độ bridge

## Troubleshooting

Nếu CLI không hoạt động:
1. Kiểm tra xem ứng dụng React có đang chạy không
2. Đảm bảo port 3000 không bị chiếm
3. Thử chạy với flag debug: `npx stagewise --debug`
4. Kiểm tra console để xem lỗi cụ thể 