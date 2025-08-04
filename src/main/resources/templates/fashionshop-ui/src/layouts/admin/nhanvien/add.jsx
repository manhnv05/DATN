import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Avatar from "@mui/material/Avatar";
import UploadIcon from "@mui/icons-material/Upload";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CircularProgress from "@mui/material/CircularProgress";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import { styled } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SafeAutocomplete from "./component/SafeAutocomplete";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CCCDCameraModal from "./modalQuetCCCD";
import { handleCameraCapture, parseCCCDText } from "./component/handleCameraCapture";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from "@mui/material/FormLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const nhanVienAddAPI = "http://localhost:8080/nhanVien";
const roleListAPI = "http://localhost:8080/vaiTro/list";
const provinceAPI = "http://localhost:8080/api/vietnamlabs/province";

const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: 20,
    background: "linear-gradient(135deg, #ffffff 0%, #f8faff 100%)",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)",
    padding: theme.spacing(4),
    position: "relative",
    overflow: "visible",
    width: "100%",
    margin: "0 auto",
    border: "0px solid rgba(23, 105, 170, 0.1)",
    height: "100%",
    [theme.breakpoints.up('md')]: {
        maxWidth: "100%",
    },
    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(2),
    },
}));

const ProfileSection = styled(Box)(({ theme }) => ({
    background: "linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)",
    borderRadius: 16,
    padding: theme.spacing(3),
    textAlign: "center",
    position: "relative",
    "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "linear-gradient(45deg, rgba(23, 105, 170, 0.05) 0%, rgba(156, 39, 176, 0.05) 100%)",
        borderRadius: 16,
        zIndex: 0,
    },
}));

const InfoCard = styled(Paper)(({ theme }) => ({
    background: "linear-gradient(135deg, #ffffff 0%, #fafbff 100%)",
    borderRadius: 12,
    padding: theme.spacing(2.5),
    border: "1px solid rgba(23, 105, 170, 0.08)",
    transition: "all 0.3s ease",
    marginBottom: theme.spacing(3),
    "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 8px 25px rgba(23, 105, 170, 0.15)",
    },
}));

const labelStyle = {
    fontWeight: 600,
    color: "#1769aa",
    marginBottom: 4,
    fontSize: 15,
    display: "block",
    letterSpacing: "0.3px"
};

const GENDER_OPTIONS = [
    { value: "Nam", label: "Nam" },
    { value: "Nữ", label: "Nữ" },
    { value: "Khác", label: "Khác" }
];

function arraySafe(array) {
    return Array.isArray(array) ? array : [];
}

function findById(array, value, key) {
    if (!array || !value) return null;
    if (!key) key = "id";
    return array.find((item) => item && item[key] === value) || null;
}

function generateEmployeeCode() {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const randomNumber = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
    return "NV" + year + month + day + randomNumber;
}

function generatePassword() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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
        idVaiTro: "",
        trangThai: 1,
        tinhThanhPho: "",
        xaPhuong: "",
        maNhanVien: "",
        matKhau: "",
        diaChi: ""
    });

    const [avatarPreview, setAvatarPreview] = useState("");
    const [avatarFile, setAvatarFile] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [focusField, setFocusField] = useState("");
    const navigate = useNavigate();
    const [provinces, setProvinces] = useState([]);
    const [wards, setWards] = useState([]);
    const [provinceInput, setProvinceInput] = useState("");
    const [wardInput, setWardInput] = useState("");
    const [roleOptions, setRoleOptions] = useState([]);
    const [roleInput, setRoleInput] = useState("");
    const [openCamera, setOpenCamera] = useState(false);

    useEffect(() => {
        setEmployee(prev => ({
            ...prev,
            maNhanVien: generateEmployeeCode(),
            matKhau: generatePassword(),
            trangThai: 1
        }));
    }, []);

    useEffect(() => {
        axios.get(provinceAPI).then((response) => {
            setProvinces(arraySafe(response.data?.data));
        });
        axios.get(roleListAPI).then((res) => {
            setRoleOptions(arraySafe(res.data));
        });
    }, []);

    useEffect(() => {
        if (employee.tinhThanhPho) {
            const foundProvince = provinces.find((item) => item.id === employee.tinhThanhPho);
            if (foundProvince && Array.isArray(foundProvince.wards)) {
                setWards(foundProvince.wards);
            } else {
                setWards([]);
            }
        } else {
            setWards([]);
        }
        setWardInput("");
    }, [employee.tinhThanhPho, provinces]);

    function handleEmployeeChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        setEmployee(prev => ({
            ...prev,
            [name]: value
        }));
        setErrors(prev => ({
            ...prev,
            [name]: undefined
        }));
    }

    function handleVaiTroChange(event) {
        setEmployee(prev => ({
            ...prev,
            idVaiTro: event.target.value
        }));
        setRoleInput("");
        setErrors(prev => ({
            ...prev,
            idVaiTro: undefined
        }));
    }

    function handleAvatarChange(event) {
        const file = event.target.files[0];
        if (file) {
            setAvatarFile(file);
            setEmployee(prev => ({
                ...prev,
                hinhAnh: file.name
            }));
            setAvatarPreview(URL.createObjectURL(file));
        }
    }

    function validate() {
        let error = {};
        const vnf_phone = /^(0[3|5|7|8|9])[0-9]{8}$/;
        const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const cccd_regex = /^[0-9]{12}$/;
        if (!employee.canCuocCongDan) {
            error.canCuocCongDan = "Vui lòng nhập mã CCCD";
            return error;
        }
        if (!cccd_regex.test(employee.canCuocCongDan)) {
            error.canCuocCongDan = "Căn cước công dân phải gồm 12 chữ số";
            return error;
        }
        if (!employee.hoVaTen) {
            error.hoVaTen = "Vui lòng nhập họ tên";
            return error;
        }
        if (!employee.soDienThoai) {
            error.soDienThoai = "Vui lòng nhập số điện thoại";
            return error;
        }
        if (!vnf_phone.test(employee.soDienThoai)) {
            error.soDienThoai = "Số điện thoại không đúng định dạng";
            return error;
        }
        if (!employee.email) {
            error.email = "Vui lòng nhập email";
            return error;
        }
        if (!email_regex.test(employee.email)) {
            error.email = "Email không đúng định dạng";
            return error;
        }
        if (!employee.ngaySinh) {
            error.ngaySinh = "Vui lòng chọn ngày Sinh ";
            return error;
        }
        if (!employee.gioiTinh) {
            error.gioiTinh = "Vui lòng chọn giới tính";
            return error;
        }
        if (!employee.idVaiTro) {
            error.idVaiTro = "Vui lòng chọn vai trò";
            return error;
        }
        if (!provinceInput && !employee.tinhThanhPho) {
            error.tinhThanhPho = "Vui lòng chọn hoặc nhập tỉnh/thành phố";
            return error;
        }
        if (!wardInput && !employee.xaPhuong) {
            error.xaPhuong = "Vui lòng chọn hoặc nhập phường/xã";
            return error;
        }
        return error;
    }

    function handleCCCDScan() {
        setOpenCamera(true);
    }

    async function handleCCCDResult(img) {
        try {
            const data = await handleCameraCapture(img);
            let info = Array.isArray(data) ? parseCCCDText(data) : data;
            let updateObj = {
                hinhAnh: typeof img === "string" ? img : "",
                canCuocCongDan: info.canCuocCongDan || "",
                hoVaTen: info.hoVaTen || "",
                ngaySinh: info.ngaySinh || "",
                gioiTinh: info.gioiTinh || "",
                diaChi: info.queQuan || info.diaChi || ""
            };
            if (info.tinh) {
                const foundProvince = provinces.find(
                    (item) =>
                        (item.province && item.province.toLowerCase() === info.tinh.toLowerCase())
                );
                if (foundProvince) {
                    updateObj.tinhThanhPho = foundProvince.id;
                    setProvinceInput(foundProvince.province);
                    if (info.xa && Array.isArray(foundProvince.wards)) {
                        const foundWard = foundProvince.wards.find(
                            (ward) => ward.name && ward.name.toLowerCase() === info.xa.toLowerCase()
                        );
                        if (foundWard) {
                            updateObj.xaPhuong = foundWard.name;
                            setWardInput(foundWard.name);
                        }
                    }
                }
            }
            setEmployee(prev => ({
                ...prev,
                ...updateObj
            }));
        } catch (err) {}
        setOpenCamera(false);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const error = validate();
        if (Object.keys(error).length) {
            setErrors(error);
            setFocusField(Object.keys(error)[0]);
            Object.values(error).forEach((msg) => {
                toast.error(msg);
            });
            return;
        }
        setLoading(true);
        setSuccess(false);
        try {
            let xa = "";
            let tinh = "";
            if (wards.length > 0 && employee.xaPhuong) {
                const foundWard = wards.find((w) => w.name === employee.xaPhuong);
                xa = foundWard && foundWard.name ? foundWard.name : employee.xaPhuong;
            } else {
                xa = employee.xaPhuong;
            }
            if (provinces.length > 0 && employee.tinhThanhPho) {
                const foundProvince = provinces.find(
                    (p) => p.id === employee.tinhThanhPho
                );
                tinh = foundProvince && foundProvince.province
                    ? foundProvince.province
                    : employee.tinhThanhPho;
            } else {
                tinh = employee.tinhThanhPho;
            }
            const diaChi = [xa, tinh].filter(Boolean).join(", ");

            // Chuẩn bị formData để gửi file ảnh nếu có
            const formData = new FormData();
            const payload = {
                hoVaTen: employee.hoVaTen,
                gioiTinh: employee.gioiTinh,
                ngaySinh: employee.ngaySinh,
                soDienThoai: employee.soDienThoai,
                canCuocCongDan: employee.canCuocCongDan,
                email: employee.email,
                idVaiTro: employee.idVaiTro,
                trangThai: 1,
                maNhanVien: employee.maNhanVien,
                matKhau: employee.matKhau,
                xaPhuong: employee.xaPhuong,
                tinhThanhPho: employee.tinhThanhPho,
                diaChi: diaChi
            };
            // Sử dụng Blob để truyền vO dạng JSON đúng chuẩn multipart
            formData.append("vO", new Blob([JSON.stringify(payload)], { type: "application/json" }));
            if (avatarFile) {
                formData.append("imageFile", avatarFile);
            }

            // Không set Content-Type, để axios tự động set boundary
            await axios.post(nhanVienAddAPI, formData);

            setSuccess(true);
            toast.success("Thêm nhân viên thành công!");
            setTimeout(function () {
                setLoading(false);
                navigate(-1);
            }, 1200);
        } catch (err) {
            setLoading(false);
            setSuccess(false);
            toast.error("Đã có lỗi, vui lòng thử lại!");
            console.error("Lỗi khi thêm nhân viên:", err);
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
                    py: 4
                }}
            >
                <ToastContainer />
                <Fade in timeout={600}>
                    <StyledCard>
                        <Typography
                            variant="h4"
                            sx={{ fontWeight: 800, color: "#1769aa", textAlign: "center", mb: 3 }}
                        >
                            Thêm Nhân Viên Mới
                        </Typography>
                        <form onSubmit={handleSubmit} autoComplete="off">
                            <Grid container spacing={4}>
                                {/* Avatar + vai trò + trạng thái + quét CCCD */}
                                <Grid item xs={12} md={4}>
                                    <ProfileSection>
                                        <Avatar
                                            src={avatarPreview || "/default-avatar.png"}
                                            alt={employee.hoVaTen || "Nhân viên"}
                                            sx={{
                                                width: 180, height: 180,
                                                mx: "auto", mb: 2, border: "4px solid white",
                                                boxShadow: "0 8px 25px rgba(0,0,0,0.15)", fontSize: "3rem", backgroundColor: "#1769aa",
                                            }}
                                        >
                                            {employee.hoVaTen ? employee.hoVaTen.charAt(0).toUpperCase() : "N"}
                                        </Avatar>
                                        <Box>
                                            <Button
                                                variant="contained"
                                                component="label"
                                                startIcon={<UploadIcon />}
                                                sx={{ mt: 2, borderRadius: 2, fontWeight: 600, px: 3 }}
                                            >
                                                Đổi ảnh
                                                <input
                                                    type="file"
                                                    hidden
                                                    accept="image/*"
                                                    onChange={handleAvatarChange}
                                                />
                                            </Button>
                                        </Box>
                                        <Divider sx={{ my: 2, opacity: 0.3 }} />
                                        <Box sx={{ width: "100%" }}>
                                            <label
                                                htmlFor="canCuocCongDan"
                                                style={{
                                                    fontWeight: 600,
                                                    color: "#1769aa",
                                                    marginBottom: 4,
                                                    fontSize: 15,
                                                    display: "block",
                                                    letterSpacing: "0.3px"
                                                }}
                                            >
                                                Căn cước công dân
                                            </label>
                                            <TextField
                                                id="canCuocCongDan"
                                                name="canCuocCongDan"
                                                value={employee.canCuocCongDan}
                                                onChange={handleEmployeeChange}
                                                fullWidth
                                                size="small"
                                                sx={{ mb: 2 }}
                                            />
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
                                                    "&:hover": { background: "#125ea2" },
                                                    width: "100%",
                                                    mt: 1
                                                }}
                                                onClick={handleCCCDScan}
                                            >
                                                Quét CCCD
                                            </Button>
                                            <CCCDCameraModal
                                                open={openCamera}
                                                onClose={() => setOpenCamera(false)}
                                                onCapture={handleCCCDResult}
                                            />
                                        </Box>
                                        <Box sx={{ display: "flex", gap: 1, justifyContent: "center", mt: 2 }}>
                                            <FormControl component="fieldset">
                                                <FormLabel component="legend" sx={{ color: "#1769aa", fontWeight: 700, mb: 1 }}>Giới tính</FormLabel>
                                                <RadioGroup row name="gioiTinh" value={employee.gioiTinh} onChange={handleEmployeeChange}>
                                                    {GENDER_OPTIONS.map((gender) => (
                                                        <FormControlLabel
                                                            key={gender.value}
                                                            value={gender.value}
                                                            control={<Radio />}
                                                            label={gender.label}
                                                        />
                                                    ))}
                                                </RadioGroup>
                                            </FormControl>
                                        </Box>
                                        <FormControl fullWidth sx={{ mt: 2 }}>
                                            <FormLabel sx={labelStyle}>Vai trò</FormLabel>
                                            <Select
                                                name="idVaiTro"
                                                value={employee.idVaiTro}
                                                onChange={handleVaiTroChange}
                                                displayEmpty
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
                                        </FormControl>
                                    </ProfileSection>
                                </Grid>
                                {/* Các trường thông tin */}
                                <Grid item xs={12} md={8}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <InfoCard>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontWeight: 700, color: "#1769aa", mb: 3,
                                                        display: "flex", alignItems: "center", gap: 1,
                                                    }}
                                                >
                                                    <PersonIcon />
                                                    Thông Tin Cá Nhân
                                                </Typography>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} sm={6}>
                                                        <label>Họ và tên</label>
                                                        <TextField
                                                            name="hoVaTen"
                                                            value={employee.hoVaTen}
                                                            onChange={handleEmployeeChange}
                                                            fullWidth
                                                            size="small"
                                                            sx={{ mb: 2 }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <label>Mã nhân viên</label>
                                                        <TextField
                                                            name="maNhanVien"
                                                            value={employee.maNhanVien}
                                                            onChange={handleEmployeeChange}
                                                            fullWidth
                                                            size="small"
                                                            sx={{ mb: 2 }}
                                                            disabled
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <label>Ngày sinh</label>
                                                        <TextField
                                                            name="ngaySinh"
                                                            type="date"
                                                            value={employee.ngaySinh}
                                                            onChange={handleEmployeeChange}
                                                            fullWidth
                                                            size="small"
                                                            sx={{ mb: 2 }}
                                                            InputLabelProps={{ shrink: true }}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </InfoCard>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <InfoCard>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontWeight: 700, color: "#1769aa", mb: 3,
                                                        display: "flex", alignItems: "center", gap: 1,
                                                    }}
                                                >
                                                    <EmailIcon />
                                                    Thông Tin Liên Hệ
                                                </Typography>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} sm={6}>
                                                        <label>Email</label>
                                                        <TextField
                                                            name="email"
                                                            value={employee.email}
                                                            onChange={handleEmployeeChange}
                                                            fullWidth
                                                            size="small"
                                                            sx={{ mb: 2 }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <label>Số điện thoại</label>
                                                        <TextField
                                                            name="soDienThoai"
                                                            value={employee.soDienThoai}
                                                            onChange={handleEmployeeChange}
                                                            fullWidth
                                                            size="small"
                                                            sx={{ mb: 2 }}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </InfoCard>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <InfoCard>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontWeight: 700, color: "#1769aa", mb: 3,
                                                        display: "flex", alignItems: "center", gap: 1,
                                                    }}
                                                >
                                                    <LocationOnIcon />
                                                    Thông Tin Địa Chỉ
                                                </Typography>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} sm={6}>
                                                        <label>Tỉnh/Thành phố</label>
                                                        <SafeAutocomplete
                                                            freeSolo
                                                            options={provinces}
                                                            getOptionLabel={(option) =>
                                                                typeof option === "string"
                                                                    ? option
                                                                    : option && typeof option.province === "string"
                                                                        ? option.province
                                                                        : ""
                                                            }
                                                            value={
                                                                employee.tinhThanhPho
                                                                    ? findById(provinces, employee.tinhThanhPho, "id")
                                                                    : provinceInput
                                                                        ? { province: provinceInput }
                                                                        : null
                                                            }
                                                            inputValue={provinceInput}
                                                            onInputChange={(_, newInputValue, reason) => {
                                                                setProvinceInput(newInputValue);
                                                                if (reason === "clear") {
                                                                    setEmployee((previous) => ({
                                                                        ...previous,
                                                                        tinhThanhPho: "",
                                                                        xaPhuong: ""
                                                                    }));
                                                                }
                                                            }}
                                                            onChange={(_, newValue) => {
                                                                if (typeof newValue === "string") {
                                                                    setProvinceInput(newValue);
                                                                    setEmployee((previous) => ({
                                                                        ...previous,
                                                                        tinhThanhPho: "",
                                                                        xaPhuong: ""
                                                                    }));
                                                                } else if (newValue && newValue.id) {
                                                                    setEmployee((previous) => ({
                                                                        ...previous,
                                                                        tinhThanhPho: newValue.id,
                                                                        xaPhuong: ""
                                                                    }));
                                                                    setProvinceInput(newValue.province);
                                                                } else {
                                                                    setProvinceInput("");
                                                                    setEmployee((previous) => ({
                                                                        ...previous,
                                                                        tinhThanhPho: "",
                                                                        xaPhuong: ""
                                                                    }));
                                                                }
                                                            }}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    size="small"
                                                                    sx={{ mb: 2 }}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <label>Phường/Xã</label>
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
                                                                    ? findById(wards, employee.xaPhuong, "name")
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
                                                                        xaPhuong: ""
                                                                    }));
                                                                }
                                                            }}
                                                            onChange={(_, newValue) => {
                                                                if (typeof newValue === "string") {
                                                                    setWardInput(newValue);
                                                                    setEmployee((previous) => ({
                                                                        ...previous,
                                                                        xaPhuong: ""
                                                                    }));
                                                                } else if (newValue && newValue.name) {
                                                                    setEmployee((previous) => ({
                                                                        ...previous,
                                                                        xaPhuong: newValue.name
                                                                    }));
                                                                    setWardInput(newValue.name);
                                                                } else {
                                                                    setWardInput("");
                                                                    setEmployee((previous) => ({
                                                                        ...previous,
                                                                        xaPhuong: ""
                                                                    }));
                                                                }
                                                            }}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    size="small"
                                                                    sx={{ mb: 2 }}
                                                                />
                                                            )}
                                                            disabled={!employee.tinhThanhPho && !provinceInput}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </InfoCard>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Divider sx={{ mb: 2, mt: 3, background: "#1976d2", opacity: 0.2 }} />
                                            <Box display="flex" justifyContent="center" gap={2}>
                                                <Button
                                                    variant="outlined"
                                                    color="inherit"
                                                    size="large"
                                                    onClick={() => navigate(-1)}
                                                    sx={{
                                                        color: "#020205",
                                                        fontWeight: 700,
                                                        borderRadius: 3,
                                                        minWidth: 120,
                                                        background: "#fafdff",
                                                        border: "2px solid #b0bec5",
                                                        "&:hover": {
                                                            background: "#eceff1",
                                                            borderColor: "#90caf9"
                                                        }
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
                                                        transition: "all 0.3s"
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
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </form>
                    </StyledCard>
                </Fade>
            </Box>
        </DashboardLayout>
    );
}