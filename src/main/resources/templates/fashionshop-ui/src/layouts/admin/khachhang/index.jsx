import React, { useState, useEffect } from "react";
import {
    Card,
    IconButton,
    Button,
    Input,
    InputAdornment,
    Select,
    MenuItem,
    FormControl,
    Box,
    Avatar,
    Slider,
    Typography,
    RadioGroup,
    Radio,
    FormControlLabel
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { FaPlus, FaEye, FaFileExcel, FaFilePdf } from "react-icons/fa";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Icon from "@mui/material/Icon";
import SoftBox from "../../../components/SoftBox";
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import Footer from "../../../examples/Footer";
import Table from "../../../examples/Tables/Table";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
// --- sửa ở đây ---
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
// --- end sửa ---
import AddressDialog from "./dialog";
import dayjs from "dayjs";

const API_BASE_URL = "http://localhost:8080/khachHang";

const STATUS_OPTIONS = [
    { value: "", label: "Tất cả" },
    { value: 1, label: "Online" },
    { value: 0, label: "Offline" },
];
const GENDER_OPTIONS = [
    { value: "", label: "Tất cả" },
    { value: 1, label: "Nam" },
    { value: 0, label: "Nữ" },
    { value: 2, label: "Khác" },
];
const VIEW_OPTIONS = [5, 10, 20, 50];

const StyledRadioGroup = styled(RadioGroup)({
    display: "flex",
    flexDirection: "row",
    gap: 2,
    "& .MuiFormControlLabel-root": {
        margin: 0,
        marginRight: 8,
        "& .MuiRadio-root": {
            color: "#90caf9",
            padding: "4px",
            "&.Mui-checked": { color: "#1976d2" }
        },
        "& .MuiFormControlLabel-label": {
            fontSize: 13,
            fontWeight: 500,
            color: "#333",
            marginLeft: "6px"
        }
    }
});

function getGenderLabel(gender) {
    if (gender === "Nam" || gender === 1) return "Nam";
    if (gender === "Nữ" || gender === 0) return "Nữ";
    if (gender === "Khác" || gender === 2) return "Khác";
    return "Khác";
}
function getStatusLabel(status) {
    if (status === 1 || status === "Online") return "Online";
    if (status === 0 || status === "Offline") return "Offline";
    return "Offline";
}
function getPaginationItems(currentPage, totalPages) {
    if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const items = [];
    if (currentPage > 2) {
        items.push(1);
        if (currentPage > 3) items.push("...");
    }
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) {
        items.push(i);
    }
    if (currentPage < totalPages - 1) {
        if (currentPage < totalPages - 2) items.push("...");
        items.push(totalPages);
    }
    return items;
}

function CustomerTable() {
    const [customers, setCustomers] = useState([]);
    const [pagination, setPagination] = useState({
        totalPages: 0,
        pageNo: 1,
        pageSize: 5,
        totalElements: 0,
    });
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const [filterCustomerName, setFilterCustomerName] = useState("");
    const [filterEmail, setFilterEmail] = useState("");
    const [genderFilter, setGenderFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [ageRange, setAgeRange] = useState([0, 100]);
    const [minAge, setMinAge] = useState("");
    const [maxAge, setMaxAge] = useState("");
    const [showFilterSection, setShowFilterSection] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [addressDialogOpen, setAddressDialogOpen] = useState(false);
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        setMinAge(ageRange[0]);
        setMaxAge(ageRange[1]);
    }, [ageRange]);

    useEffect(() => {
        function fetchCustomers() {
            setLoading(true);
            setError(null);
            const params = {
                page: pageNo - 1,
                size: pageSize,
            };
            if (filterCustomerName) params.tenKhachHang = filterCustomerName;
            if (filterEmail) params.email = filterEmail;
            if (genderFilter) params.gioiTinh = genderFilter;
            if (statusFilter !== "") params.trangThai = statusFilter;
            if (minAge) params.minAge = minAge;
            if (maxAge) params.maxAge = maxAge;

            axios
                .get(API_BASE_URL, { params })
                .then((response) => {
                    setCustomers(response.data.content || []);
                    setPagination({
                        totalPages: response.data.totalPages,
                        pageNo: response.data.number + 1,
                        pageSize: response.data.size,
                        totalElements: response.data.totalElements,
                    });
                })
                .catch(() => {
                    setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
                    setCustomers([]);
                    setPagination({});
                })
                .finally(() => {
                    setLoading(false);
                });
        }
        fetchCustomers();
    }, [
        pageNo,
        pageSize,
        filterCustomerName,
        filterEmail,
        genderFilter,
        statusFilter,
        minAge,
        maxAge,
    ]);

    function handleFilterChange(setter) {
        return function (value) {
            setter(value);
            setPageNo(1);
        };
    }

    function handlePageChange(newPage) {
        if (
            typeof newPage === "number" &&
            newPage >= 1 &&
            newPage <= pagination.totalPages &&
            newPage !== pageNo
        ) {
            setPageNo(newPage);
        }
    }

    function handleRowsPerPageChange(e) {
        setPageSize(Number(e.target.value));
        setPageNo(1);
    }

    function handleGenderFilterChange(event) {
        setGenderFilter(event.target.value);
        setPageNo(1);
    }

    function handleStatusFilterChange(event) {
        setStatusFilter(event.target.value);
        setPageNo(1);
    }

    function handleAgeRangeChange(event, newValue) {
        setAgeRange(newValue);
        setMinAge(newValue[0]);
        setMaxAge(newValue[1]);
        setPageNo(1);
    }

    function handleResetFilters() {
        setFilterCustomerName("");
        setFilterEmail("");
        setGenderFilter("");
        setStatusFilter("");
        setAgeRange([0, 100]);
        setMinAge("");
        setMaxAge("");
        setPageNo(1);
    }

    function exportTableData() {
        return customers.map((item, idx) => [
            (pagination.pageNo - 1) * pagination.pageSize + idx + 1,
            item.maKhachHang,
            item.tenKhachHang,
            item.email,
            item.ngaySinh ? dayjs(item.ngaySinh).format("DD/MM/YYYY") : "",
            getGenderLabel(item.gioiTinh),
            getStatusLabel(item.trangThai),
        ]);
    }

    function handleExportExcel() {
        const sheetData = [
            [
                "STT",
                "Mã khách hàng",
                "Tên khách hàng",
                "Email",
                "Ngày sinh",
                "Giới tính",
                "Trạng thái",
            ],
        ].concat(exportTableData());
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, "KhachHang");
        XLSX.writeFile(workbook, "danh_sach_khach_hang.xlsx");
    }

    function handleExportPDF() {
        const doc = new jsPDF({ orientation: "landscape" });
        doc.setFontSize(17);
        doc.text("Danh sách khách hàng", 14, 18);
        // --- sửa ở đây ---
        autoTable(doc, {
            head: [
                [
                    "STT",
                    "Mã khách hàng",
                    "Tên khách hàng",
                    "Email",
                    "Ngày sinh",
                    "Giới tính",
                    "Trạng thái",
                ],
            ],
            body: exportTableData(),
            startY: 28,
            styles: { fontSize: 10 },
            headStyles: { fillColor: [73, 163, 241] },
        });
        // --- end sửa ---
        doc.save("danh_sach_khach_hang.pdf");
    }

    const columns = [
        { name: "stt", label: "STT", align: "center", width: "60px" },
        { name: "maKhachHang", label: "Mã KH", align: "left", width: "100px" },
        {
            name: "tenKhachHang",
            label: "Khách hàng",
            align: "left",
            width: "180px",
            render: (value, row) => (
                <Box display="flex" alignItems="center" gap={1.5}>
                    <Avatar src={row.hinhAnh || row.anh || "/default-avatar.png"} alt={value} />
                    <span>{value}</span>
                </Box>
            ),
        },
        { name: "email", label: "Email", align: "left", width: "180px" },
        {
            name: "ngaySinh",
            label: "Ngày sinh",
            align: "center",
            width: "120px",
            render: (value) => (value ? dayjs(value).format("DD/MM/YYYY") : ""),
        },
        {
            name: "gioiTinh",
            label: "Giới tính",
            align: "center",
            width: "90px",
            render: (value) => getGenderLabel(value),
        },
        {
            name: "trangThai",
            label: "Trạng thái",
            align: "center",
            width: "110px",
            render: (value) => {
                const label = getStatusLabel(value);
                const isActive = label === "Online";
                return (
                    <span
                        style={{
                            background: isActive ? "#e6f4ea" : "#f4f6fb",
                            color: isActive ? "#219653" : "#bdbdbd",
                            border: "1px solid " + (isActive ? "#219653" : "#bdbdbd"),
                            borderRadius: 6,
                            fontWeight: 500,
                            padding: "2px 12px",
                            fontSize: 13,
                            display: "inline-block",
                        }}
                    >
                        {label}
                    </span>
                );
            },
        },
        {
            name: "actions",
            label: "Thao tác",
            align: "center",
            width: "150px",
            render: (_, row) => (
                <SoftBox display="flex" gap={0.5} justifyContent="center">
                    <IconButton
                        size="small"
                        sx={{ color: "#1976d2", background: "rgba(25, 118, 210, 0.08)", "&:hover": { background: "rgba(25, 118, 210, 0.15)", transform: "scale(1.1)" }, transition: "all 0.2s ease" }}
                        title="Chi tiết"
                        onClick={() => navigate(`/khachhang/detail/${row.id}`)}
                    >
                        <FaEye />
                    </IconButton>
                    <IconButton
                        size="small"
                        sx={{ color: "#fbc02d", background: "rgba(251, 192, 45, 0.08)", "&:hover": { background: "rgba(251, 192, 45, 0.15)", transform: "scale(1.1)" }, transition: "all 0.2s ease" }}
                        title="Quản lý địa chỉ khách hàng"
                        onClick={() => {
                            setSelectedCustomerId(row.id);
                            setAddressDialogOpen(true);
                        }}
                    >
                        <LocationOnIcon />
                    </IconButton>
                </SoftBox>
            ),
        },
    ];

    const rows = customers.map((item, idx) => ({
        stt: (pagination.pageNo - 1) * pagination.pageSize + idx + 1,
        id: item.id,
        maKhachHang: item.maKhachHang,
        tenKhachHang: item.tenKhachHang,
        email: item.email,
        ngaySinh: item.ngaySinh,
        gioiTinh: item.gioiTinh,
        trangThai: item.trangThai,
        hinhAnh: item.hinhAnh || item.anh || "",
        actions: "",
    }));

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <SoftBox py={3} sx={{ background: "#F4F6FB", minHeight: "150vh", userSelect: "none" }}>
                {/* Filter and action buttons */}
                <Card sx={{ p: { xs: 2, md: 3 }, mb: 2 }}>
                    <SoftBox display="flex" flexDirection={{ xs: "column", md: "row" }} alignItems="center" justifyContent="space-between" gap={2}>
                        <SoftBox flex={1} display="flex" alignItems="center" gap={2} maxWidth={600}>
                            <Input
                                fullWidth
                                placeholder="Tìm kiếm theo tên"
                                value={filterCustomerName}
                                onChange={e => handleFilterChange(setFilterCustomerName)(e.target.value)}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <Icon fontSize="small" sx={{ color: "#868686" }}>
                                            search
                                        </Icon>
                                    </InputAdornment>
                                }
                                sx={{
                                    background: "#f5f6fa",
                                    borderRadius: 2,
                                    p: 0.5,
                                    color: "#222",
                                }}
                            />
                            {/*<Input*/}
                            {/*    fullWidth*/}
                            {/*    placeholder="Nhập email"*/}
                            {/*    value={filterEmail}*/}
                            {/*    onChange={e => handleFilterChange(setFilterEmail)(e.target.value)}*/}
                            {/*    sx={{*/}
                            {/*        background: "#f5f6fa",*/}
                            {/*        borderRadius: 2,*/}
                            {/*        p: 0.5,*/}
                            {/*        color: "#222",*/}
                            {/*        minWidth: 120,*/}
                            {/*    }}*/}
                            {/*/>*/}
                            <IconButton
                                onClick={() => setShowFilterSection(s => !s)}
                                sx={{
                                    color: showFilterSection ? "#fff" : "#49a3f1",
                                    border: "1px solid #49a3f1",
                                    borderRadius: 2,
                                    background: showFilterSection ? "#49a3f1" : "transparent",
                                    transition: "all 0.2s ease",
                                    "&:hover": {
                                        background: showFilterSection ? "#1769aa" : "rgba(73, 163, 241, 0.1)",
                                        transform: "scale(1.05)",
                                    }
                                }}
                                title={showFilterSection ? "Ẩn bộ lọc" : "Hiển thị bộ lọc"}
                            >
                                <Icon>filter_list</Icon>
                            </IconButton>
                        </SoftBox>
                        <SoftBox display="flex" alignItems="center" gap={1}>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<FaFileExcel />}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontWeight: 400,
                                    color: "#43a047",
                                    borderColor: "#43a047",
                                    boxShadow: "none",
                                    "&:hover": { borderColor: "#1769aa", background: "#e8f5e9", color: "#1769aa" },
                                }}
                                onClick={handleExportExcel}
                            >
                                Xuất Excel
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<FaFilePdf />}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontWeight: 400,
                                    color: "#d32f2f",
                                    borderColor: "#d32f2f",
                                    boxShadow: "none",
                                    "&:hover": { borderColor: "#1769aa", background: "#ffebee", color: "#1769aa" },
                                }}
                                onClick={handleExportPDF}
                            >
                                Xuất PDF
                            </Button>
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
                                    "&:hover": { borderColor: "#1769aa", background: "#f0f6fd", color: "#1769aa" },
                                }}
                                onClick={() => navigate("/khachhang/add")}
                            >
                                Thêm khách hàng
                            </Button>
                        </SoftBox>
                    </SoftBox>
                </Card>

                {/* Bộ lọc hiện đại */}
                {showFilterSection && (
                    <Card sx={{ p: { xs: 2, md: 2.5 }, mb: 2, background: "#f8fafc", border: "1px solid #e5e7eb" }}>
                        <SoftBox>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Icon sx={{ color: "#1769aa", fontSize: 20 }}>filter_list</Icon>
                                    <Typography variant="h6" fontWeight={600} fontSize={16} color="#1769aa">
                                        Bộ lọc
                                    </Typography>
                                </Box>
                                <IconButton
                                    onClick={() => setShowFilterSection(false)}
                                    size="small"
                                    sx={{ color: "#666", "&:hover": { background: "rgba(102, 102, 102, 0.1)" } }}
                                >
                                    <Icon fontSize="small">close</Icon>
                                </IconButton>
                            </Box>
                            <Box
                                display="grid"
                                gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" }}
                                gap={2.5}
                                alignItems="center"
                                mb={2}
                            >
                                {/* Giới tính */}
                                <Box minWidth={120}>
                                    <label style={{ fontWeight: 600, color: "#1769aa", mb: 0.5, fontSize: 13, display: "block" }}>Giới tính</label>
                                    <StyledRadioGroup
                                        name="filterGender"
                                        value={genderFilter}
                                        onChange={handleGenderFilterChange}
                                        row
                                    >
                                        {GENDER_OPTIONS.map(option => (
                                            <FormControlLabel
                                                key={option.value}
                                                value={option.value}
                                                control={<Radio />}
                                                label={option.label}
                                            />
                                        ))}
                                    </StyledRadioGroup>
                                </Box>
                                {/* Trạng thái */}
                                <Box minWidth={150}>
                                    <label style={{ fontWeight: 600, color: "#1769aa", mb: 0.5, fontSize: 13, display: "block" }}>Trạng thái</label>
                                    <StyledRadioGroup
                                        name="filterStatus"
                                        value={statusFilter}
                                        onChange={handleStatusFilterChange}
                                        row
                                    >
                                        {STATUS_OPTIONS.map(option => (
                                            <FormControlLabel
                                                key={option.value}
                                                value={option.value}
                                                control={<Radio />}
                                                label={option.label}
                                            />
                                        ))}
                                    </StyledRadioGroup>
                                </Box>
                                {/* Khoảng tuổi */}
                                <Box minWidth={180} maxWidth={260}>
                                    <label style={{ fontWeight: 600, color: "#1769aa", mb: 0.5, fontSize: 13, display: "block" }}>
                                        Khoảng tuổi: <strong>{ageRange[0]} - {ageRange[1]}</strong>
                                    </label>
                                    <Slider
                                        value={ageRange}
                                        onChange={handleAgeRangeChange}
                                        valueLabelDisplay="off"
                                        min={0}
                                        max={100}
                                        sx={{ mt: 1, width: "100%" }}
                                    />
                                </Box>
                            </Box>
                            <Box display="flex" gap={2} justifyContent="space-between" alignItems="center" pt={1} borderTop="1px solid #e5e7eb">
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<Icon fontSize="small">clear</Icon>}
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: "none",
                                        color: "#666",
                                        borderColor: "#ccc",
                                        fontWeight: 500,
                                        fontSize: 13,
                                        "&:hover": {
                                            borderColor: "#999",
                                            background: "rgba(102, 102, 102, 0.05)",
                                            color: "#333"
                                        },
                                    }}
                                    onClick={handleResetFilters}
                                >
                                    Xóa bộ lọc
                                </Button>
                                <Typography variant="body2" color="#666" fontWeight={500} fontSize={13}>
                                    Tìm thấy <strong>{pagination.totalElements || 0}</strong> khách hàng
                                </Typography>
                            </Box>
                        </SoftBox>
                    </Card>
                )}

                {/* Table and pagination */}
                <Card sx={{ p: { xs: 2, md: 3 }, mb: 2 }}>
                    <SoftBox>
                        {error ? (
                            <div className="alert alert-danger">{error}</div>
                        ) : (
                            <Table columns={columns} rows={rows} loading={loading} />
                        )}
                    </SoftBox>
                    <SoftBox
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mt={2}
                        flexWrap="wrap"
                        gap={2}
                    >
                        <FormControl sx={{ minWidth: 120 }}>
                            <Select
                                value={pageSize}
                                onChange={handleRowsPerPageChange}
                                size="small"
                            >
                                {VIEW_OPTIONS.map(number => (
                                    <MenuItem key={number} value={number}>
                                        Xem {number}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <SoftBox display="flex" alignItems="center" gap={1}>
                            <Button
                                variant="text"
                                size="small"
                                disabled={pagination.pageNo === 1}
                                onClick={() => handlePageChange(pagination.pageNo - 1)}
                                sx={{
                                    color: pagination.pageNo === 1 ? "#bdbdbd" : "#49a3f1",
                                }}
                            >
                                Trước
                            </Button>
                            {getPaginationItems(pagination.pageNo, pagination.totalPages).map((item, idx) =>
                                item === "..." ? (
                                    <Button
                                        key={"ellipsis-" + idx}
                                        variant="text"
                                        size="small"
                                        disabled
                                        sx={{
                                            minWidth: 32,
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
                                        variant={pagination.pageNo === item ? "contained" : "text"}
                                        color={pagination.pageNo === item ? "info" : "inherit"}
                                        size="small"
                                        onClick={() => handlePageChange(item)}
                                        sx={{
                                            minWidth: 32,
                                            borderRadius: 2,
                                            color:
                                                pagination.pageNo === item ? "#fff" : "#495057",
                                            background:
                                                pagination.pageNo === item
                                                    ? "#49a3f1"
                                                    : "transparent",
                                        }}
                                    >
                                        {item}
                                    </Button>
                                )
                            )}
                            <Button
                                variant="text"
                                size="small"
                                disabled={pagination.pageNo === pagination.totalPages}
                                onClick={() => handlePageChange(pagination.pageNo + 1)}
                                sx={{
                                    color:
                                        pagination.pageNo === pagination.totalPages
                                            ? "#bdbdbd"
                                            : "#49a3f1",
                                }}
                            >
                                Sau
                            </Button>
                        </SoftBox>
                    </SoftBox>
                </Card>
                <AddressDialog
                    customerId={selectedCustomerId}
                    open={addressDialogOpen}
                    onClose={() => setAddressDialogOpen(false)}
                />
            </SoftBox>
            <Footer />
        </DashboardLayout>
    );
}

export default CustomerTable;