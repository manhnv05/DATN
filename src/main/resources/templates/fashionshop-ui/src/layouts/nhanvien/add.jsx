import React, { useState, useEffect } from "react";
import {
    Card, Box, Typography, Grid, TextField, Button, FormControl,
    Avatar, CircularProgress, Divider, Select, MenuItem, Dialog,
    DialogTitle, DialogContent, DialogActions, DialogContentText,
    RadioGroup, Radio, FormControlLabel, FormLabel,
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

// API URLs
const API_BASE_URL = "http://localhost:8080/nhanVien";
const provinceAPI = "https://provinces.open-api.vn/api/?depth=1";
const districtAPI = (code) => `https://provinces.open-api.vn/api/p/${code}?depth=2`;
const wardAPI = (code) => `https://provinces.open-api.vn/api/d/${code}?depth=2`;

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

function AddNhanVienForm() {

    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    const today = new Date();
    // Năm sinh tối đa được phép (không dưới 18 tuổi)
    const minBirthDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    // Năm sinh tối thiểu được phép (không quá 80 tuổi)
    const maxBirthDate = new Date(today.getFullYear() - 80, today.getMonth(), today.getDate());

    const navigate = useNavigate();

    const [employee, setEmployee] = useState({
        hinhAnh: "",
        hoVaTen: "Nguyễn Văn A",
        email: "hoangbamanh5x12@gmail.com",
        soDienThoai: "0344667744",
        ngaySinh: dayjs(minBirthDate).format("DD/MM/YYYY"),
        gioiTinh: "MALE",
        canCuocCongDan: "012345678901",   // CCCD 12 số
        vaiTro: "EMPLOYEE", // Mặc định là nhân viên
        tinhThanhPho: "", quanHuyen: "", xaPhuong: "",//code. 
    });
    const [avatarPreview, setAvatarPreview] = useState("");
    const [focusField, setFocusField] = useState("");
    const [errorField, setErrorField] = useState("");

    /**
     * Sinh ra props chuẩn cho TextField dùng trong form nhân viên,
     * bao gồm xử lý focus, style, và các thuộc tính nhập liệu cơ bản.
     * @param {string} fieldName - Tên trường dữ liệu (dùng cho style focus).
     * @param {object} options - Tuỳ chọn mở rộng (placeholder, maxLength, inputMode, disabled, autoFocus, v.v.).
     * @returns {object} - Object props cho TextField.
     */
    function buildTextFieldProps(fieldName, options = {}) {
        const value = employee[fieldName] || "";
        const maxLength = options.maxLength;
        // Nếu có maxLength thì hiển thị số ký tự
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
                    if (errorField === fieldName) {
                        setErrorField("");
                    }
                },
                onBlur: () => setFocusField(""),
            },
            inputProps: {
                maxLength,
                ...options.inputProps, // cho phép mở rộng thêm nếu cần
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

    const handlers = {
        date: (date) => {
            // Ví dụ: date = "2024-06-01T00:00:00.000Z"
            console.log("DatePicker value:", date);
            date && dayjs(date).isValid() // Nếu date tồn tại và hợp lệ
                ? setEmployee(prev => ({ ...prev, ngaySinh: dayjs(date).format("DD/MM/YYYY") })) // VD: "01/06/2024"
                : setEmployee(prev => ({ ...prev, ngaySinh: "" }));
        },
        file: (file) => {
            // Ví dụ: file = { name: "avatar.png", ... }
            if (file) {
                setEmployee(prev => ({ ...prev, hinhAnh: file.name })); // VD: "avatar.png"
                setAvatarPreview(URL.createObjectURL(file)); // VD: "blob:http://localhost:3000/..."
            }
        },
        input: (name, value) => {
            // Ví dụ: name = "soDienThoai", value = "0989999999"
            // Chỉ cho nhập số ở các trường số
            if (name === "soDienThoai" || name === "canCuocCongDan") {
                const numericValue = value.replace(/\D/g, ""); // Xóa tất cả ký tự không phải số trước khi render lại.
                console.log(`Thay đổi ${name}: "${value}" -> "${numericValue}"`);

                // // Validation để tránh nhập nhầm
                // if (name === "soDienThoai" && numericValue.length > 10) {
                //     console.warn("Số điện thoại không được quá 10 số!");
                //     return; // Không cập nhật nếu quá 10 số
                // }
                // if (name === "canCuocCongDan" && numericValue.length > 12) {
                //     console.warn("CCCD không được quá 12 số!");
                //     return; // Không cập nhật nếu quá 12 số
                // }

                setEmployee(prev => ({ ...prev, [name]: numericValue }));
                return;
            }
            console.log(`Thay đổi ${name}: "${value}"`);
            setEmployee(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleChange = (evt) => {
        // DatePicker event
        if (!evt?.target) return handlers.date(evt);

        const { name, value, files } = evt.target;

        // File upload event
        if (name === "hinhAnh" && files?.[0]) return handlers.file(files[0]);

        // Các trường còn lại
        console.log("name and value", name, value);
        handlers.input(name, value);
    };

    // Component select địa chỉ dùng chung
    function AddressSelect({ label, name, value, options, disabled, error, onFocusField }) {
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
                            onFocusField && onFocusField(name);
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
        onFocusField: PropTypes.func, // Thêm dòng này để hết lỗi linter
    };

    // Mục đích: focus vào select thì lỗi của select sẽ bị reset. (Địa Chỉ)
    const handleFocusField = (name) => {
        setErrorField(prev => (prev === name ? "" : prev));
    };

    //Danh sách địa chỉ tỉnh/tp, quận/huyện, xã/phường hiển thị trên select.
    const [addressData, setAddressData] = useState({ provinces: [], districts: [], wards: [] });

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

    //Fetch: Tỉnh: một lần duy nhất khi render xong UI lần đầu(component mounted).
    useEffect(() => {
        fetchAddress("provinces").then(provinces => {
            setAddressData(prev => ({ ...prev, provinces }));
        });
    }, []);

    useEffect(() => {
        //Hiển d.sách Quận/Huyện - Reset Xã/Phường.
        const districtsPromise = employee.tinhThanhPho
            ? fetchAddress("districts", employee.tinhThanhPho) //Nếu đang chọn 1 tỉnh
            : Promise.resolve([]);  //Nếu chọn "Chọn tỉnh/thành phố" --> value: "".
        districtsPromise.then(districts => {
            setAddressData(prev => ({ ...prev, districts, wards: [] }));
            setEmployee(prev => ({ ...prev, quanHuyen: "", xaPhuong: "" }));
        });
    }, [employee.tinhThanhPho]);

    useEffect(() => {
        const wardsPromise = employee.quanHuyen
            ? fetchAddress("wards", employee.quanHuyen)
            : Promise.resolve([]);
        wardsPromise.then(wards => {
            setAddressData(prev => ({ ...prev, wards }));
            setEmployee(prev => ({ ...prev, xaPhuong: "" }));
        });
    }, [employee.quanHuyen]);



    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [validating, setValidating] = useState(false);


    // Đầu số hợp lệ của các nhà mạng Việt Nam
    const validPrefixes = [
        "032", "033", "034", "035", "036", "037", "038", "039", // Viettel
        "070", "071", "072", "073", "074", "075", "076", "077", "078", "079", // MobiFone
        "081", "082", "083", "084", "085", "086", "087", "088", "089", // Vinaphone
        "090", "093", "094", "096", "097", "098", "099" // Gmobile, Vietnamobile, Itelecom
    ];
    // Lấy một số đầu số tiêu biểu để hiển thị
    const samplePrefixes = ["032", "070", "081", "090", "096"];

    // Cấu trúc validation rules
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
        for (const rule of validationRules) {   //Duyệt từng rule trong validationRules.
            if (rule.condition) {   //Nếu điều kiện đúng thì:   
                setErrorField(rule.field); //Lưu trữ trường lỗi.
                return rule.message; //Trả về thông báo lỗi.
            }
        }
        return null; //Nếu không có lỗi thì trả về null.
    };
    //------------DiaLog ------------//

    // Hàm kiểm tra dữ liệu trước khi mở dialog có submit thật.
    const validateBeforeSubmit = async () => {
        const validationError = validate(); // Kiểm tra validation cơ bản trước
        if (validationError) {
            toast.error(validationError);   // 🔴 Hiển thị thông báo lỗi
            return false;   // ❌ Nếu không hợp lệ → dừng, không mở dialog
        }
        // Kiểm tra trùng lặp 3 trường quan trọng
        try {

            const checkData = {
                email: employee.email,
                soDienThoai: employee.soDienThoai,
                canCuocCongDan: employee.canCuocCongDan
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
                    setErrorField("soDienThoai");
                }
                if (duplicateInfo.cccdDuplicate) {
                    errorMessage += "• CCCD đã tồn tại\n";
                    setErrorField("canCuocCongDan");
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

    // Hàm mở dialog khi click vào button submit, reset, cancel.
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
                title: "Xác nhận thêm nhân viên",
                message: "✅ Dữ liệu đã được kiểm tra và hợp lệ!\n\nBạn có chắc chắn muốn thêm nhân viên mới với thông tin đã nhập? Hành động này sẽ lưu thông tin nhân viên vào hệ thống.",
                confirmText: "Thêm nhân viên",
                cancelText: "Hủy bỏ",
                confirmColor: "primary"
            },
            cancel: {
                title: "Xác nhận hủy bỏ",
                message: "Bạn có chắc chắn muốn hủy bỏ? Tất cả thông tin đã nhập sẽ bị mất và bạn sẽ quay lại trang danh sách nhân viên.",
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

    // State quản lý các dialog xác nhận
    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        type: null, // 'submit', 'cancel', 'reset'
        title: '',
        message: '',
        confirmText: '',
        cancelText: '',
        confirmColor: 'primary'
    });

    // Hàm xử lý xác nhận từ trong dialog.
    const handleConfirmAction = () => {
        const { type } = confirmDialog;
        switch (type) {
            case 'submit':
                closeConfirmDialog();
                handleSubmit();
                break;
            case 'cancel':
                closeConfirmDialog();
                navigate("/staff-management");
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

    // Hàm reset dữ liệu về giá trị mặc định đúng
    const resetToDefaultValues = () => {
        setEmployee({
            hinhAnh: "",
            hoVaTen: "Nguyễn Văn A",
            email: "hoangbamanh5x12@gmail.com",
            soDienThoai: "0344667744",        // Số điện thoại 10 số
            ngaySinh: dayjs(minBirthDate).format("DD/MM/YYYY"),
            gioiTinh: "MALE",
            canCuocCongDan: "012345678901",   // CCCD 12 số
            vaiTro: "EMPLOYEE",
            tinhThanhPho: "", quanHuyen: "", xaPhuong: "",
        });
        setAvatarPreview("");
        setErrorField("");
        setFocusField("");
    };

    // Hàm đóng dialog xác nhận
    const closeConfirmDialog = () => {
        setConfirmDialog(prev => ({ ...prev, open: false }));
    };


    // Hàm lấy địa chỉ đầy đủ từ mã code của tỉnh, huyện, xã
    const getEmployeeFullAddress = (employee, addressData) => {
        const getNameByCode = (list, code) => list.find(item => item.code === code)?.name || "";
        const { tinhThanhPho, quanHuyen, xaPhuong } = employee; //Lấy code tỉnh, quận, xã.
        const { provinces, districts, wards } = addressData; //Lấy d.sách tỉnh, quận, xã.
        const wardName = getNameByCode(wards, xaPhuong); //Tìm tên xã.
        const districtName = getNameByCode(districts, quanHuyen); //Tìm tên huyện.
        const provinceName = getNameByCode(provinces, tinhThanhPho); //Tìm tên tỉnh.
        return [wardName, districtName, provinceName].filter(Boolean).join(", "); //Ghép thành địa chỉ đầy đủ.
    };

    // Hàm submit chính (ở trong Dialog). Bỏ qua validation vì đã validate trước khi mở dialog.
    const handleSubmit = async () => {
        setLoading(true);
        setSuccess(false);
        try {
            const diaChi = getEmployeeFullAddress(employee, addressData);

            // Debug: Log dữ liệu trước khi gửi
            console.log("Dữ liệu gửi đi:", {
                soDienThoai: employee.soDienThoai,
                canCuocCongDan: employee.canCuocCongDan,
                email: employee.email,
                hoVaTen: employee.hoVaTen
            });

            await axios.post(API_BASE_URL, { ...employee, diaChi });
            setSuccess(true);
            toast.success("Thêm nhân viên thành công!");
            navigate("/staff-management");
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



    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Box sx={{ overflowY: "hidden", minHeight: "100vh", background: "linear-gradient(130deg,#f2f9fe 70%,#e9f0fa 100%)", display: "flex", alignItems: "flex-start", justifyContent: "center", py: 4 }}>
                {addressData.provinces.length > 0 ? (
                    <Fade in timeout={600}>
                        <div>
                            <GradientCard>
                                <SectionTitle align="center" mb={1}>Thêm Nhân Viên Mới</SectionTitle>
                                <Box sx={{ background: "linear-gradient(130deg,#f2f9fe 70%,#e9f0fa 100%)", mb: 2, p: 2, borderRadius: 3, textAlign: "center" }}>
                                    <Typography variant="subtitle1" color="#1769aa" fontWeight={600}>
                                        <span style={{ color: "#43a047" }}>Nhanh chóng - Chính xác - Thẩm mỹ!</span> Vui lòng nhập đầy đủ thông tin.
                                    </Typography>
                                </Box>
                                <form autoComplete="off">
                                    <Grid container spacing={3} sx={{ px: 2 }}>
                                        <Grid item xs={12} md={4}>
                                            <Box
                                                sx={{
                                                    height: "100%",
                                                    minHeight: 500,
                                                    background: "#f6fafd",
                                                    borderRadius: 3,
                                                    p: 2,
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    gap: 2,
                                                }}
                                            >
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
                                                        onClick={() => document.getElementById("hinhAnh-upload-nv")?.click()}
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
                                                                {employee.hoVaTen?.[0]?.toUpperCase() || "A"}
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
                                                    <label htmlFor="hinhAnh-upload-nv">
                                                        <input
                                                            type="file"
                                                            id="hinhAnh-upload-nv"
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
                                                <Divider sx={{ width: "100%", my: 1, opacity: 0.13 }} />
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
                                        <Grid item xs={12} md={8}>
                                            <Grid container spacing={4}>
                                                {/* Họ và tên */}
                                                <Grid item xs={12}>
                                                    <label style={labelStyle}>Họ và tên</label>
                                                    <TextField
                                                        {...buildTextFieldProps("hoVaTen", {
                                                            placeholder: "VD: Nguyễn Văn A",
                                                            autoFocus: focusField === "hoVaTen",
                                                            maxLength: 30,
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
                                                            autoFocus: focusField === "email",
                                                            maxLength: 30,
                                                        })}
                                                    />
                                                </Grid>
                                                {/* Ngày sinh và Giới tính - Layout tối ưu */}
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
                                                            onChange={handleChange}
                                                            minDate={dayjs(maxBirthDate)} // Tối thiểu 18 tuổi (2007)
                                                            maxDate={dayjs(minBirthDate)} // Tối đa 80 tuổi (1945)
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
                                                {/* Giới tính - Sử dụng Radio */}
                                                <Grid item xs={12} sm={6}>
                                                    <label style={labelStyle}>Giới tính</label>
                                                    <Box sx={{ 
                                                        mt: 1,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'flex-start', // Căn trái để ngang hàng với TextField
                                                        minHeight: '40px', // Để ngang hàng với TextField
                                                        pl: 1 // Padding left để căn giữa hơn
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
                                                {/* 
                                                Vai trò được ẩn và mặc định là "EMPLOYEE" (Nhân viên)
                                                Để bật lại, chỉ cần thay đổi sx={{ display: 'none' }} thành sx={{ display: 'block' }}
                                                */}
                                                <Grid item xs={12} sm={6} sx={{ display: 'none' }}>
                                                    <label style={labelStyle}>Vai trò</label>
                                                    <TextField
                                                        select
                                                        {...buildTextFieldProps("vaiTro", {})}
                                                    >
                                                        <MenuItem value="EMPLOYEE">Nhân viên</MenuItem>
                                                        <MenuItem value="ADMIN">Quản trị viên</MenuItem>
                                                    </TextField>
                                                </Grid>
                                                {/* Địa chỉ */}
                                                <Grid item xs={12}>
                                                    <Grid container spacing={2}>
                                                        <AddressSelect
                                                            label="Tỉnh/Thành phố"
                                                            name="tinhThanhPho"
                                                            value={employee.tinhThanhPho}
                                                            options={addressData.provinces}
                                                            disabled={false}
                                                            error={errorField === "tinhThanhPho"}
                                                            onFocusField={handleFocusField}
                                                        />
                                                        <AddressSelect
                                                            label="Quận/Huyện"
                                                            name="quanHuyen"
                                                            value={employee.quanHuyen}
                                                            options={addressData.districts}
                                                            disabled={!employee.tinhThanhPho}
                                                            error={errorField === "quanHuyen"}
                                                            onFocusField={handleFocusField}
                                                        />
                                                        <AddressSelect
                                                            label="Phường/Xã"
                                                            name="xaPhuong"
                                                            value={employee.xaPhuong}
                                                            options={addressData.wards}
                                                            disabled={!employee.quanHuyen}
                                                            error={errorField === "xaPhuong"}
                                                            onFocusField={handleFocusField}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        {/* Button submit, reset, cancel */}
                                        <Grid item xs={12}>
                                            <Divider sx={{ my: 3, background: "#1976d2", opacity: 0.2 }} />

                                            <Box sx={{ display: "flex", justifyContent: "flex-end", pr: 9, mt: 2 }}>
                                                <Box sx={{ display: "flex", gap: 2 }}>
                                                    {/* Button reset */}
                                                    <Button
                                                        variant="outlined"
                                                        size="large"
                                                        onClick={async () => await openConfirmDialog('reset')}
                                                        disabled={loading}
                                                        sx={{
                                                            fontWeight: 700, borderRadius: 3, minWidth: 120,
                                                            background: "#fff",
                                                            border: "2px solid #2196f3",
                                                            color: "#2196f3",
                                                            "&:hover": {
                                                                background: "#e3f2fd",
                                                                borderColor: "#1976d2",
                                                                color: "#1976d2"
                                                            },
                                                            "&:disabled": {
                                                                background: "#f5f5f5",
                                                                borderColor: "#bdbdbd",
                                                                color: "#bdbdbd"
                                                            }
                                                        }}
                                                    >
                                                        Đặt lại
                                                    </Button>
                                                    {/* Button cancel */}
                                                    <Button
                                                        variant="outlined"
                                                        size="large"
                                                        onClick={async () => await openConfirmDialog('cancel')}
                                                        disabled={loading}
                                                        sx={{
                                                            fontWeight: 700, borderRadius: 3, minWidth: 120,
                                                            background: "#fff",
                                                            border: "2px solid #757575",
                                                            color: "#757575",
                                                            "&:hover": {
                                                                background: "#f5f5f5",
                                                                borderColor: "#424242",
                                                                color: "#424242"
                                                            },
                                                            "&:disabled": {
                                                                background: "#f5f5f5",
                                                                borderColor: "#bdbdbd",
                                                                color: "#bdbdbd"
                                                            }
                                                        }}
                                                    >
                                                        Quay về trang
                                                    </Button>
                                                    {/* Button submit */}
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
                                                        sx={{
                                                            fontWeight: 800, fontSize: 18, px: 6, borderRadius: 3,
                                                            minWidth: 200, boxShadow: "0 2px 10px 0 #90caf9"
                                                        }}
                                                    >
                                                        {loading ? "Đang lưu..." :
                                                            validating ? "Đang kiểm tra..." :
                                                                success ? "Thành công!" : "Thêm nhân viên"}
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
            </Box>
        </DashboardLayout>
    );
}
export default AddNhanVienForm;