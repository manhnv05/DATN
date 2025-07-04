import React, { useState, useEffect } from "react";
import { Card, IconButton, Button, Input, InputAdornment, Select, MenuItem, FormControl, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, CircularProgress, Box, Avatar } from "@mui/material";
import { FaPlus, FaEye, FaTrash, FaFileExcel, FaFilePdf, FaEdit } from "react-icons/fa";
import Icon from "@mui/material/Icon";
import SoftBox from "components/SoftBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Notifications from "layouts/Notifications";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

// API URLs
const API_BASE_URL = "http://localhost:8080/nhanVien";

// Constants
const GENDER_OPTIONS = ["Tất cả", "Nam", "Nữ"];
const ROWS_PER_PAGE_OPTIONS = [5, 10, 20];
const STATUS_OPTIONS = [
    { value: 1, label: "Đang làm" },
    { value: 0, label: "Nghỉ" },
];

// Utility functions
const getGenderLabel = gender => gender === "Nam" || gender === 1 ? "Nam" : gender === "Nữ" || gender === 0 ? "Nữ" : "Khác";
const getStatusLabel = (status, options) => {
    const found = options.find(s => s.value === status || s.label === status);
    return found ? found.label : status === 1 || status === "Đang làm" ? "Đang làm" : "Nghỉ";
};
const formatDate = date => date ? new Date(date).toLocaleDateString("vi-VN") : "";
const getPaginationArray = (currentPage, totalPages) => {
    if (totalPages <= 4) return Array.from({ length: totalPages }, (_, i) => i);
    if (currentPage <= 1) return [0, 1, "...", totalPages - 2, totalPages - 1];
    if (currentPage >= totalPages - 2) return [0, 1, "...", totalPages - 2, totalPages - 1];
    return [0, 1, "...", currentPage, "...", totalPages - 2, totalPages - 1];
};

function NhanVienTable() {
    // State
    const [nhanVienData, setNhanVienData] = useState({ content: [], totalPages: 0, number: 0, first: true, last: true });

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [genderFilter, setGenderFilter] = useState("Tất cả");
    const [statusFilter, setStatusFilter] = useState("Tất cả");
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(0);
    const [notification, setNotification] = useState({ open: false, message: "", severity: "info" });
    const navigate = useNavigate();

    // Fetch employee data
    useEffect(() => {
        const fetchEmployees = async () => {
            setLoading(true);
            setError(null);
            try {
                const params = {
                    page: currentPage,
                    size: rowsPerPage,
                    hoVaTen: search,
                    ...(genderFilter !== "Tất cả" && { gioiTinh: genderFilter }),
                    ...(statusFilter !== "Tất cả" && { trangThai: STATUS_OPTIONS.find(s => s.label === statusFilter)?.value }),
                };
                const response = await axios.get(API_BASE_URL, { params });
                setNhanVienData({ ...response.data, content: response.data.content || [] });
            } catch {
                setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
                setNhanVienData({ content: [], totalPages: 0, number: 0, first: true, last: true });
            } finally {
                setLoading(false);
            }
        };
        fetchEmployees();
    }, [search, genderFilter, statusFilter, rowsPerPage, currentPage]);

    // Handlers
    const handlePageChange = newPage => typeof newPage === "number" && newPage >= 0 && newPage < nhanVienData.totalPages && newPage !== currentPage && setCurrentPage(newPage);
    const handleSearchChange = e => { setSearch(e.target.value); setCurrentPage(0); };
    const handleGenderFilterChange = e => { setGenderFilter(e.target.value); setCurrentPage(0); };
    const handleStatusFilterChange = e => { setStatusFilter(e.target.value); setCurrentPage(0); };
    const handleRowsPerPageChange = e => { setRowsPerPage(Number(e.target.value)); setCurrentPage(0); };
    const handleNotificationClose = (_, reason) => reason !== "clickaway" && setNotification({ ...notification, open: false });

    // Table configuration
    const columns = [
        { name: "stt", label: "STT", align: "center", width: "60px" },
        {
            name: "hinhAnh", label: "Ảnh", align: "center", width: "100px", render: (v, r) => (
                <Avatar src={v || "/default-avatar.png"} alt={r.hoVaTen} sx={{ width: 40, height: 40 }} />
            )
        },
        { name: "maNhanVien", label: "Mã nhân viên", align: "left", width: "90px" },
        { name: "hoVaTen", label: "Họ và tên", align: "left", width: "170px" },
        { name: "email", label: "Email", align: "left", width: "200px" },
        { name: "soDienThoai", label: "SĐT", align: "center", width: "120px" },
        { name: "ngaySinh", label: "Ngày sinh", align: "center", width: "120px", render: v => formatDate(v) },
        { name: "gioiTinh", label: "Giới tính", align: "center", width: "90px", render: v => getGenderLabel(v) },
        { name: "idVaiTro", label: "Vai trò", align: "center",width: "100px",
            render: (v) => {
                if (v === 1) return "Quản lý";
                if (v === 2) return "Nhân viên";
                return "Không xác định"; // fallback nếu có giá trị khác
            },
        },
        { name: "diaChi", label: "Địa chỉ", align: "center", width: "230px" },
        {
            name: "trangThai", label: "Trạng thái", align: "center", width: "110px", render: v => {
                const label = getStatusLabel(v, STATUS_OPTIONS), isWork = label === "Đang làm";
                return <span style={{ background: isWork ? "#e6f4ea" : "#f4f6fb", color: isWork ? "#219653" : "#bdbdbd", border: `1px solid ${isWork ? "#219653" : "#bdbdbd"}`, borderRadius: 6, fontWeight: 500, padding: "2px 12px", fontSize: 13, display: "inline-block" }}>{label}</span>;
            }
        },
        {
            name: "actions", label: "Thao tác", width: "140px", align: "center", render: (_, r) => (
                <SoftBox display="flex" gap={0.5} justifyContent="center">
                    <IconButton size="small" sx={{ color: "#4acbf2" }} title="Chi tiết" onClick={() => navigate(`/nhanvien/chitiet/${r.id}`)}><FaEye /></IconButton>
                    <IconButton size="small" sx={{ color: "#f7b731" }} title="Sửa" onClick={() => navigate(`/nhanvien/update/${r.id}`)}><FaEdit /></IconButton>
                </SoftBox>
            )
        },
    ];
    const rows = nhanVienData.content.map((item, idx) => ({
        stt: currentPage * rowsPerPage + idx + 1,
        id: item.id,
        hinhAnh: item.hinhAnh || "",
        maNhanVien: item.maNhanVien,
        hoVaTen: item.hoVaTen,
        email: item.email || "",
        soDienThoai: item.soDienThoai || "",
        ngaySinh: item.ngaySinh || "",
        gioiTinh: item.gioiTinh,
        idVaiTro: item.idVaiTro || "",
        diaChi: item.diaChi || "",
        trangThai: item.trangThai,
        actions: "",
    }));

    // Export handlers
    const exportTableData = () => nhanVienData.content.map((item, idx) => {
        const address = item.diaChi?.trim() ? item.diaChi : [item.xaPhuong, item.quanHuyen, item.tinhThanhPho].filter(Boolean).join(", ");
        return [currentPage * rowsPerPage + idx + 1, item.maNhanVien, item.hoVaTen, item.soDienThoai || item.sdt, getGenderLabel(item.gioiTinh), address, getStatusLabel(item.trangThai, STATUS_OPTIONS)];
    });

    const handleExportExcel = () => {
        const sheetData = [["STT", "Mã nhân viên", "Họ và tên", "Số điện thoại", "Giới tính", "Địa chỉ", "Trạng thái"], ...exportTableData()];
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, "NhanVien");
        XLSX.writeFile(workbook, "danh_sach_nhan_vien.xlsx");
    };

    const handleExportPDF = () => {
        const doc = new jsPDF({ orientation: "landscape" });
        doc.setFontSize(17);
        doc.text("Danh sách nhân viên", 14, 18);
        doc.autoTable({
            head: [["STT", "Mã nhân viên", "Họ và tên", "Số điện thoại", "Giới tính", "Địa chỉ", "Trạng thái"]],
            body: exportTableData(),
            startY: 28,
            styles: { fontSize: 10 },
            headStyles: { fillColor: [73, 163, 241] },
        });
        doc.save("danh_sach_nhan_vien.pdf");
    };

    return (
        <DashboardLayout>
            {/* Notifications */}
            <Notifications open={notification.open} onClose={handleNotificationClose} message={notification.message} severity={notification.severity} autoHideDuration={2500} />
            <DashboardNavbar />
            <SoftBox py={3} sx={{ background: "#F4F6FB", minHeight: "100vh", userSelect: "none" }}>
                {/* Filter and action buttons */}
                <Card sx={{ p: { xs: 2, md: 3 }, mb: 2 }}>
                    <SoftBox display="flex" flexDirection={{ xs: "column", md: "row" }} alignItems="center" justifyContent="space-between" gap={2}>
                        <SoftBox flex={1} display="flex" alignItems="center" gap={2} maxWidth={600}>
                            <Input fullWidth placeholder="Tìm kiếm nhân viên" value={search} onChange={handleSearchChange}
                                startAdornment={<InputAdornment position="start"><Icon fontSize="small" sx={{ color: "#868686" }}>search</Icon></InputAdornment>}
                                sx={{ background: "#f5f6fa", borderRadius: 2, p: 0.5, color: "#222" }} />
                            <FormControl sx={{ minWidth: 120 }}><Select value={genderFilter} onChange={handleGenderFilterChange} size="small" displayEmpty sx={{ borderRadius: 2, background: "#f5f6fa", height: 40 }} inputProps={{ "aria-label": "Giới tính" }}>
                                {GENDER_OPTIONS.map(gender => <MenuItem key={gender} value={gender}>{gender}</MenuItem>)}
                            </Select></FormControl>
                            <FormControl sx={{ minWidth: 120 }}><Select value={statusFilter} onChange={handleStatusFilterChange} size="small" displayEmpty sx={{ borderRadius: 2, background: "#f5f6fa", height: 40 }} inputProps={{ "aria-label": "Trạng thái" }}>
                                <MenuItem value="Tất cả">Tất cả</MenuItem>
                                {STATUS_OPTIONS.map(status => <MenuItem key={status.value} value={status.label}>{status.label}</MenuItem>)}
                            </Select></FormControl>
                        </SoftBox>
                        <SoftBox display="flex" alignItems="center" gap={1}>
                            <Button variant="outlined" size="small" startIcon={<FaFileExcel />} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 400, color: "#43a047", borderColor: "#43a047", boxShadow: "none", "&:hover": { borderColor: "#1769aa", background: "#e8f5e9", color: "#1769aa" } }} onClick={handleExportExcel}>Xuất Excel</Button>
                            <Button variant="outlined" size="small" startIcon={<FaFilePdf />} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 400, color: "#d32f2f", borderColor: "#d32f2f", boxShadow: "none", "&:hover": { borderColor: "#1769aa", background: "#ffebee", color: "#1769aa" } }} onClick={handleExportPDF}>Xuất PDF</Button>
                            <Button variant="outlined" size="small" startIcon={<FaPlus />} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 400, color: "#49a3f1", borderColor: "#49a3f1", boxShadow: "none", "&:hover": { borderColor: "#1769aa", background: "#f0f6fd", color: "#1769aa" } }} onClick={() => navigate("/nhanvien/add")}>Thêm nhân viên</Button>
                        </SoftBox>
                    </SoftBox>
                </Card>
                {/* Table and pagination */}
                <Card sx={{ p: { xs: 2, md: 3 }, mb: 2 }}>
                    <SoftBox>{error ? <div className="alert alert-danger">{error}</div> : <Table columns={columns} rows={rows} loading={loading} />}</SoftBox>
                    <SoftBox display="flex" justifyContent="space-between" alignItems="center" mt={2} flexWrap="wrap" gap={2}>
                        <FormControl sx={{ minWidth: 120 }}>
                            <Select value={rowsPerPage} onChange={handleRowsPerPageChange} size="small">
                                {ROWS_PER_PAGE_OPTIONS.map(number => <MenuItem key={number} value={number}>Xem {number}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <SoftBox display="flex" alignItems="center" gap={1}>
                            <Button variant="text" size="small" disabled={nhanVienData.first} onClick={() => handlePageChange(currentPage - 1)} sx={{ color: nhanVienData.first ? "#bdbdbd" : "#49a3f1" }}>Trước</Button>
                            {getPaginationArray(nhanVienData.number, nhanVienData.totalPages).map((item, idx) => item === "..." ? (
                                <Button key={`ellipsis-${idx}`} variant="text" size="small" disabled sx={{ minWidth: 32, borderRadius: 2, color: "#bdbdbd", pointerEvents: "none", fontWeight: 700 }}>...</Button>
                            ) : (
                                <Button key={item} variant={nhanVienData.number === item ? "contained" : "text"} color={nhanVienData.number === item ? "info" : "inherit"} size="small" onClick={() => handlePageChange(item)} sx={{ minWidth: 32, borderRadius: 2, color: nhanVienData.number === item ? "#fff" : "#495057", background: nhanVienData.number === item ? "#49a3f1" : "transparent" }}>{item + 1}</Button>
                            ))}
                            <Button variant="text" size="small" disabled={nhanVienData.last} onClick={() => handlePageChange(currentPage + 1)} sx={{ color: nhanVienData.last ? "#bdbdbd" : "#49a3f1" }}>Sau</Button>
                        </SoftBox>
                    </SoftBox>
                </Card>
            </SoftBox>
            <Footer />
        </DashboardLayout>
    );
}

export default NhanVienTable;