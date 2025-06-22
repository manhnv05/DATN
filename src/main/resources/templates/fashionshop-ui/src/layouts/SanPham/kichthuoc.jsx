import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Input from "@mui/material/Input";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import SoftBox from "components/SoftBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Icon from "@mui/material/Icon";
import Table from "examples/Tables/Table";
import { FaQrcode, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import CircularProgress from "@mui/material/CircularProgress";
import { Alert } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const statusList = ["Tất cả", "Hiển thị", "Ẩn"];
const viewOptions = [5, 10, 20];

const getTrangThaiText = (val) =>
    val === 1 || val === "1" || val === "Hiển thị" ? "Hiển thị" : "Ẩn";

// Phân trang đẹp: luôn có 2 đầu, 2 cuối, và nổi bật trang hiện tại
function getPaginationItems(current, total) {
    if (total <= 5) return Array.from({ length: total }, (_, i) => i);
    if (current <= 1) return [0, 1, "...", total - 2, total - 1];
    if (current >= total - 2) return [0, 1, "...", total - 2, total - 1];
    return [0, 1, "...", current, "...", total - 2, total - 1];
}

function SizeTable() {
    const [queryParams, setQueryParams] = useState({
        tenKichCo: "",
        trangThai: "Tất cả",
        page: 0,
        size: 5,
    });

    const [sizesData, setSizesData] = useState({
        content: [],
        totalPages: 1,
        number: 0,
        first: true,
        last: true,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [newSize, setNewSize] = useState({
        ma: "",
        tenKichCo: "",
        trangThai: "Hiển thị",
    });

    // Edit states
    const [editSize, setEditSize] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    // Delete states
    const [deleteId, setDeleteId] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    // Menu states
    const [anchorEl, setAnchorEl] = useState(null);

    // Fetch sizes from API
    useEffect(() => {
        setLoading(true);
        setError("");
        let url = `http://localhost:8080/kichThuoc?page=${queryParams.page}&size=${queryParams.size}`;
        if (queryParams.tenKichCo)
            url += `&tenKichCo=${encodeURIComponent(queryParams.tenKichCo)}`;
        if (queryParams.trangThai !== "Tất cả")
            url += `&trangThai=${queryParams.trangThai === "Hiển thị" ? 1 : 0}`;

        fetch(url)
            .then((res) => {
                if (!res.ok) throw new Error("Không thể tải dữ liệu. Vui lòng thử lại sau.");
                return res.json();
            })
            .then((data) => setSizesData(data))
            .catch((err) => setError(err.message || "Lỗi không xác định"))
            .finally(() => setLoading(false));
    }, [queryParams]);

    // Handler for Add Size
    const handleAddSize = () => {
        if (!newSize.ma || !newSize.tenKichCo) {
            alert("Vui lòng nhập đầy đủ thông tin");
            return;
        }
        setLoading(true);
        fetch("http://localhost:8080/kichThuoc", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...newSize,
                trangThai: newSize.trangThai === "Hiển thị" ? 1 : 0,
            }),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Có lỗi xảy ra khi thêm kích thước!");
                return res.text();
            })
            .then(() => {
                setShowModal(false);
                setNewSize({ ma: "", tenKichCo: "", trangThai: "Hiển thị" });
                setQueryParams({ ...queryParams, page: 0 });
            })
            .catch((err) => setError(err.message || "Lỗi không xác định"))
            .finally(() => setLoading(false));
    };

    // Handler for Edit Size
    const handleEditClick = (size) => {
        setEditSize({
            ...size,
            trangThai: getTrangThaiText(size.trangThai),
        });
        setShowEditModal(true);
    };

    const handleSaveEdit = () => {
        if (!editSize.ma || !editSize.tenKichCo) {
            alert("Vui lòng nhập đầy đủ thông tin");
            return;
        }
        setLoading(true);
        fetch(`http://localhost:8080/kichThuoc/${editSize.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...editSize,
                trangThai: editSize.trangThai === "Hiển thị" ? 1 : 0,
            }),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Có lỗi xảy ra khi cập nhật kích thước!");
                return res.text();
            })
            .then(() => {
                setShowEditModal(false);
                setEditSize(null);
                setQueryParams({ ...queryParams });
            })
            .catch((err) => setError(err.message || "Lỗi không xác định"))
            .finally(() => setLoading(false));
    };

    // Handler for Delete Size
    const handleDelete = (id) => {
        setDeleteId(id);
        setShowDeleteDialog(true);
    };
    const handleConfirmDelete = () => {
        setLoading(true);
        fetch(`http://localhost:8080/kichThuoc/${deleteId}`, {
            method: "DELETE",
        })
            .then((res) => {
                if (!res.ok) throw new Error("Có lỗi xảy ra khi xóa kích thước!");
                setShowDeleteDialog(false);
                setDeleteId(null);
                setQueryParams({ ...queryParams });
            })
            .catch((err) => setError(err.message || "Lỗi không xác định"))
            .finally(() => setLoading(false));
    };

    // Pagination
    const handlePageChange = (newPage) => {
        setQueryParams({ ...queryParams, page: newPage });
    };

    // Menu actions
    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    // Table columns
    const columns = [
        { name: "stt", label: "STT", align: "center", width: "60px" },
        { name: "ma", label: "Mã", align: "left", width: "100px" },
        { name: "tenKichCo", label: "Tên", align: "left", width: "180px" },
        {
            name: "trangThai",
            label: "Trạng thái",
            align: "center",
            width: "120px",
            render: (value) => (
                <span
                    style={{
                        background: getTrangThaiText(value) === "Hiển thị" ? "#e6f4ea" : "#f4f6fb",
                        color: getTrangThaiText(value) === "Hiển thị" ? "#219653" : "#bdbdbd",
                        border: `1px solid ${
                            getTrangThaiText(value) === "Hiển thị" ? "#219653" : "#bdbdbd"
                        }`,
                        borderRadius: 6,
                        fontWeight: 500,
                        padding: "2px 12px",
                        fontSize: 13,
                        display: "inline-block",
                        minWidth: 60,
                        textAlign: "center",
                    }}
                >
          {getTrangThaiText(value)}
        </span>
            ),
        },
        {
            name: "actions",
            label: "Thao tác",
            align: "center",
            width: "110px",
            render: (_, row) => (
                <SoftBox display="flex" gap={0.5} justifyContent="center">
                    <IconButton
                        size="small"
                        sx={{ color: "#4acbf2" }}
                        title="Sửa"
                        onClick={() => handleEditClick(row)}
                    >
                        <FaEdit />
                    </IconButton>
                    <IconButton
                        size="small"
                        sx={{ color: "#4acbf2" }}
                        title="Xóa"
                        onClick={() => handleDelete(row.id)}
                    >
                        <FaTrash />
                    </IconButton>
                </SoftBox>
            ),
        },
    ];

    const rows =
        sizesData.content && sizesData.content.length
            ? sizesData.content.map((size, idx) => ({
                ...size,
                stt: queryParams.page * queryParams.size + idx + 1,
            }))
            : [];

    // Modal Thêm kích thước
    const renderAddSizeModal = () => (
        <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="xs" fullWidth>
            <DialogTitle>
                Thêm mới kích thước
                <IconButton
                    aria-label="close"
                    onClick={() => setShowModal(false)}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                    size="large"
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <FormControl fullWidth sx={{ mb: 2, mt: 2 }}>
                    <Input
                        placeholder="Mã kích thước"
                        value={newSize.ma}
                        onChange={(e) => setNewSize({ ...newSize, ma: e.target.value })}
                    />
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <Input
                        placeholder="Tên kích thước"
                        value={newSize.tenKichCo}
                        onChange={(e) => setNewSize({ ...newSize, tenKichCo: e.target.value })}
                    />
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <Select
                        value={newSize.trangThai}
                        onChange={(e) => setNewSize({ ...newSize, trangThai: e.target.value })}
                        size="small"
                    >
                        <MenuItem value="Hiển thị">Hiển thị</MenuItem>
                        <MenuItem value="Ẩn">Ẩn</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={() => setShowModal(false)} disabled={loading}>
                    Đóng
                </Button>
                <Button variant="contained" onClick={handleAddSize} disabled={loading}>
                    {loading && <CircularProgress size={18} sx={{ mr: 1 }} />}
                    Thêm
                </Button>
            </DialogActions>
        </Dialog>
    );

    // Modal sửa kích thước
    const renderEditSizeModal = () => (
        <Dialog open={showEditModal} onClose={() => setShowEditModal(false)} maxWidth="xs" fullWidth>
            <DialogTitle>
                Sửa kích thước
                <IconButton
                    aria-label="close"
                    onClick={() => setShowEditModal(false)}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                    size="large"
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <FormControl fullWidth sx={{ mb: 2, mt: 2 }}>
                    <Input
                        placeholder="Mã kích thước"
                        value={editSize?.ma || ""}
                        onChange={(e) => setEditSize({ ...editSize, ma: e.target.value })}
                    />
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <Input
                        placeholder="Tên kích thước"
                        value={editSize?.tenKichCo || ""}
                        onChange={(e) => setEditSize({ ...editSize, tenKichCo: e.target.value })}
                    />
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <Select
                        value={editSize?.trangThai || "Hiển thị"}
                        onChange={(e) => setEditSize({ ...editSize, trangThai: e.target.value })}
                        size="small"
                    >
                        <MenuItem value="Hiển thị">Hiển thị</MenuItem>
                        <MenuItem value="Ẩn">Ẩn</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={handleSaveEdit} disabled={loading}>
                    {loading && <CircularProgress size={18} sx={{ mr: 1 }} />}
                    Lưu
                </Button>
            </DialogActions>
        </Dialog>
    );

    // Dialog xác nhận xóa kích thước
    const renderDeleteDialog = () => (
        <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    pr: 2,
                    fontWeight: 700,
                    fontSize: 20,
                    pb: 1,
                    pt: 2,
                }}
            >
                <span>Bạn chắc chắn muốn xóa kích thước này?</span>
                <IconButton
                    aria-label="close"
                    onClick={() => setShowDeleteDialog(false)}
                    sx={{
                        color: (theme) => theme.palette.grey[500],
                        ml: 2,
                    }}
                    size="large"
                >
                    <CloseIcon sx={{ fontSize: 26 }} />
                </IconButton>
            </DialogTitle>
            <DialogActions sx={{ pb: 3, pt: 1, justifyContent: "center" }}>
                <Button
                    variant="outlined"
                    onClick={() => setShowDeleteDialog(false)}
                    disabled={loading}
                    sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 400,
                        color: "#49a3f1",
                        borderColor: "#49a3f1",
                        boxShadow: "none",
                        background: "#fff",
                        mr: 1.5,
                        "&:hover": {
                            borderColor: "#1769aa",
                            background: "#f0f6fd",
                            color: "#1769aa",
                        },
                        "&.Mui-disabled": {
                            color: "#49a3f1",
                            borderColor: "#49a3f1",
                            opacity: 0.7,
                            background: "#fff",
                        },
                    }}
                >
                    Hủy
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={handleConfirmDelete}
                    disabled={loading}
                    sx={{ borderRadius: 2, minWidth: 90, fontWeight: 500 }}
                >
                    {loading && <CircularProgress size={18} sx={{ mr: 1 }} />}
                    Xóa
                </Button>
            </DialogActions>
        </Dialog>
    );

    // Pagination Items
    const paginationItems = getPaginationItems(sizesData.number, sizesData.totalPages || 1);

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <SoftBox py={3} sx={{ background: "#F4F6FB", minHeight: "100vh", userSelect: "none" }}>
                {/* PHẦN 1: Card filter/search/action */}
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
                                placeholder="Tìm kích thước"
                                value={queryParams.tenKichCo}
                                onChange={(e) =>
                                    setQueryParams({
                                        ...queryParams,
                                        tenKichCo: e.target.value,
                                        page: 0,
                                    })
                                }
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
                                    value={queryParams.trangThai}
                                    onChange={(e) =>
                                        setQueryParams({
                                            ...queryParams,
                                            trangThai: e.target.value,
                                            page: 0,
                                        })
                                    }
                                    size="small"
                                    displayEmpty
                                    sx={{ borderRadius: 2, background: "#f5f6fa", height: 40 }}
                                    inputProps={{ "aria-label": "Trạng thái" }}
                                >
                                    <MenuItem value="Tất cả">Tất cả</MenuItem>
                                    <MenuItem value="Hiển thị">Hiển thị</MenuItem>
                                    <MenuItem value="Ẩn">Ẩn</MenuItem>
                                </Select>
                            </FormControl>
                        </SoftBox>
                        <SoftBox display="flex" alignItems="center" gap={1}>
                            <IconButton onClick={handleMenuOpen} sx={{ color: "#495057" }}>
                                <Icon fontSize="small">menu</Icon>
                            </IconButton>
                            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                                <MenuItem onClick={handleMenuClose} sx={{ color: "#384D6C" }}>
                                    <FaQrcode className="me-2" style={{ color: "#0d6efd" }} /> Quét mã
                                </MenuItem>
                                <MenuItem onClick={handleMenuClose} sx={{ color: "#384D6C" }}>
                                    <span style={{ color: "#27ae60", marginRight: 8 }}>📥</span> Export Excel
                                </MenuItem>
                            </Menu>
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
                                onClick={() => setShowModal(true)}
                            >
                                Thêm kích thước
                            </Button>
                        </SoftBox>
                    </SoftBox>
                </Card>

                {/* PHẦN 2: Card Table/Pagination */}
                <Card sx={{ p: { xs: 2, md: 3 }, mb: 2 }}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <SoftBox>
                        <Table columns={columns} rows={rows} loading={loading} />
                    </SoftBox>
                    {/* Pagination */}
                    <SoftBox
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mt={2}
                        flexWrap="wrap"
                        gap={2}
                    >
                        <SoftBox>
                            <FormControl sx={{ minWidth: 120 }}>
                                <Select
                                    value={queryParams.size}
                                    onChange={(e) =>
                                        setQueryParams({
                                            ...queryParams,
                                            size: Number(e.target.value),
                                            page: 0,
                                        })
                                    }
                                    size="small"
                                >
                                    {viewOptions.map((n) => (
                                        <MenuItem key={n} value={n}>
                                            Xem {n}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </SoftBox>
                        {/* Pagination đẹp */}
                        <SoftBox display="flex" alignItems="center" gap={1}>
                            <Button
                                variant="text"
                                size="small"
                                disabled={sizesData.first}
                                onClick={() => handlePageChange(queryParams.page - 1)}
                                sx={{ color: sizesData.first ? "#bdbdbd" : "#49a3f1" }}
                            >
                                Trước
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
                                        variant={sizesData.number === item ? "contained" : "text"}
                                        color={sizesData.number === item ? "info" : "inherit"}
                                        size="small"
                                        onClick={() => handlePageChange(item)}
                                        sx={{
                                            minWidth: 32,
                                            borderRadius: 2,
                                            color: sizesData.number === item ? "#fff" : "#495057",
                                            background: sizesData.number === item ? "#49a3f1" : "transparent",
                                        }}
                                    >
                                        {item + 1}
                                    </Button>
                                )
                            )}
                            <Button
                                variant="text"
                                size="small"
                                disabled={sizesData.last}
                                onClick={() => handlePageChange(queryParams.page + 1)}
                                sx={{ color: sizesData.last ? "#bdbdbd" : "#49a3f1" }}
                            >
                                Sau
                            </Button>
                        </SoftBox>
                    </SoftBox>
                </Card>
                {renderAddSizeModal()}
                {renderEditSizeModal()}
                {renderDeleteDialog()}
            </SoftBox>
            <Footer />
        </DashboardLayout>
    );
}

export default SizeTable;