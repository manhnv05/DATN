import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Input from "@mui/material/Input";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import SoftBox from "components/SoftBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Icon from "@mui/material/Icon";
import Table from "examples/Tables/Table";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEye, FaTrash, FaFileExcel, FaFilePdf, FaEdit } from "react-icons/fa";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";
import DialogContentText from "@mui/material/DialogContentText";
import Avatar from "@mui/material/Avatar";
import Notifications from "layouts/Notifications";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const genderOptions = ["Tất cả", "Nam", "Nữ", "Khác"];
const rowsPerPageOptions = [5, 10, 20];
const apiBaseUrl = "http://localhost:8080/nhanVien";
const provinceApiUrl = "https://provinces.open-api.vn/api/?depth=1";
const districtApiUrl = code => `https://provinces.open-api.vn/api/p/${code}?depth=2`;
const wardApiUrl = code => `https://provinces.open-api.vn/api/d/${code}?depth=2`;
const roleListAPI = "http://localhost:8080/vaiTro/list";

function getGenderLabel(gender) {
    if (gender === "Nam" || gender === 1) return "Nam";
    if (gender === "Nữ" || gender === 0) return "Nữ";
    return "Khác";
}

const STATUS_OPTIONS = [
    { value: 1, label: "Đang hoạt động" },
    { value: 0, label: "Ngừng hoạt động" },
];

function getStatusLabel(status, statusOptions) {
    const found = statusOptions.find(s => s.value === status || s.label === status);
    if (found) return found.label;
    if (status === 1 || status === "Đang hoạt động") return "Đang hoạt động";
    return "Ngừng hoạt động";
}

function getPaginationArray(currentPage, totalPages) {
    if (totalPages <= 4) {
        return Array.from({ length: totalPages }, (_, i) => i);
    }
    if (currentPage <= 1) {
        return [0, 1, "...", totalPages - 2, totalPages - 1];
    }
    if (currentPage >= totalPages - 2) {
        return [0, 1, "...", totalPages - 2, totalPages - 1];
    }
    return [0, 1, "...", currentPage, "...", totalPages - 2, totalPages - 1];
}

function getRoleName(vaiTro, roleOptions) {
    if (vaiTro && typeof vaiTro === "object" && vaiTro.ten) {
        return vaiTro.ten;
    }
    if (typeof vaiTro === "string") {
        return vaiTro;
    }
    if (vaiTro) {
        const found = roleOptions.find(function (role) {
            return role.id === vaiTro || String(role.id) === String(vaiTro);
        });
        if (found) {
            return found.ten;
        }
    }
    return "Chưa xác định";
}

function NhanVienTable() {
    const [nhanVienData, setNhanVienData] = useState({
        content: [],
        totalPages: 0,
        number: 0,
        first: true,
        last: true,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [genderFilter, setGenderFilter] = useState("Tất cả");
    const [statusFilter, setStatusFilter] = useState("Tất cả");
    const [statusOptions] = useState(STATUS_OPTIONS);
    const [roleOptions, setRoleOptions] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(0);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [editForm, setEditForm] = useState({
        maNhanVien: "",
        hoVaTen: "",
        soDienThoai: "",
        gioiTinh: "",
        tinhThanhPho: "",
        quanHuyen: "",
        xaPhuong: "",
        trangThai: "",
        hinhAnh: "",
        canCuocCongDan: "",
        email: "",
        vaiTro: "",
        ngaySinh: "",
        matKhau: "",
        diaChi: "",
        diaChiCuThe: ""
    });
    const [editSaving, setEditSaving] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingEmployee, setDeletingEmployee] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "info",
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchEmployees();
    }, [search, genderFilter, statusFilter, rowsPerPage, currentPage]);

    async function fetchEmployees() {
        setLoading(true);
        setError(null);
        try {
            let params = {
                page: currentPage,
                size: rowsPerPage,
                hoVaTen: search,
            };
            if (genderFilter !== "Tất cả") {
                params.gioiTinh = genderFilter;
            }
            if (statusFilter !== "Tất cả") {
                const statusObj = statusOptions.find(s => s.label === statusFilter);
                if (statusObj) {
                    params.trangThai = statusObj.value;
                }
            }
            const response = await axios.get(apiBaseUrl, { params });
            setNhanVienData({
                ...response.data,
                content: response.data.content || [],
            });
        } catch (error) {
            setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
            setNhanVienData({
                content: [],
                totalPages: 0,
                number: 0,
                first: true,
                last: true,
            });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        axios.get(provinceApiUrl).then(res => setProvinces(res.data || []));
        axios.get(roleListAPI).then(res => setRoleOptions(Array.isArray(res.data) ? res.data : []));
    }, []);

    useEffect(() => {
        if (editForm.tinhThanhPho) {
            axios.get(districtApiUrl(editForm.tinhThanhPho)).then(res => {
                setDistricts(res.data && res.data.districts ? res.data.districts : []);
            });
        } else {
            setDistricts([]);
        }
        setEditForm(f => ({ ...f, quanHuyen: "", xaPhuong: "" }));
        setWards([]);
    }, [editForm.tinhThanhPho]);

    useEffect(() => {
        if (editForm.quanHuyen) {
            axios.get(wardApiUrl(editForm.quanHuyen)).then(res => {
                setWards(res.data && res.data.wards ? res.data.wards : []);
            });
        } else {
            setWards([]);
        }
        setEditForm(f => ({ ...f, xaPhuong: "" }));
    }, [editForm.quanHuyen]);

    function handlePageChange(newPage) {
        if (
            typeof newPage === "number" &&
            newPage >= 0 &&
            newPage < nhanVienData.totalPages &&
            newPage !== currentPage
        ) {
            setCurrentPage(newPage);
        }
    }

    function handleSearchChange(event) {
        setSearch(event.target.value);
        setCurrentPage(0);
    }
    function handleGenderFilterChange(event) {
        setGenderFilter(event.target.value);
        setCurrentPage(0);
    }
    function handleStatusFilterChange(event) {
        setStatusFilter(event.target.value);
        setCurrentPage(0);
    }
    function handleRowsPerPageChange(event) {
        setRowsPerPage(Number(event.target.value));
        setCurrentPage(0);
    }

    async function handleEditOpen(employee) {
        setEditingEmployee(employee);
        try {
            const response = await axios.get(`${apiBaseUrl}/${employee.id}`);
            const detail = response.data;
            let diaChiCuThe = "";
            let xa = "";
            let huyen = "";
            let tinh = "";
            if (detail.diaChi) {
                let arr = detail.diaChi.split(" - ");
                if (arr.length > 3) {
                    diaChiCuThe = arr.slice(0, arr.length - 3).join(" - ");
                    xa = arr[arr.length - 3];
                    huyen = arr[arr.length - 2];
                    tinh = arr[arr.length - 1];
                } else {
                    diaChiCuThe = "";
                }
            }
            setEditForm({
                maNhanVien: detail.maNhanVien || "",
                hoVaTen: detail.hoVaTen || "",
                soDienThoai: detail.soDienThoai || detail.sdt || "",
                gioiTinh: detail.gioiTinh || "",
                tinhThanhPho: detail.tinhThanhPho || tinh || "",
                quanHuyen: detail.quanHuyen || huyen || "",
                xaPhuong: detail.xaPhuong || xa || "",
                trangThai: detail.trangThai !== undefined ? detail.trangThai : "",
                hinhAnh: detail.hinhAnh || detail.anh || "",
                canCuocCongDan: detail.canCuocCongDan || "",
                email: detail.email || "",
                vaiTro: detail.vaiTro && detail.vaiTro.id ? detail.vaiTro.id : "",
                ngaySinh: detail.ngaySinh || "",
                matKhau: detail.matKhau || "",
                diaChi: detail.diaChi || "",
                diaChiCuThe: diaChiCuThe
            });
        } catch (error) {
            setEditForm({
                maNhanVien: employee.maNhanVien || "",
                hoVaTen: employee.hoVaTen || employee.hoTen || "",
                soDienThoai: employee.soDienThoai || employee.sdt || "",
                gioiTinh: employee.gioiTinh || "",
                tinhThanhPho: employee.tinhThanhPho || "",
                quanHuyen: employee.quanHuyen || "",
                xaPhuong: employee.xaPhuong || "",
                trangThai: employee.trangThai !== undefined ? employee.trangThai : "",
                hinhAnh: employee.hinhAnh || employee.anh || "",
                canCuocCongDan: employee.canCuocCongDan || "",
                email: employee.email || "",
                vaiTro: employee.vaiTro && employee.vaiTro.id ? employee.vaiTro.id : "",
                ngaySinh: employee.ngaySinh || "",
                matKhau: employee.matKhau || "",
                diaChi: employee.diaChi || "",
                diaChiCuThe: ""
            });
        }
        setEditDialogOpen(true);
    }

    function handleEditClose() {
        setEditDialogOpen(false);
        setEditingEmployee(null);
        setEditForm({
            maNhanVien: "",
            hoVaTen: "",
            soDienThoai: "",
            gioiTinh: "",
            tinhThanhPho: "",
            quanHuyen: "",
            xaPhuong: "",
            trangThai: "",
            hinhAnh: "",
            canCuocCongDan: "",
            email: "",
            vaiTro: "",
            ngaySinh: "",
            matKhau: "",
            diaChi: "",
            diaChiCuThe: ""
        });
    }

    function handleEditChange(event) {
        let value = event.target.value;
        setEditForm({ ...editForm, [event.target.name]: value });
    }

    async function handleEditSave() {
        if (!editingEmployee) return;
        setEditSaving(true);
        try {
            let xa = "";
            let huyen = "";
            let tinh = "";
            if (wards.length > 0 && editForm.xaPhuong) {
                const foundWard = wards.find(w => w.code === editForm.xaPhuong);
                xa = foundWard && foundWard.name ? foundWard.name : editForm.xaPhuong;
            } else {
                xa = editForm.xaPhuong;
            }
            if (districts.length > 0 && editForm.quanHuyen) {
                const foundDistrict = districts.find(d => d.code === editForm.quanHuyen);
                huyen = foundDistrict && foundDistrict.name ? foundDistrict.name : editForm.quanHuyen;
            } else {
                huyen = editForm.quanHuyen;
            }
            if (provinces.length > 0 && editForm.tinhThanhPho) {
                const foundProvince = provinces.find(p => p.code === editForm.tinhThanhPho);
                tinh = foundProvince && foundProvince.name ? foundProvince.name : editForm.tinhThanhPho;
            } else {
                tinh = editForm.tinhThanhPho;
            }
            const diaChiCuThe = editForm.diaChiCuThe || "";
            const diaChi = [diaChiCuThe, xa, huyen, tinh].filter(Boolean).join(" - ");
            await axios.put(
                `${apiBaseUrl}/${editingEmployee.id}`,
                {
                    maNhanVien: editForm.maNhanVien,
                    hoVaTen: editForm.hoVaTen,
                    soDienThoai: editForm.soDienThoai,
                    gioiTinh: editForm.gioiTinh,
                    tinhThanhPho: editForm.tinhThanhPho,
                    quanHuyen: editForm.quanHuyen,
                    xaPhuong: editForm.xaPhuong,
                    trangThai: editForm.trangThai,
                    hinhAnh: editForm.hinhAnh,
                    canCuocCongDan: editForm.canCuocCongDan,
                    email: editForm.email,
                    vaiTro: editForm.vaiTro,
                    ngaySinh: editForm.ngaySinh,
                    matKhau: editForm.matKhau,
                    diaChi: diaChi
                }
            );
            handleEditClose();
            setNotification({
                open: true,
                message: "Cập nhật nhân viên thành công!",
                severity: "success",
            });
            fetchEmployees();
        } catch (error) {
            setNotification({
                open: true,
                message: "Sửa nhân viên thất bại!",
                severity: "error",
            });
        } finally {
            setEditSaving(false);
        }
    }

    function handleDeleteOpen(employee) {
        setDeletingEmployee(employee);
        setDeleteDialogOpen(true);
    }
    function handleDeleteClose() {
        setDeleteDialogOpen(false);
        setDeletingEmployee(null);
    }
    async function handleDeleteConfirm() {
        if (!deletingEmployee) return;
        setDeleteLoading(true);
        try {
            await axios.delete(`${apiBaseUrl}/${deletingEmployee.id}`);
            handleDeleteClose();
            setNotification({
                open: true,
                message: "Xóa nhân viên thành công!",
                severity: "success",
            });
            fetchEmployees();
        } catch (error) {
            setNotification({
                open: true,
                message: "Xóa nhân viên thất bại!",
                severity: "error",
            });
        } finally {
            setDeleteLoading(false);
        }
    }
    function handleNotificationClose(event, reason) {
        if (reason === "clickaway") return;
        setNotification({ ...notification, open: false });
    }

    const columns = [
        { name: "stt", label: "STT", align: "center", width: "60px" },
        {
            name: "maNhanVien",
            label: "Mã nhân viên",
            align: "left",
            width: "90px",
        },
        {
            name: "hoVaTen",
            label: "Họ và tên",
            align: "left",
            width: "170px",
            render: (value, row) => (
                <Box display="flex" alignItems="center" gap={1.5}>
                    <Avatar src={row.hinhAnh || row.anh || "/default-avatar.png"} alt={value} />
                    <span>{value}</span>
                </Box>
            ),
        },
        {
            name: "vaiTro",
            label: "Chức vụ",
            align: "center",
            width: "110px",
            render: (value, row) => getRoleName(row.vaiTro, roleOptions),
        },
        {
            name: "soDienThoai",
            label: "Số điện thoại",
            align: "center",
            width: "120px",
        },
        {
            name: "gioiTinh",
            label: "Giới tính",
            align: "center",
            width: "90px",
            render: value => getGenderLabel(value),
        },
        {
            name: "diaChi",
            label: "Địa chỉ",
            align: "center",
            width: "230px",
            render: (_, row) => {
                if (row.diaChi && row.diaChi.trim() !== "") return row.diaChi;
                let xa = row.xaPhuong || "";
                let huyen = row.quanHuyen || "";
                let tinh = row.tinhThanhPho || "";
                return [xa, huyen, tinh].filter(Boolean).join(", ");
            },
        },
        {
            name: "trangThai",
            label: "Trạng thái",
            align: "center",
            width: "110px",
            render: value => (
                <span
                    style={{
                        background: getStatusLabel(value, statusOptions) === "Đang làm" ? "#e6f4ea" : "#f4f6fb",
                        color: getStatusLabel(value, statusOptions) === "Đang làm" ? "#219653" : "#bdbdbd",
                        border: "1px solid " + (getStatusLabel(value, statusOptions) === "Đang làm" ? "#219653" : "#bdbdbd"),
                        borderRadius: 6,
                        fontWeight: 500,
                        padding: "2px 12px",
                        fontSize: 13,
                        display: "inline-block",
                    }}
                >
                    {getStatusLabel(value, statusOptions)}
                </span>
            ),
        },
        {
            name: "actions",
            label: "Thao tác",
            align: "center",
            width: "140px",
            render: (_, row) => (
                <SoftBox display="flex" gap={0.5} justifyContent="center">
                    <IconButton
                        size="small"
                        sx={{ color: "#4acbf2" }}
                        title="Chi tiết"
                        onClick={() => navigate("/nhanvien/chitiet/" + row.id)}
                    >
                        <FaEye />
                    </IconButton>
                    <IconButton
                        size="small"
                        sx={{ color: "#f7b731" }}
                        title="Sửa"
                        onClick={() => handleEditOpen(row)}
                    >
                        <FaEdit />
                    </IconButton>
                    <IconButton
                        size="small"
                        sx={{ color: "#e74c3c" }}
                        title="Xóa"
                        onClick={() => handleDeleteOpen(row)}
                    >
                        <FaTrash />
                    </IconButton>
                </SoftBox>
            ),
        },
    ];

    const rows = nhanVienData.content.map((item, idx) => ({
        stt: currentPage * rowsPerPage + idx + 1,
        id: item.id,
        maNhanVien: item.maNhanVien,
        hoVaTen: item.hoVaTen,
        soDienThoai: item.soDienThoai || item.sdt || "",
        gioiTinh: item.gioiTinh,
        tinhThanhPho: item.tinhThanhPho || "",
        quanHuyen: item.quanHuyen || "",
        xaPhuong: item.xaPhuong || "",
        diaChi: item.diaChi || "",
        trangThai: item.trangThai,
        vaiTro: item.vaiTro,
        hinhAnh: item.hinhAnh || item.anh || "",
        actions: "",
    }));

    const paginationItems = getPaginationArray(nhanVienData.number, nhanVienData.totalPages);

    return (
        <DashboardLayout>
            <Notifications
                open={notification.open}
                onClose={handleNotificationClose}
                message={notification.message}
                severity={notification.severity}
                autoHideDuration={2500}
            />
            <DashboardNavbar />
            <SoftBox py={3} sx={{ background: "#F4F6FB", minHeight: "100vh", userSelect: "none" }}>
                <Card sx={{ padding: { xs: 2, md: 3 }, marginBottom: 2 }}>
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
                                placeholder="Tìm kiếm nhân viên"
                                value={search}
                                onChange={handleSearchChange}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <Icon fontSize="small" sx={{ color: "#868686" }}>
                                            search
                                        </Icon>
                                    </InputAdornment>
                                }
                                sx={{ background: "#f5f6fa", borderRadius: 2, padding: 0.5, color: "#222" }}
                            />
                            <FormControl sx={{ minWidth: 120 }}>
                                <Select
                                    value={genderFilter}
                                    onChange={handleGenderFilterChange}
                                    size="small"
                                    displayEmpty
                                    sx={{ borderRadius: 2, background: "#f5f6fa", height: 40 }}
                                    inputProps={{ "aria-label": "Giới tính" }}
                                >
                                    {genderOptions.map(gender => (
                                        <MenuItem key={gender} value={gender}>
                                            {gender}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl sx={{ minWidth: 120 }}>
                                <Select
                                    value={statusFilter}
                                    onChange={handleStatusFilterChange}
                                    size="small"
                                    displayEmpty
                                    sx={{ borderRadius: 2, background: "#f5f6fa", height: 40 }}
                                    inputProps={{ "aria-label": "Trạng thái" }}
                                >
                                    <MenuItem value="Tất cả">Tất cả</MenuItem>
                                    {statusOptions.map(status => (
                                        <MenuItem key={status.value} value={status.label}>
                                            {status.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
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
                                    "&:hover": {
                                        borderColor: "#1769aa",
                                        background: "#e8f5e9",
                                        color: "#1769aa",
                                    },
                                }}
                                onClick={() => {
                                    const sheetData = [
                                        [
                                            "STT",
                                            "Mã nhân viên",
                                            "Họ và tên",
                                            "Chức vụ",
                                            "Số điện thoại",
                                            "Giới tính",
                                            "Địa chỉ",
                                            "Trạng thái"
                                        ],
                                        ...nhanVienData.content.map((item, idx) => {
                                            let address = (item.diaChi && item.diaChi.trim() !== "")
                                                ? item.diaChi
                                                : [item.xaPhuong, item.quanHuyen, item.tinhThanhPho].filter(Boolean).join(", ");
                                            let roleName = getRoleName(item.vaiTro, roleOptions);
                                            return [
                                                currentPage * rowsPerPage + idx + 1,
                                                item.maNhanVien,
                                                item.hoVaTen,
                                                roleName,
                                                item.soDienThoai || item.sdt,
                                                getGenderLabel(item.gioiTinh),
                                                address,
                                                getStatusLabel(item.trangThai, statusOptions),
                                            ];
                                        }),
                                    ];
                                    const workbook = XLSX.utils.book_new();
                                    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
                                    XLSX.utils.book_append_sheet(workbook, worksheet, "NhanVien");
                                    XLSX.writeFile(workbook, "danh_sach_nhan_vien.xlsx");
                                }}
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
                                    "&:hover": {
                                        borderColor: "#1769aa",
                                        background: "#ffebee",
                                        color: "#1769aa",
                                    },
                                }}
                                onClick={() => {
                                    const doc = new jsPDF({
                                        orientation: "landscape",
                                    });
                                    doc.setFontSize(17);
                                    doc.text("Danh sách nhân viên", 14, 18);
                                    const tableColumn = [
                                        "STT",
                                        "Mã nhân viên",
                                        "Họ và tên",
                                        "Chức vụ",
                                        "Số điện thoại",
                                        "Giới tính",
                                        "Địa chỉ",
                                        "Trạng thái",
                                    ];
                                    const tableRows = nhanVienData.content.map((item, idx) => {
                                        let address = (item.diaChi && item.diaChi.trim() !== "")
                                            ? item.diaChi
                                            : [item.xaPhuong, item.quanHuyen, item.tinhThanhPho].filter(Boolean).join(", ");
                                        let roleName = getRoleName(item.vaiTro, roleOptions);
                                        return [
                                            currentPage * rowsPerPage + idx + 1,
                                            item.maNhanVien,
                                            item.hoVaTen,
                                            roleName,
                                            item.soDienThoai || item.sdt,
                                            getGenderLabel(item.gioiTinh),
                                            address,
                                            getStatusLabel(item.trangThai, statusOptions),
                                        ];
                                    });
                                    doc.autoTable({
                                        head: [tableColumn],
                                        body: tableRows,
                                        startY: 28,
                                        styles: { fontSize: 10 },
                                        headStyles: { fillColor: [73, 163, 241] },
                                    });
                                    doc.save("danh_sach_nhan_vien.pdf");
                                }}
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
                                    "&:hover": {
                                        borderColor: "#1769aa",
                                        background: "#f0f6fd",
                                        color: "#1769aa",
                                    },
                                }}
                                onClick={() => navigate("/nhanvien/add")}
                            >
                                Thêm nhân viên
                            </Button>
                        </SoftBox>
                    </SoftBox>
                </Card>
                <Card sx={{ padding: { xs: 2, md: 3 }, marginBottom: 2 }}>
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
                        marginTop={2}
                        flexWrap="wrap"
                        gap={2}
                    >
                        <SoftBox>
                            <FormControl sx={{ minWidth: 120 }}>
                                <Select
                                    value={rowsPerPage}
                                    onChange={handleRowsPerPageChange}
                                    size="small"
                                >
                                    {rowsPerPageOptions.map(number => (
                                        <MenuItem key={number} value={number}>
                                            Xem {number}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </SoftBox>
                        <SoftBox display="flex" alignItems="center" gap={1}>
                            <Button
                                variant="text"
                                size="small"
                                disabled={nhanVienData.first}
                                onClick={() => handlePageChange(currentPage - 1)}
                                sx={{ color: nhanVienData.first ? "#bdbdbd" : "#49a3f1" }}
                            >
                                Trước
                            </Button>
                            {paginationItems.map((item, idx) =>
                                item === "..."
                                    ? (
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
                                            variant={nhanVienData.number === item ? "contained" : "text"}
                                            color={nhanVienData.number === item ? "info" : "inherit"}
                                            size="small"
                                            onClick={() => handlePageChange(item)}
                                            sx={{
                                                minWidth: 32,
                                                borderRadius: 2,
                                                color: nhanVienData.number === item ? "#fff" : "#495057",
                                                background: nhanVienData.number === item ? "#49a3f1" : "transparent",
                                            }}
                                        >
                                            {item + 1}
                                        </Button>
                                    )
                            )}
                            <Button
                                variant="text"
                                size="small"
                                disabled={nhanVienData.last}
                                onClick={() => handlePageChange(currentPage + 1)}
                                sx={{ color: nhanVienData.last ? "#bdbdbd" : "#49a3f1" }}
                            >
                                Sau
                            </Button>
                        </SoftBox>
                    </SoftBox>
                </Card>
            </SoftBox>
            <Dialog open={editDialogOpen} onClose={handleEditClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, background: "#fafdff" } }}>
                <DialogTitle sx={{ fontWeight: 800, fontSize: 26, paddingBottom: 1, color: "#1976d2", letterSpacing: 0.5 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <span>Cập nhật nhân viên</span>
                        <IconButton
                            aria-label="close"
                            onClick={handleEditClose}
                            sx={{
                                color: "#eb5757",
                                marginLeft: 1,
                                background: "#f5f6fa",
                                "&:hover": { background: "#ffeaea" }
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <Divider sx={{ marginBottom: 1 }} />
                <DialogContent sx={{ background: "#f7fbff", paddingBottom: 2 }}>
                    <Box display="flex" flexDirection="column" gap={2}>
                        <Box>
                            <Typography fontWeight={700} marginBottom={0.5} color="#1769aa">Mã nhân viên <span style={{ color: "#e74c3c" }}>*</span></Typography>
                            <TextField
                                value={editForm.maNhanVien}
                                name="maNhanVien"
                                onChange={handleEditChange}
                                fullWidth
                                size="small"
                                placeholder="Nhập mã nhân viên"
                                sx={{ background: "#fff", borderRadius: 2 }}
                            />
                        </Box>
                        <Box>
                            <Typography fontWeight={700} marginBottom={0.5} color="#1769aa">Họ và tên <span style={{ color: "#e74c3c" }}>*</span></Typography>
                            <TextField
                                value={editForm.hoVaTen}
                                name="hoVaTen"
                                onChange={handleEditChange}
                                fullWidth
                                size="small"
                                placeholder="Nhập họ tên nhân viên"
                                sx={{ background: "#fff", borderRadius: 2 }}
                            />
                        </Box>
                        <Box>
                            <Typography fontWeight={700} marginBottom={0.5} color="#1769aa">Số điện thoại</Typography>
                            <TextField
                                value={editForm.soDienThoai}
                                name="soDienThoai"
                                onChange={handleEditChange}
                                fullWidth
                                size="small"
                                placeholder="Nhập số điện thoại"
                                sx={{ background: "#fff", borderRadius: 2 }}
                            />
                        </Box>
                        <Box>
                            <Typography fontWeight={700} marginBottom={0.5} color="#1769aa">Giới tính</Typography>
                            <FormControl fullWidth size="small" sx={{ background: "#fff", borderRadius: 2 }}>
                                <Select
                                    name="gioiTinh"
                                    value={editForm.gioiTinh}
                                    onChange={handleEditChange}
                                    displayEmpty
                                >
                                    <MenuItem value=""><em>Chọn giới tính</em></MenuItem>
                                    <MenuItem value="Nam">Nam</MenuItem>
                                    <MenuItem value="Nữ">Nữ</MenuItem>
                                    <MenuItem value="Khác">Khác</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <Box>
                            <Typography fontWeight={700} marginBottom={0.5} color="#1769aa">Ngày sinh</Typography>
                            <TextField
                                value={editForm.ngaySinh}
                                name="ngaySinh"
                                onChange={handleEditChange}
                                fullWidth
                                size="small"
                                type="date"
                                placeholder="YYYY-MM-DD"
                                sx={{ background: "#fff", borderRadius: 2 }}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Box>
                        <Box>
                            <Typography fontWeight={700} marginBottom={0.5} color="#1769aa">Email</Typography>
                            <TextField
                                value={editForm.email}
                                name="email"
                                onChange={handleEditChange}
                                fullWidth
                                size="small"
                                placeholder="Nhập email"
                                sx={{ background: "#fff", borderRadius: 2 }}
                            />
                        </Box>
                        <Box>
                            <Typography fontWeight={700} marginBottom={0.5} color="#1769aa">Căn cước công dân</Typography>
                            <TextField
                                value={editForm.canCuocCongDan}
                                name="canCuocCongDan"
                                onChange={handleEditChange}
                                fullWidth
                                size="small"
                                placeholder="Nhập số căn cước công dân"
                                sx={{ background: "#fff", borderRadius: 2 }}
                            />
                        </Box>
                        <Box>
                            <Typography fontWeight={700} marginBottom={0.5} color="#1769aa">Vai trò</Typography>
                            <FormControl fullWidth size="small" sx={{ background: "#fff", borderRadius: 2 }}>
                                <Select
                                    name="vaiTro"
                                    value={editForm.vaiTro}
                                    onChange={handleEditChange}
                                    displayEmpty
                                >
                                    <MenuItem value=""><em>Chọn vai trò</em></MenuItem>
                                    {roleOptions.map(role => (
                                        <MenuItem value={role.id} key={role.id}>
                                            {role.ten}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box>
                            <Typography fontWeight={700} marginBottom={0.5} color="#1769aa">Địa chỉ cụ thể</Typography>
                            <TextField
                                value={editForm.diaChiCuThe || ""}
                                name="diaChiCuThe"
                                onChange={handleEditChange}
                                fullWidth
                                size="small"
                                placeholder="Nhập số nhà, tên đường, thôn xóm..."
                                sx={{ background: "#fff", borderRadius: 2 }}
                            />
                        </Box>
                        <Box>
                            <Typography fontWeight={700} marginBottom={0.5} color="#1769aa">Tỉnh/Thành phố</Typography>
                            <FormControl fullWidth size="small" sx={{ background: "#fff", borderRadius: 2 }}>
                                <Select
                                    name="tinhThanhPho"
                                    value={editForm.tinhThanhPho}
                                    onChange={handleEditChange}
                                    displayEmpty
                                >
                                    <MenuItem value=""><em>Chọn Tỉnh/Thành phố</em></MenuItem>
                                    {provinces.map(province => (
                                        <MenuItem value={province.code} key={province.code}>
                                            {province.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box>
                            <Typography fontWeight={700} marginBottom={0.5} color="#1769aa">Quận/Huyện</Typography>
                            <FormControl fullWidth size="small" sx={{ background: "#fff", borderRadius: 2 }}>
                                <Select
                                    name="quanHuyen"
                                    value={editForm.quanHuyen}
                                    onChange={handleEditChange}
                                    displayEmpty
                                    disabled={!editForm.tinhThanhPho}
                                >
                                    <MenuItem value=""><em>Chọn Quận/Huyện</em></MenuItem>
                                    {districts.map(district => (
                                        <MenuItem value={district.code} key={district.code}>
                                            {district.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box>
                            <Typography fontWeight={700} marginBottom={0.5} color="#1769aa">Phường/Xã</Typography>
                            <FormControl fullWidth size="small" sx={{ background: "#fff", borderRadius: 2 }}>
                                <Select
                                    name="xaPhuong"
                                    value={editForm.xaPhuong}
                                    onChange={handleEditChange}
                                    displayEmpty
                                    disabled={!editForm.quanHuyen}
                                >
                                    <MenuItem value=""><em>Chọn Phường/Xã</em></MenuItem>
                                    {wards.map(ward => (
                                        <MenuItem value={ward.code} key={ward.code}>
                                            {ward.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box>
                            <Typography fontWeight={700} marginBottom={0.5} color="#1769aa">Trạng thái</Typography>
                            <FormControl fullWidth size="small" sx={{ background: "#fff", borderRadius: 2 }}>
                                <Select
                                    name="trangThai"
                                    value={editForm.trangThai}
                                    onChange={handleEditChange}
                                    displayEmpty
                                >
                                    <MenuItem value={1}>Đang làm</MenuItem>
                                    <MenuItem value={0}>Nghỉ</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ padding: 2, background: "#fafdff", borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
                    <Button onClick={handleEditClose} disabled={editSaving} color="inherit" variant="outlined" sx={{ borderRadius: 2, fontWeight: 600 }}>
                        Hủy
                    </Button>
                    <Button onClick={handleEditSave} disabled={editSaving} variant="contained" color="info" sx={{ borderRadius: 2, minWidth: 120, fontWeight: 700, fontSize: 17, boxShadow: 3 }} startIcon={editSaving ? <CircularProgress size={18} color="inherit" /> : null}>
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={deleteDialogOpen} onClose={handleDeleteClose} maxWidth="xs" fullWidth>
                <DialogTitle fontWeight={800} color="#e74c3c" sx={{ fontSize: 22 }}>
                    Xác nhận xóa nhân viên
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có chắc chắn muốn xóa nhân viên <strong>{deletingEmployee && (deletingEmployee.hoVaTen || deletingEmployee.hoTen)}</strong> không? Thao tác này không thể hoàn tác.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ padding: 2 }}>
                    <Button onClick={handleDeleteClose} disabled={deleteLoading} variant="outlined" color="inherit" sx={{ borderRadius: 2, fontWeight: 600 }}>
                        Hủy
                    </Button>
                    <Button onClick={handleDeleteConfirm} disabled={deleteLoading} variant="contained" color="error" sx={{ borderRadius: 2, minWidth: 110, fontWeight: 700 }} startIcon={deleteLoading ? <CircularProgress size={18} color="inherit" /> : null}>
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
            <Footer />
        </DashboardLayout>
    );
}

export default NhanVienTable;