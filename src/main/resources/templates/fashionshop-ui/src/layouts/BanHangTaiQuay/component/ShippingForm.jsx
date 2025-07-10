import React, { useState, useEffect } from "react";
import axios from "axios";
import { Grid, TextField, Divider, Box, Autocomplete } from "@mui/material";

// Import components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import SoftInput from "components/SoftInput";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import PropTypes from 'prop-types';
// API để lấy danh sách tỉnh/thành
const VIETNAM_PROVINCE_API = "https://vietnamlabs.com/api/vietnamprovince";

function ShippingForm({ initialCustomer, initialAddress, onOpenAddressModal }) {
  // State cho các trường trong form
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [detailedAddress, setDetailedAddress] = useState("");

  // State cho việc lấy và chọn địa chỉ từ API
  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);

  // 1. useEffect để gọi API lấy danh sách tỉnh/thành phố (chỉ chạy 1 lần)
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get(VIETNAM_PROVINCE_API);
        if (Array.isArray(response.data.data)) {
          setProvinces(response.data.data);
        }
      } catch (error) {
        console.error("Lỗi API tỉnh/thành phố:", error);
      }
    };
    fetchProvinces();
  }, []);

  // 2. useEffect để điền dữ liệu vào form khi props (khách hàng, địa chỉ) thay đổi
  useEffect(() => {
    // Chỉ thực hiện khi có khách hàng và danh sách tỉnh đã được tải
    if (initialCustomer && provinces.length > 0) {
      setName(initialCustomer.tenKhachHang || "");
      setPhone(initialCustomer.sdt || ""); // Đảm bảo object customer có trường `sdt`

      // Nếu có địa chỉ được truyền vào, tiến hành tìm và set
      if (initialAddress) {
        setDetailedAddress(initialAddress.diaChiChiTiet || "");

        // Tìm object Tỉnh/Thành phố dựa trên tên
        const provinceToSet = provinces.find((p) => p.province === initialAddress.tinhThanhPho);
        if (provinceToSet) {
          setSelectedProvince(provinceToSet);

          // Khi đã có tỉnh, cập nhật danh sách xã/phường và tìm xã/phường tương ứng
          const wardList = provinceToSet.wards || [];
          setWards(wardList);
          const wardToSet = wardList.find((w) => w.name === initialAddress.xaPhuong);
          setSelectedWard(wardToSet || null);
        }
      } else {
        // Nếu khách hàng được chọn không có địa chỉ, xóa các trường địa chỉ
        setDetailedAddress("");
        setSelectedProvince(null);
        setSelectedWard(null);
        setWards([]);
      }
    }
  }, [initialCustomer, initialAddress, provinces]);

  // 3. useEffect để cập nhật danh sách xã/phường khi người dùng tự chọn Tỉnh/Thành phố
  useEffect(() => {
    if (selectedProvince) {
      setWards(selectedProvince.wards || []);
    } else {
      setWards([]);
    }
    // Reset xã khi tỉnh thay đổi (để tránh giữ lại xã của tỉnh cũ)
    setSelectedWard(null);
  }, [selectedProvince]);

  return (
    <SoftBox>
      {/* Nút này sẽ hiển thị tên khách hàng và cho phép bỏ chọn */}
      <SoftButton
        variant="outlined"
        color="info"
        onClick={onOpenAddressModal}
        disabled={!initialCustomer || !initialCustomer.id}
      >
        Chọn một địa chỉ có sẵn
      </SoftButton>

      <Grid container spacing={2} mt={1}>
        {/* Các trường input đã được kiểm soát (controlled components) */}
        <Grid item xs={12} md={6}>
          <SoftInput
            placeholder="Tên người nhận"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <SoftInput
            placeholder="Số điện thoại"
            fullWidth
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Autocomplete
            options={provinces}
            getOptionLabel={(option) => option.province || ""}
            value={selectedProvince}
            onChange={(event, newValue) => setSelectedProvince(newValue)}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => <TextField {...params} label="Tỉnh/Thành phố" />}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Autocomplete
            options={wards}
            getOptionLabel={(option) => option.name || ""}
            value={selectedWard}
            onChange={(event, newValue) => setSelectedWard(newValue)}
            disabled={!selectedProvince}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => <TextField {...params} label="Xã/Phường" />}
          />
        </Grid>

        <Grid item xs={12}>
          <SoftInput
            placeholder="Địa chỉ cụ thể (Số nhà, tên đường...)"
            fullWidth
            multiline
            rows={2}
            value={detailedAddress}
            onChange={(e) => setDetailedAddress(e.target.value)}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Box display="flex" alignItems="center" gap={2}>
        <DeliveryDiningIcon color="info" fontSize="large" />
        <Box>
          <SoftTypography variant="body1" fontWeight="medium">
            Đơn vị vận chuyển: Giao hàng nhanh
          </SoftTypography>
          <SoftTypography variant="body2" color="text">
            Thời gian dự kiến: 12/07/2025
          </SoftTypography>
        </Box>
      </Box>
    </SoftBox>
  );
}
ShippingForm.propTypes = {
  onOpenAddressModal: PropTypes.func.isRequired,
  initialCustomer: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tenKhachHang: PropTypes.string,
    sdt: PropTypes.string,
  }),
  initialAddress: PropTypes.shape({
    diaChiChiTiet: PropTypes.string,
    tinhThanhPho: PropTypes.string,
    xaPhuong: PropTypes.string,
  }),
};

// Khai báo giá trị mặc định để tránh lỗi khi props là null
ShippingForm.defaultProps = {
    initialCustomer: null,
    initialAddress: null,
};
export default ShippingForm;
