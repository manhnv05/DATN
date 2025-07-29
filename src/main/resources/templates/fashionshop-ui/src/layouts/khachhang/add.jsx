import React, { useState, useEffect } from "react";
import {
    Card, Box, Typography, Grid, TextField, Button, FormControl,
    Avatar, CircularProgress, Divider, Select, MenuItem, Dialog,
    DialogTitle, DialogContent, DialogActions, DialogContentText,
    RadioGroup, Radio, FormControlLabel, FormLabel
} from "@mui/material";
import { Upload, CheckCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Fade from "@mui/material/Fade";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import axios from "axios";
import { toast } from "react-toastify";
import InputAdornment from "@mui/material/InputAdornment";
import PropTypes from "prop-types";

const API_BASE_URL = "http://localhost:8080/khachHang";
const provinceAPI = "https://provinces.open-api.vn/api/?depth=1";
const districtAPI = (code) => `https://provinces.open-api.vn/api/p/${code}?depth=2`;
const wardAPI = (code) => `https://provinces.open-api.vn/api/d/${code}?depth=2`;

const labelStyle = { fontWeight: 600, color: "#1769aa", mb: 0.5, fontSize: 15, display: "block" };
const GradientCard = styled(Card)({
    borderRadius: 16, background: "#fff", boxShadow: "0 8px 32px rgba(28, 72, 180, 0.09)", p: 3,
    maxWidth: 1800,
    minHeight: "83vh",
    width: "100%",
});
const AvatarWrapper = styled(Box)({ display: "flex", alignItems: "center", flexDirection: "column", gap: 1.5, width: "100%" });
const AvatarUploadButton = styled(Button)({
    textTransform: "none", fontWeight: 700, borderRadius: 12, fontSize: 14,
    background: "#fff", color: "#1565c0", border: "1.5px solid #90caf9",
    boxShadow: "0 2px 8px #e3f0fa", mt: 0.5,
    "&:hover": { background: "#e3f0fa", borderColor: "#42a5f5", color: "#1769aa" },
});

// Styled component cho Radio Group
const StyledRadioGroup = styled(RadioGroup)({
    display: 'flex',
    flexDirection: 'row',
    gap: 2,
    '& .MuiFormControlLabel-root': {
        margin: 0,
        marginRight: 3,
        '& .MuiRadio-root': {
            color: '#90caf9',
            padding: '6px',
            '&.Mui-checked': {
                color: '#1976d2',
            },
            '&:hover': {
                background: 'rgba(25, 118, 210, 0.04)',
                borderRadius: '50%',
            },
        },
        '& .MuiFormControlLabel-label': {
            fontSize: 14,
            fontWeight: 500,
            color: '#333',
            marginLeft: '4px',
        },
    },
});
const SectionTitle = styled(Typography)({
    fontWeight: 900, color: "#1769aa", fontSize: 26, letterSpacing: 1.3,
    textShadow: "0 2px 10px #e3f0fa, 0 1px 0 #fff",
});
const getFieldSx = (focusField, name, errorField) => ({
    bgcolor: focusField === name ? "#e3f0fa" : "#fafdff",
    borderRadius: 2,
    boxShadow: focusField === name ? "0 0 0 3px #90caf9" : errorField === name ? "0 0 0 2px #d32f2f" : "none",
    border: errorField === name ? "1px solid #d32f2f" : "none",
    transition: "all 0.3s",
    "& .MuiOutlinedInput-root": {
        "& fieldset": {
            borderColor: errorField === name ? "#d32f2f" : "transparent",
        },
        "&:hover fieldset": {
            borderColor: errorField === name ? "#d32f2f" : "#90caf9",
        },
        "&.Mui-focused fieldset": {
            borderColor: errorField === name ? "#d32f2f" : "#1976d2",
        },
    },
});

// Hàm tính tuổi từ ngày sinh.
function getAgeFromDateString(dateString) {
    if (!dateString) return "";
    const [day, month, year] = dateString.split("/");//VD: "01/01/2000" → ["01", "01", "2000"]
    const birthDate = new Date(`${year}-${month}-${day}`);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}


function AddKhachHangForm() {
    const today = new Date();
    const minBirthDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    const maxBirthDate = new Date(today.getFullYear() - 80, today.getMonth(), today.getDate());
    const navigate = useNavigate();
    const [customer, setCustomer] = useState({
        hinhAnh: "",
        tenKhachHang: "Nguyễn Văn B",
        email: "haongbamanh5x12@gmail.com",
        sdt: "0887744556",
        ngaySinh: dayjs(minBirthDate).format("DD/MM/YYYY"),
        gioiTinh: "MALE",
    });
    const [address, setAddress] = useState({
        tinhThanhPho: "", quanHuyen: "", xaPhuong: "",  //code.
        trangThai: "DEFAULT"
    });
    const [avatarPreview, setAvatarPreview] = useState("");
    const [focusField, setFocusField] = useState("");
    const [errorField, setErrorField] = useState("");
    const [addressData, setAddressData] = useState({ provinces: [], districts: [], wards: [] });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [validating, setValidating] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState({ open: false, type: null, title: '', message: '', confirmText: '', cancelText: '', confirmColor: 'primary' });

    useEffect(() => {
        fetchAddress("provinces").then(provinces => {
            setAddressData(prev => ({ ...prev, provinces }));
        });
    }, []);

    useEffect(() => {
        const districtsPromise = address.tinhThanhPho
            ? fetchAddress("districts", address.tinhThanhPho)
            : Promise.resolve([]);
        districtsPromise.then(districts => {
            setAddressData(prev => ({ ...prev, districts, wards: [] }));
            setAddress(prev => ({ ...prev, quanHuyen: "", xaPhuong: "" }));
        });
    }, [address.tinhThanhPho]);

    useEffect(() => {
        const wardsPromise = address.quanHuyen
            ? fetchAddress("wards", address.quanHuyen)
            : Promise.resolve([]);
        wardsPromise.then(wards => {
            setAddressData(prev => ({ ...prev, wards }));
            setAddress(prev => ({ ...prev, xaPhuong: "" }));
        });
    }, [address.quanHuyen]);

    const fetchAddress = async (type, code) => {
        const api = {
            provinces: provinceAPI,
            districts: districtAPI(code),
            wards: wardAPI(code)
        }[type];
        try {
            const { data } = await axios.get(api);
            const result = type === "provinces" ? data : data[type];
            return Array.isArray(result) ? result : [];
        } catch (error) {
            return [];
        }
    };


    function AddressSelect({ label, name, value, options, disabled, error }) {
        const [focus, setFocus] = useState(false);
        return (
            <Grid item xs={12} sm={4}>
                <label style={labelStyle}>{label}</label>
                <FormControl
                    fullWidth
                    size="small"
                    sx={{ ...getFieldSx(focus ? name : "", name, error ? name : "") }}
                    disabled={disabled}
                >
                    <Select
                        name={name}
                        value={value || ""}
                        onChange={handleAddressChange}
                        onFocus={() => {
                            setFocus(true);
                            if (errorField === name) setErrorField("");
                        }}
                        onBlur={() => setFocus(false)}
                        displayEmpty
                    >
                        <MenuItem value=""><em>Chọn {label}</em></MenuItem>
                        {options.map(opt => (
                            <MenuItem key={opt.code} value={opt.code}>{opt.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
        );
    }

    const handleAddressChange = (evt) => {
        const { name, value } = evt.target;
        setAddress(prev => ({ ...prev, [name]: value }));
        setErrorField("");
    };

    AddressSelect.propTypes = {
        label: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        options: PropTypes.arrayOf(PropTypes.shape({
            code: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            name: PropTypes.string,
        })).isRequired,
        disabled: PropTypes.bool,
        error: PropTypes.bool,
    };

    const handlers = {
        date: (date) => {
            // date = dayjs object or null
            if (date && dayjs(date).isValid()) {
                setCustomer(prev => ({ ...prev, ngaySinh: dayjs(date).format("DD/MM/YYYY") }));
            } else {
                setCustomer(prev => ({ ...prev, ngaySinh: "" }));
            }
            setErrorField("");
        },
        file: (file) => {
            if (file) {
                setCustomer(prev => ({ ...prev, hinhAnh: file.name }));
                setAvatarPreview(URL.createObjectURL(file));
            }
        },
        input: (name, value) => {
            if (name === "sdt") {
                const numericValue = value.replace(/\D/g, "");
                setCustomer(prev => ({ ...prev, [name]: numericValue }));
                return;
            }
            // Các trường khác.
            setCustomer(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleChange = (evt) => {
        //DatePicker event
        if (!evt?.target) return handlers.date(evt);

        const { name, value, files } = evt.target;

        if (name === "hinhAnh" && files?.[0]) return handlers.file(files[0]);

        handlers.input(name, value);
    };

    // Đầu số hợp lệ của các nhà mạng Việt Nam
    const validPrefixes = [
        "032", "033", "034", "035", "036", "037", "038", "039", // Viettel
        "070", "071", "072", "073", "074", "075", "076", "077", "078", "079", // MobiFone
        "081", "082", "083", "084", "085", "086", "087", "088", "089", // Vinaphone
        "090", "093", "094", "096", "097", "098", "099" // Gmobile, Vietnamobile, Itelecom
    ];
    // Lấy một số đầu số tiêu biểu để hiển thị
    const samplePrefixes = ["032", "070", "081", "090", "096"];

    // Validation rules
    const validationRules = [
        {
            field: "tenKhachHang",
            condition: !customer.tenKhachHang,
            message: "Vui lòng nhập tên khách hàng"
        },
        {
            field: "email",
            condition: !customer.email,
            message: "Vui lòng nhập email"
        },
        {
            field: "email",
            condition: !/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(customer.email),
            message: "Email phải có định dạng @gmail.com"
        },
        {
            field: "sdt",
            condition: !customer.sdt,
            message: "Vui lòng nhập số điện thoại"
        },
        {
            field: "sdt",
            condition: !/^0\d{9}$/.test(customer.sdt),
            message: "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng số 0"
        },
        {
            field: "sdt",
            condition: !validPrefixes.some(prefix => customer.sdt.startsWith(prefix)),
            message: `Số điện thoại phải bắt đầu bằng đầu số hợp lệ (VD: ${samplePrefixes.join(", ")})`
        },
        {
            field: "ngaySinh",
            condition: !customer.ngaySinh,
            message: "Vui lòng chọn ngày sinh"
        },
        {
            field: "gioiTinh",
            condition: !customer.gioiTinh,
            message: "Vui lòng chọn giới tính"
        },
        {
            field: "gioiTinh",
            condition: customer.gioiTinh && !["MALE", "FEMALE"].includes(customer.gioiTinh),
            message: "Giới tính phải là Nam hoặc Nữ"
        },
        {
            field: "tinhThanhPho",
            condition: !address.tinhThanhPho,
            message: "Vui lòng chọn tỉnh/thành phố"
        },
        {
            field: "quanHuyen",
            condition: !address.quanHuyen,
            message: "Vui lòng chọn quận/huyện"
        },
        {
            field: "xaPhuong",
            condition: !address.xaPhuong,
            message: "Vui lòng chọn phường/xã"
        },
    ];
    // Validate cơ bản: setFieldError + return messageError
    const validate = () => {
        for (const rule of validationRules) {
            if (rule.condition) {
                setErrorField(rule.field);
                return rule.message;
            }
        }
        return null;
    };

    // Hàm kiểm tra dữ liệu trước khi mở dialog có submit thật.
    const validateBeforeSubmit = async () => {
        const validationError = validate(); // Kiểm tra validation cơ bản trước
        if (validationError) {
            toast.error(validationError);   // 🔴 Hiển thị thông báo lỗi
            return false;   // ❌ Nếu không hợp lệ → dừng, không mở dialog
        }
        // Kiểm tra trùng lặp 2 trường quan trọng
        try {
            const checkData = {
                email: customer.email,
                sdt: customer.sdt
            };

            // Gọi API kiểm tra trùng lặp
            const response = await axios.post(`${API_BASE_URL}/check-duplicate`, checkData);
            const responseData = response.data;

            if (responseData.data.hasDuplicate) {// hasDuplicate: true
                // Hiển thị thông báo lỗi chi tiết
                const duplicateInfo = responseData.data.duplicateInfo;
                let errorMessage = "Thông tin đã tồn tại trong hệ thống:\n";

                if (duplicateInfo.emailDuplicate) {
                    errorMessage += "• Email đã tồn tại\n";
                    setErrorField("email");
                }
                if (duplicateInfo.phoneDuplicate) {
                    errorMessage += "• Số điện thoại đã tồn tại\n";
                    setErrorField("sdt");
                }
                toast.error(errorMessage.trim());
                return false;
            }
            return true;
        } catch (error) {
            console.error("Lỗi kiểm tra trùng lặp:", error);
            // Nếu lỗi network hoặc server, vẫn cho phép tiếp tục
            if (error.response?.status >= 500) {
                toast.warning("Không thể kiểm tra trùng lặp, vui lòng thử lại!");
                return false;
            }
            return true; // Nếu không kiểm tra được thì cho phép tiếp tục
        }
    };

    // Dialog xác nhận
    const openConfirmDialog = async (type) => {
        // Nếu là submit, kiểm tra dữ liệu trước
        if (type === 'submit') {
            setValidating(true); // 🔄 Bật trạng thái "đang kiểm tra" ở button submit khi mở dialog.
            try {
                const isValid = await validateBeforeSubmit();
                if (!isValid) {
                    return;  // ❌ Nếu không hợp lệ → dừng, không mở dialog
                }
            } finally {
                setValidating(false);
            }
        }
        const dialogConfigs = {
            submit: {
                title: "Xác nhận thêm khách hàng",
                message: "✅ Dữ liệu đã được kiểm tra và hợp lệ!\n\nBạn có chắc chắn muốn thêm khách hàng mới với thông tin đã nhập? Hành động này sẽ lưu thông tin khách hàng vào hệ thống.",
                confirmText: "Thêm khách hàng",
                cancelText: "Hủy bỏ",
                confirmColor: "primary"
            },
            cancel: {
                title: "Xác nhận hủy bỏ",
                message: "Bạn có chắc chắn muốn hủy bỏ? Tất cả thông tin đã nhập sẽ bị mất và bạn sẽ quay lại trang danh sách khách hàng.",
                confirmText: "Hủy bỏ",
                cancelText: "Tiếp tục chỉnh sửa",
                confirmColor: "error"
            },
            reset: {
                title: "Xác nhận đặt lại",
                message: "Bạn có chắc chắn muốn đặt lại tất cả thông tin? Tất cả dữ liệu đã nhập sẽ bị xóa và thay thế bằng dữ liệu mặc định.",
                confirmText: "Đặt lại",
                cancelText: "Giữ nguyên",
                confirmColor: "warning"
            }
        };
        // ✅ Nếu hợp lệ → mở dialog xác nhận
        const config = dialogConfigs[type];
        setConfirmDialog({
            open: true,
            type,
            ...config
        });
    };
    const closeConfirmDialog = () => setConfirmDialog(prev => ({ ...prev, open: false }));
    const handleConfirmAction = () => {
        const { type } = confirmDialog;
        switch (type) {
            case 'submit':
                closeConfirmDialog();
                handleSubmit();
                break;
            case 'cancel':
                closeConfirmDialog();
                navigate("/customer-management");
                break;
            case 'reset':
                closeConfirmDialog();
                resetToDefaultValues();
                toast.success("Đã đặt lại thông tin về giá trị mặc định!");
                break;
            default:
                closeConfirmDialog();
        }
    };
    const resetToDefaultValues = () => {
        setCustomer({
            hinhAnh: "",
            tenKhachHang: "",
            email: "",
            sdt: "",
            ngaySinh: dayjs(minBirthDate).format("DD/MM/YYYY"),
            gioiTinh: "MALE",
        });
        setAddress({
            tinhThanhPho: "",
            quanHuyen: "",
            xaPhuong: "",
            trangThai: "DEFAULT"
        });
        setAvatarPreview("");
        setErrorField("");
        setFocusField("");
    };

    // Hàm lấy tên địa chỉ từ code
    function getAddressNameByCode(list, code) {
        const found = list.find(item => String(item.code) === String(code));
        return found ? found.name : "";
    }

    // Submit chính
    const handleSubmit = async () => {
        setLoading(true);
        setSuccess(false);
        try {
            // Chuyển đổi code sang tên cho địa chỉ
            const diaChiToSend = {
                ...address,
                tinhThanhPho: getAddressNameByCode(addressData.provinces, address.tinhThanhPho),
                quanHuyen: getAddressNameByCode(addressData.districts, address.quanHuyen),
                xaPhuong: getAddressNameByCode(addressData.wards, address.xaPhuong)
            };

            // Chuẩn bị form data
            const formData = new FormData();
            formData.append("customerCreateRequest", new Blob([JSON.stringify(customer)], { type: "application/json" }));
            formData.append("addressCreateRequest", new Blob([JSON.stringify(diaChiToSend)], { type: "application/json" }));
            await axios.post(API_BASE_URL, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setSuccess(true);
            toast.success("Thêm khách hàng thành công!");
            setTimeout(() => {
                setLoading(false);
                navigate("/customer-management");
            }, 1200);
        } catch (error) {
            setLoading(false);
            setSuccess(false);
            console.log("Chi tiết lỗi: ", error);
            const status = error.response?.status;
            console.log(error.response);
            
            if (status >= 500) {
                toast.error("Lỗi server, vui lòng thử lại sau!");
            } else if (status === 400) {
                toast.error("Lỗi dữ liệu, vui lòng kiểm tra lại!");
            } else if (status === 401 || status === 403) {
                toast.error("Bạn không có quyền thực hiện hành động này!");
            } else if (error.request) {
                toast.error("Không thể kết nối đến máy chủ. Kiểm tra lại kết nối hoặc server.");
            } else {
                toast.error("Đã có lỗi, vui lòng thử lại!");
            }
        }
    };

    // Khôi phục và chỉnh sửa buildTextFieldProps giống bên nhân viên
    function buildTextFieldProps(fieldName, options = {}) {
        const value = customer[fieldName] || "";
        const maxLength = options.maxLength;
        const endAdornment = maxLength ? (
            <InputAdornment position="end" sx={{ color: errorField === fieldName ? "#d32f2f" : "#90caf9", fontSize: 13 }}>
                {value.length}/{maxLength}
            </InputAdornment>
        ) : options.endAdornment;
        return {
            name: fieldName,
            value,
            onChange: handleChange,
            fullWidth: true,
            size: "small",
            placeholder: options.placeholder,
            disabled: options.disabled,
            autoFocus: options.autoFocus,
            error: errorField === fieldName,
            InputProps: {
                startAdornment: options.startAdornment,
                endAdornment,
                onFocus: () => {
                    setFocusField(fieldName);
                    if (errorField === fieldName) setErrorField("");
                },
                onBlur: () => setFocusField("")
            },
            inputProps: {
                maxLength,
                ...options.inputProps,
            },
            sx: {
                ...getFieldSx(focusField, fieldName, errorField),
                '& .MuiInputBase-input': {
                    minHeight: options.minHeightInput || "20px",
                    minWidth: options.minWidthInput || "230px",
                },
                ...options.sx,
            }
        };
    }

    // UI
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Box sx={{ overflowY: "hidden", minHeight: "100vh", background: "linear-gradient(130deg,#f2f9fe 70%,#e9f0fa 100%)", display: "flex", alignItems: "flex-start", justifyContent: "center", py: 4 }}>
                {addressData.provinces.length > 0 ? (
                    <Fade in timeout={600}>
                        <div>
                            <GradientCard>
                                <SectionTitle align="center" mb={1}>Thêm Khách Hàng Mới</SectionTitle>
                                <Box sx={{ background: "linear-gradient(130deg,#f2f9fe 70%,#e9f0fa 100%)", mb: 2, p: 2, borderRadius: 3, textAlign: "center" }}>
                                    <Typography variant="subtitle1" color="#1769aa" fontWeight={600}>
                                        <span style={{ color: "#43a047" }}>Nhanh chóng - Chính xác - Thẩm mỹ!</span> Vui lòng nhập đầy đủ thông tin.
                                    </Typography>
                                </Box>
                                <form autoComplete="off">
                                    <Grid container spacing={3} sx={{ px: 2 }}>
                                        {/* Container chứa ảnh đại diện */}
                                        <Grid item xs={12} md={4}>
                                            <Box sx={{ height: "100%", background: "#f6fafd", borderRadius: 3, p: 2, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 2 }}>
                                                <AvatarWrapper>
                                                    <Box
                                                        sx={{
                                                            position: 'relative',
                                                            width: 450,
                                                            height: 300,
                                                            mb: 2,
                                                            borderRadius: 4, // Tăng viền tròn hơn một chút
                                                            border: "3px solid #42a5f5",
                                                            boxShadow: "0 8px 25px rgba(66, 165, 245, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)",
                                                            background: "#fafdff",
                                                            cursor: "pointer",
                                                            overflow: "hidden",
                                                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                                            "&:hover": {
                                                                transform: "scale(1.03)",
                                                                boxShadow: "0 15px 35px rgba(66, 165, 245, 0.25), 0 5px 15px rgba(0, 0, 0, 0.15)",
                                                                borderColor: "#1976d2"
                                                            },
                                                            "&:active": {
                                                                transform: "scale(0.98)"
                                                            }
                                                        }}
                                                        onClick={() => document.getElementById("hinhAnh-upload-kh")?.click()}
                                                    >
                                                        {avatarPreview ? (
                                                            <img
                                                                src={avatarPreview}
                                                                alt="avatar"
                                                                style={{
                                                                    width: "100%",
                                                                    height: "100%",
                                                                    objectFit: "cover",
                                                                    borderRadius: "16px" // Tăng viền tròn cho ảnh
                                                                }}
                                                            />
                                                        ) : (
                                                            <Box
                                                                sx={{
                                                                    width: "100%",
                                                                    height: "100%",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    background: "linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 50%, #e8eaf6 100%)",
                                                                    color: "#1976d2",
                                                                    fontSize: 52,
                                                                    fontWeight: 700,
                                                                    borderRadius: "16px",
                                                                    textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
                                                                }}
                                                            >
                                                                {customer.tenKhachHang?.[0]?.toUpperCase() || "A"}
                                                            </Box>
                                                        )}
                                                        {/* Overlay khi hover */}
                                                        <Box
                                                            sx={{
                                                                position: "absolute",
                                                                top: 0,
                                                                left: 0,
                                                                right: 0,
                                                                bottom: 0,
                                                                background: "linear-gradient(135deg, rgba(25, 118, 210, 0.15) 0%, rgba(156, 39, 176, 0.1) 100%)",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                opacity: 0,
                                                                transition: "opacity 0.3s ease",
                                                                borderRadius: "16px",
                                                                "&:hover": {
                                                                    opacity: 1
                                                                }
                                                            }}
                                                        >
                                                            <Box
                                                                sx={{
                                                                    background: "rgba(255, 255, 255, 0.9)",
                                                                    borderRadius: "50%",
                                                                    p: 1,
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
                                                                }}
                                                            >
                                                                <Upload sx={{ color: "#1976d2", fontSize: 28 }} />
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                    <label htmlFor="hinhAnh-upload-kh">
                                                        <input
                                                            type="file"
                                                            id="hinhAnh-upload-kh"
                                                            name="hinhAnh"
                                                            accept="image/*"
                                                            style={{ display: "none" }}
                                                            onChange={handleChange}
                                                        />
                                                        <AvatarUploadButton
                                                            variant="outlined"
                                                            component="span"
                                                            startIcon={<Upload />}
                                                            sx={{
                                                                borderRadius: 3,
                                                                textTransform: "none",
                                                                fontWeight: 600,
                                                                fontSize: 14,
                                                                px: 4,
                                                                py: 1.5,
                                                                background: "linear-gradient(135deg, #fff 0%, #f8f9ff 100%)",
                                                                color: "#1565c0",
                                                                border: "2px solid #90caf9",
                                                                boxShadow: "0 4px 12px rgba(144, 202, 249, 0.2), 0 2px 4px rgba(0, 0, 0, 0.1)",
                                                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                                                "&:hover": {
                                                                    background: "linear-gradient(135deg, #e3f0fa 0%, #f3e5f5 100%)",
                                                                    borderColor: "#42a5f5",
                                                                    color: "#1769aa",
                                                                    boxShadow: "0 6px 16px rgba(144, 202, 249, 0.3), 0 3px 8px rgba(0, 0, 0, 0.15)",
                                                                    transform: "translateY(-1px)"
                                                                },
                                                                "&:active": {
                                                                    transform: "translateY(0px)"
                                                                }
                                                            }}
                                                        >
                                                            Ảnh đại diện
                                                        </AvatarUploadButton>
                                                    </label>
                                                </AvatarWrapper>
                                            </Box>
                                        </Grid>
                                        {/* Container chứa thông tin khách hàng + địa chỉ */}
                                        <Grid item xs={12} md={8}
                                            sx={{ display: 'flex', flexDirection: 'column' }} //Chỉnh Grid trong Grid này height bằng nó flex={1}.
                                        >
                                            <Grid container spacing={4} flex={1} >
                                                {/* Container chứa thông tin cá nhân */}
                                                <Grid item xs={12} >
                                                    <Box sx={{ mb: 2, p: 2, borderRadius: 2, background: "#f6fafd", boxShadow: "0 2px 8px #e3f0fa" }}>
                                                        <Typography variant="h6" sx={{ fontWeight: 700, color: "#1976d2", mb: 2 }}>
                                                            Thông tin khách hàng
                                                        </Typography>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} >
                                                                <label style={labelStyle}>Họ và tên khách hàng</label>
                                                                <TextField
                                                                    {...buildTextFieldProps("tenKhachHang", {
                                                                        placeholder: "VD: Nguyễn Văn B",
                                                                        autoFocus: focusField === "tenKhachHang",
                                                                        maxLength: 30,
                                                                    })}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12} sm={6}>
                                                                <label style={labelStyle}>Số điện thoại liên hệ</label>
                                                                <TextField
                                                                    {...buildTextFieldProps("sdt", {
                                                                        placeholder: "VD: 0912345678",
                                                                        maxLength: 10,
                                                                    })}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12} sm={6}>
                                                                <label style={labelStyle}>Email liên hệ</label>
                                                                <TextField
                                                                    {...buildTextFieldProps("email", {
                                                                        placeholder: "VD: email@gmail.com",
                                                                        maxLength: 30,
                                                                    })}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12} sm={6}>
                                                                <label style={labelStyle}>
                                                                    Ngày sinh khách hàng
                                                                    {customer.ngaySinh && (
                                                                        <span style={{ color: "#1976d2", fontWeight: 400, marginLeft: 8, fontSize: "14px" }}>
                                                                            ({getAgeFromDateString(customer.ngaySinh)} tuổi)
                                                                        </span>
                                                                    )}
                                                                </label>
                                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                    <DatePicker
                                                                        value={customer.ngaySinh ? dayjs(customer.ngaySinh, "DD/MM/YYYY") : null}
                                                                        onChange={handleChange}
                                                                        minDate={dayjs(maxBirthDate)}
                                                                        maxDate={dayjs(minBirthDate)}
                                                                        renderInput={(params) => (
                                                                            <TextField
                                                                                {...params}
                                                                                {...buildTextFieldProps("ngaySinh", {
                                                                                    placeholder: "VD: 01/01/2000",
                                                                                    sx: {
                                                                                        '& .MuiInputAdornment-root': {
                                                                                            marginLeft: 'auto',
                                                                                            justifyContent: 'flex-end',
                                                                                        }
                                                                                    }
                                                                                })}
                                                                                // Ưu tiên các props từ params để tránh lỗi
                                                                                inputProps={{ ...buildTextFieldProps("ngaySinh", {}).inputProps, ...params.inputProps }}
                                                                                InputProps={{ ...buildTextFieldProps("ngaySinh", {}).InputProps, ...params.InputProps }}

                                                                            />
                                                                        )}
                                                                    />
                                                                </LocalizationProvider>
                                                            </Grid>
                                                            <Grid item xs={12} sm={6}>
                                                                <label style={labelStyle}>Giới tính khách hàng</label>
                                                                <Box sx={{ 
                                                                    mt: 1,
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'flex-start',
                                                                    minHeight: '40px',
                                                                    pl: 1
                                                                }}>
                                                                    <StyledRadioGroup
                                                                        name="gioiTinh"
                                                                        value={customer.gioiTinh}
                                                                        onChange={handleChange}
                                                                        row
                                                                    >
                                                                        <FormControlLabel 
                                                                            value="MALE" 
                                                                            control={<Radio />} 
                                                                            label="Nam" 
                                                                        />
                                                                        <FormControlLabel 
                                                                            value="FEMALE" 
                                                                            control={<Radio />} 
                                                                            label="Nữ" 
                                                                        />
                                                                    </StyledRadioGroup>
                                                                </Box>
                                                            </Grid>
                                                        </Grid>
                                                    </Box>
                                                </Grid>
                                                {/* Container chứa địa chỉ */}
                                                <Grid item xs={12} mt='32px' >
                                                    <Box sx={{ mb: 0, p: 2, paddingBottom: '0px', borderRadius: 2, background: "#f6fafd", boxShadow: "0 2px 8px #e3f0fa" }}>
                                                        <Typography variant="h6" sx={{ fontWeight: 700, color: "#1976d2", mb: 2 }}>
                                                            Thông tin địa chỉ nhận hàng mặc định
                                                        </Typography>
                                                        <Grid container spacing={2}>
                                                            {/* Địa chỉ */}
                                                            <AddressSelect
                                                                label="Tỉnh/Thành phố"
                                                                name="tinhThanhPho"
                                                                value={address.tinhThanhPho}
                                                                options={addressData.provinces}
                                                                disabled={loading}
                                                                error={errorField === "tinhThanhPho"}
                                                            />
                                                            <AddressSelect
                                                                label="Quận/Huyện"
                                                                name="quanHuyen"
                                                                value={address.quanHuyen}
                                                                options={addressData.districts}
                                                                disabled={loading || !address.tinhThanhPho}
                                                                error={errorField === "quanHuyen"}
                                                            />
                                                            <AddressSelect
                                                                label="Phường/Xã"
                                                                name="xaPhuong"
                                                                value={address.xaPhuong}
                                                                options={addressData.wards}
                                                                disabled={loading || !address.quanHuyen}
                                                                error={errorField === "xaPhuong"}
                                                            />
                                                        </Grid>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        {/* Button submit, reset, cancel */}
                                        <Grid item xs={12}>
                                            <Divider sx={{ my: 3, background: "#1976d2", opacity: 0.2 }} />
                                            <Box sx={{ display: "flex", justifyContent: "flex-end", pr: 9, mt: 2 }}>
                                                <Box sx={{ display: "flex", gap: 2 }}>
                                                    <Button
                                                        variant="outlined"
                                                        size="large"
                                                        onClick={async () => await openConfirmDialog('reset')}
                                                        disabled={loading}
                                                        sx={{ fontWeight: 700, borderRadius: 3, minWidth: 120, background: "#fff", border: "2px solid #2196f3", color: "#2196f3", "&:hover": { background: "#e3f2fd", borderColor: "#1976d2", color: "#1976d2" }, "&:disabled": { background: "#f5f5f5", borderColor: "#bdbdbd", color: "#bdbdbd" } }}
                                                    >
                                                        Đặt lại
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        size="large"
                                                        onClick={async () => await openConfirmDialog('cancel')}
                                                        disabled={loading}
                                                        sx={{ fontWeight: 700, borderRadius: 3, minWidth: 120, background: "#fff", border: "2px solid #757575", color: "#757575", "&:hover": { background: "#f5f5f5", borderColor: "#424242", color: "#424242" }, "&:disabled": { background: "#f5f5f5", borderColor: "#bdbdbd", color: "#bdbdbd" } }}
                                                    >
                                                        Quay về trang
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        onClick={async () => await openConfirmDialog('submit')}
                                                        size="large"
                                                        disabled={loading || validating}
                                                        color={success ? "success" : "info"}
                                                        variant="contained"
                                                        startIcon={loading ? <CircularProgress size={22} /> : validating ? <CircularProgress size={22} /> : success ? <CheckCircle /> : null}
                                                        sx={{ fontWeight: 800, fontSize: 18, px: 6, borderRadius: 3, minWidth: 200, boxShadow: "0 2px 10px 0 #90caf9" }}
                                                    >
                                                        {loading ? "Đang lưu..." : validating ? "Đang kiểm tra..." : success ? "Thành công!" : "Thêm khách hàng"}
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </form>
                            </GradientCard>
                        </div>
                    </Fade>
                ) : (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                        <CircularProgress />
                    </Box>
                )}
                {/* Dialog xác nhận */}
                <Dialog open={confirmDialog.open} onClose={closeConfirmDialog} aria-labelledby="confirm-dialog-title" aria-describedby="confirm-dialog-description" maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)", border: "1px solid #e0e0e0" } }}>
                    <DialogTitle id="confirm-dialog-title" sx={{ background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", color: "#1976d2", fontWeight: 700, fontSize: "1.25rem", borderBottom: "1px solid #e0e0e0" }}>{confirmDialog.title}</DialogTitle>
                    <DialogContent sx={{ pt: 3, pb: 2 }}>
                        <DialogContentText id="confirm-dialog-description" sx={{ fontSize: "1rem", lineHeight: 1.6, color: "#424242", textAlign: "justify" }}>{confirmDialog.message}</DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, pt: 1, gap: 2 }}>
                        <Button onClick={closeConfirmDialog} variant="outlined" sx={{ fontWeight: 600, borderRadius: 2, px: 3, py: 1, borderColor: "#bdbdbd", color: "#757575", "&:hover": { borderColor: "#9e9e9e", backgroundColor: "#f5f5f5" } }}>{confirmDialog.cancelText}</Button>
                        <Button onClick={handleConfirmAction} variant="contained" color={confirmDialog.confirmColor} autoFocus sx={{ fontWeight: 700, borderRadius: 2, px: 4, py: 1, boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)", "&:hover": { boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)" } }}>{confirmDialog.confirmText}</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </DashboardLayout >
    );
}

export default AddKhachHangForm;