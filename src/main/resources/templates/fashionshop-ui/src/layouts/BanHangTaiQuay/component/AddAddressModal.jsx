import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Autocomplete,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SoftTypography from "components/SoftTypography";
import PropTypes from 'prop-types';
const VIETNAM_PROVINCE_API = "https://vietnamlabs.com/api/vietnamprovince";

function AddAddressModal({ open, onClose, customerId, onAddressAdded }) {
  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);
  
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [detailedAddress, setDetailedAddress] = useState("");

  const [loading, setLoading] = useState(false);
  
  // <<< THÊM 1: State để lưu các lỗi validation
  const [errors, setErrors] = useState({});

  // Reset form và lỗi khi modal được mở
  useEffect(() => {
    if (open) {
      setSelectedProvince(null);
      setSelectedWard(null);
      setDetailedAddress("");
      setWards([]);
      setErrors({}); // Reset lỗi
    }
  }, [open]);

  // Các useEffect để lấy dữ liệu địa chỉ không đổi
  useEffect(() => {
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
  }, []);
  
  useEffect(() => {
    if (selectedProvince && Array.isArray(selectedProvince.wards)) {
      setWards(selectedProvince.wards);
    } else {
      setWards([]);
    }
    setSelectedWard(null);
  }, [selectedProvince]);

  // <<< THÊM 2: Hàm để kiểm tra validation
  const validateForm = () => {
    const newErrors = {};
    if (!selectedProvince) {
      newErrors.tinhThanhPho = "Vui lòng chọn Tỉnh/Thành phố.";
    }
    if (!selectedWard) {
      newErrors.xaPhuong = "Vui lòng chọn Xã/Phường.";
    }
    if (!detailedAddress.trim()) {
      newErrors.diaChiChiTiet = "Vui lòng nhập địa chỉ chi tiết.";
    }
    return newErrors;
  };

  const handleSave = async () => {
    // <<< THÊM 3: Gọi validation trước khi thực hiện
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return; // Dừng lại nếu có lỗi
    }
    
    setLoading(true);
    const payload = {
      idKhachHang: customerId,
      tinhThanhPho: selectedProvince.province,
      quanHuyen: null,
      xaPhuong: selectedWard.name,
      diaChiChiTiet: detailedAddress,
      trangThai: 1,
    };

    try {
      await axios.post("http://localhost:8080/diaChi", payload);
    
      onAddressAdded(); 
    } catch (error) {
      console.error("Lỗi khi thêm địa chỉ:", error);
     
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <SoftTypography variant="h5">Thêm địa chỉ mới</SoftTypography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {/* <<< THÊM 4: Kết nối lỗi với giao diện Autocomplete và TextField */}
        <Autocomplete
          options={provinces}
          getOptionLabel={(option) => option.province || ""}
          value={selectedProvince}
          onChange={(e, value) => {
            setSelectedProvince(value);
            // Xóa lỗi khi người dùng tương tác
            if (errors.tinhThanhPho) setErrors(prev => ({...prev, tinhThanhPho: undefined}));
          }}
          renderInput={(params) => (
            <TextField 
              {...params} 
              label="Tỉnh/Thành phố" 
              margin="normal" 
              error={!!errors.tinhThanhPho}
              helperText={errors.tinhThanhPho || ""}
            />
          )}
        />
        
        <Autocomplete
          options={wards}
          getOptionLabel={(option) => option.name || ""}
          value={selectedWard}
          disabled={!selectedProvince}
          onChange={(e, value) => {
            setSelectedWard(value);
            if (errors.xaPhuong) setErrors(prev => ({...prev, xaPhuong: undefined}));
          }}
          renderInput={(params) => (
            <TextField 
              {...params} 
              label="Xã/Phường" 
              margin="normal" 
              error={!!errors.xaPhuong}
              helperText={errors.xaPhuong || ""}
            />
          )}
        />

        <TextField
          label="Địa chỉ chi tiết (Số nhà, tên đường...)"
          fullWidth
          margin="normal"
          value={detailedAddress}
          onChange={(e) => {
            setDetailedAddress(e.target.value);
            if (errors.diaChiChiTiet) setErrors(prev => ({...prev, diaChiChiTiet: undefined}));
          }}
          error={!!errors.diaChiChiTiet}
          helperText={errors.diaChiChiTiet || ""}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Hủy
        </Button>
        <Button onClick={handleSave} color="info" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : "Lưu địa chỉ"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
AddAddressModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  customerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onAddressAdded: PropTypes.func.isRequired,
};
export default AddAddressModal;