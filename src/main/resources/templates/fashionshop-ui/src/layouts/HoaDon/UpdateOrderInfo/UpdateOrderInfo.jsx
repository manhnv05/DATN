import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import axios from "axios";

// --- MUI Imports ---
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Backdrop,
  CircularProgress,
  Typography,
  IconButton,
  Box,
  Autocomplete,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import "react-toastify/dist/ReactToastify.css";

const VIETNAM_PROVINCE_API = "https://vietnamlabs.com/api/vietnamprovince";

// Hàm chuẩn hóa chuỗi để so sánh đáng tin cậy hơn
const normalizeString = (str = "") => {
  if (typeof str !== "string") return "";
  return str
    .toLowerCase()
    .replace(/[\s,.-]|(thành phố|tỉnh|quận|huyện|phường|xã|thị xã|thị trấn)/g, "");
};

const UpdateOrderInfo = ({ show, onClose, orderId, initialData, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({ tenNguoiNhan: "", soDienThoai: "", diaChiCuThe: "" });

  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);

  const [isPreloading, setIsPreloading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Effect để gọi API một lần duy nhất khi form được mở
  useEffect(() => {
    if (show) {
      const fetchAllAddressData = async () => {
        setIsPreloading(true);
        try {
          const response = await axios.get(VIETNAM_PROVINCE_API);
          const provincesData = (response.data?.data || []).filter((p) => p && p.province && p.id);
          setProvinces(provincesData);
        } catch (error) {
          console.error("Lỗi khi tải dữ liệu địa chỉ:", error);
          toast.error("Không thể tải danh sách địa chỉ. Vui lòng thử lại.");
        } finally {
          setIsPreloading(false);
        }
      };
      fetchAllAddressData();
    }
  }, [show]);

  // Effect để tự động điền form khi có dữ liệu ban đầu
  useEffect(() => {
    if (show && provinces.length > 0 && initialData) {
      setFormData({
        tenNguoiNhan: initialData.tenNguoiNhan || "",
        soDienThoai: initialData.soDienThoai || "",
        diaChiCuThe: "",
      });

      const addressString = initialData.diaChi || "";
      const addressParts = addressString.split(",").map((part) => part.trim());

      if (addressParts.length >= 2) {
        const provinceNameFromDB = addressParts[addressParts.length - 1];
        const provinceToSet = provinces.find(
          (p) => normalizeString(p.province) === normalizeString(provinceNameFromDB)
        );

        if (provinceToSet) {
          setSelectedProvince(provinceToSet);

          const wardList = (provinceToSet.wards || []).filter((w) => w && w.name);
          setWards(wardList);

          // <<< SỬA LỖI: Logic tìm xã/phường linh hoạt hơn
          let foundWard = null;
          let wardIndex = -1;

          // Duyệt qua các phần của địa chỉ để tìm xã/phường khớp
          for (let i = addressParts.length - 2; i >= 0; i--) {
            const part = addressParts[i];
            const potentialWard = wardList.find(
              (w) => normalizeString(w.name) === normalizeString(part)
            );
            if (potentialWard) {
              foundWard = potentialWard;
              wardIndex = i;
              break; // Dừng lại khi tìm thấy
            }
          }

          if (foundWard) {
            setSelectedWard(foundWard);
            // Lấy tất cả các phần trước xã/phường làm địa chỉ cụ thể
            const specificAddress = addressParts.slice(0, wardIndex).join(", ");
            setFormData((prev) => ({ ...prev, diaChiCuThe: specificAddress }));
          } else {
            // Nếu không tìm thấy, lấy tất cả trừ tỉnh/thành phố
            const specificAddress = addressParts.slice(0, addressParts.length - 1).join(", ");
            setFormData((prev) => ({ ...prev, diaChiCuThe: specificAddress }));
          }
          // >>> KẾT THÚC SỬA LỖI
        } else {
          setFormData((prev) => ({ ...prev, diaChiCuThe: addressString }));
        }
      } else {
        setFormData((prev) => ({ ...prev, diaChiCuThe: addressString }));
      }
    }
  }, [show, initialData, provinces]);

  // Effect để cập nhật danh sách xã/phường khi chọn tỉnh mới
  useEffect(() => {
    if (selectedProvince && selectedProvince.wards) {
      const validWards = selectedProvince.wards.filter((w) => w && w.name);
      setWards(validWards);
    } else {
      setWards([]);
    }
    // Reset lựa chọn phường khi tỉnh thay đổi
    if (!initialData) setSelectedWard(null);
  }, [selectedProvince, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!formData.tenNguoiNhan.trim())
      newErrors.tenNguoiNhan = "Tên người nhận không được để trống.";
    const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
    if (!formData.soDienThoai.trim()) newErrors.soDienThoai = "Số điện thoại không được để trống.";
    else if (!phoneRegex.test(formData.soDienThoai.trim()))
      newErrors.soDienThoai = "Số điện thoại không hợp lệ.";
    if (!selectedProvince) newErrors.province = "Vui lòng chọn Tỉnh/Thành phố.";
    if (!selectedWard) newErrors.ward = "Vui lòng chọn Xã/Phường.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    const provinceName = selectedProvince?.province || "";
    const wardName = selectedWard?.name || "";
    const fullAddress = [formData.diaChiCuThe, wardName, provinceName].filter(Boolean).join(", ");

    const requestPayload = {
      tenKhachHang: formData.tenNguoiNhan,
      sdt: formData.soDienThoai,
      diaChi: fullAddress,
      ghiChu: "Cập nhật thông tin giao hàng",
    };
    try {
      const backendApiUrl = `http://localhost:8080/api/hoa-don/cap-nhat-thong-tin/${orderId}`;
      await axios.put(backendApiUrl, requestPayload);
      toast.success("Cập nhật thông tin đơn hàng thành công!");
      setTimeout(() => {
        if (onClose) onClose();
        if (onUpdateSuccess) onUpdateSuccess();
      }, 500);
    } catch (error) {
      console.error("Lỗi khi submit:", error);
      toast.error(`Lỗi: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={show}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      component="form"
      onSubmit={handleSubmit}
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>
        Thay đổi thông tin
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1, position: "absolute" }}
          open={isPreloading}
        >
          <Box display="flex" flexDirection="column" alignItems="center">
            <CircularProgress color="inherit" />
            <Typography sx={{ mt: 2 }}>Đang tải dữ liệu...</Typography>
          </Box>
        </Backdrop>
        <Grid container spacing={3} sx={{ pt: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              name="tenNguoiNhan"
              label="Tên người nhận"
              value={formData.tenNguoiNhan}
              onChange={(e) => setFormData({ ...formData, tenNguoiNhan: e.target.value })}
              error={!!errors.tenNguoiNhan}
              helperText={errors.tenNguoiNhan || " "}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              name="soDienThoai"
              label="Số điện thoại"
              type="tel"
              value={formData.soDienThoai}
              onChange={(e) => setFormData({ ...formData, soDienThoai: e.target.value })}
              error={!!errors.soDienThoai}
              helperText={errors.soDienThoai || " "}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Autocomplete
              options={provinces}
              getOptionLabel={(option) => option.province || ""}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              value={selectedProvince}
              onChange={(event, newValue) => setSelectedProvince(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tỉnh/thành phố"
                  required
                  error={!!errors.province}
                  helperText={errors.province || " "}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Autocomplete
              options={wards}
              disabled={!selectedProvince}
              getOptionLabel={(option) => option.name || ""}
              isOptionEqualToValue={(option, value) => option.name === value.name}
              value={selectedWard}
              onChange={(event, newValue) => setSelectedWard(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Xã/phường"
                  required
                  error={!!errors.ward}
                  helperText={errors.ward || " "}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="diaChiCuThe"
              label="Địa chỉ cụ thể"
              placeholder="Số nhà, tên đường, tên quận/huyện..."
              value={formData.diaChiCuThe}
              onChange={(e) => setFormData({ ...formData, diaChiCuThe: e.target.value })}
              helperText="Lưu ý: Nhập cả Quận/Huyện vào đây nếu cần thiết"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: "16px 24px" }}>
        
        <Button
          type="submit"
          variant="outlined"
                    size="medium"
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
          disabled={isSubmitting || isPreloading}
          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

UpdateOrderInfo.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  orderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  initialData: PropTypes.shape({
    tenNguoiNhan: PropTypes.string,
    soDienThoai: PropTypes.string,
    diaChi: PropTypes.string,
  }).isRequired,
  onUpdateSuccess: PropTypes.func,
};

export default UpdateOrderInfo;
