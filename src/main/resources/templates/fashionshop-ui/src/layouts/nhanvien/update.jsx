import React, { useState, useEffect, useRef } from "react";
import {
    Card, Box, Typography, Grid, TextField, Button, FormControl,
    Avatar, CircularProgress, Divider, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, InputAdornment,
    RadioGroup, Radio, FormControlLabel, FormLabel
} from "@mui/material";
import { Upload, CheckCircle } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Fade from "@mui/material/Fade";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import axios from "axios";
import { toast } from "react-toastify";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import PropTypes from "prop-types";

// API URLs
const API_BASE_URL = "http://localhost:8080/nhanVien";
const provinceAPI = "https://provinces.open-api.vn/api/?depth=1";
const districtAPI = code => `https://provinces.open-api.vn/api/p/${code}?depth=2`;
const wardAPI = code => `https://provinces.open-api.vn/api/d/${code}?depth=2`;


// UI Styles
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
    boxShadow: focusField === name ? "0 0 0 3px #90caf9" : "none",
    transition: "all 0.3s",
    border: errorField === name ? "1px solid #d32f2f" : "none",
});
// RENDER COMPONENT
function UpdateNhanVien() {
    const renderCount = useRef(0);
    // Tăng renderCount sau mỗi lần render
    useEffect(() => {
        renderCount.current += 1;
        console.log(`Số lần render: ${renderCount.current}`);
    }); // Không có dependency array, chạy sau mỗi render

    const navigate = useNavigate();
    const { id } = useParams();
    const [employee, setEmployee] = useState({
        hinhAnh: "",
        hoVaTen: "", soDienThoai: "", email: "",
        canCuocCongDan: "", ngaySinh: "",
        gioiTinh: "MALE", vaiTro: "EMPLOYEE",
        tinhThanhPho: "", quanHuyen: "", xaPhuong: "",  //Code
        trangThai: "ACTIVE"
    });
    const [maNhanVien, setMaNhanVien] = useState("");
    // Lưu bản gốc để reset
    const [originalEmployee, setOriginalEmployee] = useState(null);
    const [originalDiaChi, setOriginalDiaChi] = useState(null); //Code tỉnh, quận, xã

    const [avatarPreview, setAvatarPreview] = useState("");
    const [loading, setLoading] = useState(false);  //Trạng thái tải trang --> UI : CircularProgress
    const [success, setSuccess] = useState(false);  //Trạng thái submit --> UI : CheckCircle
    const [validating, setValidating] = useState(false);
    
    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    // Fetch address data
    const fetchAddress = async (type, code) => {
        // Chọn API dựa trên loại địa chỉ (type)
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
            console.error(`Error fetching ${type}:`, error);
            return [];
        }
    };

    const parseAddress = (address) => {
        if (!address) return { province: "", district: "", ward: "" };
        const parts = address.split(", ").map(part => part.trim());
        return {
            provinceName: parts[2] || "",   // Thành phố Hải Phòng
            districtName: parts[1] || "",   // Huyện Kiến Thuỵ  
            wardName: parts[0] || ""        // Xã Kiến Hưng
        };
    }

    const mapAdressToCodes = async (address, provinces) => {
        if (!address || !provinces.length) return;
        const { provinceName, districtName, wardName } = parseAddress(address);
        // 1️⃣ Tìm mã tỉnh/thành phố
        const provinceCode = provinces.find(p => p.name === provinceName)?.code;
        if (!provinceCode) return;
        // 2️⃣ Lấy danh sách quận/huyện dựa trên mã tỉnh
        const districts = await fetchAddress("districts", provinceCode);
        const districtCode = districts.find(d => d.name === districtName)?.code;
        if (!districtCode) return;
        // 3️⃣ Lấy danh sách xã/phường dựa trên mã quận/huyện
        const wards = await fetchAddress("wards", districtCode);
        const wardCode = wards.find(w => w.name === wardName)?.code;
        if (!wardCode) return;
        return { tinhThanhPho: provinceCode, quanHuyen: districtCode, xaPhuong: wardCode }; // {tinhThanhPho, quanHuyen, xaPhuong}
    }

    // Fetch employee and address data
    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);   // render 2
            try {
                // 1️⃣ Fetch provinces
                const provinces = await fetchAddress("provinces");
                // 2️⃣ Fetch employee data
                const response = (await axios.get(`${API_BASE_URL}/${id}`)).data?.data;
                const employeeData = {
                    hinhAnh: response.hinhAnh || "",
                    hoVaTen: response.hoVaTen || "",
                    soDienThoai: response.soDienThoai || "",
                    email: response.email || "",
                    canCuocCongDan: response.canCuocCongDan || "",
                    ngaySinh: response.ngaySinh
                        ? dayjs(response.ngaySinh, ["DD/MM/YYYY", "DD-MM-YYYY", "YYYY-MM-DD"]).format("DD/MM/YYYY")
                        : "",
                    gioiTinh: response.gioiTinh || "",
                    vaiTro: response.vaiTro || "",
                    trangThai: response.trangThai || "",
                }
                // render 3
                // 3️⃣ Map address to codes for Employee
                const addressCodes = await mapAdressToCodes(response.diaChi, provinces);
                // 4️⃣ Set state
                setAddressData((prev) => ({ ...prev, provinces, }));
                setOriginalDiaChi(addressCodes);
                setMaNhanVien(response.maNhanVien || "");
                setEmployee({ ...employeeData, ...addressCodes });
                setOriginalEmployee(employeeData); // Lưu bản gốc để reset
                setAvatarPreview(response.hinhAnh || "/default-avatar.png");

            } catch (error) {
                console.log("error: ", error);
                toast.error("Không thể tải dữ liệu nhân viên!");
            } finally {
                setLoading(false);
            }
        }
        fetchInitialData();
    }, [id]);

    // Danh sách địa chỉ tỉnh/tp, quận/huyện, xã/phường hiển thị trên select.
    const [addressData, setAddressData] = useState({ provinces: [], districts: [], wards: [] });

    // Fetch districts when tinhThanhPho changes
    useEffect(() => {
        if (employee.tinhThanhPho) {
            fetchAddress("districts", employee.tinhThanhPho).then(districts => {
                setAddressData(prev => ({ ...prev, districts, wards: [] }));    // render 4
                if (!districts.some(d => d.code === employee.quanHuyen)) {
                    setEmployee(prev => ({ ...prev, quanHuyen: "", xaPhuong: "" }));
                }
            });
        } else {
            setAddressData(prev => ({ ...prev, districts: [], wards: [] }));
            setEmployee(prev => ({ ...prev, quanHuyen: "", xaPhuong: "" }));
        }
    }, [employee.tinhThanhPho]);

    // Fetch wards when quanHuyen changes
    useEffect(() => {
        if (employee.quanHuyen) {
            fetchAddress("wards", employee.quanHuyen).then(wards => {
                setAddressData(prev => ({ ...prev, wards }));   // render 4
                if (!wards.some(w => w.code === employee.xaPhuong)) {
                    setEmployee(prev => ({ ...prev, xaPhuong: "" }));
                }
            });
        } else {
            setAddressData(prev => ({ ...prev, wards: [] }));
            setEmployee(prev => ({ ...prev, xaPhuong: "" }));
        }
    }, [employee.quanHuyen]);



    const today = new Date();
    const minBirthDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    const maxBirthDate = new Date(today.getFullYear() - 80, today.getMonth(), today.getDate());

    // Hàm tính tuổi từ ngày sinh.
    function getAgeFromDateString(dateString) {
        if (!dateString) return "";
        // Xử lý cả định dạng "dd/mm/yyyy" và "dd-mm-yyyy"
        const delimiter = dateString.includes("/") ? "/" : "-";
        const [day, month, year] = dateString.split(delimiter); //VD: "01/01/2000" → ["01", "01", "2000"]
        const birthDate = new Date(`${year}-${month}-${day}`);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    const [focusField, setFocusField] = useState("");
    const [errorField, setErrorField] = useState("");

    // 1. Định nghĩa buildTextFieldProps giống add.jsx
    function buildTextFieldProps(fieldName, options = {}) {
        const value = employee[fieldName] || "";
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
            error: errorField === fieldName,    //Mục đích: hiển thị viền đỏ khi có lỗi
            InputProps: {
                startAdornment: options.startAdornment,
                endAdornment,
                onFocus: () => {
                    setFocusField(fieldName);
                    if (errorField === fieldName) setErrorField("");    //Mục đích: xóa viền đỏ khi focus vào trường lỗi.
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

    // Handle input changes 
    const handleChange = (evt) => {
        if (!evt?.target) return handlers.date(evt);    // DatePicker event
        const { name, value, files } = evt.target;
        if (name === "hinhAnh" && files?.[0]) return handlers.file(files[0]); // File upload event
        handlers.input(name, value); // Các trường còn lại
    };

    // Xử lí cụ thể event của từng trường.
    const handlers = {
        date: (date) => {
            if (date && dayjs(date).isValid()) {
                setEmployee(prev => ({ ...prev, ngaySinh: dayjs(date).format("DD/MM/YYYY") }));
            } else {
                setEmployee(prev => ({ ...prev, ngaySinh: "" }));
            }
        },
        file: (file) => {
            if (file) {
                setEmployee(prev => ({ ...prev, hinhAnh: file.name }));
                setAvatarPreview(URL.createObjectURL(file));
            }
        },
        input: (name, value) => {
            // Số điện thoại và CCCD chỉ nhận số.
            if (name === "soDienThoai" || name === "canCuocCongDan") {
                const numericValue = value.replace(/\D/g, "");
                // if (name === "soDienThoai" && numericValue.length > 10) return;
                // if (name === "canCuocCongDan" && numericValue.length > 12) return;
                setEmployee(prev => ({ ...prev, [name]: numericValue }));
                return;
            }
            setEmployee(prev => ({ ...prev, [name]: value }));
        }
    };

    // AddressSelect component giống add.jsx
    function AddressSelect({ label, name, value, options, disabled, error }) {
        const [focus, setFocus] = useState(false);  //Thiết lập field được focus. 
        return (
            <Grid item xs={12} sm={4}>
                <label style={labelStyle}>{label}</label>
                <FormControl
                    fullWidth
                    size="small"
                    sx={{
                        ...getFieldSx(focus ? name : "", name, error ? name : ""),
                    }}
                    disabled={disabled}
                >
                    <Select
                        name={name}
                        value={value || ""}
                        onChange={handleChange}
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
        onFocusField: PropTypes.func,
    };




    const validPrefixes = [
        "032", "033", "034", "035", "036", "037", "038", "039",
        "070", "071", "072", "073", "074", "075", "076", "077", "078", "079",
        "081", "082", "083", "084", "085", "086", "087", "088", "089",
        "090", "093", "094", "096", "097", "098", "099"
    ];

    // Lấy một số đầu số tiêu biểu để hiển thị
    const samplePrefixes = ["032", "070", "081", "090", "096"];

    // Cấu trúc validation rules giống add.jsx
    const validationRules = [
        {
            field: "hoVaTen",
            condition: !employee.hoVaTen,
            message: "Vui lòng nhập họ tên"
        },
        {
            field: "soDienThoai",
            condition: !employee.soDienThoai,
            message: "Vui lòng nhập số điện thoại"
        },
        {
            field: "soDienThoai",
            condition: !/^\d{10}$/.test(employee.soDienThoai),
            message: "Số điện thoại phải gồm 10 chữ số"
        },
        {
            field: "soDienThoai",
            condition: !validPrefixes.some(prefix => employee.soDienThoai.startsWith(prefix)),
            message: `Số điện thoại phải bắt đầu bằng đầu số hợp lệ (VD: ${samplePrefixes.join(", ")})`
        },
        {
            field: "email",
            condition: !employee.email,
            message: "Vui lòng nhập email"
        },
        {
            field: "email",
            condition: !/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(employee.email),
            message: "Email phải có định dạng @gmail.com"
        },
        {
            field: "ngaySinh",
            condition: !employee.ngaySinh,
            message: "Vui lòng chọn ngày sinh"
        },
        {
            field: "canCuocCongDan",
            condition: !employee.canCuocCongDan,
            message: "Vui lòng nhập căn cước công dân"
        },
        {
            field: "canCuocCongDan",
            condition: !/^\d{12}$/.test(employee.canCuocCongDan),
            message: "Căn cước công dân phải gồm 12 chữ số"
        },
        {
            field: "tinhThanhPho",
            condition: !employee.tinhThanhPho,
            message: "Vui lòng chọn tỉnh/thành phố"
        },
        {
            field: "quanHuyen",
            condition: !employee.quanHuyen,
            message: "Vui lòng chọn quận/huyện"
        },
        {
            field: "xaPhuong",
            condition: !employee.xaPhuong,
            message: "Vui lòng chọn phường/xã"
        }
    ];

    // Set Filed lỗi + trả Error Message.
    const validate = () => {
        for (const rule of validationRules) {
            if (rule.condition) {
                setErrorField(rule.field);
                return rule.message;
            }
        }
        return null;
    };

    // Hàm kiểm tra trùng lặp giống add.jsx, nhưng truyền thêm id
    const checkDuplicate = async () => {
        try {
            const checkData = {
                id: parseInt(id),
                email: employee.email,
                soDienThoai: employee.soDienThoai,
                canCuocCongDan: employee.canCuocCongDan
            };
            const response = await axios.post(`${API_BASE_URL}/check-duplicate`, checkData);
            return response.data.data;
        } catch (error) {
            toast.error("Không thể kiểm tra trùng lặp!");
            return { hasDuplicate: false };
        }
    };

    const validateBeforeSubmit = async () => {
        const validationError = validate(); // Kiểm tra validation cơ bản trước.
        if (validationError) {
            toast.error(validationError); // 🔴 Hiển thị thông báo lỗi.
            return false;
        }
        try {
            const duplicateResult = await checkDuplicate(); // Kiểm tra trùng lặp 3 trường quan trọng.
            if (duplicateResult.hasDuplicate) { // hasDuplicate: true
                const duplicateInfo = duplicateResult.duplicateInfo; // Lấy thông tin trùng lặp.
                let errorMessage = "Thông tin đã tồn tại trong hệ thống:\n";
                if (duplicateInfo.emailDuplicate) { // emailDuplicate: true
                    errorMessage += "• Email đã tồn tại\n";
                    setErrorField("email");
                }
                if (duplicateInfo.phoneDuplicate) { // phoneDuplicate: true
                    errorMessage += "• Số điện thoại đã tồn tại\n";
                    setErrorField("soDienThoai");
                }
                if (duplicateInfo.cccdDuplicate) { // cccdDuplicate: true
                    errorMessage += "• CCCD đã tồn tại\n";
                    setErrorField("canCuocCongDan");
                }
                toast.error(errorMessage.trim()); // 🔴 Hiển thị thông báo lỗi.
                return false;
            }
            return true;
        } catch (error) {
            if (error.response?.status >= 500) { // Lỗi server
                toast.warning("Không thể kiểm tra trùng lặp, vui lòng thử lại!");
                return false;
            }
            return true;
        }
    };

    // Hàm mở dialog khi click vào button submit, reset, cancel.
    const openConfirmDialog = async (type) => {
        if (type === 'submit') {
            setValidating(true); // 🔄 Bật trạng thái "đang kiểm tra" ở button submit khi mở dialog.
            try {
                const isValid = await validateBeforeSubmit(); // Kiểm tra dữ liệu trước khi mở dialog có submit thật.
                if (!isValid) return; // ❌ Nếu không hợp lệ → dừng, không mở dialog.
            } finally {
                setValidating(false); // 🔄 Tắt trạng thái "đang kiểm tra" ở button submit khi dialog đóng.
            }
        }
        const dialogConfigs = {
            submit: {
                title: "Xác nhận cập nhật nhân viên",
                message: `✅ Dữ liệu đã được kiểm tra và hợp lệ!\n\nBạn có chắc chắn muốn cập nhật thông tin nhân viên ${employee.hoVaTen}? Hành động này sẽ lưu thông tin nhân viên vào hệ thống.`,
                confirmText: "Cập nhật",
                cancelText: "Hủy bỏ",
                confirmColor: "primary"
            },
            cancel: {
                title: "Xác nhận hủy bỏ",
                message: "Bạn có chắc chắn muốn hủy bỏ? Tất cả thông tin đã nhập sẽ bị mất và bạn sẽ quay lại trang chi tiết nhân viên.",
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
        const config = dialogConfigs[type];
        setConfirmDialog({
            open: true,
            type,
            ...config
        });
    };

    // Dialog xác nhận giống add.jsx
    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        type: null, // 'submit', 'cancel', 'reset'
        title: '',
        message: '',
        confirmText: '',
        cancelText: '',
        confirmColor: 'primary'
    });

    // Hàm thực thi khi click vào button trong riêng mỗi dialog.
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

    // Click button trong mỗi dialog: vơi ý nghĩa đóng dialog.
    const closeConfirmDialog = () => {
        setConfirmDialog(prev => ({ ...prev, open: false }));
    };

    // Click button submit: cập nhật nhân viên trong dialog.
    const handleSubmit = async () => {
        setLoading(true);
        setSuccess(false);
        try {
            const { tinhThanhPho, quanHuyen, xaPhuong } = employee;
            const { provinces, districts, wards } = addressData;
            const diaChi = [
                wards.find(w => w.code === xaPhuong)?.name,
                districts.find(d => d.code === quanHuyen)?.name,
                provinces.find(p => p.code === tinhThanhPho)?.name
            ].filter(Boolean).join(", ");
            console.log("Formatted address:", diaChi);

            await axios.patch(`${API_BASE_URL}/${id}`, { ...employee, diaChi });
            setSuccess(true);
            toast.success("Cập nhật nhân viên thành công!");
            setTimeout(() => navigate(`/nhanvien/detail/${id}`), 1200);
        } catch (error) {
            console.log("Chi tiết lỗi: ", error);
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
                toast.error(message || `Lỗi khác từ máy chủ: ${status}`);
            }
        } finally {
            setLoading(false);
        }
    };

    // Nút Reset: đặt lại employee về originalEmployee
    const handleReset = () => {
        console.log("originalEmployee: ", originalEmployee);
        console.log("originalDiaChi: ", originalDiaChi);
        if (originalEmployee && originalDiaChi) {
            setEmployee({
                ...originalEmployee,
                ...originalDiaChi
            });
            setAvatarPreview(originalEmployee.hinhAnh || "/default-avatar.png");
        }
    };
    // Nút Hủy bỏ: quay về trang chi tiết nhân viên
    const handleCancel = () => {
        navigate(`/nhanvien/detail/${id}`);
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Box sx={{ overflowY: "hidden", minHeight: "100vh", height: '100vh', background: "linear-gradient(130deg,#f2f9fe 70%,#e9f0fa 100%)", display: "flex", alignItems: "flex-start", justifyContent: "center", py: 4 }}>
                {addressData.provinces.length > 0 && !loading ? (
                    <Fade in timeout={600}>
                        <div>
                            <GradientCard sx={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                                <SectionTitle align="center" mb={1}>Cập Nhật Thông Tin Nhân Viên</SectionTitle>
                                <Box sx={{ background: "linear-gradient(130deg,#f2f9fe 70%,#e9f0fa 100%)", mb: 2, p: 2, borderRadius: 3, textAlign: "center" }}>
                                    <Typography variant="subtitle1" color="#1769aa" fontWeight={600}>
                                        <Typography component="span" style={{ color: "#43a047" }} fontWeight={600}>
                                            Chính xác - Cẩn thận!
                                        </Typography>{" "}
                                        Vui lòng kiểm tra và cập nhật thông tin.
                                    </Typography>
                                </Box>
                                <form autoComplete="off">
                                    <Grid container sx={{ px: 2 }}>
                                        {/* Container chứa : Avatar + Upload button + mã nhân viên + Căn cước công dân*/}
                                        <Grid item xs={12} md={4} sx={{ paddingLeft: '24px', paddingTop: '15px' }}>
                                            <Box
                                                sx={{
                                                    height: "100%", minHeight: 500, background: "#f6fafd", borderRadius: 3, p: 2,
                                                    display: "flex", flexDirection: "column", justifyContent: "center",
                                                    alignItems: "center", gap: 2,
                                                }}
                                            >
                                                {/* Avatar */}
                                                <AvatarWrapper>
                                                    <Box
                                                        sx={{
                                                            position: 'relative', width: 450, height: 300, mb: 2,
                                                            borderRadius: 4, border: "3px solid #42a5f5",
                                                            boxShadow: "0 8px 25px rgba(66, 165, 245, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)",
                                                            background: "#fafdff", cursor: "pointer", overflow: "hidden", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                                            "&:hover": {
                                                                transform: "scale(1.03)",
                                                                boxShadow: "0 15px 35px rgba(66, 165, 245, 0.25), 0 5px 15px rgba(0, 0, 0, 0.15)",
                                                                borderColor: "#1976d2"
                                                            },
                                                            "&:active": {
                                                                transform: "scale(0.98)"
                                                            }
                                                        }}
                                                        // Lấy input file (name: hinhAnh-upload-nv) --> click --> mở hộp thoại chọn tệp.
                                                        onClick={() => document.getElementById("hinhAnh-upload-nv")?.click()}
                                                    >
                                                        {/* TH có image --> Hiển thị ảnh */}
                                                        {avatarPreview && avatarPreview !== "/default-avatar.png" ? (
                                                            <img
                                                                src={avatarPreview}
                                                                alt="avatar"
                                                                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "16px" }}
                                                            />
                                                        ) : (
                                                            //TH k có image --> Hiển thị chữ đầu của tên. 
                                                            <Box
                                                                sx={{
                                                                    width: "100%",
                                                                    height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                                                                    background: "linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 50%, #e8eaf6 100%)",
                                                                    color: "#1976d2", fontSize: 52, fontWeight: 700, borderRadius: "16px", textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
                                                                }}
                                                            >
                                                                {employee.hoVaTen?.[0]?.toUpperCase() || "A"}
                                                            </Box>
                                                        )}
                                                        {/* Overlay (lớp phủ) khi hover: hiển thị icon upload. */}
                                                        <Box
                                                            sx={{
                                                                position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                                                                background: "linear-gradient(135deg, rgba(25, 118, 210, 0.15) 0%, rgba(156, 39, 176, 0.1) 100%)",
                                                                display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.3s ease", borderRadius: "16px",
                                                                "&:hover": {
                                                                    opacity: 1  // Khi hover: hiển thị lớp phủ.
                                                                }
                                                            }}
                                                        >
                                                            {/* Box chứa icon upload */}
                                                            <Box
                                                                sx={{
                                                                    background: "rgba(255, 255, 255, 0.9)", borderRadius: "50%", p: 1,
                                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
                                                                }}
                                                            >
                                                                <Upload sx={{ color: "#1976d2", fontSize: 28 }} /> {/* Icon upload */}
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                    {/* Label chứa input file */}
                                                    <label htmlFor="hinhAnh-upload-nv">
                                                        <input type="file" id="hinhAnh-upload-nv" name="hinhAnh"
                                                            accept="image/*" style={{ display: "none" }}
                                                            onChange={handleChange}
                                                        />
                                                        {/* Button upload */}
                                                        <AvatarUploadButton
                                                            variant="outlined"
                                                            component="span"
                                                            startIcon={<Upload />}
                                                            sx={{
                                                                borderRadius: 3, textTransform: "none", fontWeight: 600, fontSize: 14, px: 4, py: 1.5,
                                                                background: "linear-gradient(135deg, #fff 0%, #f8f9ff 100%)",
                                                                color: "#1565c0", border: "2px solid #90caf9", boxShadow: "0 4px 12px rgba(144, 202, 249, 0.2), 0 2px 4px rgba(0, 0, 0, 0.1)",
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

                                                    {/* Hiển thị mã nhân viên dưới ảnh */}
                                                    <Typography
                                                        variant="body2"
                                                        sx={{ color: "#666", mb: 2, fontWeight: 500 }}
                                                    >
                                                        {maNhanVien || "Chưa có mã nhân viên"}
                                                    </Typography>
                                                </AvatarWrapper>
                                                {/* Divider: đường kẻ ngang */}
                                                <Divider sx={{ width: "100%", my: 1, opacity: 0.13 }} />
                                                {/* Container chứa : Căn cước công dân */}
                                                <Box sx={{ width: "100%" }}>
                                                    <label style={labelStyle}>Căn cước công dân</label>
                                                    <TextField
                                                        {...buildTextFieldProps("canCuocCongDan", {
                                                            placeholder: "VD: 001234567890",
                                                            maxLength: 12,
                                                        })}
                                                    />
                                                </Box>
                                            </Box>
                                        </Grid>
                                        {/* Container chứa : Họ và tên + Số điện thoại + Email + Ngày sinh + Giới tính + Vai trò + Trạng thái + Tỉnh/Thành phố + Quận/Huyện + Phường/Xã */}
                                        <Grid item xs={12} md={8} sx={{ paddingLeft: '24px', paddingTop: '15px' }}>

                                            <Grid container spacing={4}>
                                                {/* Họ và tên */}
                                                <Grid item xs={12}>
                                                    <label style={labelStyle}>Họ và tên</label>
                                                    <TextField
                                                        {...buildTextFieldProps("hoVaTen", {
                                                            placeholder: "VD: Nguyễn Văn A",
                                                            maxLength: 30
                                                        })}
                                                    />
                                                </Grid>
                                                {/* Số điện thoại */}
                                                <Grid item xs={12} sm={6}>
                                                    <label style={labelStyle}>Số điện thoại</label>
                                                    <TextField
                                                        {...buildTextFieldProps("soDienThoai", {
                                                            placeholder: "VD: 0989999999",
                                                            maxLength: 10,
                                                        })}
                                                    />
                                                </Grid>
                                                {/* Email */}
                                                <Grid item xs={12} sm={6}>
                                                    <label style={labelStyle}>Email</label>
                                                    <TextField
                                                        {...buildTextFieldProps("email", {
                                                            placeholder: "VD: email@gmail.com",
                                                            maxLength: 30,
                                                        })}
                                                    />
                                                </Grid>
                                                {/* Ngày sinh */}
                                                <Grid item xs={12} sm={6}>
                                                    <label style={labelStyle}>
                                                        Ngày sinh
                                                        {employee.ngaySinh && (
                                                            <span style={{ color: "#1976d2", fontWeight: 400, marginLeft: 8, fontSize: "14px" }}>
                                                                ({getAgeFromDateString(employee.ngaySinh)} tuổi)
                                                            </span>
                                                        )}
                                                    </label>
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DatePicker
                                                            value={employee.ngaySinh ? dayjs(employee.ngaySinh, "DD/MM/YYYY") : null}
                                                            minDate={dayjs(maxBirthDate)}
                                                            maxDate={dayjs(minBirthDate)}
                                                            onChange={handleChange}
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
                                                {/* Giới tính - Sử dụng Radio */}
                                                <Grid item xs={12} sm={6}>
                                                    <label style={labelStyle}>Giới tính</label>
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
                                                            value={employee.gioiTinh}
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
                                                {/* Vai trò - Ẩn và mặc định là nhân viên */}
                                                <Grid item xs={12} sm={6} sx={{ display: 'none' }}>
                                                    <label style={labelStyle}>Vai trò</label>
                                                    <TextField
                                                        select
                                                        {...buildTextFieldProps("vaiTro", {})}
                                                        value="EMPLOYEE"
                                                    >
                                                        <MenuItem value="EMPLOYEE">Nhân viên</MenuItem>
                                                    </TextField>
                                                </Grid>
                                                {/* Trạng thái - Sử dụng Radio */}
                                                <Grid item xs={12} sm={6}>
                                                    <label style={labelStyle}>Trạng thái</label>
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
                                                            value={employee.trangThai}
                                                            onChange={handleChange}
                                                            row
                                                        >
                                                            <FormControlLabel 
                                                                value="ACTIVE" 
                                                                control={<Radio />} 
                                                                label="Đang làm việc" 
                                                            />
                                                            <FormControlLabel 
                                                                value="INACTIVE" 
                                                                control={<Radio />} 
                                                                label="Nghỉ việc" 
                                                            />
                                                        </StyledRadioGroup>
                                                    </Box>
                                                </Grid>
                                                {/* Container chứa : Tỉnh/Thành phố + Quận/Huyện + Phường/Xã */}
                                                <Grid item xs={12}>
                                                    <Grid container spacing={2}>
                                                        {/* Tỉnh/Thành phố */}
                                                        <AddressSelect
                                                            label="Tỉnh/Thành phố"
                                                            name="tinhThanhPho"
                                                            value={employee.tinhThanhPho}
                                                            options={addressData.provinces}
                                                            disabled={false}
                                                            error={errorField === "tinhThanhPho"}
                                                        />
                                                        {/* Quận/Huyện */}
                                                        <AddressSelect
                                                            label="Quận/Huyện"
                                                            name="quanHuyen"
                                                            value={employee.quanHuyen}
                                                            options={addressData.districts}
                                                            disabled={!employee.tinhThanhPho}
                                                            error={errorField === "quanHuyen"}
                                                        />
                                                        {/* Phường/Xã */}
                                                        <AddressSelect
                                                            label="Phường/Xã"
                                                            name="xaPhuong"
                                                            value={employee.xaPhuong}
                                                            options={addressData.wards}
                                                            disabled={!employee.quanHuyen}
                                                            error={errorField === "xaPhuong"}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        {/* Container chứa : Button reset + Button cancel + Button update */}
                                        <Grid item xs={12} sx={{ padding: 0 }}>
                                            {/* Divider: đường kẻ ngang */}
                                            <Divider sx={{ my: 1, background: "#1976d2", opacity: 0.2 }} />
                                            <Box sx={{ display: "flex", justifyContent: "flex-end", pr: 9, mt: 2, mb: 2, marginBottom: '5px' }}>
                                                <Box sx={{ display: "flex", gap: 2 }}>
                                                    {/* Button reset */}
                                                    <Button
                                                        variant="outlined"
                                                        size="large"
                                                        onClick={async () => await openConfirmDialog('reset')}
                                                        disabled={loading}
                                                        sx={{ fontWeight: 700, borderRadius: 3, minWidth: 120, background: "#fff", border: "2px solid #2196f3", color: "#2196f3", "&:hover": { background: "#e3f2fd", borderColor: "#1976d2", color: "#1976d2" }, "&:disabled": { background: "#f5f5f5", borderColor: "#bdbdbd", color: "#bdbdbd" } }}
                                                    >
                                                        Đặt lại
                                                    </Button>
                                                    {/* Button cancel */}
                                                    <Button
                                                        variant="outlined"
                                                        size="large"
                                                        onClick={async () => await openConfirmDialog('cancel')}
                                                        disabled={loading}
                                                        sx={{ fontWeight: 700, borderRadius: 3, minWidth: 120, background: "#fff", border: "2px solid #757575", color: "#757575", "&:hover": { background: "#f5f5f5", borderColor: "#424242", color: "#424242" }, "&:disabled": { background: "#f5f5f5", borderColor: "#bdbdbd", color: "#bdbdbd" } }}
                                                    >
                                                        Quay về trang
                                                    </Button>
                                                    {/* Button update */}
                                                    <Button
                                                        type="button"
                                                        onClick={async () => await openConfirmDialog('submit')}
                                                        size="large"
                                                        disabled={loading || validating}
                                                        color={success ? "success" : "info"}
                                                        variant="contained"
                                                        startIcon={
                                                            loading ? <CircularProgress size={22} /> :
                                                                validating ? <CircularProgress size={22} /> :
                                                                    success ? <CheckCircle /> : null
                                                        }
                                                        sx={{ fontWeight: 800, fontSize: 18, px: 6, borderRadius: 3, minWidth: 200, boxShadow: "0 2px 10px 0 #90caf9" }}
                                                    >
                                                        {loading ? "Đang cập nhật..." :
                                                            validating ? "Đang kiểm tra..." :
                                                                success ? "Thành công!" : "Cập nhật nhân viên"}
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </form>
                            </GradientCard>
                            {/* Dialog xác nhận */}
                            <Dialog
                                open={confirmDialog.open}
                                onClose={closeConfirmDialog}
                                aria-labelledby="confirm-dialog-title"
                                aria-describedby="confirm-dialog-description"
                                maxWidth="sm"
                                fullWidth
                                PaperProps={{
                                    sx: {
                                        borderRadius: 3,
                                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
                                        border: "1px solid #e0e0e0"
                                    }
                                }}
                            >
                                <DialogTitle
                                    id="confirm-dialog-title"
                                    sx={{
                                        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                                        color: "#1976d2",
                                        fontWeight: 700,
                                        fontSize: "1.25rem",
                                        borderBottom: "1px solid #e0e0e0"
                                    }}
                                >
                                    {confirmDialog.title}
                                </DialogTitle>
                                <DialogContent sx={{ pt: 3, pb: 2 }}>
                                    <DialogContentText
                                        id="confirm-dialog-description"
                                        sx={{
                                            fontSize: "1rem",
                                            lineHeight: 1.6,
                                            color: "#424242",
                                            textAlign: "justify"
                                        }}
                                    >
                                        {confirmDialog.message}
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions sx={{ p: 3, pt: 1, gap: 2 }}>
                                    <Button
                                        onClick={closeConfirmDialog}
                                        variant="outlined"
                                        sx={{
                                            fontWeight: 600,
                                            borderRadius: 2,
                                            px: 3,
                                            py: 1,
                                            borderColor: "#bdbdbd",
                                            color: "#757575",
                                            "&:hover": {
                                                borderColor: "#9e9e9e",
                                                backgroundColor: "#f5f5f5"
                                            }
                                        }}
                                    >
                                        {confirmDialog.cancelText}
                                    </Button>
                                    <Button
                                        onClick={handleConfirmAction}
                                        variant="contained"
                                        color={confirmDialog.confirmColor}
                                        autoFocus
                                        sx={{
                                            fontWeight: 700,
                                            borderRadius: 2,
                                            px: 4,
                                            py: 1,
                                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                                            "&:hover": {
                                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)"
                                            }
                                        }}
                                    >
                                        {confirmDialog.confirmText}
                                    </Button>
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
        </DashboardLayout >
    );
}

export default UpdateNhanVien;