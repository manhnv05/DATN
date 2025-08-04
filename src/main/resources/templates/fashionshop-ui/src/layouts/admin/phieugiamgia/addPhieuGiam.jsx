import Input from "@mui/material/Input";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import Card from "@mui/material/Card";
import FormControl from "@mui/material/FormControl";
import { FormHelperText } from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Menu from "@mui/material/Menu";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Icon from "@mui/material/Icon";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import SoftBox from "components/SoftBox";
import Table from "examples/Tables/Table";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { addVouchers, sendMail } from "./service/PhieuGiamService";
import { toast } from "react-toastify";
import { fetchKhachHang } from "./service/KhachHangService";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { addPDDKH } from "./service/PhieuGiamGiaKhachHangService";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function getPaginationItems(currentPage, totalPages) {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, function (_, index) { return index + 1; });
    }
    if (currentPage <= 3) {
        return [1, 2, 3, 4, "...", totalPages - 1, totalPages];
    }
    if (currentPage >= totalPages - 2) {
        return [1, 2, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, 2, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages - 1, totalPages];
}

export default function AddPhieuGiam() {
    const [statusPhieu, setStatusPhieu] = useState(0);
    const [giaTriGiam, setGiaTriGiam] = useState("");
    const [loaiPhieu, setLoaiPhieu] = useState(0);
    const [tongSoTrang, setTongSoTrang] = useState(0);
    const [danhSachKhachHang, setDanhSachKhachHang] = useState([]);
    const [tatCaKhachHang, setTatCaKhachHang] = useState([]);
    const [soTrangHienTai, setSoTrangHienTai] = useState(1);
    const [soLuongXem, setSoLuongXem] = useState(5);
    const [danhSachDaChon, setDanhSachDaChon] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [dangTaiDuLieu, setDangTaiDuLieu] = useState(false);
    const [timKiemKhachHang, setTimKiemKhachHang] = useState("");
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [dieuKienGiamDisplay, setDieuKienGiamDisplay] = useState("");
    const [giaTriGiamDisplay, setGiaTriGiamDisplay] = useState("");
    const [giamToiDaDisplay, setGiamToiDaDisplay] = useState("");

    const navigate = useNavigate();

    const tatCaDuocChon = danhSachKhachHang.length > 0 &&
        danhSachKhachHang.every(function (khachHang) { return danhSachDaChon.includes(khachHang.id); });

    const cacLuaChonXem = [5, 10, 20];

    // Hàm format số thành tiền tệ (cải tiến)
    function formatCurrency(value) {
        if (!value || value === "0") return "";
        // Loại bỏ tất cả ký tự không phải số
        const numericValue = value.toString().replace(/\D/g, "");
        if (!numericValue) return "";

        // Format số với dấu phẩy phân cách hàng nghìn
        const formatted = new Intl.NumberFormat('vi-VN').format(numericValue);
        return formatted + " VNĐ";
    }

    // Hàm lấy giá trị số từ chuỗi đã format
    function getNumericValue(formattedValue) {
        if (!formattedValue) return "";
        return formattedValue.replace(/\D/g, "");
    }

    // Thêm hàm xử lý sự kiện keydown để hỗ trợ xóa tốt hơn
    function handleKeyDown(event, fieldType, fieldType2) {
        // Xử lý phím Backspace và Delete
        if (event.key === 'Backspace' || event.key === 'Delete') {
            const currentValue = event.target.value;

            // Nếu đang ở cuối chuỗi và nhấn Backspace
            if (event.key === 'Backspace' && event.target.selectionStart === currentValue.length) {
                event.preventDefault();

                if (fieldType === 'currency') {
                    // Xóa từng ký tự số từ cuối
                    const numericValue = getNumericValue(currentValue);
                    if (numericValue.length > 1) {
                        const newNumericValue = numericValue.slice(0, -1);
                        const newValue = formatCurrency(newNumericValue);
                        console.log(newValue, fieldType)
                        // Cập nhật state tương ứng
                        if (fieldType2 === 'dieuKienGiam') {
                            setDieuKienGiamDisplay(newValue);
                            setValue("dieuKienGiam", newNumericValue);
                        } else if (fieldType2 === 'giamToiDa') {
                            setGiamToiDaDisplay(newValue);
                            setValue("giamToiDa", newNumericValue);
                        } else if (fieldType2 === 'soTienGiam' && statusPhieu === 0) {
                            setGiaTriGiamDisplay(newValue);
                            setGiaTriGiam(newNumericValue);
                            setValue("soTienGiam", newNumericValue);
                            console.log(newNumericValue)
                        }
                    } else {
                        // Xóa hết - cập nhật cho tất cả các trường currency
                        if (currentValue.includes("VNĐ")) {
                            if (currentValue === dieuKienGiamDisplay) {
                                setDieuKienGiamDisplay("");
                                setValue("dieuKienGiam", "");
                            } else if (currentValue === giamToiDaDisplay) {
                                setGiamToiDaDisplay("");
                                setValue("giamToiDa", "");
                            } else if (currentValue === giaTriGiamDisplay && statusPhieu === 0) {
                                setGiaTriGiamDisplay("");
                                setGiaTriGiam("");
                            }
                        }
                    }
                } else if (fieldType === 'percentage') {
                    // Xử lý cho phần trăm
                    const numericValue = currentValue.replace(/\D/g, "");
                    if (numericValue.length > 1) {
                        const newNumericValue = numericValue.slice(0, -1);
                        setGiaTriGiamDisplay(newNumericValue + "%");
                        setGiaTriGiam(newNumericValue);
                    } else {
                        setGiaTriGiamDisplay("");
                        setGiaTriGiam("");
                    }
                }
            }
        }
    }

    // Hàm xử lý khi thay đổi giá trị điều kiện giảm (cải tiến)
    function handleDieuKienGiamChange(event) {
        const inputValue = event.target.value;

        // Nếu input rỗng, cho phép xóa hoàn toàn
        if (inputValue === "") {
            setDieuKienGiamDisplay("");
            setValue("dieuKienGiam", "");
            return;
        }

        const numericValue = getNumericValue(inputValue);

        // Nếu không có số nào, giữ nguyên trạng thái hiện tại
        if (!numericValue) {
            return;
        }

        const formattedValue = formatCurrency(numericValue);
        setDieuKienGiamDisplay(formattedValue);
        setValue("dieuKienGiam", numericValue);
    }

    // Hàm xử lý khi thay đổi giảm tối đa (cải tiến)
    function handleGiamToiDaChange(event) {
        const inputValue = event.target.value;

        // Nếu input rỗng, cho phép xóa hoàn toàn
        if (inputValue === "") {
            setGiamToiDaDisplay("");
            setValue("giamToiDa", "");
            return;
        }

        const numericValue = getNumericValue(inputValue);

        // Nếu không có số nào, giữ nguyên trạng thái hiện tại
        if (!numericValue) {
            return;
        }

        const formattedValue = formatCurrency(numericValue);
        setGiamToiDaDisplay(formattedValue);
        setValue("giamToiDa", numericValue);
    }

    // Hàm xử lý khi thay đổi giá trị giảm (cải tiến)
    function handleGiaTriGiamChange(event) {
        const inputValue = event.target.value;

        // Nếu input rỗng, cho phép xóa hoàn toàn
        if (inputValue === "") {
            setGiaTriGiamDisplay("");
            setGiaTriGiam("");
            return;
        }

        if (statusPhieu === 1) {
            // Nếu là phần trăm, chỉ cho phép số từ 0-50
            let numericValue = inputValue.replace(/\D/g, "");
            if (!numericValue) {
                return;
            }
            if (Number(numericValue) > 50) {
                numericValue = "50";
            }
            setGiaTriGiamDisplay(numericValue + "%");
            setGiaTriGiam(numericValue);
        } else {
            // Nếu là tiền, format như tiền tệ
            const numericValue = getNumericValue(inputValue);
            if (!numericValue) {
                return;
            }
            const formattedValue = formatCurrency(numericValue);
            setGiaTriGiamDisplay(formattedValue);
            setGiaTriGiam(numericValue);
        }
    }

    function moMenu(event) {
        setAnchorEl(event.currentTarget);
    }
    function dongMenu() {
        setAnchorEl(null);
    }
    function chonTatCaKhachHangHienTai() {
        if (tatCaDuocChon) {
            const cacIdTrangHienTai = danhSachKhachHang.map(function (khachHang) { return khachHang.id; });
            setDanhSachDaChon(danhSachDaChon.filter(function (id) { return !cacIdTrangHienTai.includes(id); }));
        } else {
            const cacIdTrangHienTai = danhSachKhachHang.map(function (khachHang) { return khachHang.id; });
            const danhSachMoi = [].concat(danhSachDaChon);
            cacIdTrangHienTai.forEach(function (id) {
                if (!danhSachMoi.includes(id)) {
                    danhSachMoi.push(id);
                }
            });
            setDanhSachDaChon(danhSachMoi);
        }
    }
    function chonTatCaKhachHang() {
        if (danhSachDaChon.length === tatCaKhachHang.length) {
            setDanhSachDaChon([]);
        } else {
            const toanBoId = tatCaKhachHang.map(function (khachHang) { return khachHang.id; });
            setDanhSachDaChon(toanBoId);
        }
    }
    function chonKhachHang(id) {
        if (danhSachDaChon.includes(id)) {
            setDanhSachDaChon(danhSachDaChon.filter(function (i) { return i !== id; }));
        } else {
            setDanhSachDaChon([].concat(danhSachDaChon, [id]));
        }
    }
    function thayDoiTrangMoi(trangMoi) {
        if (
            trangMoi >= 1 &&
            trangMoi <= tongSoTrang &&
            trangMoi !== soTrangHienTai &&
            typeof trangMoi === "number"
        ) {
            setSoTrangHienTai(trangMoi);
            taiDuLieuKhachHang(trangMoi - 1);
        }
    }

    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors }
    } = useForm({
        mode: "onChange", // 👈 validate mỗi khi thay đổi
    });

    async function onSubmit(duLieuNhapVao) {
        const cacTruongBatBuoc = [
            { field: "maPhieuGiamGia", message: "Mã phiếu không để trống" },
            { field: "tenPhieu", message: "Tên phiếu không để trống" },
            { field: "dieuKienGiam", message: "Điều kiện giảm không để trống" },
            { field: "soLuong", message: "Số lượng không để trống" },
            { field: "giamToiDa", message: "Giảm tối đa không để trống" },
            { field: "loaiPhieu", message: "Loại phiếu không để trống" },
            { field: "ngayBatDau", message: "Ngày bắt đầu không để trống" },
            { field: "ngayKetThuc", message: "Ngày kết thúc không để trống" }
        ];
        for (let i = 0; i < cacTruongBatBuoc.length; i++) {

            const truong = cacTruongBatBuoc[i].field;
            if (!duLieuNhapVao[truong] && duLieuNhapVao[truong] !== 0) {
                toast.error(cacTruongBatBuoc[i].message);
                return;
            }
        }
        if (giaTriGiam === "") {
            toast.error("Giá trị không để trống");
            return;
        }

        const duLieuGuiLen = {
            maPhieuGiamGia: duLieuNhapVao.maPhieuGiamGia,
            dieuKienGiam: duLieuNhapVao.dieuKienGiam.toString(),
            tenPhieu: duLieuNhapVao.tenPhieu,
            loaiPhieu: Number(duLieuNhapVao.loaiPhieu),
            phamTramGiamGia: statusPhieu === 1 ? Number(giaTriGiam) : null,
            soTienGiam: statusPhieu === 0 ? Number(giaTriGiam) : null,
            giamToiDa: duLieuNhapVao.giamToiDa ? Number(duLieuNhapVao.giamToiDa) : 0,
            ngayBatDau: dayjs(duLieuNhapVao.ngayBatDau).format("YYYY-MM-DDTHH:mm:ss"),
            ngayKetThuc: dayjs(duLieuNhapVao.ngayKetThuc).format("YYYY-MM-DDTHH:mm:ss"),
            ngayTao: null,
            ngayCapNhat: null,
            ghiChu: duLieuNhapVao.ghiChu || "",
            trangThai: 2,
            soLuong: duLieuNhapVao.soLuong ? Number(duLieuNhapVao.soLuong) : 0
        };
        console.log(duLieuGuiLen)

        const ketQua = await addVouchers(duLieuGuiLen);
        console.log(ketQua)
        if (ketQua.code) {
            const danhSachEmailKhachHang = tatCaKhachHang.filter(function (khachHang) { return danhSachDaChon.includes(khachHang.id); }).map(function (khachHang) { return khachHang.email; });
            const duLieuGuiMail = {
                phieuGiamGiaVO: duLieuGuiLen,
                emails: danhSachEmailKhachHang
            };
            sendMail(duLieuGuiMail);
            const danhSachPhieuGiamGiaKhachHang = danhSachDaChon.map(function (idKhachHang) {
                return {
                    phieuGiamGia: ketQua.data.id,
                    khachHang: idKhachHang,
                    trangThai: 1
                };
            });
            if (danhSachPhieuGiamGiaKhachHang.length !== 0) {
                await addPDDKH(danhSachPhieuGiamGiaKhachHang);
            }
            navigate("/PhieuGiam", {
                state: {
                    message: "Thêm voucher thành công!",
                },
            });
        } else {
            toast.warning("Thêm voucher thất bại, " + ketQua.message);
        }
    }

    async function taiDuLieuKhachHang(soTrang) {
        setDangTaiDuLieu(true);
        try {
            const duLieu = await fetchKhachHang(soTrang, soLuongXem, timKiemKhachHang);
            setDanhSachKhachHang(duLieu.data.content);
            setTongSoTrang(duLieu.data.totalPages);
            const tatCa = await fetchKhachHang(0, 999);
            setTatCaKhachHang(tatCa.data.content);
        } catch (error) {
            console.error("Lỗi khi tải danh sách khách hàng:", error);
            toast.error("Lỗi khi tải danh sách khách hàng");
        } finally {
            setDangTaiDuLieu(false);
        }
    }

    useEffect(function () {
        taiDuLieuKhachHang(soTrangHienTai - 1);
    }, [soTrangHienTai, soLuongXem, timKiemKhachHang]);

    function thayDoiLoaiGiamGia(event) {
        setStatusPhieu(Number(event.target.value));
        setGiaTriGiam("");
        setGiaTriGiamDisplay(""); // Reset display value
        if (event.target.value == 0) {
            setValue("phamTramGiamGia", "");
        } else {
            setValue("soTienGiam", "");
        }
    }

    function thayDoiGiaTriGiam(event) {
        // Hàm này giờ được thay thế bởi handleGiaTriGiamChange
        handleGiaTriGiamChange(event);
    }

    function thayDoiRadioLoaiGiamGia(event) {
        const giaTri = Number(event.target.value);
        setStatusPhieu(giaTri);
        setGiaTriGiam("");
        setGiaTriGiamDisplay(""); // Reset display value
    }

    function renderCheckbox(row) {
        return (
            <Checkbox
                checked={row.selected}
                onChange={function () { chonKhachHang(row.id); }}
                size="small"
            />
        );
    }

    useEffect(() => {
        setValue("soLuong", danhSachDaChon.length)
    }, [danhSachDaChon])

    const danhSachDong = danhSachKhachHang.map(function (khachHang, chiSo) {
        return {
            id: khachHang.id,
            checkbox: renderCheckbox({
                id: khachHang.id,
                selected: danhSachDaChon.includes(khachHang.id)
            }),
            stt: (soTrangHienTai - 1) * soLuongXem + chiSo + 1,
            tenKhachHang: khachHang.tenKhachHang,
            email: khachHang.email,
            selected: danhSachDaChon.includes(khachHang.id)
        };
    }) || [];

    const danhSachCot = [
        {
            name: "checkbox",
            label: "",
            align: "center",
            width: "50px"
        },
        { name: "stt", label: "STT", align: "center", width: "60px" },
        { name: "tenKhachHang", label: "Tên khách hàng", align: "left" },
        { name: "email", label: "Email", align: "left" }
    ];

    const cacPhanTrang = getPaginationItems(soTrangHienTai, tongSoTrang);

    const soLuongDaChon = danhSachDaChon.length;
    const tongSoKhachHang = tatCaKhachHang.length;

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <SoftBox py={3} sx={{ background: "#F4F6FB", minHeight: "100vh", userSelect: "none" }}>
                <SoftBox sx={{ fontSize: "14px", fontWeight: "bold", marginBottom: 2, paddingLeft: 3, paddingRight: 3 }}>
                    Phiếu giảm giá / Thêm mới
                </SoftBox>
                <Card sx={{ padding: { xs: 2, md: 3 }, marginLeft: 3, marginRight: 3 }}>
                    <Box display="flex" flexDirection="row">
                        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: "40%" }}>
                            <Box display="flex" flexDirection="column">
                                <Box display="flex" flexDirection="row" gap={2} marginBottom={2}>
                                    <Box sx={{ flex: 1 }}>
                                        <Box component="label" sx={{ display: "block", marginBottom: 1, fontSize: "14px" }}>
                                            Mã phiếu giảm giá
                                        </Box>
                                        <Input
                                            placeholder="VD:PGG123"
                                            fullWidth
                                            type="text"
                                            {...register("maPhieuGiamGia")}
                                            sx={{
                                                fontWeight: 700,
                                                color: "#1769aa",
                                                background: "#f2f6fa",
                                                borderRadius: 2,
                                                paddingLeft: 1
                                            }}
                                        />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Box component="label" sx={{ display: "block", marginBottom: 1, fontSize: "14px" }}>
                                            Tên phiếu
                                        </Box>
                                        <Input
                                            placeholder="VD:Giảm giá ngày hè"
                                            fullWidth
                                            type="text"
                                            {...register("tenPhieu")}
                                            sx={{
                                                fontWeight: 700,
                                                color: "#1769aa",
                                                background: "#f2f6fa",
                                                borderRadius: 2,
                                                paddingLeft: 1
                                            }}
                                        />
                                    </Box>
                                </Box>
                                <Box display="flex" flexDirection="row" gap={2} marginBottom={2}>
                                    <Box sx={{ flex: 1 }}>
                                        <Box component="label" sx={{ display: "block", marginBottom: 1, fontSize: "14px" }}>
                                            Điều kiện giảm
                                        </Box>
                                        <FormControl fullWidth error={!!errors.dieuKienGiam}>
                                            <Input
                                                placeholder="VD: 100.000 VNĐ"
                                                fullWidth
                                                type="text"
                                                value={dieuKienGiamDisplay}
                                                onChange={handleDieuKienGiamChange}
                                                onKeyDown={(event) => handleKeyDown(event, 'currency', 'dieuKienGiam')}
                                                sx={{
                                                    fontWeight: 700,
                                                    color: "#1769aa",
                                                    background: "#f2f6fa",
                                                    borderRadius: 2,
                                                    paddingLeft: 1
                                                }}
                                            />
                                            {/* Hidden input để register với react-hook-form */}
                                            <input
                                                type="hidden"
                                                {...register("dieuKienGiam", {
                                                    required: "Vui lòng nhập điều kiện giảm",
                                                    validate: (value) => {
                                                        if (!value || value === "0") return "Vui lòng nhập điều kiện giảm";
                                                        return /^\d+$/.test(value) || "Chỉ được nhập số";
                                                    }
                                                })}
                                            />
                                            {errors.dieuKienGiam && (
                                                <FormHelperText>{errors.dieuKienGiam.message}</FormHelperText>
                                            )}
                                        </FormControl>
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Box component="label" sx={{ display: "block", marginBottom: 1, fontSize: "14px" }}>
                                            Loại phiếu
                                        </Box>
                                        <Controller
                                            name="loaiPhieu"
                                            control={control}
                                            defaultValue="0"
                                            render={function ({ field }) {
                                                return (
                                                    <FormControl>
                                                        <RadioGroup
                                                            row
                                                            {...field}
                                                            name="loaiPhieu"
                                                            onChange={function (event) {
                                                                const giaTri = Number(event.target.value);
                                                                field.onChange(giaTri);
                                                                setLoaiPhieu(giaTri);
                                                                setDanhSachDaChon([]);
                                                                setSoTrangHienTai(1);
                                                                setIsReadOnly((prev) => !prev)
                                                            }}
                                                            sx={{ paddingLeft: 1 }}
                                                        >
                                                            <FormControlLabel sx={{ marginRight: 3 }} value={0} control={<Radio />} label="Công khai" />
                                                            <FormControlLabel value={1} control={<Radio />} label="Cá nhân" />
                                                        </RadioGroup>
                                                    </FormControl>
                                                );
                                            }}
                                        />
                                    </Box>
                                </Box>
                                <Box display="flex" flexDirection="row" gap={2} marginBottom={2}>
                                    <Box sx={{ flex: 1 }}>
                                        <Box component="label" sx={{ display: "block", marginBottom: 1, fontSize: "14px" }}>
                                            Giá trị
                                        </Box>
                                        <Input
                                            fullWidth
                                            type="text"
                                            value={giaTriGiamDisplay}
                                            onChange={handleGiaTriGiamChange}
                                            onKeyDown={(event) => handleKeyDown(event, statusPhieu === 1 ? 'percentage' : 'currency', 'soTienGiam')}
                                            placeholder={statusPhieu ? "VD: 10%" : "VD: 100.000 VNĐ"}
                                            sx={{
                                                fontWeight: 700,
                                                color: "#1769aa",
                                                background: "#f2f6fa",
                                                borderRadius: 2,
                                                paddingLeft: 1
                                            }}
                                        />
                                        {/* Hidden input để register với react-hook-form */}
                                        <input
                                            type="hidden"
                                            {...register(statusPhieu ? "phamTramGiamGia" : "soTienGiam")}
                                            value={giaTriGiam}
                                        />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Box component="label" sx={{ display: "block", marginBottom: 1, fontSize: "14px" }}>
                                            Loại Giảm giá
                                        </Box>
                                        <FormControl>
                                            <RadioGroup
                                                value={statusPhieu === 0 ? "0" : "1"}
                                                onChange={thayDoiRadioLoaiGiamGia}
                                                onClick={thayDoiLoaiGiamGia}
                                                row
                                                sx={{ paddingLeft: 1 }}
                                            >
                                                <FormControlLabel sx={{ marginRight: 4 }} value="0" control={<Radio />} label="Giá tiền" />
                                                <FormControlLabel value="1" control={<Radio />} label="Phần trăm" />
                                            </RadioGroup>
                                        </FormControl>
                                    </Box>
                                </Box>
                                <Box display="flex" flexDirection="row" gap={2} marginBottom={2}>
                                    <Box sx={{ flex: 1 }}>
                                        <Box component="label" sx={{ display: "block", marginBottom: 1, fontSize: "14px" }}>
                                            Giảm tối đa
                                        </Box>

                                        <FormControl fullWidth error={!!errors.giamToiDa}>
                                            <Input
                                                placeholder="VD: 100.000 VNĐ"
                                                fullWidth
                                                type="text"
                                                value={giamToiDaDisplay}
                                                onChange={handleGiamToiDaChange}
                                                onKeyDown={(event) => handleKeyDown(event, 'currency', 'giamToiDa')}
                                                sx={{
                                                    fontWeight: 700,
                                                    color: "#1769aa",
                                                    background: "#f2f6fa",
                                                    borderRadius: 2,
                                                    paddingLeft: 1
                                                }}
                                            />
                                            {/* Hidden input để register với react-hook-form */}
                                            <input
                                                type="hidden"
                                                {...register("giamToiDa", {
                                                    required: "Vui lòng nhập giảm tối đa",
                                                    validate: (value) => {
                                                        if (!value || value === "0") return "Vui lòng nhập giảm tối đa";
                                                        return /^\d+$/.test(value) || "Chỉ được nhập số";
                                                    }
                                                })}
                                            />
                                            {errors.giamToiDa && (
                                                <FormHelperText>{errors.giamToiDa.message}</FormHelperText>
                                            )}
                                        </FormControl>

                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Box component="label" sx={{ display: "block", marginBottom: 1, fontSize: "14px" }}>
                                            Số lượng
                                        </Box>
                                        <Input
                                            fullWidth
                                            inputProps={{ readOnly: isReadOnly }}
                                            type="number"
                                            {...register("soLuong")}
                                            sx={{
                                                fontWeight: 700,
                                                color: "#1769aa",
                                                background: "#f2f6fa",
                                                borderRadius: 2,
                                                paddingLeft: 1
                                            }}
                                        />
                                    </Box>
                                </Box>
                                <Box display="flex" flexDirection="row" gap={2} mb={2}>
                                    <Box sx={{ flex: 1, maxWidth: 210 }}>
                                        <Box component="label" sx={{ display: "block", mb: 1, fontSize: "14px" }}>
                                            Ngày bắt đầu
                                        </Box>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <Controller
                                                name="ngayBatDau"
                                                control={control}
                                                defaultValue={null}
                                                render={({ field }) => (
                                                    <DateTimePicker
                                                        renderInput={(props) => (
                                                            <TextField
                                                                {...props}
                                                                fullWidth
                                                                sx={{
                                                                    '& .MuiInputBase-root': {
                                                                        fontWeight: 700,
                                                                        color: "#1769aa",
                                                                        background: "#f2f6fa",
                                                                        borderRadius: 2,
                                                                        height: '56px',
                                                                        fontSize: '16px',
                                                                    },
                                                                    '& .MuiInputBase-input': {
                                                                        padding: '16.5px 14px',
                                                                    },
                                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                                        border: 'none',
                                                                    }
                                                                }}
                                                            />
                                                        )}
                                                        value={field.value}
                                                        onChange={(newValue) => {
                                                            field.onChange(newValue);
                                                        }}
                                                    />
                                                )}
                                            />
                                        </LocalizationProvider>
                                    </Box>
                                    <Box sx={{ flex: 1, maxWidth: 210 }}>
                                        <Box component="label" sx={{ display: "block", mb: 1, fontSize: "14px" }}>
                                            Ngày kết thúc
                                        </Box>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <Controller
                                                name="ngayKetThuc"
                                                control={control}
                                                defaultValue={null}
                                                render={({ field }) => (
                                                    <DateTimePicker

                                                        renderInput={(props) => (
                                                            <TextField
                                                                {...props}
                                                                fullWidth
                                                                sx={{
                                                                    '& .MuiInputBase-root': {
                                                                        fontWeight: 700,
                                                                        color: "#1769aa",
                                                                        background: "#f2f6fa",
                                                                        borderRadius: 2,
                                                                        height: '56px',
                                                                        fontSize: '16px',
                                                                    },
                                                                    '& .MuiInputBase-input': {
                                                                        padding: '16.5px 14px',
                                                                    },
                                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                                        border: 'none',
                                                                    }
                                                                }}
                                                            />
                                                        )}
                                                        value={field.value}
                                                        onChange={(newValue) => {
                                                            field.onChange(newValue);
                                                        }}
                                                    />
                                                )}
                                            />
                                        </LocalizationProvider>
                                    </Box>
                                </Box>
                                <Box marginTop={2}>
                                    <Button
                                        type="submit"
                                        variant="outlined"
                                        sx={{
                                            borderRadius: 2,
                                            textTransform: "none",
                                            fontWeight: 400,
                                            color: "#49a3f1",
                                            borderColor: "#49a3f1",
                                            boxShadow: "none",
                                            "&:hover": {
                                                borderColor: "#1769aa",
                                                background: "#f0f6fd",
                                                color: "#1769aa",
                                            },
                                        }}>
                                        Thêm
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{ width: "60%", marginLeft: 2 }}>
                            {loaiPhieu === 1 && (
                                <Card sx={{ padding: { xs: 2, md: 3 } }}>
                                    <SoftBox
                                        display="flex"
                                        flexDirection={{ xs: "column", md: "row" }}
                                        alignItems="center"
                                        justifyContent="space-between"
                                        gap={2}
                                        marginBottom={2}
                                    >
                                        <SoftBox flex={1} display="flex" alignItems="center" gap={2} maxWidth={400}>
                                            <Input
                                                fullWidth
                                                placeholder="Tìm kiếm theo tên"
                                                value={timKiemKhachHang}
                                                onChange={function (event) { setTimKiemKhachHang(event.target.value); }}
                                                startAdornment={
                                                    <InputAdornment position="start">
                                                        <Icon fontSize="small" sx={{ color: "#868686" }}>
                                                            search
                                                        </Icon>
                                                    </InputAdornment>
                                                }
                                                sx={{ background: "#f5f6fa", borderRadius: 2, padding: 0.5, color: "#222" }}
                                            />
                                        </SoftBox>
                                        <SoftBox display="flex" alignItems="center" gap={2}>
                                            <Box component="span" sx={{ fontSize: "14px", color: "#666" }}>
                                                Đã chọn: {soLuongDaChon}/{tongSoKhachHang}
                                            </Box>
                                            <SoftBox display="flex" alignItems="center" gap={1}>
                                                <Checkbox
                                                    checked={tatCaDuocChon}
                                                    onChange={chonTatCaKhachHangHienTai}
                                                    size="small"
                                                />
                                                <Box component="span" sx={{ fontSize: "14px" }}>
                                                    Chọn trang này ({danhSachKhachHang.length})
                                                </Box>
                                            </SoftBox>
                                            <Button
                                                variant="text"
                                                size="small"
                                                onClick={chonTatCaKhachHang}
                                                sx={{
                                                    textTransform: "none",
                                                    fontSize: "14px",
                                                    minWidth: "auto",
                                                    padding: "4px 8px"
                                                }}
                                            >
                                                {danhSachDaChon.length === tatCaKhachHang.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                                            </Button>
                                        </SoftBox>
                                    </SoftBox>
                                    <SoftBox>
                                        <Table columns={danhSachCot} rows={danhSachDong} loading={dangTaiDuLieu} />
                                    </SoftBox>
                                    <SoftBox
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        marginTop={2}
                                        flexWrap="wrap"
                                        gap={2}
                                    >
                                        <SoftBox>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                sx={{
                                                    borderRadius: 2,
                                                    textTransform: "none",
                                                    color: "#49a3f1",
                                                    borderColor: "#49a3f1"
                                                }}
                                                onClick={moMenu}
                                            >
                                                Xem {soLuongXem} khách hàng
                                            </Button>
                                            <Menu
                                                anchorEl={anchorEl}
                                                open={Boolean(anchorEl)}
                                                onClose={dongMenu}
                                            >
                                                {cacLuaChonXem.map(function (soLuong) {
                                                    return (
                                                        <MenuItem
                                                            key={soLuong}
                                                            onClick={function () {
                                                                setSoLuongXem(soLuong);
                                                                setSoTrangHienTai(1);
                                                                dongMenu();
                                                            }}
                                                            sx={{ color: "#495057" }}
                                                        >
                                                            Xem {soLuong} khách hàng
                                                        </MenuItem>
                                                    );
                                                })}
                                            </Menu>
                                        </SoftBox>
                                        <SoftBox display="flex" alignItems="center" gap={1}>
                                            <Button
                                                variant="text"
                                                size="small"
                                                disabled={soTrangHienTai === 1}
                                                onClick={function () { thayDoiTrangMoi(soTrangHienTai - 1); }}
                                                sx={{ color: soTrangHienTai === 1 ? "#bdbdbd" : "#49a3f1" }}
                                            >
                                                TRƯỚC
                                            </Button>
                                            {cacPhanTrang.map(function (item, index) {
                                                if (item === "...") {
                                                    return (
                                                        <Button
                                                            key={"ellipsis-" + index}
                                                            variant="text"
                                                            size="small"
                                                            disabled
                                                            sx={{
                                                                minWidth: 32,
                                                                height: 32,
                                                                borderRadius: 2,
                                                                color: "#bdbdbd",
                                                                pointerEvents: "none",
                                                                fontWeight: 700
                                                            }}
                                                        >
                                                            ...
                                                        </Button>
                                                    );
                                                } else {
                                                    return (
                                                        <Button
                                                            key={item}
                                                            variant={soTrangHienTai === item ? "contained" : "text"}
                                                            color={soTrangHienTai === item ? "primary" : "inherit"}
                                                            size="small"
                                                            onClick={function () { thayDoiTrangMoi(item); }}
                                                            sx={{
                                                                minWidth: 32,
                                                                height: 32,
                                                                borderRadius: 2,
                                                                color: soTrangHienTai === item ? "#fff" : "#495057",
                                                                background: soTrangHienTai === item ? "#1976d2" : "transparent",
                                                                fontWeight: soTrangHienTai === item ? 600 : 400,
                                                                "&:hover": {
                                                                    background: soTrangHienTai === item ? "#1565c0" : "rgba(25, 118, 210, 0.04)"
                                                                }
                                                            }}
                                                        >
                                                            {item}
                                                        </Button>
                                                    );
                                                }
                                            })}
                                            <Button
                                                variant="text"
                                                size="small"
                                                disabled={soTrangHienTai === tongSoTrang || tongSoTrang === 0}
                                                onClick={function () { thayDoiTrangMoi(soTrangHienTai + 1); }}
                                                sx={{ color: soTrangHienTai === tongSoTrang ? "#bdbdbd" : "#49a3f1" }}
                                            >
                                                SAU
                                            </Button>
                                        </SoftBox>
                                    </SoftBox>
                                </Card>
                            )}
                        </Box>
                    </Box>
                </Card>
            </SoftBox>
            <Footer />
        </DashboardLayout>
    );
}