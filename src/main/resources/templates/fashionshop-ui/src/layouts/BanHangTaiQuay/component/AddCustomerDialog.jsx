import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  IconButton,
  Typography,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  FormControl,
  Autocomplete, // <<< THÊM Autocomplete
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import dayjs from "dayjs";
import PropTypes from "prop-types";

// API Endpoint để lấy dữ liệu địa chỉ
const VIETNAM_PROVINCE_API = "https://vietnamlabs.com/api/vietnamprovince";

// State ban đầu chỉ còn địa chỉ chi tiết
const initialCustomerState = {
  tenKhachHang: "",
  email: "",
  soDienThoai: "",
  ngaySinh: "",
  gioiTinh: "",
  address: {
    diaChiChiTiet: "", 
  },
};

function AddCustomerDialog({ open, onClose, onCustomerAdded, showNotification }) {
  const [newCustomer, setNewCustomer] = useState(initialCustomerState);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // === STATE MỚI CHO VIỆC CHỌN ĐỊA CHỈ ===
  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  // ==========================================

  // Reset state khi dialog được mở
  useEffect(() => {
    if (open) {
      setNewCustomer(initialCustomerState);
      setErrors({});
      setSelectedProvince(null);
      setSelectedWard(null);
      setWards([]);
    }
  }, [open]);

  // === API LOGIC: LẤY DỮ LIỆU ĐỊA CHỈ ===
  // 1. Lấy danh sách Tỉnh/Thành phố khi dialog mở
  useEffect(() => {
    if (open) {
      const fetchProvinces = async () => {
        try {
          const response = await axios.get(VIETNAM_PROVINCE_API);
          if (Array.isArray(response.data.data)) {
            setProvinces(response.data.data);
          }
        } catch (error) {
          console.error("Lỗi API Tỉnh/Thành phố:", error);
        }
      };
      fetchProvinces();
    }
  }, [open]);

  // 2. Cập nhật danh sách Xã/Phường khi Tỉnh/Thành phố thay đổi
  useEffect(() => {
    if (selectedProvince && Array.isArray(selectedProvince.wards)) {
      setWards(selectedProvince.wards);
    } else {
      setWards([]);
    }
    // Reset lựa chọn xã khi chọn lại tỉnh
    setSelectedWard(null);
  }, [selectedProvince]);
  // ========================================

  // Handler cho các trường input thông thường
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "diaChiChiTiet") {
      setNewCustomer((prev) => ({ ...prev, address: { ...prev.address, diaChiChiTiet: value } }));
    } else {
      setNewCustomer((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Cập nhật hàm validate
  const validateForm = () => {
    const newErrors = {};
    if (!newCustomer.tenKhachHang.trim()) newErrors.tenKhachHang = "Tên không được để trống.";
    if (!newCustomer.email.trim()) newErrors.email = "Email không được để trống.";
    else if (!/\S+@\S+\.\S+/.test(newCustomer.email)) newErrors.email = "Email không hợp lệ.";
    if (!newCustomer.soDienThoai.trim())
      newErrors.soDienThoai = "Số điện thoại không được để trống.";
    else if (!/^\d{10,11}$/.test(newCustomer.soDienThoai))
      newErrors.soDienThoai = "Số điện thoại không hợp lệ.";
    if (!newCustomer.gioiTinh) newErrors.gioiTinh = "Vui lòng chọn giới tính.";

    // Validate cho địa chỉ
    if (!selectedProvince) newErrors.tinhThanhPho = "Vui lòng chọn Tỉnh/Thành phố.";
    if (!selectedWard) newErrors.xaPhuong = "Vui lòng chọn Xã/Phường.";
    if (!newCustomer.address.diaChiChiTiet.trim())
      newErrors.diaChiChiTiet = "Vui lòng nhập địa chỉ chi tiết.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Cập nhật hàm thêm mới
  const handleAddNewCustomer = async () => {
    if (!validateForm()) return; // Giữ nguyên phần validate
    setLoading(true);

    // --- BẮT ĐẦU THAY ĐỔI ---

    // THAY ĐỔI 1: Xây dựng payload theo cấu trúc KhachHangWithDiaChiVO
    const payload = {
      khachHang: {
        tenKhachHang: newCustomer.tenKhachHang,
        email: newCustomer.email,
        sdt: newCustomer.soDienThoai, // Lưu ý: Backend dùng `sdt`, frontend đang dùng `soDienThoai`
        gioiTinh: newCustomer.gioiTinh === "Nam" ? 1 : newCustomer.gioiTinh === "Nữ" ? 0 : 2,
        ngaySinh: newCustomer.ngaySinh ? dayjs(newCustomer.ngaySinh).format("YYYY-MM-DD") : null,
        trangThai: 1
        // Các trường khác như maKhachHang, matKhau, hinhAnh, trangThai sẽ là null vì không có trong form
      },
      diaChi: {
        tinhThanhPho: selectedProvince ? selectedProvince.province : null,
        quanHuyen: null, // Gửi null vì form không có trường này
        xaPhuong: selectedWard ? selectedWard.name : null,
        trangThai: 1
        // Lưu ý: Backend VO không có 'diaChiChiTiet'. Xem ghi chú bên dưới.
      },
    };

    try {
      // THAY ĐỔI 2: Cập nhật URL endpoint
      await axios.post("http://localhost:8080/khachHang/with-address", payload);

      showNotification({ open: true, message: "Thêm khách hàng thành công!", severity: "success" });
      onCustomerAdded();
      onClose();
    } catch (err) {
      console.error("Lỗi khi thêm khách hàng:", err.response || err);
      const apiError = err.response?.data?.message || "Đã xảy ra lỗi khi thêm khách hàng.";
      showNotification({ open: true, message: apiError, severity: "error" });
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
    // --- KẾT THÚC THAY ĐỔI ---
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        Thêm khách hàng
        <IconButton aria-label="close" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {/* Các trường thông tin cá nhân */}
        <TextField
          label="Tên khách hàng"
          name="tenKhachHang"
          fullWidth
          margin="normal"
          value={newCustomer.tenKhachHang}
          onChange={handleChange}
          error={!!errors.tenKhachHang}
          helperText={errors.tenKhachHang}
        />
        <TextField
          label="Email"
          name="email"
          fullWidth
          margin="normal"
          value={newCustomer.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          label="Số điện thoại"
          name="soDienThoai"
          fullWidth
          margin="normal"
          value={newCustomer.soDienThoai}
          onChange={handleChange}
          error={!!errors.soDienThoai}
          helperText={errors.soDienThoai}
        />
        <TextField
          label="Ngày sinh"
          name="ngaySinh"
          type="date"
          fullWidth
          margin="normal"
          value={newCustomer.ngaySinh}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
        <FormControl component="fieldset" margin="normal" error={!!errors.gioiTinh}>
          <FormLabel component="legend">Giới tính</FormLabel>
          <RadioGroup row name="gioiTinh" value={newCustomer.gioiTinh} onChange={handleChange}>
            <FormControlLabel value="Nam" control={<Radio />} label="Nam" />
            <FormControlLabel value="Nữ" control={<Radio />} label="Nữ" />
            <FormControlLabel value="Khác" control={<Radio />} label="Khác" />
          </RadioGroup>
          {errors.gioiTinh && (
            <Typography color="error" variant="caption" sx={{ pl: 2 }}>
              {errors.gioiTinh}
            </Typography>
          )}
        </FormControl>

        <Divider sx={{ my: 2 }} />

        {/* === THAY ĐỔI: SỬ DỤNG AUTOCOMPLETE CHO ĐỊA CHỈ === */}
        <Typography variant="h6" gutterBottom>
          Địa chỉ
        </Typography>

        <Autocomplete
          options={provinces}
          getOptionLabel={(option) => option.province || ""}
          value={selectedProvince}
          onChange={(event, newValue) => setSelectedProvince(newValue)}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Tỉnh/Thành phố"
              margin="normal"
              error={!!errors.tinhThanhPho}
              helperText={errors.tinhThanhPho}
            />
          )}
        />

        <Autocomplete
          options={wards}
          getOptionLabel={(option) => option.name || ""}
          value={selectedWard}
          disabled={!selectedProvince}
          onChange={(event, newValue) => setSelectedWard(newValue)}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Xã/Phường"
              margin="normal"
              error={!!errors.xaPhuong}
              helperText={errors.xaPhuong}
            />
          )}
        />

        <TextField
          label="Địa chỉ chi tiết"
          name="diaChiChiTiet"
          fullWidth
          margin="normal"
          multiline
          rows={2}
          value={newCustomer.address.diaChiChiTiet}
          onChange={handleChange}
          error={!!errors.diaChiChiTiet}
          helperText={errors.diaChiChiTiet}
        />
        {/* =================================================== */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Hủy
        </Button>
        <Button onClick={handleAddNewCustomer} color="info" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : "Thêm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

AddCustomerDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCustomerAdded: PropTypes.func.isRequired,
  showNotification: PropTypes.func.isRequired,
};

export default AddCustomerDialog;
