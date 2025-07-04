import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
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
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Tooltip from "@mui/material/Tooltip";
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

const nhanVienDetailAPI = (id) => `http://localhost:8080/nhanVien/${id}`;
const roleListAPI = "http://localhost:8080/vaiTro/list";
const provinceAPI = "https://provinces.open-api.vn/api/?depth=1";
const districtAPI = (code) => "https://provinces.open-api.vn/api/p/" + code + "?depth=2";
const wardAPI = (code) => "https://provinces.open-api.vn/api/d/" + code + "?depth=2";

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

function normalizeString(str) {
    return (str || "").toLowerCase().replace(/\s+/g, "").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const GENDER_OPTIONS = [
    { value: "Nam", label: "Nam" },
    { value: "Nữ", label: "Nữ" },
    { value: "Khác", label: "Khác" }
];

const STATUS_OPTIONS = [
    { value: 1, label: "Đang hoạt động" },
    { value: 0, label: "Ngừng hoạt động" }
];

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
    maxWidth: 1500,
    width: "100%"
}));

const AvatarWrapper = styled(Box)(({ theme }) => ({
    position: "relative",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    gap: theme.spacing(1.5),
    width: "100%"
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
        color: "#1769aa"
    }
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 900,
    color: "#1769aa",
    fontSize: 26,
    letterSpacing: 1.3,
    textShadow: "0 2px 10px #e3f0fa, 0 1px 0 #fff"
}));

function getDiaChiString({ xaPhuong, quanHuyen, tinhThanhPho }, provinces, districts, wards) {
    let xa = "";
    let huyen = "";
    let tinh = "";
    if (wards.length > 0 && xaPhuong) {
        const foundWard = wards.find((w) => w.code === xaPhuong);
        xa = foundWard && foundWard.name ? foundWard.name : xaPhuong;
    } else {
        xa = xaPhuong;
    }
    if (districts.length > 0 && quanHuyen) {
        const foundDistrict = districts.find((d) => d.code === quanHuyen);
        huyen = foundDistrict && foundDistrict.name ? foundDistrict.name : quanHuyen;
    } else {
        huyen = quanHuyen;
    }
    if (provinces.length > 0 && tinhThanhPho) {
        const foundProvince = provinces.find((p) => p.code === tinhThanhPho);
        tinh = foundProvince && foundProvince.name ? foundProvince.name : tinhThanhPho;
    } else {
        tinh = tinhThanhPho;
    }
    return [xa, huyen, tinh].filter(Boolean).join(", ");
}

export default function UpdateNhanVienForm({ id: propId, onClose }) {
    const params = useParams();
    const id = propId || params.id;
    const [employee, setEmployee] = useState({
        hoVaTen: "",
        hinhAnh: "",
        gioiTinh: "",
        ngaySinh: "",
        soDienThoai: "",
        canCuocCongDan: "",
        email: "",
        vaiTro: null,
        trangThai: 1,
        tinhThanhPho: "",
        quanHuyen: "",
        xaPhuong: "",
        maNhanVien: "",
        matKhau: "",
        diaChi: ""
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
    const [openCamera, setOpenCamera] = useState(false);
    const [pendingLocation, setPendingLocation] = useState(null);

    function fetchRoles() {
        axios.get(roleListAPI).then(function (response) {
            setRoleOptions(arraySafe(response.data));
        });
    }

    useEffect(function () {
        axios.get(provinceAPI).then(function (response) {
            setProvinces(arraySafe(response.data));
        });
    }, []);

    useEffect(function () {
        fetchRoles();
    }, []);

    useEffect(function () {
        async function fetchEmployee() {
            if (!id) return;
            try {
                const res = await axios.get(nhanVienDetailAPI(id));
                if (!res.data) return;
                let data = res.data;
                let tinhThanhPho = data.tinhThanhPho || "";
                let quanHuyen = data.quanHuyen || "";
                let xaPhuong = data.xaPhuong || "";
                let provinceInputName = "";
                let districtInputName = "";
                let wardInputName = "";
                if ((!tinhThanhPho || !quanHuyen || !xaPhuong) && data.diaChi) {
                    const arr = data.diaChi.split(",").map(s => s.trim());
                    let nameTinh = "";
                    let nameHuyen = "";
                    let nameXa = "";
                    if (arr.length === 3) [nameXa, nameHuyen, nameTinh] = arr;
                    else if (arr.length === 2) [nameHuyen, nameTinh] = arr;
                    else if (arr.length === 1) [nameTinh] = arr;
                    let codeTinh = "";
                    if (nameTinh) {
                        const foundTinh = provinces.find(
                            p => normalizeString(p.name) === normalizeString(nameTinh)
                        );
                        codeTinh = foundTinh?.code || "";
                    }
                    tinhThanhPho = codeTinh;
                    provinceInputName = nameTinh;
                    if (codeTinh) {
                        const resDistricts = await axios.get(districtAPI(codeTinh));
                        const districtsArr = resDistricts.data.districts || [];
                        setDistricts(districtsArr);
                        let codeHuyen = "";
                        let foundHuyen;
                        if (nameHuyen) {
                            foundHuyen = districtsArr.find(
                                d => normalizeString(d.name) === normalizeString(nameHuyen)
                            );
                            codeHuyen = foundHuyen?.code || "";
                        }
                        quanHuyen = codeHuyen;
                        districtInputName = nameHuyen;
                        if (codeHuyen) {
                            const resWards = await axios.get(wardAPI(codeHuyen));
                            const wardsArr = resWards.data.wards || [];
                            setWards(wardsArr);
                            let codeXa = "";
                            if (nameXa) {
                                const foundXa = wardsArr.find(
                                    w => normalizeString(w.name) === normalizeString(nameXa)
                                );
                                codeXa = foundXa?.code || "";
                            }
                            xaPhuong = codeXa;
                            wardInputName = nameXa;
                            setPendingLocation({
                                tinhThanhPho,
                                quanHuyen,
                                xaPhuong,
                                provinceInputName,
                                districtInputName,
                                wardInputName,
                                data
                            });
                            setAvatarPreview(data.hinhAnh ? data.hinhAnh : "");
                            return;
                        }
                        setPendingLocation({
                            tinhThanhPho,
                            quanHuyen,
                            xaPhuong: "",
                            provinceInputName,
                            districtInputName,
                            wardInputName: "",
                            data
                        });
                        setAvatarPreview(data.hinhAnh ? data.hinhAnh : "");
                        return;
                    }
                    setPendingLocation({
                        tinhThanhPho,
                        quanHuyen: "",
                        xaPhuong: "",
                        provinceInputName,
                        districtInputName: "",
                        wardInputName: "",
                        data
                    });
                    setAvatarPreview(data.hinhAnh ? data.hinhAnh : "");
                    return;
                }
                let districtsArr = [];
                let wardsArr = [];
                if (tinhThanhPho) {
                    const resDistricts = await axios.get(districtAPI(tinhThanhPho));
                    districtsArr = resDistricts.data.districts || [];
                    setDistricts(districtsArr);
                }
                if (quanHuyen) {
                    const resWards = await axios.get(wardAPI(quanHuyen));
                    wardsArr = resWards.data.wards || [];
                    setWards(wardsArr);
                }
                setEmployee({
                    hoVaTen: data.hoVaTen || "",
                    hinhAnh: data.hinhAnh || "",
                    gioiTinh: data.gioiTinh || "",
                    ngaySinh: data.ngaySinh || "",
                    soDienThoai: data.soDienThoai || "",
                    canCuocCongDan: data.canCuocCongDan || "",
                    email: data.email || "",
                    vaiTro: data.vaiTro || null,
                    trangThai: data.trangThai !== undefined ? data.trangThai : 1,
                    tinhThanhPho,
                    quanHuyen,
                    xaPhuong,
                    maNhanVien: data.maNhanVien || "",
                    matKhau: data.matKhau || "",
                    diaChi: data.diaChi || ""
                });
                setProvinceInput(provinces.find(p => p.code === tinhThanhPho)?.name || "");
                setDistrictInput(districtsArr.find(d => d.code === quanHuyen)?.name || "");
                setWardInput(wardsArr.find(w => w.code === xaPhuong)?.name || "");
                setAvatarPreview(data.hinhAnh ? data.hinhAnh : "");
            } catch {
                toast.error("Không lấy được thông tin nhân viên!");
            }
        }
        if (provinces.length) fetchEmployee();
    }, [id, provinces.length]);

    useEffect(() => {
        if (pendingLocation) {
            setEmployee({
                hoVaTen: pendingLocation.data.hoVaTen || "",
                hinhAnh: pendingLocation.data.hinhAnh || "",
                gioiTinh: pendingLocation.data.gioiTinh || "",
                ngaySinh: pendingLocation.data.ngaySinh || "",
                soDienThoai: pendingLocation.data.soDienThoai || "",
                canCuocCongDan: pendingLocation.data.canCuocCongDan || "",
                email: pendingLocation.data.email || "",
                vaiTro: pendingLocation.data.vaiTro || null,
                trangThai: pendingLocation.data.trangThai !== undefined ? pendingLocation.data.trangThai : 1,
                tinhThanhPho: pendingLocation.tinhThanhPho,
                quanHuyen: pendingLocation.quanHuyen,
                xaPhuong: pendingLocation.xaPhuong,
                maNhanVien: pendingLocation.data.maNhanVien || "",
                matKhau: pendingLocation.data.matKhau || "",
                diaChi: pendingLocation.data.diaChi || ""
            });
            setProvinceInput(pendingLocation.provinceInputName || "");
            setDistrictInput(pendingLocation.districtInputName || "");
            setWardInput(pendingLocation.wardInputName || "");
            setPendingLocation(null);
        }
    }, [districts, wards, pendingLocation]);

    useEffect(function () {
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
        setDistrictInput("");
        setWardInput("");
        setWards([]);
        // KHÔNG reset employee.quanHuyen/xaPhuong ở đây!
    }, [employee.tinhThanhPho]);

    useEffect(function () {
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
        setWardInput("");
        // KHÔNG reset employee.xaPhuong ở đây!
    }, [employee.quanHuyen]);

    useEffect(function () {
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
        setWardInput("");
        // KHÔNG reset employee.xaPhuong ở đây!
    }, [employee.quanHuyen]);

    function handleEmployeeChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        setEmployee(function (previous) {
            return {
                ...previous,
                [name]: value
            };
        });
        setErrors(function (previous) {
            return {
                ...previous,
                [name]: undefined
            };
        });
    }

    function handleAvatarChange(event) {
        const file = event.target.files[0];
        if (file) {
            setEmployee(function (previous) {
                return {
                    ...previous,
                    hinhAnh: file.name
                };
            });
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
        if (!employee.trangThai && employee.trangThai !== 0) {
            error.trangThai = "Vui lòng chọn trạng thái";
            return error;
        }
        if (!employee.vaiTro || !employee.vaiTro.id) {
            error.vaiTro = "Vui lòng chọn vai trò";
            return error;
        }
        if (!provinceInput && !employee.tinhThanhPho) {
            error.tinhThanhPho = "Vui lòng chọn hoặc nhập tỉnh/thành phố";
            return error;
        }
        if (!districtInput && !employee.quanHuyen) {
            error.quanHuyen = "Vui lòng chọn hoặc nhập quận/huyện";
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
                    (item) => item.name && item.name.toLowerCase() === info.tinh.toLowerCase()
                );
                if (foundProvince) {
                    updateObj.tinhThanhPho = foundProvince.code;
                    setProvinceInput(foundProvince.name);
                    const districtRes = await axios.get(districtAPI(foundProvince.code));
                    const districtsData = districtRes.data.districts || [];
                    setDistricts(districtsData);
                    if (info.huyen) {
                        const foundDistrict = districtsData.find(
                            (item) => item.name && item.name.toLowerCase() === info.huyen.toLowerCase()
                        );
                        if (foundDistrict) {
                            updateObj.quanHuyen = foundDistrict.code;
                            setDistrictInput(foundDistrict.name);
                            const wardRes = await axios.get(wardAPI(foundDistrict.code));
                            const wardsData = wardRes.data.wards || [];
                            setWards(wardsData);
                            if (info.xa) {
                                const foundWard = wardsData.find(
                                    (item) => item.name && item.name.toLowerCase() === info.xa.toLowerCase()
                                );
                                if (foundWard) {
                                    updateObj.xaPhuong = foundWard.code;
                                    setWardInput(foundWard.name);
                                }
                            }
                        }
                    }
                }
            }
            setEmployee(prev => ({
                ...prev,
                ...updateObj
            }));
        } catch (err) {
        }
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
            const diaChi = getDiaChiString(employee, provinces, districts, wards);
            const data = {
                hoVaTen: employee.hoVaTen,
                hinhAnh: typeof employee.hinhAnh === "string" ? employee.hinhAnh : "",
                gioiTinh: employee.gioiTinh,
                ngaySinh: employee.ngaySinh,
                soDienThoai: employee.soDienThoai,
                canCuocCongDan: employee.canCuocCongDan,
                email: employee.email,
                idVaiTro: employee.vaiTro && employee.vaiTro.id ? employee.vaiTro.id : null,
                trangThai: employee.trangThai,
                maNhanVien: employee.maNhanVien,
                matKhau: employee.matKhau,
                xaPhuong: employee.xaPhuong,
                quanHuyen: employee.quanHuyen,
                tinhThanhPho: employee.tinhThanhPho,
                diaChi: diaChi
            };
            await axios.put(nhanVienDetailAPI(id), data);
            setSuccess(true);
            toast.success("Cập nhật nhân viên thành công!");
            setTimeout(function () {
                setLoading(false);
                if (onClose) {
                    onClose();
                } else {
                    navigate(-1);
                }
            }, 1200);
        } catch {
            setLoading(false);
            setSuccess(false);
            toast.error("Đã có lỗi, vui lòng thử lại!");
        }
    }

    function getFieldSx(name) {
        if (focusField === name) {
            return {
                bgcolor: "#e3f0fa",
                borderRadius: 2,
                boxShadow: "0 0 0 3px #90caf9",
                transition: "all 0.3s"
            };
        } else {
            return {
                bgcolor: "#fafdff",
                borderRadius: 2,
                transition: "all 0.3s"
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
                    py: 4
                }}
            >
                <ToastContainer />
                <Fade in timeout={600}>
                    <GradientCard>
                        <SectionTitle align="center" mb={1}>
                            Cập nhật Nhân Viên
                        </SectionTitle>
                        <Paper
                            elevation={0}
                            sx={{
                                background: "#fff",
                                mb: 2,
                                p: 2,
                                borderRadius: 3,
                                textAlign: "center"
                            }}
                        >
                            <Typography variant="subtitle1" color="#1769aa" fontWeight={600}>
                                <span style={{ color: "#43a047" }}>Nhanh chóng - Chính xác - Thẩm mỹ!</span>
                                <br />
                                Vui lòng cập nhật đầy đủ thông tin nhân viên để quản lý hiệu quả và bảo mật tối ưu.
                            </Typography>
                        </Paper>
                        <form onSubmit={handleSubmit} autoComplete="off">
                            <Grid container spacing={2}>
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
                                        </AvatarWrapper>
                                        <Divider sx={{ width: "100%", my: 1, opacity: 0.13 }} />
                                        <Box sx={{ width: "100%" }}>
                                            <label style={labelStyle}>Căn cước công dân</label>
                                            <TextField
                                                name="canCuocCongDan"
                                                value={employee.canCuocCongDan}
                                                onChange={handleEmployeeChange}
                                                fullWidth
                                                size="small"
                                                sx={getFieldSx("canCuocCongDan")}
                                                placeholder="Nhập căn cước công dân"
                                                onFocus={() => setFocusField("canCuocCongDan")}
                                                onBlur={() => setFocusField("")}
                                                InputLabelProps={{ shrink: true }}
                                                margin="dense"
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
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={8}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <label style={labelStyle}>Họ và tên</label>
                                            <TextField
                                                name="hoVaTen"
                                                value={employee.hoVaTen}
                                                onChange={handleEmployeeChange}
                                                fullWidth
                                                size="small"
                                                sx={getFieldSx("hoVaTen")}
                                                placeholder="Nhập họ và tên"
                                                onFocus={() => setFocusField("hoVaTen")}
                                                onBlur={() => setFocusField("")}
                                                InputLabelProps={{ shrink: true }}
                                                margin="dense"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <label style={labelStyle}>Số điện thoại</label>
                                            <TextField
                                                name="soDienThoai"
                                                value={employee.soDienThoai}
                                                onChange={handleEmployeeChange}
                                                fullWidth
                                                size="small"
                                                sx={getFieldSx("soDienThoai")}
                                                placeholder="Nhập số điện thoại"
                                                onFocus={() => setFocusField("soDienThoai")}
                                                onBlur={() => setFocusField("")}
                                                InputLabelProps={{ shrink: true }}
                                                margin="dense"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <label style={labelStyle}>Email</label>
                                            <TextField
                                                name="email"
                                                value={employee.email}
                                                onChange={handleEmployeeChange}
                                                fullWidth
                                                size="small"
                                                sx={getFieldSx("email")}
                                                placeholder="Nhập email"
                                                onFocus={() => setFocusField("email")}
                                                onBlur={() => setFocusField("")}
                                                InputLabelProps={{ shrink: true }}
                                                margin="dense"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <label style={labelStyle}>Ngày sinh</label>
                                            <TextField
                                                type="date"
                                                name="ngaySinh"
                                                value={employee.ngaySinh}
                                                onChange={handleEmployeeChange}
                                                fullWidth
                                                size="small"
                                                sx={getFieldSx("ngaySinh")}
                                                onFocus={() => setFocusField("ngaySinh")}
                                                onBlur={() => setFocusField("")}
                                                InputLabelProps={{ shrink: true }}
                                                margin="dense"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <label style={labelStyle}>Giới tính</label>
                                            <FormControl
                                                fullWidth
                                                size="small"
                                                sx={getFieldSx("gioiTinh")}
                                                margin="dense"
                                            >
                                                <Select
                                                    name="gioiTinh"
                                                    value={employee.gioiTinh}
                                                    onChange={handleEmployeeChange}
                                                    displayEmpty
                                                    onFocus={() => setFocusField("gioiTinh")}
                                                    onBlur={() => setFocusField("")}
                                                    inputProps={{ "aria-label": "Giới tính" }}
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
                                                <FormHelperText />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <label style={labelStyle}>Trạng thái</label>
                                            <FormControl fullWidth size="small" sx={getFieldSx("trangThai")} margin="dense">
                                                <Select
                                                    name="trangThai"
                                                    value={employee.trangThai}
                                                    onChange={handleEmployeeChange}
                                                    required
                                                    onFocus={() => setFocusField("trangThai")}
                                                    onBlur={() => setFocusField("")}
                                                    inputProps={{ "aria-label": "Trạng thái" }}
                                                >
                                                    {STATUS_OPTIONS.map((status) => (
                                                        <MenuItem value={status.value} key={status.value}>
                                                            {status.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                <FormHelperText />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
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
                                                            tinhThanhPho: ""
                                                        }));
                                                    }
                                                }}
                                                onChange={(_, newValue) => {
                                                    if (typeof newValue === "string") {
                                                        setProvinceInput(newValue);
                                                        setEmployee((previous) => ({
                                                            ...previous,
                                                            tinhThanhPho: "",
                                                            quanHuyen: "",
                                                            xaPhuong: ""
                                                        }));
                                                    } else if (newValue && newValue.code) {
                                                        setEmployee((previous) => ({
                                                            ...previous,
                                                            tinhThanhPho: newValue.code,
                                                            quanHuyen: "",
                                                            xaPhuong: ""
                                                        }));
                                                        setProvinceInput(newValue.name);
                                                    } else {
                                                        setProvinceInput("");
                                                        setEmployee((previous) => ({
                                                            ...previous,
                                                            tinhThanhPho: "",
                                                            quanHuyen: "",
                                                            xaPhuong: ""
                                                        }));
                                                    }
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        placeholder="Chọn hoặc nhập tỉnh/thành phố"
                                                        size="small"
                                                        sx={getFieldSx("tinhThanhPho")}
                                                        margin="dense"
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
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
                                                            quanHuyen: ""
                                                        }));
                                                    }
                                                }}
                                                onChange={(_, newValue) => {
                                                    if (typeof newValue === "string") {
                                                        setDistrictInput(newValue);
                                                        setEmployee((previous) => ({
                                                            ...previous,
                                                            quanHuyen: "",
                                                            xaPhuong: ""
                                                        }));
                                                    } else if (newValue && newValue.code) {
                                                        setEmployee((previous) => ({
                                                            ...previous,
                                                            quanHuyen: newValue.code,
                                                            xaPhuong: ""  // Reset xã khi đổi huyện
                                                        }));
                                                        setDistrictInput(newValue.name);
                                                    } else {
                                                        setDistrictInput("");
                                                        setEmployee((previous) => ({
                                                            ...previous,
                                                            quanHuyen: "",
                                                            xaPhuong: ""
                                                        }));
                                                    }
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        placeholder="Chọn hoặc nhập quận/huyện"
                                                        size="small"
                                                        sx={getFieldSx("quanHuyen")}
                                                        margin="dense"
                                                    />
                                                )}
                                                disabled={!employee.tinhThanhPho && !provinceInput}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
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
                                                    } else if (newValue && newValue.code) {
                                                        setEmployee((previous) => ({
                                                            ...previous,
                                                            xaPhuong: newValue.code
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
                                                        placeholder="Chọn hoặc nhập phường/xã"
                                                        size="small"
                                                        sx={getFieldSx("xaPhuong")}
                                                        margin="dense"
                                                    />
                                                )}
                                                disabled={
                                                    (!employee.tinhThanhPho && !provinceInput) ||
                                                    (!employee.quanHuyen && !districtInput)
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <label style={labelStyle}>Vai trò</label>
                                            <FormControl
                                                fullWidth
                                                size="small"
                                                sx={getFieldSx("vaiTro")}
                                                margin="dense"
                                            >
                                                <Select
                                                    name="vaiTro"
                                                    value={employee.vaiTro && employee.vaiTro.id ? employee.vaiTro.id : ""}
                                                    onChange={function (event) {
                                                        const selectedId = event.target.value;
                                                        const foundRole = roleOptions.find(function (role) {
                                                            return role.id === selectedId || String(role.id) === String(selectedId);
                                                        });
                                                        setEmployee(function (previous) {
                                                            return {
                                                                ...previous,
                                                                vaiTro: foundRole || null
                                                            };
                                                        });
                                                        setRoleInput(foundRole ? foundRole.ten : "");
                                                        setErrors(function (previous) {
                                                            return {
                                                                ...previous,
                                                                vaiTro: undefined
                                                            };
                                                        });
                                                    }}
                                                    displayEmpty
                                                    onFocus={() => setFocusField("vaiTro")}
                                                    onBlur={() => setFocusField("")}
                                                    inputProps={{ "aria-label": "Vai trò" }}
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
                                                <FormHelperText />
                                            </FormControl>
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
                                            onClick={() => {
                                                if (onClose) {
                                                    onClose();
                                                } else {
                                                    navigate(-1);
                                                }
                                            }}
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
                                                    : "Cập nhật nhân viên"}
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </form>
                    </GradientCard>
                </Fade>
            </Box>
        </DashboardLayout>
    );
}

UpdateNhanVienForm.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onClose: PropTypes.func,
};