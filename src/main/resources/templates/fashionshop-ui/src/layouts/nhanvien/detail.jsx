import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const nhanVienDetailAPI = "http://localhost:8080/nhanVien";
const roleListAPI = "http://localhost:8080/vaiTro/list";
const provinceAPI = "https://provinces.open-api.vn/api/?depth=1";
const districtAPI = (code) =>
    "https://provinces.open-api.vn/api/p/" + code + "?depth=2";
const wardAPI = (code) =>
    "https://provinces.open-api.vn/api/d/" + code + "?depth=2";

const labelStyle = {
    fontWeight: 600,
    color: "#1769aa",
    marginBottom: 4,
    fontSize: 15,
    display: "block",
    letterSpacing: "0.3px",
};

const GradientCard = styled(Card)(({ theme }) => ({
    borderRadius: 16,
    background: "#fff",
    boxShadow: "0 8px 32px 0 rgba(28, 72, 180, 0.09)",
    padding: theme.spacing(3),
    position: "relative",
    overflow: "visible",
    maxWidth: 1500,
    width: "100%",
}));

// Sửa lại hàm này để so sánh kiểu chuỗi cho chắc chắn
function getRoleName(idVaiTro, roleOptions, tenVaiTro) {
    if (tenVaiTro) return tenVaiTro;
    const role = roleOptions.find((r) => String(r.id) === String(idVaiTro));
    return role ? role.ten : "Chưa xác định";
}
function getGenderLabel(gioiTinh) {
    if (gioiTinh === "Nam" || gioiTinh === 1) return "Nam";
    if (gioiTinh === "Nữ" || gioiTinh === 0) return "Nữ";
    return "Khác";
}
function getStatusLabel(trangThai) {
    if (trangThai === 1) return "Đang làm";
    if (trangThai === 0) return "Nghỉ";
    return "Không xác định";
}

export default function NhanVienDetail(props) {
    const params = useParams();
    const id = props.id || params.id;
    const navigate = useNavigate();

    const [nhanVien, setNhanVien] = useState(null);
    const [loading, setLoading] = useState(true);
    const [roleOptions, setRoleOptions] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        axios
            .get(`${nhanVienDetailAPI}/${id}`)
            .then((res) => {
                setNhanVien(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        axios.get(roleListAPI).then((res) => {
            setRoleOptions(Array.isArray(res.data) ? res.data : []);
        });
        axios.get(provinceAPI).then((res) => setProvinces(Array.isArray(res.data) ? res.data : []));
    }, []);

    useEffect(() => {
        if (nhanVien && nhanVien.tinhThanhPho) {
            axios.get(districtAPI(nhanVien.tinhThanhPho)).then((res) => {
                setDistricts(res.data && Array.isArray(res.data.districts) ? res.data.districts : []);
            });
        }
    }, [nhanVien]);

    useEffect(() => {
        if (nhanVien && nhanVien.quanHuyen) {
            axios.get(wardAPI(nhanVien.quanHuyen)).then((res) => {
                setWards(res.data && Array.isArray(res.data.wards) ? res.data.wards : []);
            });
        }
    }, [nhanVien]);

    function resolveProvinceName(code) {
        const found = provinces.find((p) => String(p.code) === String(code));
        return found ? found.name : code || "-";
    }
    function resolveDistrictName(code) {
        const found = districts.find((d) => String(d.code) === String(code));
        return found ? found.name : code || "-";
    }
    function resolveWardName(code) {
        const found = wards.find((w) => String(w.code) === String(code));
        return found ? found.name : code || "-";
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
                <GradientCard>
                    <Box mb={2} display="flex" alignItems="center" justifyContent="space-between">
                        <Button
                            startIcon={<ArrowBackIcon />}
                            onClick={
                                props.onClose
                                    ? props.onClose
                                    : () => navigate(-1)
                            }
                            variant="outlined"
                            color="inherit"
                            sx={{
                                color: "#020205",
                                borderRadius: 2,
                                fontWeight: 700,
                                minWidth: 90,
                                px: 2,
                                background: "#b6e6f6"
                            }}
                        >
                            Quay lại
                        </Button>
                        <Typography fontWeight={900} color="#1769aa" fontSize={28} letterSpacing={1.2}>
                            Thông Tin Nhân Viên
                        </Typography>
                        <Box width={90}></Box>
                    </Box>
                    <Paper
                        elevation={0}
                        sx={{
                            background: "#fafdff",
                            mb: 2,
                            p: 2,
                            borderRadius: 3,
                            textAlign: "center"
                        }}
                    >
                        <Typography variant="subtitle1" color="#1769aa" fontWeight={600}>
                            Xem chi tiết thông tin nhân viên
                        </Typography>
                    </Paper>
                    {loading ? (
                        <Box display="flex" alignItems="center" justifyContent="center" minHeight={240}>
                            <CircularProgress color="info" size={50} />
                        </Box>
                    ) : (
                        nhanVien && (
                            <Grid container spacing={3}>
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
                                        <Avatar
                                            src={nhanVien.hinhAnh || "/default-avatar.png"}
                                            alt={nhanVien.hoVaTen || ""}
                                            sx={{
                                                width: 130,
                                                height: 130,
                                                mb: 1,
                                                border: "3px solid #42a5f5",
                                                boxShadow: "0 3px 12px #e3f0fa",
                                                fontSize: 46,
                                                bgcolor: "#fafdff",
                                                color: "#1976d2",
                                            }}
                                        >
                                            {nhanVien.hoVaTen && typeof nhanVien.hoVaTen === "string"
                                                ? nhanVien.hoVaTen[0].toUpperCase()
                                                : "N"}
                                        </Avatar>
                                        <Typography fontWeight={700} fontSize={19} color="#1769aa">
                                            {nhanVien.hoVaTen}
                                        </Typography>
                                        <Typography color="text.secondary" fontSize={15}>
                                            <b>{nhanVien.maNhanVien || "..."}</b>
                                        </Typography>
                                        <Divider sx={{ width: "100%", my: 2, opacity: 0.13 }} />
                                        <Typography color="#43a047" fontWeight={700} fontSize={22}>
                                            {getRoleName(nhanVien.idVaiTro, roleOptions, nhanVien.tenVaiTro)}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={8}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <label style={labelStyle}>Họ và tên</label>
                                            <Typography fontWeight={600} fontSize={16}>
                                                {nhanVien.hoVaTen || "-"}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <label style={labelStyle}>Mã nhân viên</label>
                                            <Typography fontWeight={600} fontSize={16}>
                                                {nhanVien.maNhanVien || "-"}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <label style={labelStyle}>Số điện thoại</label>
                                            <Typography fontWeight={600} fontSize={16}>
                                                {nhanVien.soDienThoai || "-"}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <label style={labelStyle}>Email</label>
                                            <Typography fontWeight={600} fontSize={16}>
                                                {nhanVien.email || "-"}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <label style={labelStyle}>Giới tính</label>
                                            <Typography fontWeight={600} fontSize={16}>
                                                {getGenderLabel(nhanVien.gioiTinh)}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <label style={labelStyle}>Ngày sinh</label>
                                            <Typography fontWeight={600} fontSize={16}>
                                                {nhanVien.ngaySinh || "-"}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <label style={labelStyle}>Căn cước công dân</label>
                                            <Typography fontWeight={600} fontSize={16}>
                                                {nhanVien.canCuocCongDan || "-"}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <label style={labelStyle}>Trạng thái</label>
                                            <Typography fontWeight={600} fontSize={16}>
                                                {getStatusLabel(nhanVien.trangThai)}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <label style={labelStyle}>Chức vụ</label>
                                            <Typography fontWeight={600} fontSize={16}>
                                                {getRoleName(nhanVien.idVaiTro, roleOptions, nhanVien.tenVaiTro)}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <label style={labelStyle}>Địa chỉ</label>
                                            <Typography fontWeight={500} fontSize={15} color="#666">
                                                {nhanVien.diaChi ||
                                                    [
                                                        resolveWardName(nhanVien.xaPhuong),
                                                        resolveDistrictName(nhanVien.quanHuyen),
                                                        resolveProvinceName(nhanVien.tinhThanhPho),
                                                    ]
                                                        .filter(Boolean)
                                                        .join(", ") || "-"}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        )
                    )}
                </GradientCard>
            </Box>
        </DashboardLayout>
    );
}

NhanVienDetail.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onClose: PropTypes.func,
};