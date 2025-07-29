export async function fetchKhachHang(page, size, search) {
    try {
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("size", size);
        if (search && search.trim() !== "") {
            params.append("tenKhachHang", search.trim());
        }

        const response = await fetch(`http://localhost:8080/khachHang/query?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error("Lỗi không load được khách hàng");
        }
        const data = await response.json();

        // Đảm bảo trả về object có thuộc tính 'data' với 'content'
        return {
            data: {
                content: data.content || [],
                totalPages: data.totalPages || 0,
                number: data.number || 0,
                first: typeof data.first === 'boolean' ? data.first : true,
                last: typeof data.last === 'boolean' ? data.last : true,
            }
        };
    } catch (error) {
        console.error("Lỗi không load được khách hàng", error);
        // Đảm bảo trả về đúng cấu trúc cho UI, tránh lỗi undefined
        return {
            data: {
                content: [],
                totalPages: 0,
                number: 0,
                first: true,
                last: true,
            }
        };
    }
}