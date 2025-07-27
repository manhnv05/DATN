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
import WorkIcon from "@mui/icons-material/Work";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";

const nhanVienDetailAPI = "http://localhost:8080/nhanVien";


// Styled Components
// StyledCard là container bao quanh: 
// header (nút quay lại, tiêu đề, nút chỉnh sửa) + phần hồ sơ (ProfileSection), và phần thông tin chi tiết (InfoCard).
const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: 20,//Bo góc cho Card
    background: "linear-gradient(135deg, #ffffff 0%, #f8faff 100%)",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)",
    padding: theme.spacing(4),//: Thêm khoảng đệm bên trong Card: 4 = 1rem = 16px: K.cách cho nội dung bên trong Card
    position: "relative",//Đặt vị trí tương đối: Để các p.tử con (nếu có): sử dụng position: absolute tham chiếu đến StyledCard
    overflow: "visible",
    width: "100%",
    margin: "0 auto",
    border: "0px solid rgba(23, 105, 170, 0.1)",
    height: "100%", // Thêm để lấp đầy chiều cao của container cha
    //Khi màn hình có chiều rộng lớn hơn 900px:
    [theme.breakpoints.up('md')]: {
        maxWidth: "100%",
    },
    //Khi màn hình có chiều rộng nhỏ hơn 900px:
    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(2),//Giảm khoảng đệm bên trong Card: 2 = 0.5rem = 8px. (tránh nội dung bị chật chội.)
    },
}));
//Phần bên trái: ProfileSection
const ProfileSection = styled(Box)(({ theme }) => ({
    background: "linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)",//nền gradient chuyển từ màu xanh lá đến màu xanh dương.
    borderRadius: 16,//Bo góc cho ProfileSection
    padding: theme.spacing(3),//Tạo không gian bên trong để nội dung (avatar, tên, chip, v.v.) không bị dính sát mép.
    textAlign: "center",//Căn giữa nội dung bên trong ProfileSection.
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
//Phần bên phải: InfoCard là container bao quanh: 
//header (tiêu đề, icon) + phần thông tin chi tiết (InfoField).
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
//StatusChip là chip hiển thị trạng thái của nhân viên.
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
//GenderChip là chip hiển thị giới tính của nhân viên.  
const GenderChip = styled(Chip)(({ gender, theme }) => ({
    fontWeight: 600,
    fontSize: "0.875rem",
    padding: "4px 12px",
    borderRadius: 20,
    backgroundColor: gender === "MALE"
        ? "rgba(33, 150, 243, 0.1)"
        : "rgba(233, 30, 99, 0.1)",
    color: gender === "MALE"
        ? theme.palette.primary.main
        : theme.palette.secondary.main,
    border: `1px solid ${gender === "MALE"
        ? theme.palette.primary.main
        : theme.palette.secondary.main}`,
}));

// Utility functions
const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    try {
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

const getStatusLabel = (trangThai) => {
    if (!trangThai) return "Chưa cập nhật";
    switch (trangThai.toUpperCase()) {
        case "ACTIVE":
            return "Đang làm việc";
        case "INACTIVE":
            return "Đã nghỉ việc";
        default:
            return "Không xác định";
    }
};

const getRoleLabel = (vaiTro) => {
    if (!vaiTro) return "Chưa cập nhật";
    switch (vaiTro.toUpperCase()) {
        case "ADMIN":
            return "Quản trị viên";
        case "EMPLOYEE":
            return "Nhân viên";
        default:
            return vaiTro;
    }
};
//
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

const calculateAge = (dateString) => {
    if (!dateString) return null;
    let day, month, year;
    if (typeof dateString === 'string' && dateString.includes('-')) {
        const parts = dateString.split('-');
        if (parts.length === 3) {
            day = parseInt(parts[0], 10);
            month = parseInt(parts[1], 10) - 1;
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

export default function NhanVienDetail(props) {
    const params = useParams();//hook từ react-router-dom: lấy id từ URL.
    const id = props.id || params.id;
    const navigate = useNavigate();//hook từ react-router-dom: dùng để chuyển hướng trang.

    const [nhanVien, setNhanVien] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;
        const fetchEmployeeData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(`${nhanVienDetailAPI}/${id}`);
                // Giả lập delay 300ms
                await new Promise(resolve => setTimeout(resolve, 1000));

                setNhanVien(response.data.data);
            } catch (err) {
                console.error("Error fetching employee data:", err);
                setError("Không thể tải thông tin nhân viên. Vui lòng thử lại.");
            } finally {
                setLoading(false);
            }
        };
        fetchEmployeeData();
    }, [id]);

    const handleGoBack = () => {
        navigate("/staff-management");
    };

    const handleEdit = () => {
        // Navigate to edit page or open edit modal
        navigate(`/nhanvien/update/${id}`);
    };

    if (loading) {
        return (
            <DashboardLayout>
                <DashboardNavbar />
                <Box
                    sx={{
                        height: "100vh",
                        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                        display: "flex",
                        flexDirection: "column", // Nội dung xếp theo cột
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Box textAlign="center">
                        <CircularProgress size={60} sx={{ color: "#1769aa", mb: 2 }} />
                        <Typography variant="h6" color="#1769aa" fontWeight={600}>
                            Đang tải thông tin nhân viên...
                        </Typography>
                    </Box>
                </Box>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <DashboardNavbar />
                <Box
                    sx={{
                        minHeight: "100vh",
                        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Box textAlign="center">
                        <Typography variant="h6" color="error" fontWeight={600} mb={2}>
                            {error}
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={handleGoBack}
                            sx={{
                                background: "#ffb4a2", // đỏ nhạt/cam nhạt
                                color: "#fff",
                                fontWeight: 700,
                                borderRadius: 2,
                                boxShadow: "0 2px 8px rgba(255, 105, 97, 0.15)",
                                px: 3,
                                py: 1,
                                "&:hover": {
                                    background: "#ff6f61", // đỏ/cam đậm hơn
                                    color: "#fff",
                                    boxShadow: "0 4px 16px rgba(255, 105, 97, 0.25)",
                                },
                            }}
                        >
                            Quay lại
                        </Button>
                    </Box>
                </Box>
            </DashboardLayout>
        );
    }

    if (!nhanVien) {
        return (
            <DashboardLayout>
                <DashboardNavbar />
                <Box
                    sx={{
                        minHeight: "100vh",
                        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Box textAlign="center">
                        <Typography variant="h6" color="error" fontWeight={600} mb={2}>
                            Không tìm thấy thông tin nhân viên
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={handleGoBack}
                            sx={{ backgroundColor: "#1769aa" }}
                        >
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
            <Box
                sx={{
                    height: "100vh",//Chiều cao tối thiểu của container cha: 100vh = 100% chiều cao của viewport.
                    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                    py: 4,//padding-top: 1rem = 16px, padding-bottom: 1rem = 16px.
                    pb: 0, // Đặt padding-bottom là 0px
                    borderRadius: "0 0 20px 20px",
                }}
            >
                <StyledCard>
                    {/* Header Section */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mb: 4,
                            flexWrap: "wrap",
                            gap: 2,
                        }}
                    >
                        {/* Icon Quay lại: nút quay lại trang nhân viên */}
                        <Tooltip title="Quay lại danh sách nhân viên" arrow>
                            <Button startIcon={<ArrowBackIcon />}
                                onClick={handleGoBack} variant="outlined"
                                sx={{
                                    color: "#1769aa", borderColor: "#b6e6f6", background: "#e3f2fd", fontWeight: 600, borderRadius: 2, px: 3, py: 1,
                                    transition: "all 0.2s",
                                    "&:hover": { background: "#1769aa", color: "#fff", borderColor: "#1769aa", boxShadow: "0 2px 8px rgba(23, 105, 170, 0.15)", },
                                }}
                            >
                                Quay lại
                            </Button>
                        </Tooltip>
                        {/* Tiêu đề: Chi Tiết Nhân Viên */}
                        <Typography
                            variant="h4"
                            sx={{ fontWeight: 800, color: "#1769aa", textAlign: "center", flex: 1, fontSize: { xs: "1.5rem", md: "2rem" }, }}
                        >
                            Chi Tiết Nhân Viên
                        </Typography>
                        {/* Icon Edit: nút chỉnh sửa thông tin nhân viên */}
                        <Tooltip title="Chỉnh sửa thông tin nhân viên" arrow>
                            <IconButton
                                onClick={handleEdit}
                                sx={{ backgroundColor: "#1769aa", color: "white", "&:hover": { backgroundColor: "#0d47a1", }, }}
                            >
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    {/* Main Content */}
                    <Grid container spacing={4}>
                        {/* Profile Section (Bên trái) */}
                        <Grid item xs={12} md={4}>
                            <ProfileSection>
                                {/* Avatar: hình ảnh nhân viên */}
                                <Avatar
                                    src={nhanVien.hinhAnh}
                                    alt={nhanVien.hoVaTen || "Nhân viên"}
                                    sx={{
                                        width: 180, height: 180,
                                        mx: "auto", mb: 2, border: "4px solid white",
                                        boxShadow: "0 8px 25px rgba(0,0,0,0.15)", fontSize: "3rem", backgroundColor: "#1769aa",
                                    }}
                                >
                                    {nhanVien.hoVaTen ? nhanVien.hoVaTen.charAt(0).toUpperCase() : "N"}
                                </Avatar>
                                {/* Họ và tên: nhân viên */}
                                <Typography
                                    variant="h5"
                                    sx={{ fontWeight: 700, color: "#1769aa", mb: 1, fontSize: { xs: "1.25rem", md: "1.5rem" }, }}
                                >
                                    {nhanVien.hoVaTen || "Chưa cập nhật"}
                                </Typography>

                                {/* Mã nhân viên: mã nhân viên */}
                                <Typography
                                    variant="body2"
                                    sx={{ color: "#666", mb: 2, fontWeight: 500, }}
                                >
                                    {nhanVien.maNhanVien || "Chưa có mã nhân viên"}
                                </Typography>

                                {/* Divider: đường kẻ ngang */}
                                <Divider sx={{ my: 2, opacity: 0.3 }} />

                                {/* StatusChip: trạng thái nhân viên */}
                                <Box sx={{ display: "flex", gap: 1, justifyContent: "center", mb: 2 }}>
                                    <StatusChip
                                        label={getStatusLabel(nhanVien.trangThai)}
                                        status={nhanVien.trangThai}
                                        size="small"
                                    />
                                    {/* GenderChip: giới tính nhân viên */}
                                    <GenderChip
                                        label={getGenderLabel(nhanVien.gioiTinh)}
                                        gender={nhanVien.gioiTinh}
                                        size="small"
                                    />
                                </Box>

                                {/* Chip: chức vụ nhân viên */}
                                <Chip
                                    label={getRoleLabel(nhanVien.vaiTro)}
                                    sx={{
                                        backgroundColor: "rgba(156, 39, 176, 0.1)",
                                        color: "#9c27b0",
                                        fontWeight: 600,
                                        fontSize: "0.875rem",
                                    }}
                                />
                            </ProfileSection>
                        </Grid>

                        {/* Information Section (Bên phải) */}
                        <Grid item xs={12} md={8}>
                            <Grid container spacing={3}>
                                {/* Personal Information (Thông tin cá nhân) */}
                                <Grid item xs={12}>
                                    <InfoCard>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 700,
                                                color: "#1769aa",
                                                mb: 3,
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                            }}
                                        >
                                            <PersonIcon />
                                            Thông Tin Cá Nhân
                                        </Typography>

                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <InfoField
                                                    icon={<PersonIcon />}
                                                    label="Họ và tên"
                                                    value={nhanVien.hoVaTen}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <InfoField
                                                    icon={<BadgeIcon />}
                                                    label="Mã nhân viên"
                                                    value={nhanVien.maNhanVien}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <InfoField
                                                    icon={<CalendarTodayIcon />}
                                                    label={
                                                        (() => {
                                                            const age = calculateAge(nhanVien.ngaySinh);
                                                            return age !== null && !isNaN(age)
                                                                ? `Ngày sinh (${age} tuổi)`
                                                                : "Ngày sinh";
                                                        })()
                                                    }
                                                    value={formatDate(nhanVien.ngaySinh)}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <InfoField
                                                    icon={<BadgeIcon />}
                                                    label="Căn cước công dân"
                                                    value={nhanVien.canCuocCongDan}
                                                />
                                            </Grid>
                                        </Grid>
                                    </InfoCard>
                                </Grid>

                                {/* Contact Information (Thông tin liên hệ) */}
                                <Grid item xs={12}>
                                    <InfoCard>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 700,
                                                color: "#1769aa",
                                                mb: 3,
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                            }}
                                        >
                                            <EmailIcon />
                                            Thông Tin Liên Hệ
                                        </Typography>

                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <InfoField
                                                    icon={<EmailIcon />}
                                                    label="Email"
                                                    value={nhanVien.email}
                                                    color="#e91e63"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <InfoField
                                                    icon={<PhoneIcon />}
                                                    label="Số điện thoại"
                                                    value={nhanVien.soDienThoai}
                                                    color="#ff9800"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <InfoField
                                                    icon={<LocationOnIcon />}
                                                    label="Địa chỉ"
                                                    value={nhanVien.diaChi}
                                                    color="#4caf50"
                                                />
                                            </Grid>
                                        </Grid>
                                    </InfoCard>
                                </Grid>

                                {/* Work Information (Thông tin công việc) */}
                                <Grid item xs={12}>
                                    <InfoCard>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 700,
                                                color: "#1769aa",
                                                mb: 3,
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                            }}
                                        >
                                            <WorkIcon />
                                            Thông Tin Công Việc
                                        </Typography>

                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <InfoField
                                                    icon={<WorkIcon />}
                                                    label="Chức vụ"
                                                    value={getRoleLabel(nhanVien.vaiTro)}
                                                    color="#9c27b0"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <InfoField
                                                    icon={<BadgeIcon />}
                                                    label="Trạng thái"
                                                    value={getStatusLabel(nhanVien.trangThai)}
                                                    color={nhanVien.trangThai === "ACTIVE" ? "#4caf50" : "#f44336"}
                                                />
                                            </Grid>
                                        </Grid>
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

NhanVienDetail.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onClose: PropTypes.func,
};