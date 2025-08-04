import dayjs from 'dayjs';

export async function loadThongKe() {
    try {
        const response = await fetch("http://localhost:8080/thong_ke", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            let errorMsg = "Failed to add voucher";
            try {
                const err = await response.json();
                if (err && err.message) errorMsg = err.message;
            } catch { }
            throw new Error(errorMsg);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error adding voucher:", error);
        return null;
    }
}
export async function fetchThongKeAlternative(page, size, search, startDate, endDate) {
    try {
        const searchObject = {};
        if (search) {
            // Nếu backend tìm theo OR thì nên chỉ truyền 1 trường, nếu AND thì truyền cả hai
            searchObject.boLocNgayTuanThangNam = search.trim();
        }
        if (startDate && endDate) {
            searchObject.tuNgay = dayjs(startDate).format('YYYY-MM-DDTHH:mm:ss');
            searchObject.denNgay = dayjs(endDate).format('YYYY-MM-DDTHH:mm:ss');
        }
        // Bộ lọc trạng thái
       
        const response = await fetch(`http://localhost:8080/thong_ke?page=${page}&size=${size}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(searchObject),
        });

        if (!response.ok) {
            // Có thể lấy thêm response json để lấy thông điệp lỗi chi tiết
            let errorMsg = 'Không thể lấy dữ liệu phiếu giảm giá';
            try {
                const err = await response.json();
                if (err && err.message) errorMsg = err.message;
            } catch { }
            throw new Error(errorMsg);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu phiếu giảm giá:", error);
        throw error;
    }
}

export async function loadBieuDo(check) {
    try {
        const response = await fetch(`http://localhost:8080/thong_ke/bieudo/${check}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            let errorMsg = "Failed to add voucher";
            try {
                const err = await response.json();
                if (err && err.message) errorMsg = err.message;
            } catch { }
            throw new Error(errorMsg);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error adding voucher:", error);
        return null;
    }
}