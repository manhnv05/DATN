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
import configs from "examples/Charts/BubbleChart/configs";

const VIETNAM_PROVINCE_API = "https://vietnamlabs.com/api/vietnamprovince";

function ShippingForm({ initialCustomer, initialAddress, onOpenAddressModal,onFormChange  }) {
  // State cho các trường trong form
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [detailedAddress, setDetailedAddress] = useState("");

  // State cho việc lấy và chọn địa chỉ từ API
  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
 useEffect(() => {
    if (onFormChange) {
      const formData = {
        name,
        phone,
        detailedAddress,
        province: selectedProvince?.province || "",
        ward: selectedWard?.name || "",
      };
     
 
      onFormChange(formData);
    }
  }, [name, phone, detailedAddress, selectedProvince, selectedWard, onFormChange]);


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


  useEffect(() => {
  
     console.log("LOG 2 (ShippingForm): Nhận được props mới:", { initialCustomer, initialAddress });
    if (initialCustomer && provinces.length > 0) {
      setName(initialCustomer.tenKhachHang || "");
      setPhone(initialCustomer.sdt || ""); 

   
      if (initialAddress) {
      setDetailedAddress(""); 

       
        const provinceToSet = provinces.find((p) => p.province === initialAddress.tinhThanhPho);
        if (provinceToSet) {
          setSelectedProvince(provinceToSet);

   
          const wardList = provinceToSet.wards || [];
          setWards(wardList);
          const wardToSet = wardList.find((w) => w.name === initialAddress.xaPhuong);
          setSelectedWard(wardToSet || null);
        }
      } else {
       
        setDetailedAddress("");
        setSelectedProvince(null);
        setSelectedWard(null);
        setWards([]);
      }
    }
  }, [initialCustomer, initialAddress, provinces]);


  return (
    <SoftBox>
    
      <SoftButton
        variant="outlined"
        color="info"
        onClick={onOpenAddressModal}
        disabled={!initialCustomer || !initialCustomer.id}
      >
        Chọn một địa chỉ có sẵn
      </SoftButton>

      <Grid container spacing={2} mt={1}>
    
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
    xaPhuong: PropTypes.string,
    diaChi: PropTypes.string,
  }),
  onFormChange: PropTypes.func.isRequired,
};

// Khai báo giá trị mặc định để tránh lỗi khi props là null
ShippingForm.defaultProps = {
    initialCustomer: null,
    initialAddress: null,
    
};
export default ShippingForm;
