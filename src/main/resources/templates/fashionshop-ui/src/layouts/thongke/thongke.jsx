import React from 'react';
import PropTypes from 'prop-types';
import Button from "@mui/material/Button";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TextField } from '@mui/material';
import Alert from "@mui/material/Alert";
import Table from "examples/Tables/Table";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { DateTimePicker } from "@mui/x-date-pickers";
import {
    Box,
    Card,
    Typography,
    Grid,
    Container
} from '@mui/material';
import {
    CalendarToday,
    Today,
    DateRange,
    Event
} from '@mui/icons-material';

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import SoftBox from "components/SoftBox";
import { useState, useEffect } from 'react';
import { fetchThongKeAlternative, loadThongKe } from './thongkeService';

function getPaginationItems(current, total) {
    if (total <= 7) {
        // Nếu tổng số trang <= 7, hiển thị tất cả
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    if (current <= 3) {
        // Nếu trang hiện tại ở đầu (1, 2, 3)
        return [1, 2, 3, 4, "...", total - 1, total];
    }

    if (current >= total - 2) {
        // Nếu trang hiện tại ở cuối
        return [1, 2, "...", total - 3, total - 2, total - 1, total];
    }

    // Nếu trang hiện tại ở giữa
    return [1, 2, "...", current - 1, current, current + 1, "...", total - 1, total];
}

const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    stats = []
}) => (
    <Card
        sx={{
            p: 4,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
            color: 'white',
            position: 'relative',
            overflow: 'hidden',

            minWidth: '500px',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '200px',
                height: '120px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
                transform: 'translate(30px, -30px)'
            }
        }}
    >
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
            <Box>
                <Icon sx={{ fontSize: 28, mb: 1, opacity: 0.9 }} />
                <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500, fontSize: '0.9rem' }}>
                    {title}
                </Typography>
            </Box>
        </Box>

        <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
            {value}
        </Typography>

        <Grid container spacing={2}>
            {stats.map((stat, index) => (
                <Grid item xs={3} key={index}>
                    <Box textAlign="center">
                        <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.75rem' }}>
                            {stat.label}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                            {stat.value}
                        </Typography>
                    </Box>
                </Grid>
            ))}
        </Grid>
    </Card>
);

// PropTypes validation for StatCard component
StatCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    color: PropTypes.string.isRequired,
    stats: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired
        })
    )
};

export default function DashboardStats() {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const error = null;
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewCount, setViewCount] = useState(5);
    const [page, setPage] = useState(1);
    const [statsData, setStatsData] = useState([]);
    const [search, setSearch] = useState("");
    const [vouchersData, setvouchersData] = useState({
        content: [],
        totalPages: 0,
        number: 0,
        first: true,
        last: true,
    });
    const paginationItems = getPaginationItems(page, vouchersData.totalPages);

    const viewOptions = [5, 10, 20];

    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handlePageChange = (newPage) => {
        if (
            newPage >= 1 &&
            newPage <= vouchersData.totalPages &&
            newPage !== page &&
            typeof newPage === "number"
        )
            setPage(newPage);
    };


    const columns = [
        { name: "anh", label: "Ảnh", align: "center", width: "60px" },
        { name: "tensp", label: "Tên Sản phẩm", align: "left" },
        { name: "soLuong", label: "Số lượng", align: "left" },
        { name: "giaTien", label: "Giá tiền", align: "left" },
        { name: "kichCo", label: "Kích cơ", align: "left" },

    ];

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await fetchThongKeAlternative(page - 1, viewCount, search, startDate, endDate);
            const mapped = data.data.content.map((item, idx) => ({
                tensp: item.tenSp,
                soLuong: item.soLuong,
                giaTien: item.giaTien,
                kichCo: item.kichCo,
            }));

            setRows(mapped);
            setvouchersData({
                ...data.data,
                content: mapped,
            });
        } catch (e) {
            console.error("Lỗi khi fetch vouchers", e);
            // Reset dữ liệu khi có lỗi
            setRows([]);
            setvouchersData({
                content: [],
                totalPages: 0,
                number: 0,
                first: true,
                last: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleClickStatus = (event) => {
        setSearch(event.target.value)
        setStartDate(null)
        setEndDate(null)
    }

    const loadTK = async () => {

        const data = await loadThongKe()
        setStatsData([
            {
                title: 'Hôm nay',
                value: data.data.homNay.tongTienTatCa,
                icon: Today,
                color: '#17a2b8',
                stats: [
                    { label: 'Sản phẩm', value: data.data.homNay.tongSanPham },
                    { label: 'Đơn thành công', value: data.data.homNay.tongDonHoanThanh },
                    { label: 'Đơn hủy', value: data.data.homNay.tongDonHuy }
                ]
            },
            {
                title: 'Tuần này',
                value: data.data.tuanNay.tongTienTatCa,
                icon: CalendarToday,
                color: '#fd7e14',
                stats: [
                    { label: 'Sản phẩm', value: data.data.tuanNay.tongSanPham },
                    { label: 'Đơn thành công', value: data.data.tuanNay.tongDonHoanThanh },
                    { label: 'Đơn hủy', value: data.data.tuanNay.tongDonHuy }
                ]
            },
            {
                title: 'Tháng này',
                value: data.data.thangNay.tongTienTatCa,
                icon: DateRange,
                color: '#007bff',
                stats: [
                    { label: 'Sản phẩm', value: data.data.thangNay.tongSanPham },
                    { label: 'Đơn thành công', value: data.data.thangNay.tongDonHoanThanh },
                    { label: 'Đơn hủy', value: data.data.thangNay.tongDonHuy }
                ]
            },
            {
                title: 'Năm này',
                value: data.data.namNay.tongTienTatCa,
                icon: Event,
                color: '#28a745',
                stats: [
                    { label: 'Sản phẩm', value: data.data.namNay.tongSanPham },
                    { label: 'Đơn thành công', value: data.data.namNay.tongDonHoanThanh },
                    { label: 'Đơn hủy', value: data.data.namNay.tongDonHuy }
                ]
            }
        ]);
    }

    useEffect(() => {
        loadTK()
    }, [])
    useEffect(() => {
        fetchData()
    }, [page, viewCount, startDate, endDate, search])

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <SoftBox py={3} sx={{ background: "#F4F6FB", minHeight: "100vh", userSelect: "none" }}>
                <Card sx={{ p: { xs: 2, md: 3 }, mb: 2 }}>
                    <Container maxWidth="xl" sx={{ py: 3 }}>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h5" sx={{ fontWeight: 600, color: '#495057', mb: 1 }}>
                                Thống kê
                            </Typography>
                        </Box>

                        <Grid container spacing={3}>
                            {statsData.map((stat, index) => (
                                <Grid item xs={12} sm={6} md={6} lg={3} key={index}>
                                    <StatCard {...stat} />
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </Card>
                <Card sx={{ p: { xs: 2, md: 3 }, mb: 2 }}>
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: '#495057', mb: 1 }}>
                            Bộ lọc
                        </Typography>
                    </Box>
                    <SoftBox
                        display="flex"
                        flexDirection={{ xs: "column", md: "row" }}
                        alignItems="center"
                        justifyContent="space-between"
                        gap={3}
                        flexWrap="wrap" // Thêm flexWrap để tránh bị đẩy
                    >
                        <SoftBox flex={1} display="flex" alignItems="center" gap={2} maxWidth={600}>
                            <Button
                                variant="outlined"
                                size="small"
                                value="0"
                                onClick={handleClickStatus}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontWeight: 400,
                                    fontSize: "0.75rem",         // Giảm cỡ chữ
                                    padding: "5px 12px",            // Giảm padding
                                    minWidth: "auto",            // Bỏ giới hạn min-width
                                    color: "#49a3f1",
                                    borderColor: "#49a3f1",
                                    boxShadow: "none",
                                    "&:hover": {
                                        borderColor: "#1769aa",
                                        background: "#f0f6fd",
                                        color: "#1769aa",
                                    },
                                }}
                            >
                                Ngày
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                value="1"
                                onClick={handleClickStatus}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontWeight: 400,
                                    fontSize: "0.75rem",         // Giảm cỡ chữ
                                    padding: "5px 12px",            // Giảm padding
                                    minWidth: "auto",            // Bỏ giới hạn min-width
                                    color: "#49a3f1",
                                    borderColor: "#49a3f1",
                                    boxShadow: "none",
                                    "&:hover": {
                                        borderColor: "#1769aa",
                                        background: "#f0f6fd",
                                        color: "#1769aa",
                                    },
                                }}
                            >
                                Tuần
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                value="2"
                                onClick={handleClickStatus}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontWeight: 400,
                                    fontSize: "0.75rem",         // Giảm cỡ chữ
                                    padding: "5px 12px",            // Giảm padding
                                    minWidth: "auto",            // Bỏ giới hạn min-width
                                    color: "#49a3f1",
                                    borderColor: "#49a3f1",
                                    boxShadow: "none",
                                    "&:hover": {
                                        borderColor: "#1769aa",
                                        background: "#f0f6fd",
                                        color: "#1769aa",
                                    },
                                }}
                            >
                                Tháng
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                value="3"
                                onClick={handleClickStatus}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontWeight: 400,
                                    fontSize: "0.75rem",         // Giảm cỡ chữ
                                    padding: "5px 12px",            // Giảm padding
                                    minWidth: "auto",            // Bỏ giới hạn min-width
                                    color: "#49a3f1",
                                    borderColor: "#49a3f1",
                                    boxShadow: "none",
                                    "&:hover": {
                                        borderColor: "#1769aa",
                                        background: "#f0f6fd",
                                        color: "#1769aa",
                                    },
                                }}
                            >
                                Năm
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                value="4"
                                onClick={handleClickStatus}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontWeight: 400,
                                    fontSize: "0.75rem",         // Giảm cỡ chữ
                                    padding: "5px 12px",          // Giảm padding
                                    minWidth: "auto",            // Bỏ giới hạn min-width
                                    color: "#49a3f1",
                                    borderColor: "#49a3f1",
                                    boxShadow: "none",
                                    "&:hover": {
                                        borderColor: "#1769aa",
                                        background: "#f0f6fd",
                                        color: "#1769aa",
                                    },
                                }}
                            >
                                Tùy chỉnh
                            </Button>
                        </SoftBox>

                        {/* Container riêng cho DateTimePicker với flex cố định */}
                        <SoftBox
                            display="flex"
                            alignItems="center"
                            gap={1}
                            minWidth={Number(search) === 4 ? 500 : 0} // Đặt minWidth khi hiển thị picker
                            sx={{
                                flexShrink: 0, // Không cho phép shrink
                            }}
                        >
                            {Number(search) === 4 && (
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                        <DateTimePicker
                                            label="Từ ngày"
                                            value={startDate}
                                            inputFormat="DD-MM-YYYY HH:mm"
                                            onChange={(newValue) => setStartDate(newValue)}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    size="small"
                                                    sx={{ minWidth: 200 }}
                                                />
                                            )}
                                        />
                                        <DateTimePicker
                                            label="Đến ngày"
                                            value={endDate}
                                            inputFormat="DD-MM-YYYY HH:mm"
                                            onChange={(newValue) => setEndDate(newValue)}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    size="small"
                                                    sx={{ minWidth: 200 }}
                                                />
                                            )}
                                        />
                                    </Box>
                                </LocalizationProvider>
                            )}
                        </SoftBox>

                        <SoftBox
                            display="flex"
                            alignItems="center"
                            gap={1}
                            sx={{ flexShrink: 0 }} // Không cho phép shrink
                        >
                            <Button
                                variant="outlined"
                                size="small"
                                sx={{
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontWeight: 400,
                                    color: "#49a3f1",
                                    borderColor: "#49a3f1",
                                    boxShadow: "none",
                                    minWidth: 120,
                                    "&:hover": {
                                        borderColor: "#1769aa",
                                        background: "#f0f6fd",
                                        color: "#1769aa",
                                    },
                                }}
                            >
                                Export To Excel
                            </Button>
                        </SoftBox>
                    </SoftBox>
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: '#495057', mb: 1 }}>
                            Danh sách sản phẩm bán chạy
                        </Typography>
                    </Box>
                    <Card sx={{ padding: { xs: 1, md: 3 } }}>
                        <Box display="flex" flexDirection="row">
                            <Box sx={{ width: "70%" }}>
                                <Box display="flex" flexDirection="column">

                                    {error && (
                                        <Alert severity="error" sx={{ mb: 2 }}>
                                            {error}
                                        </Alert>
                                    )}
                                    <SoftBox>
                                        <Table columns={columns} rows={rows} loading={loading} />
                                    </SoftBox>

                                    <SoftBox
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        mt={2}
                                        flexWrap="wrap"
                                        gap={2}
                                    >
                                        {/* View count selector - positioned on the left */}
                                        <SoftBox>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                sx={{
                                                    borderRadius: 2,
                                                    textTransform: "none",
                                                    color: "#49a3f1",
                                                    borderColor: "#49a3f1",
                                                }}
                                                aria-haspopup="true"
                                                aria-controls="view-count-menu"
                                                onClick={handleMenuOpen}
                                            >
                                                Xem {viewCount} phiếu
                                            </Button>
                                            <Menu
                                                anchorEl={anchorEl}
                                                id="view-count-menu"
                                                open={Boolean(anchorEl)}
                                                onClose={handleMenuClose}
                                            >
                                                {viewOptions.map((n) => (
                                                    <MenuItem
                                                        key={n}
                                                        onClick={() => {
                                                            setViewCount(n);
                                                            setPage(1);
                                                            handleMenuClose();
                                                        }}
                                                        sx={{ color: "#495057" }}
                                                    >
                                                        Xem {n} phiếu
                                                    </MenuItem>
                                                ))}
                                            </Menu>
                                        </SoftBox>

                                        {/* Pagination - positioned on the right */}
                                        <SoftBox display="flex" alignItems="center" gap={1}>
                                            <Button
                                                variant="text"
                                                size="small"
                                                disabled={page === 1}
                                                onClick={() => handlePageChange(page - 1)}
                                                sx={{ color: page === 1 ? "#bdbdbd" : "#49a3f1" }}
                                            >
                                                TRƯỚC
                                            </Button>
                                            {paginationItems.map((item, idx) =>
                                                item === "..." ? (
                                                    <Button
                                                        key={`ellipsis-${idx}`}
                                                        variant="text"
                                                        size="small"
                                                        disabled
                                                        sx={{
                                                            minWidth: 32,
                                                            height: 32,
                                                            borderRadius: 2,
                                                            color: "#bdbdbd",
                                                            pointerEvents: "none",
                                                            fontWeight: 700,
                                                        }}
                                                    >
                                                        ...
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        key={item}
                                                        variant={page === item ? "contained" : "text"}
                                                        color={page === item ? "primary" : "inherit"}
                                                        size="small"
                                                        onClick={() => handlePageChange(item)}
                                                        sx={{
                                                            minWidth: 32,
                                                            height: 32,
                                                            borderRadius: 2,
                                                            color: page === item ? "#fff" : "#495057",
                                                            background: page === item ? "#1976d2" : "transparent",
                                                            fontWeight: page === item ? 600 : 400,
                                                            "&:hover": {
                                                                background: page === item ? "#1565c0" : "rgba(25, 118, 210, 0.04)",
                                                            },
                                                        }}
                                                    >
                                                        {item}
                                                    </Button>
                                                )
                                            )}
                                            <Button
                                                variant="text"
                                                size="small"
                                                disabled={page === vouchersData.totalPages || vouchersData.totalPages === 0}
                                                onClick={() => handlePageChange(page + 1)}
                                                sx={{ color: page === vouchersData.totalPages ? "#bdbdbd" : "#49a3f1" }}
                                            >
                                                SAU
                                            </Button>
                                        </SoftBox>
                                    </SoftBox>

                                </Box>
                            </Box>
                        </Box>
                    </Card>

                </Card>
            </SoftBox>
        </DashboardLayout>
    );
};