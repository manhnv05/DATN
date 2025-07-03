import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import FormControl from "@mui/material/FormControl";
import Avatar from "@mui/material/Avatar";
import FormHelperText from "@mui/material/FormHelperText";
import UploadIcon from "@mui/icons-material/Upload";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import Fade from "@mui/material/Fade";
import Tooltip from "@mui/material/Tooltip";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const GENDER_OPTIONS = [
    { value: 1, label: "Nam" },
    { value: 0, label: "Nữ" },
    { value: 2, label: "Khác" }
];

const STATUS_OPTIONS = [
    { value: 1, label: "Đang hoạt động" },
    { value: 0, label: "Ngừng hoạt động" }
];

const labelStyle = {
    fontWeight: 700,
    color: "#1976d2",
    marginBottom: 4,
    fontSize: 16,
    display: "block",
    letterSpacing: "0.5px"
};

function generateMaKhachHang() {
    const randomNumber = Math.floor(10000000 + Math.random() * 90000000);
    return "KH" + randomNumber;
}

function generateMatKhau() {
    let result = "";
    for (let i = 0; i < 10; i++) {
        result += Math.floor(Math.random() * 10).toString();
    }
    return result;
}

const API_URL = "http://localhost:8080/khachHang/with-address";

export default function AddKhachHangForm() {
    const [khachHang, setKhachHang] = useState({
        maKhachHang: "",
        matKhau: "",
        tenKhachHang: "",
        email: "",
        gioiTinh: "",
        sdt: "",
        ngaySinh: "",
        hinhAnh: "",
        trangThai: 1
    });
    const [diaChi, setDiaChi] = useState({
        tinhThanhPho: "",
        quanHuyen: "",
        xaPhuong: "",
        trangThai: 1
    });
    const [provinceInput, setProvinceInput] = useState("");
    const [districtInput, setDistrictInput] = useState("");
    const [wardInput, setWardInput] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("");
    const [errors, setErrors] = useState({});
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [provinceName, setProvinceName] = useState("");
    const [districtName, setDistrictName] = useState("");
    const [wardName, setWardName] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setKhachHang((prev) => ({
            ...prev,
            maKhachHang: generateMaKhachHang(),
            matKhau: generateMatKhau()
        }));
    }, []);

    useEffect(() => {
        async function fetchProvinces() {
            try {
                const response = await axios.get("https://provinces.open-api.vn/api/?depth=1");
                setProvinces(response.data || []);
            } catch {
                setProvinces([]);
            }
        }
        fetchProvinces();
    }, []);

    useEffect(() => {
        if (diaChi.tinhThanhPho) {
            async function fetchDistricts() {
                try {
                    const response = await axios.get(`https://provinces.open-api.vn/api/p/${diaChi.tinhThanhPho}?depth=2`);
                    setDistricts(response.data.districts || []);
                    setProvinceName(response.data.name || "");
                } catch {
                    setDistricts([]);
                }
            }
            fetchDistricts();
            setDiaChi((prev) => ({ ...prev, quanHuyen: "", xaPhuong: "" }));
            setDistrictInput("");
            setWardInput("");
            setWards([]);
            setDistrictName("");
            setWardName("");
        }
    }, [diaChi.tinhThanhPho]);

    useEffect(() => {
        if (diaChi.quanHuyen) {
            async function fetchWards() {
                try {
                    const response = await axios.get(`https://provinces.open-api.vn/api/d/${diaChi.quanHuyen}?depth=2`);
                    setWards(response.data.wards || []);
                    setDistrictName(response.data.name || "");
                } catch {
                    setWards([]);
                }
            }
            fetchWards();
            setDiaChi((prev) => ({ ...prev, xaPhuong: "" }));
            setWardInput("");
            setWardName("");
        }
    }, [diaChi.quanHuyen]);

    useEffect(() => {
        if (diaChi.xaPhuong) {
            const found = wards.find((item) => String(item.code) === String(diaChi.xaPhuong));
            setWardName(found ? found.name : "");
        }
    }, [diaChi.xaPhuong, wards]);

    function handleKhachHangChange(event) {
        const { name, value } = event.target;
        setKhachHang((prev) => ({
            ...prev,
            [name]: value
        }));
        setErrors((prev) => ({
            ...prev,
            [name]: undefined
        }));
    }

    function handleDateChange(event) {
        let value = event.target.value;
        setKhachHang((prev) => ({
            ...prev,
            ngaySinh: value
        }));
        setErrors((prev) => ({
            ...prev,
            ngaySinh: undefined
        }));
    }

    function handleAvatarChange(event) {
        const file = event.target.files[0];
        if (file) {
            setKhachHang((prev) => ({
                ...prev,
                hinhAnh: file.name
            }));
            setAvatarPreview(URL.createObjectURL(file));
        }
    }

    function handleDiaChiField(field, value) {
        setDiaChi((prev) => ({
            ...prev,
            [field]: value
        }));
        setErrors((prev) => ({
            ...prev,
            [field]: undefined
        }));
    }

    function validate() {
        let error = {};
        if (!khachHang.tenKhachHang) error.tenKhachHang = "Vui lòng nhập tên khách hàng";
        if (!khachHang.email) error.email = "Vui lòng nhập email";
        if (khachHang.gioiTinh === "") error.gioiTinh = "Vui lòng chọn giới tính";
        if (!khachHang.sdt) error.sdt = "Vui lòng nhập số điện thoại";
        if (!khachHang.ngaySinh) error.ngaySinh = "Vui lòng chọn ngày sinh";
        if (!diaChi.tinhThanhPho && !provinceInput) error.tinhThanhPho = "Vui lòng chọn hoặc nhập tỉnh/thành phố";
        if (!diaChi.quanHuyen && !districtInput) error.quanHuyen = "Vui lòng chọn hoặc nhập quận/huyện";
        if (!diaChi.xaPhuong && !wardInput) error.xaPhuong = "Vui lòng chọn hoặc nhập phường/xã";
        return error;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const error = validate();
        if (Object.keys(error).length) {
            setErrors(error);
            return;
        }
        setLoading(true);
        setSuccess(false);
        const data = {
            khachHang,
            diaChi: {
                ...diaChi,
                tinhThanhPho: provinceName || provinceInput || "",
                quanHuyen: districtName || districtInput || "",
                xaPhuong: wardName || wardInput || "",
            }
        };
        try {
            await axios.post(API_URL, data, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            setSuccess(true);
            setTimeout(() => {
                setLoading(false);
                navigate(-1);
            }, 1200);
        } catch {
            setLoading(false);
            setSuccess(false);
            alert("Đã có lỗi, vui lòng thử lại!");
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
                    alignItems: "center",
                    justifyContent: "center",
                    py: 5
                }}
            >
                <Fade in timeout={600}>
                    <Card
                        sx={{
                            maxWidth: 1180,
                            width: "100%",
                            borderRadius: 7,
                            boxShadow: "0 10px 50px 0 rgba(28, 72, 180, 0.13)",
                            p: { xs: 2, md: 5 },
                            background: "linear-gradient(140deg,#fff 60%,#e6f1fb 120%)",
                            position: "relative"
                        }}
                    >
                        <Typography
                            variant="h3"
                            fontWeight={900}
                            color="#1976d2"
                            mb={4}
                            align="center"
                            letterSpacing={1.8}
                            sx={{
                                textShadow: "0 3px 12px #e3f0fa, 0 2px 0 #fff"
                            }}
                        >
                            Thêm Khách Hàng Mới
                        </Typography>
                        <Paper elevation={0} sx={{ background: "transparent", mb: 4, p: 2, borderRadius: 4 }}>
                            <Typography variant="h6" color="#1976d2" fontWeight={700}>
                                Thông tin khách hàng và địa chỉ được lưu đồng thời. Sau khi thêm, tài khoản và mật khẩu sẽ được gửi vào email khách hàng!
                            </Typography>
                        </Paper>
                        <form onSubmit={handleSubmit} autoComplete="off">
                            <Grid container spacing={4}>
                                <Grid item xs={12} md={3}>
                                    <Stack spacing={2} alignItems="center">
                                        <Tooltip title="Ảnh đại diện khách hàng" arrow placement="right">
                                            <Avatar
                                                src={avatarPreview || "/default-avatar.png"}
                                                alt="avatar"
                                                sx={{
                                                    width: 120,
                                                    height: 120,
                                                    mb: 1,
                                                    border: "3px solid #42a5f5",
                                                    boxShadow: "0 5px 20px #e3f0fa",
                                                    fontSize: 44,
                                                    bgcolor: "#f7fbfd",
                                                    color: "#1976d2"
                                                }}
                                            >
                                                {khachHang.tenKhachHang && khachHang.tenKhachHang.length > 0 ? khachHang.tenKhachHang.charAt(0).toUpperCase() : "A"}
                                            </Avatar>
                                        </Tooltip>
                                        <label htmlFor="hinhAnh-upload">
                                            <input
                                                type="file"
                                                id="hinhAnh-upload"
                                                name="hinhAnh"
                                                accept="image/*"
                                                style={{ display: "none" }}
                                                onChange={handleAvatarChange}
                                            />
                                            <Button
                                                variant="outlined"
                                                color="info"
                                                component="span"
                                                startIcon={<UploadIcon />}
                                                sx={{
                                                    textTransform: "none",
                                                    fontWeight: 700,
                                                    borderRadius: 3,
                                                    px: 2,
                                                    fontSize: 16,
                                                    background: "#fafdff",
                                                    border: "1.7px solid #90caf9",
                                                    "&:hover": {
                                                        background: "#e3f0fa",
                                                        borderColor: "#42a5f5",
                                                        color: "#1565c0"
                                                    }
                                                }}
                                            >
                                                Ảnh đại diện
                                            </Button>
                                        </label>
                                        <FormHelperText sx={{ color: "error.main" }}>
                                            {errors.hinhAnh}
                                        </FormHelperText>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={9}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6} lg={4}>
                                            <label style={labelStyle}>Họ và tên khách hàng</label>
                                            <TextField
                                                name="tenKhachHang"
                                                value={khachHang.tenKhachHang}
                                                onChange={handleKhachHangChange}
                                                error={!!errors.tenKhachHang}
                                                helperText={errors.tenKhachHang}
                                                fullWidth
                                                size="small"
                                                sx={{
                                                    bgcolor: "#f7fbfd",
                                                    borderRadius: 2,
                                                    input: { fontWeight: 600 }
                                                }}
                                                placeholder="VD: Nguyễn Văn B"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6} lg={4}>
                                            <label style={labelStyle}>Email liên hệ</label>
                                            <TextField
                                                name="email"
                                                value={khachHang.email}
                                                onChange={handleKhachHangChange}
                                                error={!!errors.email}
                                                helperText={errors.email}
                                                fullWidth
                                                size="small"
                                                sx={{
                                                    bgcolor: "#f7fbfd",
                                                    borderRadius: 2,
                                                    input: { fontWeight: 600 }
                                                }}
                                                placeholder="VD: email@gmail.com"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6} lg={4}>
                                            <label style={labelStyle}>Giới tính khách hàng</label>
                                            <FormControl
                                                fullWidth
                                                size="small"
                                                error={!!errors.gioiTinh}
                                                sx={{ bgcolor: "#f7fbfd", borderRadius: 2 }}
                                            >
                                                <Select
                                                    name="gioiTinh"
                                                    value={khachHang.gioiTinh}
                                                    onChange={handleKhachHangChange}
                                                    displayEmpty
                                                >
                                                    <MenuItem value="">
                                                        <em>Chọn giới tính khách hàng</em>
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
                                        <Grid item xs={12} md={6} lg={4}>
                                            <label style={labelStyle}>Số điện thoại liên hệ</label>
                                            <TextField
                                                name="sdt"
                                                value={khachHang.sdt}
                                                onChange={handleKhachHangChange}
                                                error={!!errors.sdt}
                                                helperText={errors.sdt}
                                                fullWidth
                                                size="small"
                                                sx={{
                                                    bgcolor: "#f7fbfd",
                                                    borderRadius: 2,
                                                    input: { fontWeight: 600 }
                                                }}
                                                placeholder="VD: 0912345678"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6} lg={4}>
                                            <label style={labelStyle}>Ngày sinh khách hàng</label>
                                            <TextField
                                                type="date"
                                                name="ngaySinh"
                                                value={khachHang.ngaySinh}
                                                onChange={handleDateChange}
                                                error={!!errors.ngaySinh}
                                                helperText={errors.ngaySinh}
                                                fullWidth
                                                size="small"
                                                sx={{
                                                    bgcolor: "#f7fbfd",
                                                    borderRadius: 2,
                                                    input: { fontWeight: 600 }
                                                }}
                                                InputLabelProps={{ shrink: true }}
                                            />
                                        </Grid>
                                        {/* Địa chỉ */}
                                        <Grid item xs={12} md={6} lg={4}>
                                            <label style={labelStyle}>Tỉnh/Thành phố</label>
                                            <Autocomplete
                                                freeSolo
                                                options={provinces}
                                                getOptionLabel={(option) =>
                                                    typeof option === "string"
                                                        ? option
                                                        : option.name || ""
                                                }
                                                value={
                                                    provinces.find((item) => item.code === diaChi.tinhThanhPho) ||
                                                    (provinceInput && { name: provinceInput }) ||
                                                    null
                                                }
                                                inputValue={provinceInput}
                                                onInputChange={(event, newInputValue, reason) => {
                                                    setProvinceInput(newInputValue);
                                                    if (reason === "clear") {
                                                        handleDiaChiField("tinhThanhPho", "");
                                                        setProvinceName("");
                                                    }
                                                }}
                                                onChange={(event, newValue) => {
                                                    if (typeof newValue === "string") {
                                                        setProvinceInput(newValue);
                                                        handleDiaChiField("tinhThanhPho", "");
                                                        setProvinceName(newValue);
                                                    } else if (newValue && newValue.code) {
                                                        handleDiaChiField("tinhThanhPho", newValue.code);
                                                        setProvinceInput(newValue.name);
                                                        setProvinceName(newValue.name);
                                                    } else {
                                                        setProvinceInput("");
                                                        handleDiaChiField("tinhThanhPho", "");
                                                        setProvinceName("");
                                                    }
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        placeholder="Chọn hoặc nhập tỉnh/thành phố"
                                                        error={!!errors.tinhThanhPho}
                                                        helperText={errors.tinhThanhPho}
                                                        size="small"
                                                        sx={{ bgcolor: "#f7fbfd", borderRadius: 2 }}
                                                    />
                                                )}
                                            />
                                            {(provinceInput || provinceName) && (
                                                <Box mt={1} fontSize={14} color="#1976d2">
                                                    <b>Tỉnh/Thành phố:</b> {provinceInput || provinceName}
                                                </Box>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} md={6} lg={4}>
                                            <label style={labelStyle}>Quận/Huyện</label>
                                            <Autocomplete
                                                freeSolo
                                                options={districts}
                                                getOptionLabel={(option) =>
                                                    typeof option === "string"
                                                        ? option
                                                        : option.name || ""
                                                }
                                                value={
                                                    districts.find((item) => item.code === diaChi.quanHuyen) ||
                                                    (districtInput && { name: districtInput }) ||
                                                    null
                                                }
                                                inputValue={districtInput}
                                                onInputChange={(event, newInputValue, reason) => {
                                                    setDistrictInput(newInputValue);
                                                    if (reason === "clear") {
                                                        handleDiaChiField("quanHuyen", "");
                                                        setDistrictName("");
                                                    }
                                                }}
                                                onChange={(event, newValue) => {
                                                    if (typeof newValue === "string") {
                                                        setDistrictInput(newValue);
                                                        handleDiaChiField("quanHuyen", "");
                                                        setDistrictName(newValue);
                                                    } else if (newValue && newValue.code) {
                                                        handleDiaChiField("quanHuyen", newValue.code);
                                                        setDistrictInput(newValue.name);
                                                        setDistrictName(newValue.name);
                                                    } else {
                                                        setDistrictInput("");
                                                        handleDiaChiField("quanHuyen", "");
                                                        setDistrictName("");
                                                    }
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        placeholder="Chọn hoặc nhập quận/huyện"
                                                        error={!!errors.quanHuyen}
                                                        helperText={errors.quanHuyen}
                                                        size="small"
                                                        sx={{ bgcolor: "#f7fbfd", borderRadius: 2 }}
                                                    />
                                                )}
                                                disabled={!diaChi.tinhThanhPho && !provinceInput}
                                            />
                                            {(districtInput || districtName) && (
                                                <Box mt={1} fontSize={14} color="#1976d2">
                                                    <b>Quận/Huyện:</b> {districtInput || districtName}
                                                </Box>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} md={6} lg={4}>
                                            <label style={labelStyle}>Phường/Xã</label>
                                            <Autocomplete
                                                freeSolo
                                                options={wards}
                                                getOptionLabel={(option) =>
                                                    typeof option === "string"
                                                        ? option
                                                        : option.name || ""
                                                }
                                                value={
                                                    wards.find((item) => item.code === diaChi.xaPhuong) ||
                                                    (wardInput && { name: wardInput }) ||
                                                    null
                                                }
                                                inputValue={wardInput}
                                                onInputChange={(event, newInputValue, reason) => {
                                                    setWardInput(newInputValue);
                                                    if (reason === "clear") {
                                                        handleDiaChiField("xaPhuong", "");
                                                        setWardName("");
                                                    }
                                                }}
                                                onChange={(event, newValue) => {
                                                    if (typeof newValue === "string") {
                                                        setWardInput(newValue);
                                                        handleDiaChiField("xaPhuong", "");
                                                        setWardName(newValue);
                                                    } else if (newValue && newValue.code) {
                                                        handleDiaChiField("xaPhuong", newValue.code);
                                                        setWardInput(newValue.name);
                                                        setWardName(newValue.name);
                                                    } else {
                                                        setWardInput("");
                                                        handleDiaChiField("xaPhuong", "");
                                                        setWardName("");
                                                    }
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        placeholder="Chọn hoặc nhập phường/xã"
                                                        error={!!errors.xaPhuong}
                                                        helperText={errors.xaPhuong}
                                                        size="small"
                                                        sx={{ bgcolor: "#f7fbfd", borderRadius: 2 }}
                                                    />
                                                )}
                                                disabled={
                                                    (!diaChi.tinhThanhPho && !provinceInput) ||
                                                    (!diaChi.quanHuyen && !districtInput)
                                                }
                                            />
                                            {(wardInput || wardName) && (
                                                <Box mt={1} fontSize={14} color="#1976d2">
                                                    <b>Phường/Xã:</b> {wardInput || wardName}
                                                </Box>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} md={6} lg={4}>
                                            <label style={labelStyle}>Trạng thái hoạt động</label>
                                            <FormControl fullWidth size="small" sx={{ bgcolor: "#f7fbfd", borderRadius: 2 }}>
                                                <Select
                                                    name="trangThai"
                                                    value={khachHang.trangThai}
                                                    onChange={handleKhachHangChange}
                                                    displayEmpty
                                                >
                                                    {STATUS_OPTIONS.map((status) => (
                                                        <MenuItem key={status.value} value={status.value}>
                                                            {status.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Divider sx={{ mb: 3, mt: 4, background: "#1976d2", opacity: 0.2 }} />
                                    <Box
                                        display="flex"
                                        justifyContent="center"
                                        mt={2}
                                        gap={3}
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
                                                border: "1.7px solid #b0bec5",
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
                                                fontSize: 20,
                                                px: 8,
                                                borderRadius: 3,
                                                minWidth: 220,
                                                boxShadow: "0 3px 12px 0 #90caf9",
                                                transition: "all 0.3s"
                                            }}
                                            disabled={loading}
                                            startIcon={
                                                loading ? <CircularProgress color="inherit" size={20} /> :
                                                    success ? <CheckCircleIcon color="success" /> : null
                                            }
                                        >
                                            {loading
                                                ? "Đang lưu..."
                                                : success
                                                    ? "Thành công!"
                                                    : "Thêm khách hàng"}
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </form>
                    </Card>
                </Fade>
            </Box>
        </DashboardLayout>
    );
}