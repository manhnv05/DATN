// Test function để kiểm tra formatDate với dữ liệu thực tế
const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    
    try {
        // Xử lý định dạng "dd-MM-yyyy" từ BE
        if (typeof dateString === 'string' && dateString.includes('-')) {
            const parts = dateString.split('-');
            if (parts.length === 3) {
                const day = parseInt(parts[0], 10);
                const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
                const year = parseInt(parts[2], 10);
                
                const date = new Date(year, month, day);
                
                // Kiểm tra xem date có hợp lệ không
                if (date.getFullYear() === year && 
                    date.getMonth() === month && 
                    date.getDate() === day) {
                    return date.toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    });
                }
            }
        }
        
        // Fallback: thử parse với Date constructor
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        }
        
        return "Chưa cập nhật";
    } catch (error) {
        console.error("Error formatting date:", error);
        return "Chưa cập nhật";
    }
};

// Test cases với dữ liệu thực tế
console.log("Test 1:", formatDate("19-07-2007")); // Expected: 19/07/2007
console.log("Test 2:", formatDate("01-01-1990")); // Expected: 01/01/1990
console.log("Test 3:", formatDate("31-12-2023")); // Expected: 31/12/2023
console.log("Test 4:", formatDate("")); // Expected: Chưa cập nhật
console.log("Test 5:", formatDate(null)); // Expected: Chưa cập nhật
console.log("Test 6:", formatDate("invalid-date")); // Expected: Chưa cập nhật
console.log("Test 7:", formatDate("2007-07-19")); // Fallback test
console.log("Test 8:", formatDate("07/19/2007")); // Fallback test

// Test với dữ liệu từ BE response
const employeeData = {
    "status": 200,
    "message": "Query employee by ID: 37 successful",
    "data": {
        "id": 37,
        "hinhAnh": "",
        "maNhanVien": "EMP-37",
        "hoVaTen": "Nguyễn Văn A",
        "email": "5bamanh5x12@gmail.com",
        "soDienThoai": "0344655744",
        "ngaySinh": "19-07-2007",
        "gioiTinh": "MALE",
        "vaiTro": "EMPLOYEE",
        "diaChi": "Xã Đồng Than, Huyện Yên Mỹ, Tỉnh Hưng Yên",
        "trangThai": "ACTIVE",
        "canCuocCongDan": "012345678904"
    }
};

console.log("Real BE data test:", formatDate(employeeData.data.ngaySinh)); // Expected: 19/07/2007 