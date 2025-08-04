import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import SoftBox from "components/SoftBox";
import Table from "examples/Tables/Table";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Input from "@mui/material/Input";
import Footer from "examples/Footer";
import InputAdornment from "@mui/material/InputAdornment";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import { FaPlus, FaEdit } from "react-icons/fa";
import { fetchVouchersAlternative, updateStatustVoucher } from "./service/PhieuGiamService";
import dayjs from 'dayjs';
import { useNavigate } from "react-router-dom";
import Chip from "@mui/material/Chip";
import ThreeDotMenu from "components/Voucher/menu";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box, TextField } from '@mui/material';
import { DateTimePicker } from "@mui/x-date-pickers";

// Pagination: đã sửa logic để hiển thị đúng các trang
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

export default function PhieuGiamPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    // States
    const [statusFilter, setStatusFilter] = useState("Tất cả");
    const statusList = ["Tất cả", "Đang diễn ra", "Đã kết thúc", "Tạm dừng"];
    const [page, setPage] = useState(1);
    const [viewCount, setViewCount] = useState(5);

    const statusListVoucher = ["Tạm Dừng", "Bắt đầu", "Kết thúc"];

    // Menu cho view count selector
    const [anchorEl, setAnchorEl] = useState(null);

    const [vouchersData, setvouchersData] = useState({
        content: [],
        totalPages: 0,
        number: 0,
        first: true,
        last: true,
    });
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const error = null;

    useEffect(() => {
        if (location.state?.message) {
            console.log(location.state.message)
            toast.success(location.state.message);
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    // Handlers cho view count menu
    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleStatusChange = async (id, status) => {
        const res = await updateStatustVoucher(id, status)
        if (status == 1 && res.code == 200) {
            toast.success("Đổi trạng thái thành thành công, Đang diễn ra")
        }
        else if (status == 3 && res.code == 200) {
            toast.success("Đổi trạng thái thành thành công, Tạm dừng")
        }
        else if (status == 0 && res.code == 200) {
            toast.success("Đổi trạng thái thành thành công, Kết thúc")
        }
        else {
            toast.error("Đôi trạng thái không thành công")
        }
        fetchData()
    };

    const handlePageChange = (newPage) => {
        if (
            newPage >= 1 &&
            newPage <= vouchersData.totalPages &&
            newPage !== page &&
            typeof newPage === "number"
        )
            setPage(newPage);
    };

    const viewOptions = [5, 10, 20];

    function checkTrangThai(trangthai) {
        if (trangthai === 0) {
            return (
                <Chip
                    label="Đã kết thúc"
                    size="small"
                    sx={{
                        backgroundColor: '#fef2f2',
                        color: '#b91c1c',
                        fontWeight: 500,
                        fontSize: '12px',
                        height: '28px',
                        '& .MuiChip-label': {
                            paddingX: '12px'
                        }
                    }}
                />
            );
        }
        else if (trangthai === 1) {
            return (
                <Chip
                    label="Đang diễn ra"
                    size="small"
                    sx={{
                        backgroundColor: '#f0fdf4',
                        color: '#15803d',
                        fontWeight: 500,
                        fontSize: '12px',
                        height: '28px',
                        '& .MuiChip-label': {
                            paddingX: '12px'
                        }
                    }}
                />
            );
        }
        else if (trangthai === 2) {
            return (
                <Chip
                    label="Chưa bắt đầu"
                    size="small"
                    sx={{
                        backgroundColor: '#eff6ff',
                        color: '#1d4ed8',
                        fontWeight: 500,
                        fontSize: '12px',
                        height: '28px',
                        '& .MuiChip-label': {
                            paddingX: '12px'
                        }
                    }}
                />
            );
        }
        else {
            return (
                <Chip
                    label="Tạm dừng"
                    size="small"
                    sx={{
                        backgroundColor: '#f9fafb',
                        color: '#374151',
                        fontWeight: 500,
                        fontSize: '12px',
                        height: '28px',
                        '& .MuiChip-label': {
                            paddingX: '12px'
                        }
                    }}
                />
            );
        }
    }

    function checkLoaiPhieu(Loai) {
        return <Chip
            label={Loai === 0 ? 'Công khai' : 'Cá nhân'}
            size="small"
            sx={{
                fontWeight: 500,
                color: 'white',
                backgroundColor: Loai === 0 ? '#2ecc71' : '#3498db', // custom màu
            }}
        />
    }

    function checkGiaTriGiam(data) {
        if (data.phamTramGiamGia) {
            return data.phamTramGiamGia + " %"
        }
        else {
            return data.soTienGiam.toLocaleString("vi-VN") + " ₫" ?? ""
        }
    }
    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await fetchVouchersAlternative(page - 1, viewCount, search, startDate, endDate, statusFilter);
            const mapped = data.data.content.map((item, idx) => ({
                stt: (page - 1) * viewCount + idx + 1,
                id: item.id,
                maPhieuGiamGia: item.maPhieuGiamGia,
                tenPhieu: item.tenPhieu,
                loaiPhieu: checkLoaiPhieu(item.loaiPhieu),
                phamTramGiamGia: checkGiaTriGiam(item),
                soTienGiam: checkGiaTriGiam(item),
                giamToiDa: item.giamToiDa?.toLocaleString("vi-VN") + " ₫" ?? "",
                ngayBatDau: dayjs(item.ngayBatDau).format("DD/MM/YYYY HH:mm"),
                ngayKetThuc: dayjs(item.ngayKetThuc).format("DD/MM/YYYY HH:mm"),
                trangThai: checkTrangThai(item.trangThai),
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
    useEffect(() => {
        fetchData();
    }, [page, viewCount, startDate, endDate, search, statusFilter]);

    // Pagination rendering
    const paginationItems = getPaginationItems(page, vouchersData.totalPages);

    const columns = [
        { name: "stt", label: "STT", align: "center", width: "60px" },
        { name: "maPhieuGiamGia", label: "Mã phiếu", align: "left" },
        {
            name: "tenPhieu", label: "Tên phiếu", align: "left",
            render: (value, row) => (value)
        },
        { name: "loaiPhieu", label: "Loại phiếu", align: "center" },
        { name: "soTienGiam", label: "Giá trị giảm", align: "right" },
        { name: "giamToiDa", label: "Giảm tối đa", align: "right" },
        { name: "ngayBatDau", label: "Bắt đầu", align: "center" },
        { name: "ngayKetThuc", label: "Kết thúc", align: "center" },
        { name: "trangThai", label: "Trạng thái", align: "center" },
        {
            name: "actions",
            label: "Thao tác",
            align: "center",
            width: "110px",
            render: (_, row) => (
                <SoftBox display="flex" gap={0.5} justifyContent="center">
                    <ThreeDotMenu
                        statusList={statusListVoucher}
                        onSelectStatus={(status) => handleStatusChange(row.id, status)}
                    />

                    <IconButton
                        size="small"
                        sx={{ color: "#4acbf2" }}
                        title="Sửa"
                        onClick={() => navigate(`/PhieuGiam/update/${row.id}`)}
                    >
                        <FaEdit />
                    </IconButton>
                </SoftBox>
            ),
        },
    ];

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <SoftBox py={3} sx={{ background: "#F4F6FB", minHeight: "100vh", userSelect: "none" }}>
                <Card sx={{ p: { xs: 2, md: 3 }, mb: 2 }}>
                    <SoftBox
                        display="flex"
                        flexDirection={{ xs: "column", md: "row" }}
                        alignItems="center"
                        justifyContent="space-between"
                        gap={2}
                    >
                        <SoftBox flex={1} display="flex" alignItems="center" gap={2} maxWidth={600}>
                            <Input
                                fullWidth
                                placeholder="Tìm theo tên hoặc mã"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <Icon fontSize="small" sx={{ color: "#868686" }}>
                                            search
                                        </Icon>
                                    </InputAdornment>
                                }
                                sx={{ background: "#f5f6fa", borderRadius: 2, p: 0.5, color: "#222" }}
                            />

                            <FormControl sx={{ minWidth: 140 }}>
                                <Select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    size="small"
                                    displayEmpty
                                    sx={{ borderRadius: 2, background: "#f5f6fa", height: 40 }}
                                    inputProps={{ "aria-label": "Trạng thái" }}
                                >
                                    {statusList.map((status) => (
                                        <MenuItem key={status} value={status}>
                                            {status}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Box>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <DateTimePicker
                                            label="Từ ngày"
                                            value={startDate}
                                            inputFormat="DD-MM-YYYY HH:mm"
                                            onChange={(newValue) => setStartDate(newValue)}
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                        <DateTimePicker
                                            label="Đến ngày"
                                            value={endDate}
                                            inputFormat="DD-MM-YYYY HH:mm"
                                            onChange={(newValue) => setEndDate(newValue)}
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                    </Box>
                                </LocalizationProvider>
                            </Box>
                        </SoftBox>
                        <SoftBox display="flex" alignItems="center" gap={1}>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<FaPlus />}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontWeight: 400,
                                    color: "#49a3f1",
                                    borderColor: "#49a3f1",
                                    boxShadow: "none",
                                    "&:hover": {
                                        borderColor: "#1769aa",
                                        background: "#f0f6fd",
                                        color: "#1769aa",
                                    },
                                }}
                                onClick={() => navigate("/PhieuGiam/ThemMoi")}
                            >
                                Thêm phiếu giảm giá
                            </Button>
                        </SoftBox>
                    </SoftBox>
                </Card>

                {/* Table + Pagination */}
                <Card sx={{ p: { xs: 2, md: 3 }, mb: 2 }}>
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
                </Card>
            </SoftBox>
            <Footer />
        </DashboardLayout>
    );
}