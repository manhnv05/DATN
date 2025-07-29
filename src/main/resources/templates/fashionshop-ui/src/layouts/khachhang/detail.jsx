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
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BadgeIcon from "@mui/icons-material/Badge";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";

const customerDetailAPI = "http://localhost:8080/khachHang";

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
    "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 8px 25px rgba(23, 105, 170, 0.15)",
    },
}));
const StatusChip = styled(Chip)(({ status, theme }) => ({
    fontWeight: 600,
    fontSize: "0.875rem",
    padding: "4px 12px",
    borderRadius: 20,
    backgroundColor: status === "ACTIVE"
        ? "rgba(76, 175, 80, 0.1)"
        : "rgba(244, 67, 54, 0.1)",
    color: status === "ACTIVE"
        ? theme.palette.success.main
        : theme.palette.error.main,
    border: `1px solid ${status === "ACTIVE"
        ? theme.palette.success.main
        : theme.palette.error.main}`,
}));
const GenderChip = styled(Chip)(({ gender, theme }) => ({
    fontWeight: 600,
    fontSize: "0.875rem",
    padding: "4px 12px",
    borderRadius: 20,
    backgroundColor: gender === "Nam"
        ? "rgba(33, 150, 243, 0.1)"
        : "rgba(233, 30, 99, 0.1)",
    color: gender === "Nam"
        ? theme.palette.primary.main
        : theme.palette.secondary.main,
    border: `1px solid ${gender === "Nam"
        ? theme.palette.primary.main
        : theme.palette.secondary.main}`,
}));

const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    try {
        // Xử lý định dạng "dd/MM/yyyy" từ BE
        if (typeof dateString === 'string' && dateString.includes('/')) {
            const parts = dateString.split('/');
            if (parts.length === 3) {
                const day = parseInt(parts[0], 10);
                const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
                const year = parseInt(parts[2], 10);

                const date = new Date(year, month, day);

                // Kiểm tra xem date có hợp lệ không
                if (date.getFullYear() === year &&
                    date.getMonth() === month &&
                    date.getDate() === day) {
                    return date.toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    });
                }
            }
        }

        // Xử lý định dạng "dd-MM-yyyy" từ BE
        if (typeof dateString === 'string' && dateString.includes('-')) {
            const parts = dateString.split('-');
            if (parts.length === 3) {
                const day = parseInt(parts[0], 10);
                const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
                const year = parseInt(parts[2], 10);

                const date = new Date(year, month, day);

                // Kiểm tra xem date có hợp lệ không
                if (date.getFullYear() === year &&
                    date.getMonth() === month &&
                    date.getDate() === day) {
                    return date.toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    });
                }
            }
        }

        // Fallback: thử parse với Date constructor
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        }

        return "Chưa cập nhật";
    } catch (error) {
        console.error("Error formatting date:", error);
        return "Chưa cập nhật";
    }
};

const calculateAge = (dateString) => {
    if (!dateString) return null;
    let day, month, year;
    
    // Xử lý định dạng "dd/MM/yyyy" từ BE
    if (typeof dateString === 'string' && dateString.includes('/')) {
        const parts = dateString.split('/');
        if (parts.length === 3) {
            day = parseInt(parts[0], 10);
            month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
            year = parseInt(parts[2], 10);
        }
    }
    
    // Xử lý định dạng "dd-MM-yyyy" từ BE
    if (typeof dateString === 'string' && dateString.includes('-')) {
        const parts = dateString.split('-');
        if (parts.length === 3) {
            day = parseInt(parts[0], 10);
            month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
            year = parseInt(parts[2], 10);
        }
    }
    
    if (year && month >= 0 && day) {
        const today = new Date();
        let age = today.getFullYear() - year;
        if (
            today.getMonth() < month ||
            (today.getMonth() === month && today.getDate() < day)
        ) {
            age--;
        }
        return age;
    }
    
    // fallback parse
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
        const today = new Date();
        let age = today.getFullYear() - date.getFullYear();
        if (
            today.getMonth() < date.getMonth() ||
            (today.getMonth() === date.getMonth() && today.getDate() < date.getDate())
        ) {
            age--;
        }
        return age;
    }
    return null;
};

const getGenderLabel = (gioiTinh) => {
    if (!gioiTinh) return "Chưa cập nhật";
    switch (gioiTinh.toUpperCase()) {
        case "MALE":
            return "Nam";
        case "FEMALE":
            return "Nữ";
        default:
            return "Khác";
    }
};

const getGenderIcon = (gioiTinh) => {
    if (!gioiTinh) return <HelpOutlineIcon color="disabled" />;
    switch (gioiTinh.toUpperCase()) {
        case "MALE":
            return <MaleIcon sx={{ color: '#1976d2' }} />;
        case "FEMALE":
            return <FemaleIcon sx={{ color: '#e91e63' }} />;
        default:
            return <HelpOutlineIcon color="disabled" />;
    }
};

const getStatusLabel = (trangThai) => {
    if (!trangThai) return "Chưa cập nhật";
    switch (trangThai.toUpperCase()) {
        case "ACTIVE":
            return "Đang hoạt động";
        case "INACTIVE":
            return "Ngừng hoạt động";
        default:
            return trangThai;
    }
};

const InfoField = ({ icon, label, value, color = "#1769aa" }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <Box
            sx={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 40, height: 40,
                borderRadius: "50%", backgroundColor: `${color}15`, color: color,
            }}
        >
            {icon}
        </Box>
        <Box sx={{ flex: 1 }}>
            <Typography
                variant="caption"
                sx={{
                    color: "#666", fontSize: "0.75rem", fontWeight: 500,
                    textTransform: "uppercase", letterSpacing: "0.5px",
                }}
            >
                {label}
            </Typography>
            <Typography
                variant="body1"
                sx={{ color: "#1a1a1a", fontSize: "0.95rem", fontWeight: 600, mt: 0.5, }}
            >
                {value || "Chưa cập nhật"}
            </Typography>
        </Box>
    </Box>
);

InfoField.propTypes = {
    icon: PropTypes.node.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string,
    color: PropTypes.string,
};

const AddressList = ({ addresses }) => (
    <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1769aa", mb: 1 }}>
            Danh sách địa chỉ
        </Typography>
        {(!addresses || addresses.length === 0) ? (
            <Typography variant="body2" color="text.secondary">
                Chưa có địa chỉ nào
            </Typography>
        ) : (
            <Grid container spacing={2}>
                {addresses.map((address, idx) => (
                    <Grid item xs={12} sm={6} key={address.id || idx}>
                        <Paper elevation={2} sx={{ p: 2, borderRadius: 2, background: "#f8faff" }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: "#1769aa" }}>
                                {address.tinhThanhPho}, {address.quanHuyen}, {address.xaPhuong}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Trạng thái: {getStatusLabel(address.trangThai)}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        )}
    </Box>
);

AddressList.propTypes = {
    addresses: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        tinhThanhPho: PropTypes.string,
        quanHuyen: PropTypes.string,
        xaPhuong: PropTypes.string,
        trangThai: PropTypes.string,
    })),
};

export default function KhachHangDetail(props) {
    const params = useParams();
    const id = props.id || params.id;
    const navigate = useNavigate();

    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;
        const fetchCustomerData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${customerDetailAPI}/${id}`);
                await new Promise(resolve => setTimeout(resolve, 500));
                setCustomer(response.data.data);
            } catch (err) {
                setError("Không thể tải thông tin khách hàng. Vui lòng thử lại.");
            } finally {
                setLoading(false);
            }
        };
        fetchCustomerData();
    }, [id]);

    const handleGoBack = () => {
        navigate("/customer-management");
    };

    const handleEdit = () => {
        navigate(`/khachhang/update/${id}`);
    };

    if (loading) {
        return (
            <DashboardLayout>
                <DashboardNavbar />
                <Box sx={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CircularProgress size={60} sx={{ color: "#1769aa", mb: 2 }} />
                </Box>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <DashboardNavbar />
                <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Box textAlign="center">
                        <Typography variant="h6" color="error" fontWeight={600} mb={2}>
                            {error}
                        </Typography>
                        <Button variant="contained" onClick={handleGoBack} sx={{ backgroundColor: "#1769aa" }}>
                            Quay lại
                        </Button>
                    </Box>
                </Box>
            </DashboardLayout>
        );
    }

    if (!customer) {
        return (
            <DashboardLayout>
                <DashboardNavbar />
                <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Box textAlign="center">
                        <Typography variant="h6" color="error" fontWeight={600} mb={2}>
                            Không tìm thấy thông tin khách hàng
                        </Typography>
                        <Button variant="contained" onClick={handleGoBack} sx={{ backgroundColor: "#1769aa" }}>
                            Quay lại
                        </Button>
                    </Box>
                </Box>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Box sx={{ height: "100vh", background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", py: 4, pb: 0, borderRadius: "0 0 20px 20px" }}>
                <StyledCard>
                    {/* Header Section */}
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4, flexWrap: "wrap", gap: 2 }}>
                        <Tooltip title="Quay lại danh sách khách hàng" arrow>
                            <Button startIcon={<ArrowBackIcon />} onClick={handleGoBack} variant="outlined"
                                sx={{ color: "#1769aa", borderColor: "#b6e6f6", background: "#e3f2fd", fontWeight: 600, borderRadius: 2, px: 3, py: 1, transition: "all 0.2s", '&:hover': { background: "#1769aa", color: "#fff", borderColor: "#1769aa", boxShadow: "0 2px 8px rgba(23, 105, 170, 0.15)" } }}>
                                Quay lại
                            </Button>
                        </Tooltip>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: "#1769aa", textAlign: "center", flex: 1, fontSize: { xs: "1.5rem", md: "2rem" } }}>
                            Chi Tiết Khách Hàng
                        </Typography>
                        <Tooltip title="Chỉnh sửa thông tin khách hàng" arrow>
                            <IconButton onClick={handleEdit} sx={{ backgroundColor: "#1769aa", color: "white", '&:hover': { backgroundColor: "#0d47a1" } }}>
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    {/* Main Content */}
                    <Grid container spacing={4}>
                        {/* Profile Section (Left) */}
                        <Grid item xs={12} md={4}>
                            <ProfileSection>
                                <Avatar
                                    src={customer.hinhAnh}
                                    alt={customer.tenKhachHang || "Khách hàng"}
                                    sx={{ width: 180, height: 180, mx: "auto", mb: 2, border: "4px solid white", boxShadow: "0 8px 25px rgba(0,0,0,0.15)", fontSize: "3rem", backgroundColor: "#1769aa" }}
                                >
                                    {customer.tenKhachHang ? customer.tenKhachHang.charAt(0).toUpperCase() : "K"}
                                </Avatar>
                                <Typography variant="h5" sx={{ fontWeight: 700, color: "#1769aa", mb: 1, fontSize: { xs: "1.25rem", md: "1.5rem" } }}>
                                    {customer.tenKhachHang || "Chưa cập nhật"}
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#666", mb: 2, fontWeight: 500 }}>
                                    {customer.maKhachHang || "Chưa có mã khách hàng"}
                                </Typography>
                                <Divider sx={{ my: 2, opacity: 0.3 }} />
                                <Box sx={{ display: "flex", gap: 1, justifyContent: "center", mb: 2 }}>
                                    <StatusChip label={getStatusLabel(customer.trangThai)} status={customer.trangThai} size="small" />
                                    <GenderChip label={getGenderLabel(customer.gioiTinh)} gender={getGenderLabel(customer.gioiTinh)} size="small" />
                                </Box>
                            </ProfileSection>
                        </Grid>
                        {/* Information Section (Right) */}
                        <Grid item xs={12} md={8}>
                            <Grid container spacing={3}>
                                {/* Personal Information */}
                                <Grid item xs={12}>
                                    <InfoCard>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: "#1769aa", mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                                            <PersonIcon /> Thông Tin Cá Nhân
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <InfoField icon={<PersonIcon />} label="Tên khách hàng" value={customer.tenKhachHang} />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <InfoField icon={<BadgeIcon />} label="Mã khách hàng" value={customer.maKhachHang} />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <InfoField
                                                    icon={<CalendarTodayIcon />}
                                                    label={
                                                        (() => {
                                                            const age = calculateAge(customer.ngaySinh);
                                                            return age !== null && !isNaN(age)
                                                                ? `Ngày sinh (${age} tuổi )`
                                                                : "Ngày sinh";
                                                        })()
                                                    }
                                                    value={formatDate(customer.ngaySinh)}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <InfoField
                                                    icon={getGenderIcon(customer.gioiTinh)}
                                                    label="Giới tính"
                                                    value={getGenderLabel(customer.gioiTinh)}
                                                />
                                            </Grid>
                                        </Grid>
                                    </InfoCard>
                                </Grid>
                                {/* Contact Information */}
                                <Grid item xs={12}>
                                    <InfoCard>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: "#1769aa", mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                                            <EmailIcon /> Thông Tin Liên Hệ
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <InfoField icon={<EmailIcon />} label="Email" value={customer.email} color="#e91e63" />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <InfoField icon={<PhoneIcon />} label="Số điện thoại" value={customer.sdt} color="#ff9800" />
                                            </Grid>
                                        </Grid>
                                    </InfoCard>
                                </Grid>
                                {/* Address List */}
                                <Grid item xs={12}>
                                    <InfoCard>
                                        <AddressList addresses={customer.diaChis} />
                                    </InfoCard>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </StyledCard>
            </Box>
        </DashboardLayout>
    );
}

KhachHangDetail.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onClose: PropTypes.func,
}; 