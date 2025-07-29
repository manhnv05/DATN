import React, { useState, useEffect } from "react";
import {
    Card, Box, Typography, Grid, TextField, Button, FormControl,
    Avatar, CircularProgress, Divider, MenuItem, Dialog,
    DialogTitle, DialogContent, DialogActions, DialogContentText,
    RadioGroup, Radio, FormControlLabel, FormLabel
} from "@mui/material";
import { Upload, CheckCircle } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
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
// ✅ Xóa các API endpoints địa chỉ vì không cần

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

function getAgeFromDateString(dateString) {
    if (!dateString) return "";
    const [day, month, year] = dateString.split("/");
    const birthDate = new Date(`${year}-${month}-${day}`);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

function UpdateKhachHang() {
    const { id } = useParams();
    const today = new Date();
    const minBirthDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    const maxBirthDate = new Date(today.getFullYear() - 80, today.getMonth(), today.getDate());
    const navigate = useNavigate();
    const [customer, setCustomer] = useState({
        hinhAnh: "",
        tenKhachHang: "",
        email: "",
        sdt: "",
        ngaySinh: dayjs(minBirthDate).format("DD/MM/YYYY"),
        gioiTinh: "MALE",
        trangThai: "ACTIVE" // ✅ Thêm trạng thái cho update
    });
    // ✅ Xóa state address vì không cập nhật địa chỉ trong update
    const [avatarPreview, setAvatarPreview] = useState("");
    const [focusField, setFocusField] = useState("");
    const [errorField, setErrorField] = useState("");
    // ✅ Xóa addressData vì không cần
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [validating, setValidating] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState({ open: false, type: null, title: '', message: '', confirmText: '', cancelText: '', confirmColor: 'primary' });
    const [originalCustomer, setOriginalCustomer] = useState(null);
    // ✅ Xóa originalAddress vì không cần

    useEffect(() => {
        // ✅ Xóa fetchAddress vì không cần
    }, []);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        axios.get(`${API_BASE_URL}/${id}`)
            .then(res => {
                const data = res.data.data;
                // ✅ Debug: Log response từ backend
                console.log("Backend response data:", data);
                
                setCustomer({
                    hinhAnh: data.hinhAnh || "",
                    tenKhachHang: data.tenKhachHang || "",
                    email: data.email || "",
                    sdt: data.sdt || "",
                    ngaySinh: data.ngaySinh || dayjs(minBirthDate).format("DD/MM/YYYY"),
                    gioiTinh: data.gioiTinh || "MALE",
                    trangThai: data.trangThai || "ACTIVE" // ✅ Thêm trạng thái cho update
                });
                // Sử dụng diaChiMacDinh thay vì diaChis
                // ✅ Xóa setAddress vì không cập nhật địa chỉ
                setAvatarPreview(data.hinhAnh || "");
                setOriginalCustomer({
                    hinhAnh: data.hinhAnh || "",
                    tenKhachHang: data.tenKhachHang || "",
                    email: data.email || "",
                    sdt: data.sdt || "",
                    ngaySinh: data.ngaySinh || dayjs(minBirthDate).format("DD/MM/YYYY"),
                    gioiTinh: data.gioiTinh || "MALE",
                    trangThai: data.trangThai || "ACTIVE" // ✅ Thêm trạng thái cho update
                });
            })
            .catch(() => toast.error("Không thể tải dữ liệu khách hàng!"))
            .finally(() => setLoading(false));
    }, [id]);

    const handlers = {
        date: (date) => {
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
            setCustomer(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleChange = (evt) => {
        if (!evt?.target) return handlers.date(evt);
        const { name, value, files } = evt.target;
        if (name === "hinhAnh" && files?.[0]) return handlers.file(files[0]);
        handlers.input(name, value);
    };

    const validPrefixes = [
        "032", "033", "034", "035", "036", "037", "038", "039",
        "070", "071", "072", "073", "074", "075", "076", "077", "078", "079",
        "081", "082", "083", "084", "085", "086", "087", "088", "089",
        "090", "093", "094", "096", "097", "098", "099"
    ];
    const samplePrefixes = ["032", "070", "081", "090", "096"];

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
            field: "trangThai",
            condition: !customer.trangThai,
            message: "Vui lòng chọn trạng thái"
        },
        {
            field: "trangThai",
            condition: customer.trangThai && !["ACTIVE", "INACTIVE"].includes(customer.trangThai),
            message: "Trạng thái phải là ACTIVE hoặc INACTIVE"
        },
    ];
    const validate = () => {
        for (const rule of validationRules) {
            if (rule.condition) {
                setErrorField(rule.field);
                return rule.message;
            }
        }
        return null;
    };

    const validateBeforeSubmit = async () => {
        const validationError = validate();
        if (validationError) {
            toast.error(validationError);
            return false;
        }
        try {
            const checkData = {
                id: parseInt(id),
                email: customer.email,
                sdt: customer.sdt
            };
            const response = await axios.post(`${API_BASE_URL}/check-duplicate`, checkData);
            const responseData = response.data;
            if (responseData.data.hasDuplicate) {
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
            if (error.response?.status >= 500) {
                toast.warning("Không thể kiểm tra trùng lặp, vui lòng thử lại!");
                return false;
            }
            return true;
        }
    };

    const openConfirmDialog = async (type) => {
        if (type === 'submit') {
            setValidating(true);
            try {
                const isValid = await validateBeforeSubmit();
                if (!isValid) return;
            } finally {
                setValidating(false);
            }
        }
        const dialogConfigs = {
            submit: {
                title: "Xác nhận cập nhật khách hàng",
                message: "✅ Dữ liệu đã được kiểm tra và hợp lệ!\n\nBạn có chắc chắn muốn cập nhật thông tin khách hàng với thông tin đã nhập? Hành động này sẽ lưu thông tin khách hàng vào hệ thống.",
                confirmText: "Cập nhật khách hàng",
                cancelText: "Hủy bỏ",
                confirmColor: "primary"
            },
            cancel: {
                title: "Xác nhận hủy bỏ",
                message: "Bạn có chắc chắn muốn hủy bỏ? Tất cả thông tin đã nhập sẽ bị mất và bạn sẽ quay lại trang chi tiết khách hàng.",
                confirmText: "Hủy bỏ",
                cancelText: "Tiếp tục chỉnh sửa",
                confirmColor: "error"
            },
            reset: {
                title: "Xác nhận đặt lại",
                message: "Bạn có chắc chắn muốn đặt lại tất cả thông tin? Tất cả dữ liệu đã nhập sẽ bị xóa và thay thế bằng dữ liệu gốc.",
                confirmText: "Đặt lại",
                cancelText: "Giữ nguyên",
                confirmColor: "warning"
            }
        };
        setConfirmDialog({
            open: true,
            type,
            ...dialogConfigs[type]
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
                handleCancel();
                break;
            case 'reset':
                closeConfirmDialog();
                handleReset();
                toast.success("Đã đặt lại thông tin về giá trị gốc!");
                break;
            default:
                closeConfirmDialog();
        }
    };
    const handleSubmit = async () => {
        setLoading(true);
        setSuccess(false);
        try {
            // ✅ Tạo object request rõ ràng với đầy đủ các trường
            const customerUpdateRequest = {
                hinhAnh: customer.hinhAnh,
                tenKhachHang: customer.tenKhachHang,
                email: customer.email,
                sdt: customer.sdt,
                ngaySinh: customer.ngaySinh, // ✅ Giữ nguyên format dd/MM/yyyy
                gioiTinh: customer.gioiTinh,
                trangThai: customer.trangThai // ✅ Đảm bảo trường trangThai được gửi
            };
            
            // ✅ Debug: Log request để kiểm tra
            console.log("Customer Update Request:", customerUpdateRequest);
            console.log("Customer state:", customer);
            
            await axios.patch(`${API_BASE_URL}/${id}`, customerUpdateRequest);
            setSuccess(true);
            toast.success("Cập nhật khách hàng thành công!");
            setTimeout(() => navigate(`/khachhang/detail/${id}`), 1200);
        } catch (error) {
            setLoading(false);
            setSuccess(false);
            // ✅ Debug: Log error để kiểm tra
            console.log("Error response:", error.response?.data);
            
            const status = error.response?.status;
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
    const handleReset = () => {
        if (originalCustomer) {
            setCustomer({ ...originalCustomer });
            setAvatarPreview(originalCustomer.hinhAnh || "");
        }
    };
    const handleCancel = () => {
        navigate(`/khachhang/detail/${id}`);
    };
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
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Box sx={{ overflowY: "hidden", minHeight: "100vh", background: "linear-gradient(130deg,#f2f9fe 70%,#e9f0fa 100%)", display: "flex", alignItems: "flex-start", justifyContent: "center", py: 4 }}>
                {!loading ? (
                    <Fade in timeout={600}>
                        <div>
                            <GradientCard>
                                <SectionTitle align="center" mb={1}>Cập Nhật Khách Hàng</SectionTitle>
                                <Box sx={{ background: "linear-gradient(130deg,#f2f9fe 70%,#e9f0fa 100%)", mb: 2, p: 2, borderRadius: 3, textAlign: "center" }}>
                                    <Typography variant="subtitle1" color="#1769aa" fontWeight={600}>
                                        <span style={{ color: "#43a047" }}>Chính xác - Cẩn thận!</span> Vui lòng kiểm tra và cập nhật thông tin.
                                    </Typography>
                                </Box>
                                <form autoComplete="off">
                                    <Grid container spacing={3} sx={{ px: 2 }}>
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
                                                        onClick={() => document.getElementById("hinhAnh-upload-kh-update")?.click()}
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
                                                    <label htmlFor="hinhAnh-upload-kh-update">
                                                        <input
                                                            type="file"
                                                            id="hinhAnh-upload-kh-update"
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
                                        <Grid item xs={12} md={8} sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <Grid container spacing={4} flex={1}>
                                                <Grid item xs={12}>
                                                    <Box sx={{ mb: 2, p: 2, borderRadius: 2, background: "#f6fafd", boxShadow: "0 2px 8px #e3f0fa" }}>
                                                        <Typography variant="h6" sx={{ fontWeight: 700, color: "#1976d2", mb: 2 }}>
                                                            Thông tin khách hàng
                                                        </Typography>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12}>
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
                                                            <Grid item xs={12} sm={6}>
                                                                <label style={labelStyle}>Trạng thái khách hàng</label>
                                                                <Box sx={{ 
                                                                    mt: 1,
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'flex-start',
                                                                    minHeight: '40px',
                                                                    pl: 1
                                                                }}>
                                                                    <StyledRadioGroup
                                                                        name="trangThai"
                                                                        value={customer.trangThai}
                                                                        onChange={handleChange}
                                                                        row
                                                                    >
                                                                        <FormControlLabel 
                                                                            value="ACTIVE" 
                                                                            control={<Radio />} 
                                                                            label="Hoạt động" 
                                                                        />
                                                                        <FormControlLabel 
                                                                            value="INACTIVE" 
                                                                            control={<Radio />} 
                                                                            label="Không hoạt động" 
                                                                        />
                                                                    </StyledRadioGroup>
                                                                </Box>
                                                            </Grid>
                                                        </Grid>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Grid>
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
                                                        {loading ? "Đang lưu..." : validating ? "Đang kiểm tra..." : success ? "Thành công!" : "Cập nhật khách hàng"}
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </form>
                            </GradientCard>
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
                        </div>
                    </Fade>
                ) : (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                        <CircularProgress />
                    </Box>
                )}
            </Box>
        </DashboardLayout>
    );
}

export default UpdateKhachHang; 