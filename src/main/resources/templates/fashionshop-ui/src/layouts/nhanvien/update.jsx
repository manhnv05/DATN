import React, { useState, useEffect } from "react";
import {
    Card, Box, Typography, Grid, TextField, Button, FormControl,
    Avatar, CircularProgress, Divider, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from "@mui/material";
import { Upload, CheckCircle } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Fade from "@mui/material/Fade";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// API URLs
const nhanVienAPI = "http://localhost:8080/nhanVien";
const provinceAPI = "https://provinces.open-api.vn/api/?depth=1";
const districtAPI = code => `https://provinces.open-api.vn/api/p/${code}?depth=2`;
const wardAPI = code => `https://provinces.open-api.vn/api/d/${code}?depth=2`;

// Constants
const GENDER_OPTIONS = [{ value: "Nam", label: "Nam" }, { value: "Nữ", label: "Nữ" }];
const ROLE_OPTIONS = [{ value: 1, label: "Quản Lí" }, { value: 2, label: "Nhân viên" }];
const STATUS_OPTIONS = [{ value: 1, label: "Đang làm" }, { value: 0, label: "Nghỉ" }];

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
const SectionTitle = styled(Typography)({
    fontWeight: 900, color: "#1769aa", fontSize: 26, letterSpacing: 1.3,
    textShadow: "0 2px 10px #e3f0fa, 0 1px 0 #fff",
});

const getFieldSx = (focusField, name) => ({
    bgcolor: focusField === name ? "#e3f0fa" : "#fafdff",
    borderRadius: 2,
    boxShadow: focusField === name ? "0 0 0 3px #90caf9" : "none",
    transition: "all 0.3s",
});

const arraySafe = arr => (Array.isArray(arr) ? arr : []);
const findByName = (arr, name) => {
    if (!name || !arr) return null;
    return arr.find(item => item?.name.toLowerCase() === name.toLowerCase()) || null;
};
const getNameByCode = (arr, code) => {
    if (!arr || !code) return "";
    return arr.find(item => item.code === code)?.name || "";
};

function UpdateNhanVien() {
    const { id } = useParams();
    const [employee, setEmployee] = useState({
        hinhAnh: "",
        hoVaTen: "", soDienThoai: "", email: "",
        canCuocCongDan: "", ngaySinh: "",
        gioiTinh: "Nam", idVaiTro: 2,
        tinhThanhPho: "", quanHuyen: "", xaPhuong: "",
        status: 1
    });
    const [avatarPreview, setAvatarPreview] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [focusField, setFocusField] = useState("");
    const [addressData, setAddressData] = useState({ provinces: [], districts: [], wards: [] });
    const [confirmOpen, setConfirmOpen] = useState(false);
    const navigate = useNavigate();

    const validPrefixes = [
        "032", "033", "034", "035", "036", "037", "038", "039",
        "070", "071", "072", "073", "074", "075", "076", "077", "078", "079",
        "081", "082", "083", "084", "085", "086", "087", "088", "089",
        "090", "093", "094", "096", "097", "098", "099"
    ];

    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
        .toISOString()
        .split("T")[0];

    // Fetch address data
    const fetchAddress = async (type, code) => {
        const api = { provinces: provinceAPI, districts: districtAPI(code), wards: wardAPI(code) }[type];
        if (!api) return [];
        try {
            const response = await axios.get(api);
            return arraySafe(type === "provinces" ? response.data : response.data[type]);
        } catch (error) {
            console.error(`Error fetching ${type}:`, error);
            return [];
        }
    };

    // Parse address string into province, district, ward
    const parseAddress = (address) => {
        if (!address) return { province: "", district: "", ward: "" };
        //["Xã Thanh Lâm", "Huyện Ba Chẽ", "Tỉnh Quảng Ninh"]
        const parts = address.split(", ").map(part => part.trim());
        if (parts.length !== 3) return { province: "", district: "", ward: "" };
        return {
            ward: parts[0],       // giữ nguyên "Xã Thanh Lâm"
            district: parts[1],   // giữ nguyên "Huyện Ba Chẽ"
            province: parts[2]    // giữ nguyên "Tỉnh Quảng Ninh"
        };
    };

    // Fetch employee and address data
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                // Fetch provinces
                const provinces = await fetchAddress("provinces");
                console.log("Provinces:", provinces);
                setAddressData(prev => ({ ...prev, provinces }));
                console.log("addressData loaded:", addressData);

                // Fetch employee data
                const response = await axios.get(`${nhanVienAPI}/${id}`);
                const data = response.data;

                // Parse address from diaChi field
                const { province, district, ward } = parseAddress(data.diaChi);

                // Map address names to codes
                let tinhThanhPhoCode = "";
                let quanHuyenCode = "";
                let xaPhuongCode = "";

                // Find province code
                const provinceMatch = findByName(provinces, province);
                console.log("Province Match:", provinceMatch);

                if (provinceMatch) {
                    tinhThanhPhoCode = provinceMatch.code;
                    // Fetch districts
                    const districts = await fetchAddress("districts", tinhThanhPhoCode);
                    setAddressData(prev => ({ ...prev, districts }));

                    // Find district code
                    const districtMatch = findByName(districts, district);
                    if (districtMatch) {
                        quanHuyenCode = districtMatch.code;
                        // Fetch wards
                        const wards = await fetchAddress("wards", quanHuyenCode);
                        setAddressData(prev => ({ ...prev, wards }));

                        // Find ward code
                        const wardMatch = findByName(wards, ward);
                        if (wardMatch) {
                            xaPhuongCode = wardMatch.code;
                        }
                    }
                }

                // Initialize employee data
                const employeeData = {
                    hinhAnh: data.hinhAnh || "",
                    hoVaTen: data.hoVaTen || "", // Fixed: Use hoVaTen instead of hinhAnh
                    soDienThoai: data.soDienThoai || "",
                    email: data.email || "",
                    canCuocCongDan: data.canCuocCongDan || "",
                    ngaySinh: data.ngaySinh ? new Date(data.ngaySinh).toISOString().split("T")[0] : "",
                    gioiTinh: data.gioiTinh || "Nam",
                    idVaiTro: data.idVaiTro || 2,
                    tinhThanhPho: tinhThanhPhoCode,
                    quanHuyen: quanHuyenCode,
                    xaPhuong: xaPhuongCode,
                    status: data.trangThai !== null ? data.trangThai : 1 // Use trangThai instead of status
                };

                setEmployee(employeeData);
                setAvatarPreview(data.hinhAnh || "/default-avatar.png");
            } catch (error) {
                toast.error("Không thể tải dữ liệu nhân viên!");
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchInitialData();
    }, [id]);

    // Fetch districts when tinhThanhPho changes
    useEffect(() => {
        if (employee.tinhThanhPho) {
            fetchAddress("districts", employee.tinhThanhPho).then(districts => {
                setAddressData(prev => ({ ...prev, districts, wards: [] }));
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
                setAddressData(prev => ({ ...prev, wards }));
                if (!wards.some(w => w.code === employee.xaPhuong)) {
                    setEmployee(prev => ({ ...prev, xaPhuong: "" }));
                }
            });
        } else {
            setAddressData(prev => ({ ...prev, wards: [] }));
            setEmployee(prev => ({ ...prev, xaPhuong: "" }));
        }
    }, [employee.quanHuyen]);

    // Handle input changes
    const handleChange = ({ target: { name, value } }) => {
        if (name === "soDienThoai") {
            if (/^\d*$/.test(value) && value.length <= 10) {
                setEmployee(prev => ({ ...prev, [name]: value }));
            }
        } else if (name === "canCuocCongDan") {
            if (/^\d*$/.test(value) && value.length <= 12) {
                setEmployee(prev => ({ ...prev, [name]: value }));
            }
        } else if (name === "hoVaTen") {
            if (value.length <= 30) {
                setEmployee(prev => ({ ...prev, [name]: value }));
            }
        } else {
            setEmployee(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleAvatarChange = e => {
        const file = e.target.files[0];
        if (file) {
            setEmployee(prev => ({ ...prev, hinhAnh: file.name }));
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    // Validation
    const validate = () => {
        if (!employee.hoVaTen) return "Vui lòng nhập họ tên";
        if (employee.hoVaTen.length > 30) return "Họ tên không được vượt quá 30 ký tự";
        if (!employee.soDienThoai) return "Vui lòng nhập số điện thoại";
        if (!/^\d{10}$/.test(employee.soDienThoai)) return "Số điện thoại phải gồm 10 chữ số";
        if (!validPrefixes.some(prefix => employee.soDienThoai.startsWith(prefix))) {
            return "Số điện thoại phải bắt đầu bằng đầu số hợp lệ của Việt Nam";
        }
        if (!employee.email) return "Vui lòng nhập email";
        if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(employee.email)) {
            return "Email phải có định dạng @gmail.com";
        }
        if (!employee.ngaySinh) return "Vui lòng chọn ngày sinh";
        const birthDate = new Date(employee.ngaySinh);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
        if (age < 18) return "Nhân viên phải từ 18 tuổi trở lên";
        if (!employee.canCuocCongDan) return "Vui lòng nhập căn cước công dân";
        if (!/^\d{12}$/.test(employee.canCuocCongDan)) return "Căn cước công dân phải gồm 12 chữ số";
        if (!employee.tinhThanhPho) return "Vui lòng chọn tỉnh/thành phố";
        if (!employee.quanHuyen) return "Vui lòng chọn quận/huyện";
        if (!employee.xaPhuong) return "Vui lòng chọn phường/xã";
        if (employee.status === undefined) return "Vui lòng chọn trạng thái";
        return null;
    };

    // Handle submit
    const handleConfirmUpdate = async () => {
        setConfirmOpen(false);
        setLoading(true);
        setSuccess(false);

        try {
            //19 / 5581 / 167.
            const { tinhThanhPho, quanHuyen, xaPhuong } = employee;
            console.log("Submitting employee data:", employee);
            const { provinces, districts, wards } = addressData;
            console.log("Address data:", { provinces, districts, wards });
            const diaChi = [
                getNameByCode(wards, xaPhuong),
                getNameByCode(districts, quanHuyen),
                getNameByCode(provinces, tinhThanhPho)
            ].filter(Boolean).join(", ");
            console.log("Formatted address:", diaChi);

            await axios.put(`${nhanVienAPI}/${id}`, { ...employee, diaChi });

            setSuccess(true);
            toast.success("Cập nhật nhân viên thành công!");
            setTimeout(() => navigate("/staff-management"), 1200);
        } catch {
            toast.error("Đã có lỗi, vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmClose = () => {
        setConfirmOpen(false);
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const error = validate();
        if (error) return toast.error(error);
        setConfirmOpen(true);
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Box sx={{ overflowY: "hidden", minHeight: "100vh", background: "linear-gradient(130deg,#f2f9fe 70%,#e9f0fa 100%)", display: "flex", alignItems: "flex-start", justifyContent: "center", py: 4 }}>
                {addressData.provinces.length > 0 && !loading ? (
                    <Fade in timeout={600}>
                        <div>
                            <GradientCard>
                                <SectionTitle align="center" mb={1}>Cập Nhật Thông Tin Nhân Viên</SectionTitle>
                                <Box sx={{ background: "linear-gradient(130deg,#f2f9fe 70%,#e9f0fa 100%)", mb: 2, p: 2, borderRadius: 3, textAlign: "center" }}>
                                    <Typography variant="subtitle1" color="#1769aa" fontWeight={600}>
                                        <Typography component="span" style={{ color: "#43a047" }} fontWeight={600}>
                                            Chính xác - Cẩn thận!
                                        </Typography>{" "}
                                        Vui lòng kiểm tra và cập nhật thông tin.
                                    </Typography>
                                </Box>
                                <form onSubmit={handleSubmit} autoComplete="off">
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
                                                    <Avatar
                                                        src={avatarPreview || "/default-avatar.png"}
                                                        alt="avatar"
                                                        sx={{ width: 110, height: 110, mb: 1, border: "3px solid #42a5f5", boxShadow: "0 3px 12px #e3f0fa", fontSize: 38, bgcolor: "#fafdff", color: "#1976d2", cursor: "pointer" }}
                                                        onClick={() => document.getElementById("hinhAnh-upload-nv")?.click()}
                                                    >
                                                        {employee.hoVaTen?.[0]?.toUpperCase() || "A"}
                                                    </Avatar>
                                                    <label htmlFor="hinhAnh-upload-nv">
                                                        <input
                                                            type="file"
                                                            id="hinhAnh-upload-nv"
                                                            name="hinhAnh"
                                                            accept="image/*"
                                                            style={{ display: "none" }}
                                                            onChange={handleAvatarChange}
                                                        />
                                                        <AvatarUploadButton variant="outlined" component="span" startIcon={<Upload />}>
                                                            Ảnh đại diện
                                                        </AvatarUploadButton>
                                                    </label>
                                                </AvatarWrapper>
                                                <Divider sx={{ width: "100%", my: 1, opacity: 0.13 }} />
                                                <Box sx={{ width: "100%" }}>
                                                    <label style={labelStyle}>Căn cước công dân</label>
                                                    <TextField
                                                        name="canCuocCongDan"
                                                        value={employee.canCuocCongDan}
                                                        onChange={handleChange}
                                                        fullWidth
                                                        size="small"
                                                        sx={getFieldSx(focusField, "canCuocCongDan")}
                                                        placeholder="VD: 001234567890"
                                                        onFocus={() => setFocusField("canCuocCongDan")}
                                                        onBlur={() => setFocusField("")}
                                                        inputProps={{ maxLength: 12, inputMode: "numeric" }}
                                                        disabled={true}
                                                    />
                                                </Box>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={8}>
                                            <Grid container spacing={4}>
                                                <Grid item xs={12}>
                                                    <label style={labelStyle}>Họ và tên</label>
                                                    <TextField
                                                        name="hoVaTen"
                                                        value={employee.hoVaTen || ""}
                                                        onChange={handleChange}
                                                        fullWidth
                                                        size="small"
                                                        placeholder="VD: Nguyễn Văn A"
                                                        autoFocus={focusField === "hoVaTen"}
                                                        sx={getFieldSx(focusField, "hoVaTen")}
                                                        onFocus={() => setFocusField("hoVaTen")}
                                                        onBlur={() => setFocusField("")}
                                                        inputProps={{ maxLength: 30 }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <label style={labelStyle}>Số điện thoại</label>
                                                    <TextField
                                                        name="soDienThoai"
                                                        value={employee.soDienThoai || ""}
                                                        onChange={handleChange}
                                                        fullWidth
                                                        size="small"
                                                        placeholder="VD: 0989999999"
                                                        sx={getFieldSx(focusField, "soDienThoai")}
                                                        onFocus={() => setFocusField("soDienThoai")}
                                                        onBlur={() => setFocusField("")}
                                                        inputProps={{ maxLength: 10, inputMode: "numeric" }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <label style={labelStyle}>Email</label>
                                                    <TextField
                                                        name="email"
                                                        value={employee.email || ""}
                                                        onChange={handleChange}
                                                        fullWidth
                                                        size="small"
                                                        placeholder="VD: email@gmail.com"
                                                        sx={getFieldSx(focusField, "email")}
                                                        onFocus={() => setFocusField("email")}
                                                        onBlur={() => setFocusField("")}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <label style={labelStyle}>Ngày sinh</label>
                                                    <TextField
                                                        type="date"
                                                        name="ngaySinh"
                                                        value={employee.ngaySinh || ""}
                                                        onChange={handleChange}
                                                        fullWidth
                                                        size="small"
                                                        InputLabelProps={{ shrink: true }}
                                                        sx={getFieldSx(focusField, "ngaySinh")}
                                                        onFocus={() => setFocusField("ngaySinh")}
                                                        onBlur={() => setFocusField("")}
                                                        inputProps={{ max: maxDate }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <label style={labelStyle}>Giới tính</label>
                                                    <TextField
                                                        select
                                                        fullWidth
                                                        size="small"
                                                        name="gioiTinh"
                                                        value={employee.gioiTinh || "Nam"}
                                                        onChange={handleChange}
                                                        onFocus={() => setFocusField("gioiTinh")}
                                                        onBlur={() => setFocusField("")}
                                                        sx={getFieldSx(focusField, "gioiTinh")}
                                                    >
                                                        {GENDER_OPTIONS.map((gender) => (
                                                            <MenuItem key={gender.value} value={gender.value}>
                                                                {gender.label}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <label style={labelStyle}>Vai trò</label>
                                                    <TextField
                                                        select
                                                        fullWidth
                                                        size="small"
                                                        name="idVaiTro"
                                                        value={employee.idVaiTro || 2}
                                                        onChange={(e) =>
                                                            handleChange({
                                                                target: { name: "idVaiTro", value: parseInt(e.target.value) },
                                                            })
                                                        }
                                                        onFocus={() => setFocusField("idVaiTro")}
                                                        onBlur={() => setFocusField("")}
                                                        sx={getFieldSx(focusField, "idVaiTro")}
                                                    >
                                                        {ROLE_OPTIONS.map((role) => (
                                                            <MenuItem key={role.value} value={role.value}>
                                                                {role.label}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <label style={labelStyle}>Trạng thái</label>
                                                    <TextField
                                                        select
                                                        fullWidth
                                                        size="small"
                                                        name="status"
                                                        value={employee.status !== undefined ? employee.status : 1}
                                                        onChange={(e) =>
                                                            handleChange({
                                                                target: { name: "status", value: parseInt(e.target.value) },
                                                            })
                                                        }
                                                        onFocus={() => setFocusField("status")}
                                                        onBlur={() => setFocusField("")}
                                                        sx={getFieldSx(focusField, "status")}
                                                    >
                                                        {STATUS_OPTIONS.map((status) => (
                                                            <MenuItem key={status.value} value={status.value}>
                                                                {status.label}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12} sm={4}>
                                                            <label style={labelStyle}>Tỉnh/Thành phố</label>
                                                            <FormControl fullWidth size="small" sx={getFieldSx(focusField, "tinhThanhPho")}>
                                                                <Select
                                                                    name="tinhThanhPho"
                                                                    value={employee.tinhThanhPho || ""}
                                                                    onChange={handleChange}
                                                                    onFocus={() => setFocusField("tinhThanhPho")}
                                                                    onBlur={() => setFocusField("")}
                                                                    displayEmpty
                                                                >
                                                                    <MenuItem value=""><em>Chọn Tỉnh/Thành phố</em></MenuItem>
                                                                    {addressData.provinces.map(province => (
                                                                        <MenuItem key={province.code} value={province.code}>
                                                                            {province.name}
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item xs={12} sm={4}>
                                                            <label style={labelStyle}>Quận/Huyện</label>
                                                            <FormControl
                                                                fullWidth
                                                                size="small"
                                                                sx={getFieldSx(focusField, "quanHuyen")}
                                                                disabled={!employee.tinhThanhPho}
                                                            >
                                                                <Select
                                                                    name="quanHuyen"
                                                                    value={employee.quanHuyen || ""}
                                                                    onChange={handleChange}
                                                                    onFocus={() => setFocusField("quanHuyen")}
                                                                    onBlur={() => setFocusField("")}
                                                                    displayEmpty
                                                                >
                                                                    <MenuItem value=""><em>Chọn Quận/Huyện</em></MenuItem>
                                                                    {addressData.districts.map(district => (
                                                                        <MenuItem key={district.code} value={district.code}>
                                                                            {district.name}
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item xs={12} sm={4}>
                                                            <label style={labelStyle}>Phường/Xã</label>
                                                            <FormControl
                                                                fullWidth
                                                                size="small"
                                                                sx={getFieldSx(focusField, "xaPhuong")}
                                                                disabled={!employee.quanHuyen}
                                                            >
                                                                <Select
                                                                    name="xaPhuong"
                                                                    value={employee.xaPhuong || ""}
                                                                    onChange={handleChange}
                                                                    onFocus={() => setFocusField("xaPhuong")}
                                                                    onBlur={() => setFocusField("")}
                                                                    displayEmpty
                                                                >
                                                                    <MenuItem value=""><em>Chọn Phường/Xã</em></MenuItem>
                                                                    {addressData.wards.map(ward => (
                                                                        <MenuItem key={ward.code} value={ward.code}>
                                                                            {ward.name}
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                            </FormControl>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Divider sx={{ my: 3, background: "#1976d2", opacity: 0.2 }} />
                                            <Box sx={{ display: "flex", justifyContent: "flex-end", pr: 9, mt: 2 }}>
                                                <Box sx={{ display: "flex", gap: 2 }}>
                                                    <Button
                                                        variant="outlined"
                                                        color="inherit"
                                                        size="large"
                                                        onClick={() => navigate("/staff-management")}
                                                        disabled={loading}
                                                        sx={{
                                                            fontWeight: 700, borderRadius: 3, minWidth: 120,
                                                            background: "#fafdff", border: "2px solid #b0bec5",
                                                            "&:hover": { background: "#eceff1", borderColor: "#90caf9" }
                                                        }}
                                                    >
                                                        Hủy bỏ
                                                    </Button>
                                                    <Button
                                                        type="submit"
                                                        size="large"
                                                        disabled={loading}
                                                        color={success ? "success" : "info"}
                                                        variant="contained"
                                                        startIcon={loading ? <CircularProgress size={22} /> : success ? <CheckCircle /> : null}
                                                        sx={{
                                                            fontWeight: 800, fontSize: 18, px: 6, borderRadius: 3,
                                                            minWidth: 200, boxShadow: "0 2px 10px 0 #90caf9"
                                                        }}
                                                    >
                                                        {loading ? "Đang cập nhật..." : success ? "Thành công!" : "Cập nhật nhân viên"}
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </form>
                            </GradientCard>
                            <Dialog
                                open={confirmOpen}
                                onClose={handleConfirmClose}
                                aria-labelledby="confirm-dialog-title"
                            >
                                <DialogTitle id="confirm-dialog-title">Xác nhận cập nhật</DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        Bạn có chắc chắn muốn cập nhật thông tin nhân viên {employee.hoVaTen}?
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleConfirmClose} color="inherit">
                                        Hủy
                                    </Button>
                                    <Button onClick={handleConfirmUpdate} color="info" autoFocus>
                                        Xác nhận
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
                <ToastContainer position="top-right" autoClose={1000} hideProgressBar={false} />
            </Box>
        </DashboardLayout>
    );
}

export default UpdateNhanVien;