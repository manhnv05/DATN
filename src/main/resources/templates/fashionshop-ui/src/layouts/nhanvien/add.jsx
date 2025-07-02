import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Avatar from "@mui/material/Avatar";
import FormHelperText from "@mui/material/FormHelperText";
import UploadIcon from "@mui/icons-material/Upload";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import { styled } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Slide from "@mui/material/Slide";
import SafeAutocomplete from "./component/SafeAutocomplete";
import { toast } from "react-toastify";

const nhanVienAddAPI = "http://localhost:8080/nhanVien";
const roleListAPI = "http://localhost:8080/vaiTro/list";
const roleAddAPI = "http://localhost:8080/vaiTro";
const provinceAPI = "https://provinces.open-api.vn/api/?depth=1";
const districtAPI = (code) =>
    "https://provinces.open-api.vn/api/p/" + code + "?depth=2";
const wardAPI = (code) =>
    "https://provinces.open-api.vn/api/d/" + code + "?depth=2";

function arraySafe(array) {
    if (Array.isArray(array)) {
        return array;
    } else {
        return [];
    }
}

function findById(array, value, key) {
    if (!array || !value) return null;
    if (!key) key = "id";
    return array.find((item) => item && item[key] === value) || null;
}

const GENDER_OPTIONS = [
    { value: "Nam", label: "Nam" },
    { value: "Nữ", label: "Nữ" },
    { value: "Khác", label: "Khác" },
];

const STATUS_OPTIONS = [
    { value: 1, label: "Đang làm" },
    { value: 0, label: "Nghỉ" },
];

const POSITION_OPTIONS = [
    { value: "Nhân viên bán hàng", label: "Nhân viên bán hàng" },
    { value: "Quản lý", label: "Quản lý" },
    { value: "Kế toán", label: "Kế toán" },
    { value: "Thủ kho", label: "Thủ kho" },
    { value: "Thu ngân", label: "Thu ngân" },
];

// UI Styles
const labelStyle = {
    fontWeight: 600,
    color: "#1769aa",
    marginBottom: 4,
    fontSize: 15,
    display: "block",
    letterSpacing: "0.3px"
};

const GradientCard = styled(Card)(({ theme }) => ({
    borderRadius: 16,
    background: "#fff",
    boxShadow: "0 8px 32px 0 rgba(28, 72, 180, 0.09)",
    padding: theme.spacing(3),
    position: "relative",
    overflow: "visible",
    maxWidth: 950,
    width: "100%"
}));

const AvatarWrapper = styled(Box)(({ theme }) => ({
    position: "relative",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    gap: theme.spacing(1.5),
    width: "100%",
}));

const AvatarUploadButton = styled(Button)(({ theme }) => ({
    textTransform: "none",
    fontWeight: 700,
    borderRadius: 12,
    fontSize: 14,
    background: "#fff",
    color: "#1565c0",
    border: "1.5px solid #90caf9",
    boxShadow: "0 2px 8px #e3f0fa",
    marginTop: theme.spacing(0.5),
    "&:hover": {
        background: "#e3f0fa",
        borderColor: "#42a5f5",
        color: "#1769aa",
    },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 900,
    color: "#1769aa",
    fontSize: 26,
    letterSpacing: 1.3,
    textShadow: "0 2px 10px #e3f0fa, 0 1px 0 #fff",
}));

const SuccessBox = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing(1.5),
    marginTop: theme.spacing(1),
}));

function generateEmployeeCode() {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const randomNumber = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0");
    return "NV" + year + month + day + randomNumber;
}

function generatePassword() {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let index = 0; index < 10; index++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return password;
}

export default function AddNhanVienForm() {
    const [employee, setEmployee] = useState({
        hoVaTen: "",
        hinhAnh: "",
        gioiTinh: "",
        ngaySinh: "",
        soDienThoai: "",
        canCuocCongDan: "",
        email: "",
        tenTaiKhoan: "",
        vaiTro: null,
        chucVu: "",
        trangThai: 1,
        tinhThanhPho: "",
        quanHuyen: "",
        xaPhuong: "",
        maNhanVien: "",
        matKhau: "",
    });

    const [avatarPreview, setAvatarPreview] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [focusField, setFocusField] = useState("");
    const navigate = useNavigate();
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [provinceInput, setProvinceInput] = useState("");
    const [districtInput, setDistrictInput] = useState("");
    const [wardInput, setWardInput] = useState("");
    const [roleOptions, setRoleOptions] = useState([]);
    const [roleInput, setRoleInput] = useState("");
    const [openRoleDialog, setOpenRoleDialog] = useState(false);
    const [roleDialogMode, setRoleDialogMode] = useState("add");
    const [roleDialogValue, setRoleDialogValue] = useState({
        ten: "",
        moTaVaiTro: "",
        id: null,
    });
    const [roleDialogLoading, setRoleDialogLoading] = useState(false);

    function fetchRoles() {
        axios.get(roleListAPI).then(function (response) {
            setRoleOptions(arraySafe(response.data));
        });
    }

    useEffect(function () {
        setEmployee(function (previous) {
            return {
                ...previous,
                maNhanVien: generateEmployeeCode(),
                matKhau: generatePassword(),
            };
        });
    }, []);

    useEffect(function () {
        axios.get(provinceAPI).then(function (response) {
            setProvinces(arraySafe(response.data));
        });
    }, []);

    useEffect(function () {
        fetchRoles();
    }, []);

    useEffect(
        function () {
            if (employee.tinhThanhPho) {
                axios.get(districtAPI(employee.tinhThanhPho)).then(function (response) {
                    if (response.data && Array.isArray(response.data.districts)) {
                        setDistricts(response.data.districts);
                    } else {
                        setDistricts([]);
                    }
                });
            } else {
                setDistricts([]);
            }
            setEmployee(function (previous) {
                return {
                    ...previous,
                    quanHuyen: "",
                    xaPhuong: "",
                };
            });
            setDistrictInput("");
            setWardInput("");
            setWards([]);
        },
        [employee.tinhThanhPho]
    );

    useEffect(
        function () {
            if (employee.quanHuyen) {
                axios.get(wardAPI(employee.quanHuyen)).then(function (response) {
                    if (response.data && Array.isArray(response.data.wards)) {
                        setWards(response.data.wards);
                    } else {
                        setWards([]);
                    }
                });
            } else {
                setWards([]);
            }
            setEmployee(function (previous) {
                return {
                    ...previous,
                    xaPhuong: "",
                };
            });
            setWardInput("");
        },
        [employee.quanHuyen]
    );

    function handleEmployeeChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        setEmployee(function (previous) {
            return {
                ...previous,
                [name]: value,
            };
        });
        setErrors(function (previous) {
            return {
                ...previous,
                [name]: undefined,
            };
        });
    }

    function handleAvatarChange(event) {
        const file = event.target.files[0];
        if (file) {
            setEmployee(function (previous) {
                return {
                    ...previous,
                    hinhAnh: file.name,
                };
            });
            setAvatarPreview(URL.createObjectURL(file));
        }
    }

    function validate() {
        let error = {};
        if (!employee.hoVaTen) {
            error.hoVaTen = "Vui lòng nhập họ tên";
        }
        if (!employee.gioiTinh) {
            error.gioiTinh = "Vui lòng chọn giới tính";
        }
        if (!employee.vaiTro || !employee.vaiTro.id) {
            error.vaiTro = "Vui lòng chọn vai trò";
        }
        if (!employee.chucVu) {
            error.chucVu = "Vui lòng chọn chức vụ";
        }
        if (!employee.soDienThoai) {
            error.soDienThoai = "Vui lòng nhập số điện thoại";
        }
        if (!provinceInput && !employee.tinhThanhPho) {
            error.tinhThanhPho = "Vui lòng chọn hoặc nhập tỉnh/thành phố";
        }
        if (!districtInput && !employee.quanHuyen) {
            error.quanHuyen = "Vui lòng chọn hoặc nhập quận/huyện";
        }
        if (!wardInput && !employee.xaPhuong) {
            error.xaPhuong = "Vui lòng chọn hoặc nhập phường/xã";
        }
        if (!employee.trangThai && employee.trangThai !== 0) {
            error.trangThai = "Vui lòng chọn trạng thái";
        }
        return error;
    }

    function handleCCCDScan() {
        setEmployee(function (previous) {
            return {
                ...previous,
                canCuocCongDan: "001234567890",
                hoVaTen: previous.hoVaTen || "Nguyễn Văn Demo",
            };
        });
        setErrors(function (previous) {
            return {
                ...previous,
                canCuocCongDan: undefined,
                hoVaTen: undefined,
            };
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const error = validate();
        if (Object.keys(error).length) {
            setErrors(error);
            setFocusField(Object.keys(error)[0]);
            return;
        }
        setLoading(true);
        setSuccess(false);
        try {
            const maNhanVien = generateEmployeeCode();
            const matKhau = generatePassword();
            let diaChi = "";
            let xa = "";
            let huyen = "";
            let tinh = "";
            if (wards.length > 0 && employee.xaPhuong) {
                const foundWard = wards.find((w) => w.code === employee.xaPhuong);
                xa = foundWard && foundWard.name ? foundWard.name : employee.xaPhuong;
            } else {
                xa = employee.xaPhuong;
            }
            if (districts.length > 0 && employee.quanHuyen) {
                const foundDistrict = districts.find((d) => d.code === employee.quanHuyen);
                huyen = foundDistrict && foundDistrict.name ? foundDistrict.name : employee.quanHuyen;
            } else {
                huyen = employee.quanHuyen;
            }
            if (provinces.length > 0 && employee.tinhThanhPho) {
                const foundProvince = provinces.find((p) => p.code === employee.tinhThanhPho);
                tinh = foundProvince && foundProvince.name ? foundProvince.name : employee.tinhThanhPho;
            } else {
                tinh = employee.tinhThanhPho;
            }
            diaChi = [xa, huyen, tinh].filter(Boolean).join(", ");
            const data = {
                hoVaTen: employee.hoVaTen,
                hinhAnh: employee.hinhAnh,
                gioiTinh: employee.gioiTinh,
                ngaySinh: employee.ngaySinh,
                soDienThoai: employee.soDienThoai,
                canCuocCongDan: employee.canCuocCongDan,
                email: employee.email,
                tenTaiKhoan: employee.tenTaiKhoan,
                idVaiTro: employee.vaiTro && employee.vaiTro.id ? employee.vaiTro.id : null,
                chucVu: employee.chucVu,
                trangThai: employee.trangThai,
                maNhanVien: maNhanVien,
                matKhau: matKhau,
                xaPhuong: employee.xaPhuong,
                quanHuyen: employee.quanHuyen,
                tinhThanhPho: employee.tinhThanhPho,
                diaChi: diaChi,
            };
            await axios.post(nhanVienAddAPI, data);
            setSuccess(true);
            setTimeout(function () {
                setLoading(false);
                navigate(-1);
            }, 1200);
            toast.success("Thêm nhân viên thành công !")
        } catch {
            setLoading(false);
            setSuccess(false);
            alert("Đã có lỗi, vui lòng thử lại!");
        }
    }

    function handleOpenRoleDialog(mode, value) {
        setRoleDialogMode(mode);
        if (mode === "edit" && value) {
            setRoleDialogValue({ ten: value.ten, moTaVaiTro: value.moTaVaiTro, id: value.id });
        } else {
            setRoleDialogValue({ ten: roleInput, moTaVaiTro: "", id: null });
        }
        setOpenRoleDialog(true);
    }

    function handleCloseRoleDialog() {
        setOpenRoleDialog(false);
        setRoleDialogLoading(false);
        setRoleDialogValue({ ten: "", moTaVaiTro: "", id: null });
    }

    async function handleSaveRole() {
        setRoleDialogLoading(true);
        try {
            if (roleDialogMode === "add") {
                await axios.post(roleAddAPI, {
                    ten: roleDialogValue.ten,
                    moTaVaiTro: roleDialogValue.moTaVaiTro,
                });
                fetchRoles();
                toast.success("Thêm vai trò thành công !")
                setTimeout(function () {
                    setEmployee(function (previous) {
                        const newRole = roleOptions.find(function (role) {
                            return role.ten.toLowerCase() === roleDialogValue.ten.toLowerCase();
                        });
                        return { ...previous, vaiTro: newRole || { ten: roleDialogValue.ten } };
                    });
                    setRoleInput(roleDialogValue.ten);
                }, 600);
            } else if (roleDialogMode === "edit" && roleDialogValue.id) {
                await axios.put(roleAddAPI + "/" + roleDialogValue.id, {
                    ten: roleDialogValue.ten,
                    moTaVaiTro: roleDialogValue.moTaVaiTro,
                });
                fetchRoles();
                setTimeout(function () {
                    setEmployee(function (previous) {
                        if (previous.vaiTro && previous.vaiTro.id === roleDialogValue.id) {
                            const newRole = roleOptions.find(function (role) {
                                return role.id === roleDialogValue.id;
                            });
                            return { ...previous, vaiTro: newRole || { ...previous.vaiTro, ...roleDialogValue } };
                        }
                        return previous;
                    });
                }, 600);
            }
            handleCloseRoleDialog();
        } catch {
            setRoleDialogLoading(false);
            toast.warning("Có lỗi khi thêm hoặc sửa vai trò.");
        }
    }

    function getFieldSx(name) {
        if (focusField === name) {
            return {
                bgcolor: "#e3f0fa",
                borderRadius: 2,
                boxShadow: "0 0 0 3px #90caf9",
                transition: "all 0.3s",
            };
        } else {
            return {
                bgcolor: "#fafdff",
                borderRadius: 2,
                transition: "all 0.3s",
            };
        }
    }

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Box
                sx={{
                    minHeight: "100vh",
                    background: "linear-gradient(130deg,#f2f9fe 70%,#e9f0fa 100%)",
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    py: 4,
                }}
            >
                <Fade in timeout={600}>
                    <GradientCard>
                        <SectionTitle align="center" mb={1}>
                            Thêm Nhân Viên Mới
                        </SectionTitle>
                        <Paper
                            elevation={0}
                            sx={{
                                background: "linear-gradient(130deg,#f2f9fe 70%,#e9f0fa 100%)",
                                mb: 2,
                                p: 2,
                                borderRadius: 3,
                                textAlign: "center"
                            }}
                        >
                            <Typography variant="subtitle1" color="#1769aa" fontWeight={600}>
                                <span style={{ color: "#43a047" }}>Nhanh chóng - Chính xác - Thẩm mỹ!</span>
                                <br />
                                Vui lòng nhập đầy đủ thông tin nhân viên để quản lý hiệu quả và bảo mật tối ưu.
                            </Typography>
                        </Paper>
                        <form onSubmit={handleSubmit} autoComplete="off">
                            <Grid container spacing={3}>
                                {/* Left - Avatar & CCCD */}
                                <Grid item xs={12} md={4}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            gap: 2,
                                            height: "100%",
                                            background: "#f6fafd",
                                            borderRadius: 3,
                                            p: 2
                                        }}
                                    >
                                        <AvatarWrapper>
                                            <Tooltip title={avatarPreview ? "Đổi ảnh đại diện" : "Chọn ảnh đại diện"} arrow>
                                                <Avatar
                                                    src={avatarPreview || "/default-avatar.png"}
                                                    alt="avatar"
                                                    sx={{
                                                        width: 110,
                                                        height: 110,
                                                        mb: 1,
                                                        border: "3px solid #42a5f5",
                                                        boxShadow: "0 3px 12px #e3f0fa",
                                                        fontSize: 38,
                                                        bgcolor: "#fafdff",
                                                        color: "#1976d2",
                                                        cursor: "pointer",
                                                        transition: "all 0.3s"
                                                    }}
                                                    onClick={() => document.getElementById("hinhAnh-upload-nv").click()}
                                                >
                                                    {employee.hoVaTen && typeof employee.hoVaTen === "string" && employee.hoVaTen
                                                        ? employee.hoVaTen[0].toUpperCase()
                                                        : "A"}
                                                </Avatar>
                                            </Tooltip>
                                            <label htmlFor="hinhAnh-upload-nv">
                                                <input
                                                    type="file"
                                                    id="hinhAnh-upload-nv"
                                                    name="hinhAnh"
                                                    accept="image/*"
                                                    style={{ display: "none" }}
                                                    onChange={handleAvatarChange}
                                                />
                                                <AvatarUploadButton
                                                    variant="outlined"
                                                    component="span"
                                                    startIcon={<UploadIcon />}
                                                >
                                                    Ảnh đại diện
                                                </AvatarUploadButton>
                                            </label>
                                            <FormHelperText sx={{ color: "error.main" }}>
                                                {errors.hinhAnh}
                                            </FormHelperText>
                                        </AvatarWrapper>
                                        <Divider sx={{ width: "100%", my: 1, opacity: 0.13 }} />
                                        <Box sx={{ width: "100%" }}>
                                            <label style={labelStyle}>Căn cước công dân</label>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <TextField
                                                    name="canCuocCongDan"
                                                    value={employee.canCuocCongDan}
                                                    onChange={handleEmployeeChange}
                                                    fullWidth
                                                    size="small"
                                                    sx={getFieldSx("canCuocCongDan")}
                                                    placeholder="VD: 0123456789"
                                                    onFocus={() => setFocusField("canCuocCongDan")}
                                                    onBlur={() => setFocusField("")}
                                                />
                                                <Tooltip title="Quét CCCD (Auto-fill demo)">
                                                    <Button
                                                        variant="contained"
                                                        size="medium"
                                                        color="info"
                                                        startIcon={<CameraAltIcon />}
                                                        sx={{
                                                            fontWeight: 600,
                                                            borderRadius: 2,
                                                            minWidth: 0,
                                                            px: 2,
                                                            boxShadow: "0 2px 8px #90caf9",
                                                            background: "#1976d2",
                                                            color: "#fff",
                                                            "&:hover": { background: "#125ea2" }
                                                        }}
                                                        onClick={handleCCCDScan}
                                                    >
                                                        Quét
                                                    </Button>
                                                </Tooltip>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Grid>
                                {/* Right - Form */}
                                <Grid item xs={12} md={8}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <label style={labelStyle}>Họ và tên</label>
                                            <TextField
                                                name="hoVaTen"
                                                value={employee.hoVaTen}
                                                onChange={handleEmployeeChange}
                                                error={Boolean(errors.hoVaTen)}
                                                helperText={errors.hoVaTen}
                                                fullWidth
                                                size="small"
                                                sx={getFieldSx("hoVaTen")}
                                                placeholder="VD: Nguyễn Văn A"
                                                autoFocus={focusField === "hoVaTen"}
                                                onFocus={() => setFocusField("hoVaTen")}
                                                onBlur={() => setFocusField("")}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <label style={labelStyle}>Số điện thoại</label>
                                            <TextField
                                                name="soDienThoai"
                                                value={employee.soDienThoai}
                                                onChange={handleEmployeeChange}
                                                error={Boolean(errors.soDienThoai)}
                                                helperText={errors.soDienThoai}
                                                fullWidth
                                                size="small"
                                                sx={getFieldSx("soDienThoai")}
                                                placeholder="VD: 0989999999"
                                                onFocus={() => setFocusField("soDienThoai")}
                                                onBlur={() => setFocusField("")}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <label style={labelStyle}>Email</label>
                                            <TextField
                                                name="email"
                                                value={employee.email}
                                                onChange={handleEmployeeChange}
                                                fullWidth
                                                size="small"
                                                sx={getFieldSx("email")}
                                                placeholder="VD: email@gmail.com"
                                                onFocus={() => setFocusField("email")}
                                                onBlur={() => setFocusField("")}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <label style={labelStyle}>Tên tài khoản</label>
                                            <TextField
                                                name="tenTaiKhoan"
                                                value={employee.tenTaiKhoan}
                                                onChange={handleEmployeeChange}
                                                fullWidth
                                                size="small"
                                                sx={getFieldSx("tenTaiKhoan")}
                                                placeholder="VD: nguyenvana"
                                                onFocus={() => setFocusField("tenTaiKhoan")}
                                                onBlur={() => setFocusField("")}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <label style={labelStyle}>Ngày sinh</label>
                                            <TextField
                                                type="date"
                                                name="ngaySinh"
                                                value={employee.ngaySinh}
                                                onChange={handleEmployeeChange}
                                                fullWidth
                                                size="small"
                                                sx={getFieldSx("ngaySinh")}
                                                InputLabelProps={{ shrink: true }}
                                                onFocus={() => setFocusField("ngaySinh")}
                                                onBlur={() => setFocusField("")}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <label style={labelStyle}>Giới tính</label>
                                            <FormControl
                                                fullWidth
                                                size="small"
                                                error={Boolean(errors.gioiTinh)}
                                                sx={getFieldSx("gioiTinh")}
                                            >
                                                <Select
                                                    name="gioiTinh"
                                                    value={employee.gioiTinh}
                                                    onChange={handleEmployeeChange}
                                                    displayEmpty
                                                    onFocus={() => setFocusField("gioiTinh")}
                                                    onBlur={() => setFocusField("")}
                                                >
                                                    <MenuItem value="">
                                                        <em>Chọn giới tính</em>
                                                    </MenuItem>
                                                    {GENDER_OPTIONS.map((gender) => (
                                                        <MenuItem key={gender.value} value={gender.value}>
                                                            {gender.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                <FormHelperText>{errors.gioiTinh}</FormHelperText>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <label style={labelStyle}>Trạng thái</label>
                                            <FormControl fullWidth size="small" sx={getFieldSx("trangThai")}>
                                                <Select
                                                    name="trangThai"
                                                    value={employee.trangThai}
                                                    onChange={handleEmployeeChange}
                                                    label="Trạng thái"
                                                    required
                                                    onFocus={() => setFocusField("trangThai")}
                                                    onBlur={() => setFocusField("")}
                                                >
                                                    {STATUS_OPTIONS.map((status) => (
                                                        <MenuItem value={status.value} key={status.value}>
                                                            {status.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <label style={labelStyle}>Vai trò</label>
                                            <FormControl
                                                fullWidth
                                                size="small"
                                                error={Boolean(errors.vaiTro)}
                                                sx={getFieldSx("vaiTro")}
                                            >
                                                <Select
                                                    name="vaiTro"
                                                    value={employee.vaiTro && employee.vaiTro.id ? employee.vaiTro.id : ""}
                                                    onChange={function (event) {
                                                        const selectedId = event.target.value;
                                                        const foundRole = roleOptions.find(function (role) {
                                                            return role.id === selectedId;
                                                        });
                                                        setEmployee(function (previous) {
                                                            return {
                                                                ...previous,
                                                                vaiTro: foundRole || null,
                                                            };
                                                        });
                                                        setRoleInput(foundRole ? foundRole.ten : "");
                                                        setErrors(function (previous) {
                                                            return {
                                                                ...previous,
                                                                vaiTro: undefined,
                                                            };
                                                        });
                                                    }}
                                                    displayEmpty
                                                    onFocus={() => setFocusField("vaiTro")}
                                                    onBlur={() => setFocusField("")}
                                                >
                                                    <MenuItem value="">
                                                        <em>Chọn vai trò</em>
                                                    </MenuItem>
                                                    {roleOptions.map((role) => (
                                                        <MenuItem value={role.id} key={role.id}>
                                                            {role.ten}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                <FormHelperText>{errors.vaiTro}</FormHelperText>
                                            </FormControl>
                                            <Tooltip title="Thêm vai trò mới">
                                                <IconButton
                                                    color="primary"
                                                    sx={{ marginLeft: 1 }}
                                                    onClick={() => handleOpenRoleDialog("add")}
                                                >
                                                    <AddCircleOutlineIcon fontSize="large" />
                                                </IconButton>
                                            </Tooltip>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <label style={labelStyle}>Chức vụ</label>
                                            <FormControl
                                                fullWidth
                                                size="small"
                                                error={Boolean(errors.chucVu)}
                                                sx={getFieldSx("chucVu")}
                                            >
                                                <Select
                                                    name="chucVu"
                                                    value={employee.chucVu}
                                                    onChange={handleEmployeeChange}
                                                    displayEmpty
                                                    onFocus={() => setFocusField("chucVu")}
                                                    onBlur={() => setFocusField("")}
                                                >
                                                    <MenuItem value="">
                                                        <em>Chọn chức vụ</em>
                                                    </MenuItem>
                                                    {POSITION_OPTIONS.map((pos) => (
                                                        <MenuItem value={pos.value} key={pos.value}>
                                                            {pos.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                <FormHelperText>{errors.chucVu}</FormHelperText>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <label style={labelStyle}>Tỉnh/Thành phố</label>
                                            <SafeAutocomplete
                                                freeSolo
                                                options={provinces}
                                                getOptionLabel={(option) =>
                                                    typeof option === "string"
                                                        ? option
                                                        : option && typeof option.name === "string"
                                                            ? option.name
                                                            : ""
                                                }
                                                value={
                                                    employee.tinhThanhPho
                                                        ? findById(provinces, employee.tinhThanhPho, "code")
                                                        : provinceInput
                                                            ? { name: provinceInput }
                                                            : null
                                                }
                                                inputValue={provinceInput}
                                                onInputChange={(_, newInputValue, reason) => {
                                                    setProvinceInput(newInputValue);
                                                    if (reason === "clear") {
                                                        setEmployee((previous) => ({
                                                            ...previous,
                                                            tinhThanhPho: "",
                                                        }));
                                                    }
                                                }}
                                                onChange={(_, newValue) => {
                                                    if (typeof newValue === "string") {
                                                        setProvinceInput(newValue);
                                                        setEmployee((previous) => ({
                                                            ...previous,
                                                            tinhThanhPho: "",
                                                        }));
                                                    } else if (newValue && newValue.code) {
                                                        setEmployee((previous) => ({
                                                            ...previous,
                                                            tinhThanhPho: newValue.code,
                                                        }));
                                                        setProvinceInput(newValue.name);
                                                    } else {
                                                        setProvinceInput("");
                                                        setEmployee((previous) => ({
                                                            ...previous,
                                                            tinhThanhPho: "",
                                                        }));
                                                    }
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        placeholder="Chọn hoặc nhập tỉnh/thành phố"
                                                        error={Boolean(errors.tinhThanhPho)}
                                                        helperText={errors.tinhThanhPho}
                                                        size="small"
                                                        sx={getFieldSx("tinhThanhPho")}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <label style={labelStyle}>Quận/Huyện</label>
                                            <SafeAutocomplete
                                                freeSolo
                                                options={districts}
                                                getOptionLabel={(option) =>
                                                    typeof option === "string"
                                                        ? option
                                                        : option && typeof option.name === "string"
                                                            ? option.name
                                                            : ""
                                                }
                                                value={
                                                    employee.quanHuyen
                                                        ? findById(districts, employee.quanHuyen, "code")
                                                        : districtInput
                                                            ? { name: districtInput }
                                                            : null
                                                }
                                                inputValue={districtInput}
                                                onInputChange={(_, newInputValue, reason) => {
                                                    setDistrictInput(newInputValue);
                                                    if (reason === "clear") {
                                                        setEmployee((previous) => ({
                                                            ...previous,
                                                            quanHuyen: "",
                                                        }));
                                                    }
                                                }}
                                                onChange={(_, newValue) => {
                                                    if (typeof newValue === "string") {
                                                        setDistrictInput(newValue);
                                                        setEmployee((previous) => ({
                                                            ...previous,
                                                            quanHuyen: "",
                                                        }));
                                                    } else if (newValue && newValue.code) {
                                                        setEmployee((previous) => ({
                                                            ...previous,
                                                            quanHuyen: newValue.code,
                                                        }));
                                                        setDistrictInput(newValue.name);
                                                    } else {
                                                        setDistrictInput("");
                                                        setEmployee((previous) => ({
                                                            ...previous,
                                                            quanHuyen: "",
                                                        }));
                                                    }
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        placeholder="Chọn hoặc nhập quận/huyện"
                                                        error={Boolean(errors.quanHuyen)}
                                                        helperText={errors.quanHuyen}
                                                        size="small"
                                                        sx={getFieldSx("quanHuyen")}
                                                    />
                                                )}
                                                disabled={!employee.tinhThanhPho && !provinceInput}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <label style={labelStyle}>Phường/Xã</label>
                                            <SafeAutocomplete
                                                freeSolo
                                                options={wards}
                                                getOptionLabel={(option) =>
                                                    typeof option === "string"
                                                        ? option
                                                        : option && typeof option.name === "string"
                                                            ? option.name
                                                            : ""
                                                }
                                                value={
                                                    employee.xaPhuong
                                                        ? findById(wards, employee.xaPhuong, "code")
                                                        : wardInput
                                                            ? { name: wardInput }
                                                            : null
                                                }
                                                inputValue={wardInput}
                                                onInputChange={(_, newInputValue, reason) => {
                                                    setWardInput(newInputValue);
                                                    if (reason === "clear") {
                                                        setEmployee((previous) => ({
                                                            ...previous,
                                                            xaPhuong: "",
                                                        }));
                                                    }
                                                }}
                                                onChange={(_, newValue) => {
                                                    if (typeof newValue === "string") {
                                                        setWardInput(newValue);
                                                        setEmployee((previous) => ({
                                                            ...previous,
                                                            xaPhuong: "",
                                                        }));
                                                    } else if (newValue && newValue.code) {
                                                        setEmployee((previous) => ({
                                                            ...previous,
                                                            xaPhuong: newValue.code,
                                                        }));
                                                        setWardInput(newValue.name);
                                                    } else {
                                                        setWardInput("");
                                                        setEmployee((previous) => ({
                                                            ...previous,
                                                            xaPhuong: "",
                                                        }));
                                                    }
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        placeholder="Chọn hoặc nhập phường/xã"
                                                        error={Boolean(errors.xaPhuong)}
                                                        helperText={errors.xaPhuong}
                                                        size="small"
                                                        sx={getFieldSx("xaPhuong")}
                                                    />
                                                )}
                                                disabled={
                                                    (!employee.tinhThanhPho && !provinceInput) ||
                                                    (!employee.quanHuyen && !districtInput)
                                                }
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Divider sx={{ mb: 2, mt: 3, background: "#1976d2", opacity: 0.2 }} />
                                    <Box
                                        display="flex"
                                        justifyContent="center"
                                        mt={2}
                                        gap={2}
                                        sx={{ px: { xs: 0, sm: 4 } }}
                                    >
                                        <Button
                                            variant="outlined"
                                            color="inherit"
                                            size="large"
                                            onClick={() => navigate(-1)}
                                            sx={{
                                                fontWeight: 700,
                                                borderRadius: 3,
                                                minWidth: 120,
                                                background: "#fafdff",
                                                border: "2px solid #b0bec5",
                                                "&:hover": {
                                                    background: "#eceff1",
                                                    borderColor: "#90caf9",
                                                },
                                            }}
                                            disabled={loading}
                                        >
                                            Hủy bỏ
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color={success ? "success" : "info"}
                                            size="large"
                                            type="submit"
                                            sx={{
                                                fontWeight: 800,
                                                fontSize: 18,
                                                px: 8,
                                                borderRadius: 3,
                                                minWidth: 200,
                                                boxShadow: "0 2px 10px 0 #90caf9",
                                                transition: "all 0.3s",
                                            }}
                                            disabled={loading}
                                            startIcon={
                                                loading ? (
                                                    <CircularProgress color="inherit" size={22} />
                                                ) : success ? (
                                                    <CheckCircleIcon fontSize="large" />
                                                ) : undefined
                                            }
                                        >
                                            {loading
                                                ? "Đang lưu..."
                                                : success
                                                    ? "Thành công!"
                                                    : "Thêm nhân viên"}
                                        </Button>
                                    </Box>
                                    <Slide direction="up" in={success} mountOnEnter unmountOnExit timeout={420}>
                                        <SuccessBox>
                                            <CheckCircleIcon color="success" fontSize="large" />
                                            <Typography color="success.main" fontWeight={700} fontSize={18}>
                                                Thêm nhân viên thành công!
                                            </Typography>
                                        </SuccessBox>
                                    </Slide>
                                </Grid>
                            </Grid>
                        </form>
                        <Dialog open={openRoleDialog} onClose={handleCloseRoleDialog} maxWidth="xs" fullWidth>
                            <DialogTitle sx={{ fontWeight: 700, color: "#1769aa" }}>
                                {roleDialogMode === "add" ? "Thêm vai trò mới" : "Cập nhật vai trò"}
                            </DialogTitle>
                            <DialogContent>
                                <Box display="flex" flexDirection="column" gap={2} py={1}>
                                    <TextField
                                        label="Tên vai trò"
                                        value={roleDialogValue.ten}
                                        onChange={(event) =>
                                            setRoleDialogValue((previous) => ({
                                                ...previous,
                                                ten: event.target.value,
                                            }))
                                        }
                                        fullWidth
                                        size="small"
                                    />
                                    <TextField
                                        label="Mô tả vai trò"
                                        value={roleDialogValue.moTaVaiTro}
                                        onChange={(event) =>
                                            setRoleDialogValue((previous) => ({
                                                ...previous,
                                                moTaVaiTro: event.target.value,
                                            }))
                                        }
                                        fullWidth
                                        size="small"
                                        multiline
                                        minRows={2}
                                    />
                                </Box>
                            </DialogContent>
                            <DialogActions sx={{ px: 3, pb: 2 }}>
                                <Button
                                    onClick={handleCloseRoleDialog}
                                    color="inherit"
                                    variant="outlined"
                                    sx={{ borderRadius: 2, fontWeight: 600 }}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    onClick={handleSaveRole}
                                    color="info"
                                    variant="contained"
                                    sx={{ borderRadius: 2, fontWeight: 700, minWidth: 120 }}
                                    disabled={roleDialogLoading || !roleDialogValue.ten}
                                    startIcon={
                                        roleDialogLoading ? <CircularProgress size={18} color="inherit" /> : null
                                    }
                                >
                                    {roleDialogMode === "add" ? "Thêm mới" : "Cập nhật"}
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </GradientCard>
                </Fade>
            </Box>
        </DashboardLayout>
    );
}