import axios from "axios";
import { toast } from "react-toastify";

/**
 * Gửi file ảnh CCCD lên backend, trả về kết quả nhận diện.
 * @param {File|Blob} file Ảnh CCCD
 * @returns {Promise<any>} Dữ liệu nhận diện, có thể là object hoặc mảng text
 */
export async function handleCameraCapture(file) {
    try {
        toast.info("Đang gửi ảnh để nhận diện...");
        const formData = new FormData();
        formData.append("file", file);

        const res = await axios.post("http://localhost:8080/api/cccd/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        toast.success("Đã nhận diện CCCD thành công!");
        return res.data;
    } catch (err) {
        toast.error("Nhận diện thất bại!");
        console.error(err);
        throw err;
    }
}

/**
 * Parse mảng text từ backend CCCD OCR thành object các trường cần thiết,
 * tách riêng xã, huyện, tỉnh từ "Quê quán / Place of origin".
 * @param {string[]} lines Mảng các dòng text nhận diện
 * @returns {Object} Object có { canCuocCongDan, hoVaTen, ngaySinh, gioiTinh, tinh, huyen, xa, queQuan }
 */
export function parseCCCDText(lines) {
    let result = {};
    if (!Array.isArray(lines)) return result;

    let queQuan = "";

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Số CCCD: tìm dòng chứa 'No.:' hoặc 12 số liên tiếp
        if (!result.canCuocCongDan) {
            const cccdMatch = line.match(/No\.:?\s*([0-9]{12})/i) || line.match(/\b[0-9]{12}\b/);
            if (cccdMatch) {
                result.canCuocCongDan = (cccdMatch[1] || cccdMatch[0]).trim();
            }
        }

        // Họ tên: dòng tiếp sau 'Họ và tên' hoặc 'Full name'
        if (
            !result.hoVaTen &&
            (line.toLowerCase().includes("họ và tên") ||
                line.toLowerCase().includes("họ tên") ||
                line.toLowerCase().includes("full name"))
        ) {
            if (i + 1 < lines.length) {
                let nameCandidate = lines[i + 1].trim();
                if (
                    nameCandidate &&
                    !nameCandidate.includes(":") &&
                    /^[A-ZÀÁẢÃẠĂẮẰẲẴẶÂẦẤẨẪẬĐÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴ\s']+$/i.test(nameCandidate) &&
                    nameCandidate.length > 3
                ) {
                    result.hoVaTen = nameCandidate;
                }
            }
        }

        // Ngày sinh
        if (
            !result.ngaySinh &&
            (line.toLowerCase().includes("ngày sinh") || line.toLowerCase().includes("date of birth"))
        ) {
            let date = line.match(/(\d{2})[\/\-](\d{2})[\/\-](\d{4})/);
            if (date) {
                let [day, month, year] = date[0].split(/[\/\-]/);
                if (year && year.length === 4) {
                    result.ngaySinh = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
                }
            }
        }

        // Giới tính
        if (!result.gioiTinh && (line.toLowerCase().includes("giới tính") || line.toLowerCase().includes("sex"))) {
            if (line.toLowerCase().includes("nam")) result.gioiTinh = "Nam";
            else if (line.toLowerCase().includes("nữ")) result.gioiTinh = "Nữ";
            else result.gioiTinh = "";
        }

        // Quê quán (Place of origin) lấy dòng tiếp theo
        if (
            !queQuan &&
            (line.toLowerCase().includes("quê quán") || line.toLowerCase().includes("place of origin"))
        ) {
            if (i + 1 < lines.length) {
                queQuan = lines[i + 1].trim();
            }
        }
    }

    // Tách tỉnh/huyện/xã từ quê quán
    if (queQuan) {
        const parts = queQuan.split(",").map(s => s.trim());
        if (parts.length >= 3) {
            result.xa = parts[0];
            result.huyen = parts[1];
            result.tinh = parts.slice(2).join(", ");
        } else if (parts.length === 2) {
            result.huyen = parts[0];
            result.tinh = parts[1];
        } else if (parts.length === 1) {
            result.tinh = parts[0];
        }
        result.queQuan = queQuan;
    }

    return result;
}