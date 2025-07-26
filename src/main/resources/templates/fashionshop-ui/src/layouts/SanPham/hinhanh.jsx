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
import Alert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";

// Danh sách trạng thái và số lượng hiển thị
const statusList = ["Tất cả", "Hiển thị", "Ẩn"];
const viewOptions = [5, 10, 20];

// Hàm chuyển trạng thái sang text
const getTrangThaiText = (val) =>
    val === 1 || val === "1" || val === "Hiển thị" ? "Hiển thị" : "Ẩn";

// Hàm tạo phân trang thông minh
function getPaginationItems(current, total) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i);
  if (current <= 1) return [0, 1, "...", total - 2, total - 1];
  if (current >= total - 2) return [0, 1, "...", total - 2, total - 1];
  return [0, 1, "...", current, "...", total - 2, total - 1];
}

// Chuẩn hóa đường dẫn ảnh
const normalizeUrl = (url) =>
    url?.startsWith("http")
        ? url
        : `http://localhost:8080${url?.startsWith("/") ? "" : "/"}${url || ""}`;

function ImageTable() {
  // State quản lý dữ liệu
  const [images, setImages] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [showModal, setShowModal] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [previewImg, setPreviewImg] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(viewOptions[0]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  // State cho form
  const [formData, setFormData] = useState({
    maAnh: "",
    duongDanAnh: null, // file
    anhMacDinh: false,
    moTa: "",
    trangThai: "Hiển thị",
    // idSanPhamChiTiet: null, // Thêm nếu cần
  });

  // Lấy danh sách hình ảnh
  const fetchImages = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        page,
        size,
        moTa: search,
        trangThai:
            statusFilter === "Tất cả"
                ? undefined
                : statusFilter === "Hiển thị"
                    ? 1
                    : 0,
      };
      const queryString = Object.keys(params)
          .filter((k) => params[k] !== undefined && params[k] !== "")
          .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
          .join("&");
      const res = await fetch(`http://localhost:8080/hinhAnh?${queryString}`);
      if (!res.ok) throw new Error("Không thể tải dữ liệu.");
      const data = await res.json();
      setImages(
          (data.content || []).map((img) => ({
            ...img,
            anhMacDinh: img.anhMacDinh === 1,
            trangThai: getTrangThaiText(img.trangThai),
          }))
      );
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      setError("Không thể tải dữ liệu.");
      setImages([]);
      setTotalPages(0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchImages();
    // eslint-disable-next-line
  }, [search, statusFilter, page, size]);

  // Hiện modal thêm mới
  const handleShowAddModal = () => {
    setEditingImage(null);
    setFormData({
      maAnh: "",
      duongDanAnh: null,
      anhMacDinh: false,
      moTa: "",
      trangThai: "Hiển thị",
    });
    setPreviewImg("");
    setShowModal(true);
  };

  // Hiện modal sửa
  const handleShowEditModal = (img) => {
    setEditingImage(img);
    setFormData({
      maAnh: img.maAnh || "",
      duongDanAnh: null,
      anhMacDinh: img.anhMacDinh === 1 || img.anhMacDinh === true,
      moTa: img.moTa || "",
      trangThai: getTrangThaiText(img.trangThai),
      // idSanPhamChiTiet: img.idSanPhamChiTiet || null,
    });
    setPreviewImg(normalizeUrl(img.duongDanAnh));
    setShowModal(true);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setShowModal(false);
    setPreviewImg("");
  };

  // Xử lý thay đổi form
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      const file = files[0];
      if (file) {
        setFormData((prev) => ({
          ...prev,
          duongDanAnh: file,
        }));
        setPreviewImg(URL.createObjectURL(file));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Lưu hình ảnh (thêm mới)
  const handleSave = async () => {
    if (
        !(formData.maAnh || "").trim() ||
        !(formData.moTa || "").trim() ||
        (!editingImage && !formData.duongDanAnh)
    ) {
      toast.warning("Vui lòng nhập đầy đủ thông tin và chọn ảnh!");
      return;
    }
    // Gửi FormData với snake_case đúng BE yêu cầu
    const data = new FormData();
    data.append("ma_anh", formData.maAnh || "");
    if (formData.duongDanAnh)
      data.append("duong_dan_anh", formData.duongDanAnh);
    data.append("anh_mac_dinh", formData.anhMacDinh ? 1 : 0);
    data.append("mo_ta", formData.moTa || "");
    data.append("trang_thai", formData.trangThai === "Hiển thị" ? 1 : 0);
    // Nếu có id_san_pham_chi_tiet thì truyền thêm
    // if (formData.idSanPhamChiTiet) data.append("id_san_pham_chi_tiet", formData.idSanPhamChiTiet);

    try {
      if (editingImage) {
        // Nếu backend PUT nhận JSON thì phải sửa lại (xem chú thích bên dưới)
        // Ở đây giữ nguyên nếu backend PUT cũng nhận multipart
        const res = await fetch(
            `http://localhost:8080/hinhAnh/${editingImage.id}`,
            {
              method: "PUT",
              // Nếu backend PUT nhận JSON thì dùng code bên dưới thay cho FormData:
              // headers: { "Content-Type": "application/json" },
              // body: JSON.stringify({
              //   maAnh: formData.maAnh,
              //   anhMacDinh: formData.anhMacDinh ? 1 : 0,
              //   moTa: formData.moTa,
              //   trangThai: formData.trangThai === "Hiển thị" ? 1 : 0,
              //   duongDanAnh: editingImage.duongDanAnh, // hoặc truyền lại đường dẫn cũ
              //   idSanPhamChiTiet: formData.idSanPhamChiTiet
              // })
              body: data,
            }
        );
        if (!res.ok) throw new Error("Có lỗi xảy ra khi lưu hình ảnh!");
        toast.success("Cập nhật thành công !")
      } else {
        // Thêm mới: gửi FormData
        const res = await fetch("http://localhost:8080/hinhAnh", {
          method: "POST",
          body: data,
        });
        if (!res.ok) throw new Error("Có lỗi xảy ra khi lưu hình ảnh!");
        toast.success("Thêm thành công !")
      }
      setShowModal(false);
      fetchImages();
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lưu hình ảnh!");
    }
  };

  // Xóa hình ảnh
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa hình ảnh này?")) {
      try {
        const res = await fetch(`http://localhost:8080/hinhAnh/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error();
        toast.success("Xóa ảnh thành công")
        fetchImages();
      } catch (error) {
        toast.error("Có lỗi xảy ra khi xóa hình ảnh!");
      }
    }
  };

  // Định nghĩa các cột bảng
  const columns = [
    { name: "stt", label: "STT", align: "center", width: 60 },
    {
      name: "maAnh",
      label: "Mã ảnh",
      align: "center",
      width: 100,
    },
    {
      name: "img",
      label: "Ảnh",
      align: "center",
      width: 70,
      render: (val, row) => (
          <img
              src={normalizeUrl(row.duongDanAnh)}
              alt="Ảnh"
              style={{
                width: 60,
                height: 60,
                objectFit: "cover",
                borderRadius: 8,
              }}
          />
      ),
    },
    { name: "moTa", label: "Mô tả", align: "left", width: 200 },
    {
      name: "anhMacDinh",
      label: "Mặc định",
      align: "center",
      width: 80,
      render: (val) =>
          val ? (
              <span
                  style={{
                    background: "#49a3f1",
                    color: "#fff",
                    borderRadius: 8,
                    padding: "2px 10px",
                    fontSize: 13,
                  }}
              >
            Mặc định
          </span>
          ) : (
              ""
          ),
    },
    {
      name: "trangThai",
      label: "Trạng thái",
      align: "center",
      width: 110,
      render: (val) => (
          <span
              style={{
                background: val === "Hiển thị" ? "#e6f4ea" : "#f4f6fb",
                color: val === "Hiển thị" ? "#219653" : "#bdbdbd",
                border: `1px solid ${val === "Hiển thị" ? "#219653" : "#bdbdbd"}`,
                borderRadius: 6,
                fontWeight: 500,
                padding: "2px 12px",
                fontSize: 13,
                display: "inline-block",
                minWidth: 60,
                textAlign: "center",
              }}
          >
          {val}
        </span>
      ),
    },
    {
      name: "actions",
      label: "Thao tác",
      align: "center",
      width: 110,
      render: (_, row) => (
          <SoftBox display="flex" gap={0.5} justifyContent="center">
            <IconButton
                size="small"
                sx={{ color: "#4acbf2" }}
                title="Sửa"
                onClick={() => handleShowEditModal(row)}
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

  // Chuẩn bị dữ liệu hiển thị bảng
  const rows = images.map((img, idx) => ({
    stt: page * size + idx + 1,
    ...img,
    img: img.duongDanAnh,
    actions: "",
  }));

  // Phân trang
  const paginationItems = getPaginationItems(page, totalPages);

  // Đổi trang
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) setPage(newPage);
  };

  // Menu actions
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // Render component
  return (
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox
            py={3}
            sx={{ background: "#F4F6FB", minHeight: "100vh", userSelect: "none" }}
        >
          {/* Card filter/search/action */}
          <Card sx={{ p: { xs: 2, md: 3 }, mb: 2 }}>
            <SoftBox
                display="flex"
                flexDirection={{ xs: "column", md: "row" }}
                alignItems="center"
                justifyContent="space-between"
                gap={2}
            >
              <SoftBox
                  flex={1}
                  display="flex"
                  alignItems="center"
                  gap={2}
                  maxWidth={600}
              >
                <Input
                    fullWidth
                    placeholder="Tìm mô tả ảnh"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(0);
                    }}
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
                <FormControl sx={{ minWidth: 140 }}>
                  <Select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setPage(0);
                      }}
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
              </SoftBox>
              <SoftBox display="flex" alignItems="center" gap={1}>
                <IconButton onClick={handleMenuOpen} sx={{ color: "#495057" }}>
                  <Icon fontSize="small">menu</Icon>
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                  <MenuItem
                      onClick={handleMenuClose}
                      sx={{ color: "#384D6C" }}
                  >
                    <FaQrcode
                        className="me-2"
                        style={{ color: "#0d6efd" }}
                    />{" "}
                    Quét mã
                  </MenuItem>
                  <MenuItem
                      onClick={handleMenuClose}
                      sx={{ color: "#384D6C" }}
                  >
                    <span style={{ color: "#27ae60", marginRight: 8 }}>📥</span>{" "}
                    Export
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
                    onClick={handleShowAddModal}
                >
                  Thêm hình ảnh
                </Button>
              </SoftBox>
            </SoftBox>
          </Card>

          {/* Card Table/Pagination */}
          <Card sx={{ p: { xs: 2, md: 3 }, mb: 2 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
            )}
            <SoftBox>
              <Table columns={columns} rows={rows} loading={loading} />
            </SoftBox>
            {/* Pagination + View */}
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
                      value={size}
                      onChange={(e) => {
                        setSize(Number(e.target.value));
                        setPage(0);
                      }}
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
              <SoftBox display="flex" alignItems="center" gap={1}>
                <Button
                    variant="text"
                    size="small"
                    disabled={page === 0}
                    onClick={() => handlePageChange(page - 1)}
                    sx={{ color: page === 0 ? "#bdbdbd" : "#49a3f1" }}
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
                            variant={page === item ? "contained" : "text"}
                            color={page === item ? "info" : "inherit"}
                            size="small"
                            onClick={() => handlePageChange(item)}
                            sx={{
                              minWidth: 32,
                              borderRadius: 2,
                              color: page === item ? "#fff" : "#495057",
                              background: page === item ? "#49a3f1" : "transparent",
                            }}
                        >
                          {item + 1}
                        </Button>
                    )
                )}
                <Button
                    variant="text"
                    size="small"
                    disabled={page + 1 >= totalPages}
                    onClick={() => handlePageChange(page + 1)}
                    sx={{ color: page + 1 >= totalPages ? "#bdbdbd" : "#49a3f1" }}
                >
                  Sau
                </Button>
              </SoftBox>
            </SoftBox>
          </Card>

          {/* Modal Thêm/Sửa hình ảnh */}
          <Dialog open={showModal} onClose={handleCloseModal} maxWidth="xs" fullWidth>
            <DialogTitle>
              {editingImage ? "Sửa hình ảnh" : "Thêm hình ảnh"}
              <IconButton
                  aria-label="close"
                  onClick={handleCloseModal}
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
                    placeholder="Mã ảnh"
                    name="maAnh"
                    value={formData.maAnh || ""}
                    disabled={!!editingImage}
                    onChange={handleChange}
                />
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <label
                    htmlFor="file-input"
                    style={{
                      background: "#fff",
                      display: "flex",
                      gap: 10,
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 10,
                      marginTop: 12,
                      borderRadius: 10,
                      border: "2px dashed rgb(171 202 255)",
                      color: "#444",
                      cursor: "pointer",
                      transition: "background 0.2s, border 0.2s",
                    }}
                >
                <span style={{ fontWeight: 600, color: "#444" }}>
                  Thả tệp vào đây
                </span>
                  hoặc
                  <input
                      type="file"
                      accept="image/*"
                      required={!editingImage}
                      id="file-input"
                      style={{ width: 350, maxWidth: "100%" }}
                      onChange={handleChange}
                  />
                  {previewImg && (
                      <img
                          src={previewImg}
                          alt="Preview"
                          style={{
                            marginTop: 10,
                            maxWidth: "100%",
                            maxHeight: 200,
                            objectFit: "contain",
                            borderRadius: 10,
                          }}
                      />
                  )}
                </label>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <Input
                    placeholder="Mô tả"
                    name="moTa"
                    value={formData.moTa || ""}
                    onChange={handleChange}
                />
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <label>
                  <input
                      type="checkbox"
                      name="anhMacDinh"
                      checked={formData.anhMacDinh}
                      onChange={handleChange}
                      style={{ marginRight: 8 }}
                  />
                  Ảnh mặc định
                </label>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <Select
                    name="trangThai"
                    value={formData.trangThai}
                    onChange={handleChange}
                    size="small"
                >
                  <MenuItem value="Hiển thị">Hiển thị</MenuItem>
                  <MenuItem value="Ẩn">Ẩn</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" onClick={handleCloseModal}>
                Đóng
              </Button>
              <Button variant="contained" onClick={handleSave}>
                Lưu
              </Button>
            </DialogActions>
          </Dialog>
        </SoftBox>
        <Footer />
      </DashboardLayout>
  );
}

export default ImageTable;