# API Documentation - Quản lý địa chỉ khách hàng

## Tổng quan
Hệ thống quản lý địa chỉ khách hàng cho phép thêm, sửa, xóa và thiết lập địa chỉ mặc định cho khách hàng.

## Các API Endpoints

### 1. Lấy danh sách địa chỉ của khách hàng
```
GET /khachHang/{customerId}/diaChis
```

**Response:**
```json
{
  "status": 200,
  "message": "Query addresses by customerId successful",
  "data": [
    {
      "id": 1,
      "tinhThanhPho": "Hồ Chí Minh",
      "quanHuyen": "Quận 1",
      "xaPhuong": "Phường Bến Nghé",
      "trangThai": "DEFAULT"
    }
  ]
}
```

### 2. Thêm địa chỉ mới
```
POST /khachHang/{customerId}/diaChi
```

**Request Body:**
```json
{
  "tinhThanhPho": "Hồ Chí Minh",
  "quanHuyen": "Quận 1", 
  "xaPhuong": "Phường Bến Nghé",
  "trangThai": "DEFAULT"
}
```

**Validation:**
- Tối đa 5 địa chỉ cho mỗi khách hàng
- Các trường bắt buộc: tinhThanhPho, quanHuyen, xaPhuong
- trangThai chỉ nhận giá trị "DEFAULT" hoặc "PHU"

### 3. Cập nhật địa chỉ
```
PATCH /khachHang/{customerId}/diaChi/{addressId}
```

**Request Body:**
```json
{
  "id": 1,
  "tinhThanhPho": "Hồ Chí Minh",
  "quanHuyen": "Quận 1",
  "xaPhuong": "Phường Bến Nghé",
  "trangThai": "DEFAULT"
}
```

### 4. Thiết lập địa chỉ mặc định
```
PATCH /khachHang/{customerId}/diaChi/{addressId}/setDefault
```

**Response:**
```json
{
  "status": 200,
  "message": "Set default address successfully",
  "data": {
    "id": 1,
    "tinhThanhPho": "Hồ Chí Minh",
    "quanHuyen": "Quận 1",
    "xaPhuong": "Phường Bến Nghé",
    "trangThai": "DEFAULT"
  }
}
```

### 5. Xóa địa chỉ
```
DELETE /khachHang/{customerId}/diaChi/{addressId}
```

**Validation:**
- Không thể xóa địa chỉ mặc định khi còn địa chỉ khác
- Có thể xóa địa chỉ mặc định nếu chỉ có 1 địa chỉ duy nhất

## Logic nghiệp vụ

### Quản lý địa chỉ mặc định
- Mỗi khách hàng chỉ có thể có 1 địa chỉ mặc định
- Khi thiết lập địa chỉ mới làm mặc định, tất cả địa chỉ khác sẽ được reset về trạng thái "PHU"
- Không thể xóa địa chỉ mặc định khi còn địa chỉ khác (phải chọn địa chỉ mới làm mặc định trước)

### Validation
- Tối đa 5 địa chỉ cho mỗi khách hàng
- Các trường địa chỉ không được để trống
- Địa chỉ phải thuộc về khách hàng được chỉ định

### Error Handling
- 404: Khách hàng hoặc địa chỉ không tồn tại
- 400: Validation error (số lượng địa chỉ vượt quá giới hạn, không thể xóa địa chỉ mặc định)
- 500: Lỗi server

## Frontend Integration

### Các thay đổi chính
1. **API Endpoints**: Cập nhật để sử dụng đúng endpoints
2. **Error Handling**: Hiển thị thông báo lỗi từ backend
3. **Validation**: Form validation ở frontend
4. **UX Flow**: Cải thiện flow xử lý xóa địa chỉ mặc định

### Các tính năng mới
- Validation form real-time
- Error message từ backend
- Flow xử lý xóa địa chỉ mặc định được cải thiện
- Loading states và error states 