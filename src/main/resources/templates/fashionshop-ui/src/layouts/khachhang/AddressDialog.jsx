import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction, Divider, CircularProgress, Menu, MenuItem, Tooltip, Chip, TextField, FormControl, Select
} from "@mui/material";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import axios from "axios";
import PropTypes from "prop-types";
import AddIcon from "@mui/icons-material/Add";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Fab from "@mui/material/Fab";
import PlaceIcon from "@mui/icons-material/Place";
import { useTheme } from "@mui/material/styles";
import { styled } from '@mui/material/styles';
import Fade from '@mui/material/Fade';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { MapPin, X, Plus } from 'lucide-react';
import { toast } from "react-toastify";

// Define font constants at the top
const FONT_FAMILY = 'Roboto, Arial, sans-serif';
const BASE_FONT_SIZE = 16;

const MAX_ADDRESSES = 5;

// API endpoints for address data
const provinceAPI = "https://provinces.open-api.vn/api/?depth=1";
const districtAPI = (code) => `https://provinces.open-api.vn/api/p/${code}?depth=2`;
const wardAPI = (code) => `https://provinces.open-api.vn/api/d/${code}?depth=2`;

// --- Color and style adjustments ---
const SOFT_PRIMARY = '#2563eb'; // lighter blue
const SOFT_BG = '#f8fafc';
const SOFT_BORDER = '#e5e7eb';
const SOFT_GREEN = '#22c55e';
const SOFT_GREEN_BG = '#f0fdf4';
const SOFT_BADGE_TEXT = '#fff';
const SOFT_CARD_SHADOW = '0 1px 0 0 #dbeafe';

// Là nhãn nhỏ màu xanh lá hiển thị "Mặc định" cho địa chỉ mặc định
const GreenBadge = styled(Chip)(({ theme }) => ({
  background: SOFT_GREEN,
  color: SOFT_BADGE_TEXT,
  fontWeight: 700,
  fontSize: 12,
  height: 22,
  minWidth: 0,
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  paddingLeft: 6,
  paddingRight: 6,
  '.MuiChip-icon': {
    fontSize: 15,
    marginRight: 3,
  },
}));

// Là nút nhỏ hiển thị các hành động như chỉnh sửa, xóa, đặt làm mặc định
const SmallActionIconButton = styled(IconButton)(({ theme }) => ({
  border: 'none',
  borderRadius: 6,
  background: 'none',
  padding: 5,
  fontSize: 18,
  color: theme.palette.action.active,
  marginLeft: 8,
  marginRight: 0,
  transition: 'background 0.15s, color 0.15s',
  '&:hover': {
    background: 'none',
    color: SOFT_PRIMARY,
    boxShadow: `0 0 0 2px ${SOFT_PRIMARY}33`, // màu xanh nhạt với độ mờ (hex 33 ≈ 20% opacity)
  },
  '&:first-of-type': {
    marginLeft: 0,
  },
  // ✅ Thêm styles cho từng loại icon
  '&.set-default:hover': {
    color: '#16a34a', // Màu xanh lá cho thiết lập mặc định
    boxShadow: `0 0 0 2px #16a34a33`,
  },
  '&.edit:hover': {
    color: '#f59e0b', // Màu vàng cho chỉnh sửa
    boxShadow: `0 0 0 2px #f59e0b33`,
  },
  '&.delete:hover': {
    color: '#ef4444', // Màu đỏ cho xóa
    boxShadow: `0 0 0 2px #ef444433`,
  },
}));

// Là thẻ địa chỉ có hiệu ứng mượt mà khi hover
const AnimatedCard = styled(Paper)(({ theme }) => ({
  transition: 'border-color 0.2s, box-shadow 0.2s',
  boxShadow: 'none',
  border: `1.5px solid ${SOFT_BORDER}`,
  background: '#fff',
  borderRadius: 8,
  padding: '14px 18px',
  marginBottom: 10,
  '&.fade-in': {
    animation: 'fadeIn 0.5s',
  },
  '&:hover': {
    borderColor: SOFT_PRIMARY,
    boxShadow: SOFT_CARD_SHADOW,
  },
  '@keyframes fadeIn': {
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'none' },
  },
}));

// Là phần form thêm/chỉnh sửa địa chỉ
function AddressFormSection({ open, onClose, onSubmit, initialData, isEdit }) {
  const [form, setForm] = useState({
    tinhThanhPho: '',
    quanHuyen: '',
    xaPhuong: '',
    trangThai: '',
  });

  // Trạng thái checkbox "Đặt làm mặc định"
  const [defaultChecked, setDefaultChecked] = useState(false);
  // Hiển thị CircularProgress trên nút submit
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);

  // ✅ State cho validation giống update nhân viên
  // const [focusField, setFocusField] = useState("");
  const [errorField, setErrorField] = useState("");

  // State cho danh sách địa chỉ
  const [addressData, setAddressData] = useState({ provinces: [], districts: [], wards: [] });

  // ✅ Styled components giống update nhân viên
  const labelStyle = { fontWeight: 600, color: "#1769aa", mb: 0.5, fontSize: 15, display: "block" };

  const getFieldSx = (focusField, name, errorField) => ({
    bgcolor: focusField === name ? "#e3f0fa" : "#fafdff",
    borderRadius: 2,
    boxShadow: focusField === name ? "0 0 0 3px #90caf9" : "none",
    transition: "all 0.3s",
    border: errorField === name ? "1px solid #d32f2f" : "none",
  });

  // Hàm fetch danh sách địa chỉ từ API
  const fetchAddress = async (type, code) => {
    const api = {
      provinces: provinceAPI,
      districts: districtAPI(code),
      wards: wardAPI(code)
    }[type];
    try {
      const { data } = await axios.get(api);
      const result = type === "provinces" ? data : data[type];
      return Array.isArray(result) ? result : [];
    } catch (error) {
      return [];
    }
  };

  // ✅ Hàm tìm code từ tên địa chỉ
  const findCodeByName = (list, name) => {
    const found = list.find(item => item.name === name);
    return found ? found.code : null;
  };

  // ✅ Hàm khởi tạo form dựa trên initialData
  const initializeForm = async () => {
    if (!open) return;

    // Fetch danh sách tỉnh trước
    const provinces = await fetchAddress("provinces");
    setAddressData(prev => ({ ...prev, provinces }));

    // Nếu là edit, tìm code từ tên địa chỉ
    if (isEdit && initialData) {
      const provinceCode = findCodeByName(provinces, initialData.tinhThanhPho);//provinceCode: 20
      if (provinceCode) {
        // Fetch districts của tỉnh này
        const districts = await fetchAddress("districts", provinceCode);
        setAddressData(prev => ({ ...prev, districts }));

        const districtCode = findCodeByName(districts, initialData.quanHuyen);//districtCode: 181
        if (districtCode) {
          // Fetch wards của quận/huyện này
          const wards = await fetchAddress("wards", districtCode);
          setAddressData(prev => ({ ...prev, wards }));

          const wardCode = findCodeByName(wards, initialData.xaPhuong);//wardCode:  6091
          setForm({
            tinhThanhPho: provinceCode,
            quanHuyen: districtCode,
            xaPhuong: wardCode,
            trangThai: initialData.trangThai || '',
          });
          // ✅ Khi edit, giữ nguyên trạng thái mặc định hiện tại, không cho thay đổi
          setDefaultChecked(initialData.trangThai === 'DEFAULT');
        }
      }
    } else {
      setForm({ tinhThanhPho: '', quanHuyen: '', xaPhuong: '', trangThai: '' });
      // ✅ Khi add mới, cho phép chọn trạng thái mặc định
      setDefaultChecked(false);
    }
    setErrorField(""); // Reset error field
  };

  // ✅ useEffect để khởi tạo form khi open hoặc initialData thay đổi
  useEffect(() => {
    initializeForm();
  }, [open, isEdit, initialData]);

  // useEffect cho Quận/Huyện khi tỉnh thay đổi
  useEffect(() => {
    const fetchDistricts = async () => {
      if (form.tinhThanhPho) {
        const districts = await fetchAddress("districts", form.tinhThanhPho);
        setAddressData(prev => ({ ...prev, districts, wards: [] }));
        // ✅ Kiểm tra xem quận/huyện hiện tại có trong danh sách mới không
        if (!districts.some(d => d.code === form.quanHuyen)) {
          setForm(prev => ({ ...prev, quanHuyen: "", xaPhuong: "" }));
        }
      }
    };
    fetchDistricts();
  }, [form.tinhThanhPho]);

  // useEffect cho Xã/Phường khi quận/huyện thay đổi
  useEffect(() => {
    const fetchWards = async () => {
      if (form.quanHuyen) {
        const wards = await fetchAddress("wards", form.quanHuyen);
        setAddressData(prev => ({ ...prev, wards }));
        // ✅ Kiểm tra xem xã/phường hiện tại có trong danh sách mới không
        if (!wards.some(w => w.code === form.xaPhuong)) {
          setForm(prev => ({ ...prev, xaPhuong: "" }));
        }
      }
    };
    fetchWards();
  }, [form.quanHuyen]);

  // ✅ Handle change giống update nhân viên
  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errorField === name) {
      setErrorField("");
    }
  };

  // ✅ Handle default checkbox change
  const handleDefaultChange = (e) => {
    setDefaultChecked(e.target.checked);
  };

  // ✅ AddressSelect component giống update nhân viên
  function AddressSelect({ label, name, value, options, disabled, error }) {
    const [focus, setFocus] = useState(false);
    return (
      <Box>
        <label style={labelStyle}>{label}</label>
        <FormControl
          fullWidth
          size="small"
          sx={{
            ...getFieldSx(focus ? name : "", name, error ? name : ""),
          }}
          disabled={disabled}
        >
          <Select
            name={name}
            value={value || ""}
            onChange={handleChange}
            onFocus={() => {
              setFocus(true);
              if (errorField === name) setErrorField("");
            }}
            onBlur={() => setFocus(false)}
            displayEmpty
          >
            <MenuItem value=""><em>Chọn {label}</em></MenuItem>
            {options.map(opt => (
              <MenuItem key={opt.code} value={opt.code}>{opt.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    );
  }

  // ✅ PropTypes cho AddressSelect
  AddressSelect.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    options: PropTypes.arrayOf(PropTypes.shape({
      code: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
    })).isRequired,
    disabled: PropTypes.bool,
    error: PropTypes.bool,
  };

  // ✅ Validation rules giống update nhân viên
  const validationRules = [
    {
      field: "tinhThanhPho",
      condition: !form.tinhThanhPho,
      message: "Vui lòng chọn tỉnh/thành phố"
    },
    {
      field: "quanHuyen",
      condition: !form.quanHuyen,
      message: "Vui lòng chọn quận/huyện"
    },
    {
      field: "xaPhuong",
      condition: !form.xaPhuong,
      message: "Vui lòng chọn xã/phường"
    }
  ];

  // ✅ Hàm validate giống update nhân viên
  const validate = () => {
    for (const rule of validationRules) {
      if (rule.condition) {
        setErrorField(rule.field);
        return rule.message;
      }
    }
    return null;
  };

  // ✅ Hàm validateBeforeSubmit giống update nhân viên
  const validateBeforeSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      toast.error(validationError);
      return false;
    }
    return true;
  };

  // Hàm lấy tên địa chỉ từ code
  function getAddressNameByCode(list, code) {
    const found = list.find(item => String(item.code) === String(code));
    return found ? found.name : "";
  }

  // ✅ Handle submit với validation giống update nhân viên
  const handleSubmit = async () => {
    setValidating(true);
    try {
      const isValid = await validateBeforeSubmit();
      if (!isValid) return;

      setLoading(true);
      // Chuyển đổi code sang tên cho địa chỉ
      const submitData = {
        ...form,
        tinhThanhPho: getAddressNameByCode(addressData.provinces, form.tinhThanhPho),
        quanHuyen: getAddressNameByCode(addressData.districts, form.quanHuyen),
        xaPhuong: getAddressNameByCode(addressData.wards, form.xaPhuong),
        // ✅ Logic trạng thái: chỉ thay đổi khi add mới, giữ nguyên khi edit
        trangThai: isEdit ? initialData.trangThai : (defaultChecked ? 'DEFAULT' : null)
      };

      // Nếu là edit, thêm id
      if (isEdit && initialData?.id) {
        submitData.id = initialData.id;
      }

      await onSubmit(submitData);
      onClose();
    } catch (error) {
      // Error handling is done in parent component
      console.log("error: ", error);
      toast.error("Lỗi khi thêm/cập nhật địa chỉ");
    } finally {
      setLoading(false);
      setValidating(false);
    }
  };

  if (!open) return null;

  return (
    <AnimatedCard elevation={3} className="fade-in" sx={{ mt: 3, p: { xs: 2, md: 4 }, borderRadius: 3, background: '#fff', border: '1.5px solid', borderColor: 'primary.main', position: 'relative' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={700} fontSize={17}>
          {isEdit ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
        </Typography>
        <SmallActionIconButton onClick={onClose} aria-label="Đóng">
          <CloseIcon sx={{ fontSize: 20 }} />
        </SmallActionIconButton>
      </Box>
      <Box component="form" autoComplete="off">
        <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={3}>
          {/* ✅ Sử dụng AddressSelect component */}
          <AddressSelect
            label="Tỉnh/Thành phố"
            name="tinhThanhPho"
            value={form.tinhThanhPho}
            options={addressData.provinces}
            disabled={false}
            error={errorField === "tinhThanhPho"}
          />
          <AddressSelect
            label="Quận/Huyện"
            name="quanHuyen"
            value={form.quanHuyen}
            options={addressData.districts}
            disabled={!form.tinhThanhPho}
            error={errorField === "quanHuyen"}
          />
          <AddressSelect
            label="Xã/Phường"
            name="xaPhuong"
            value={form.xaPhuong}
            options={addressData.wards}
            disabled={!form.quanHuyen}
            error={errorField === "xaPhuong"}
          />
        </Box>
        {/* ✅ Chỉ hiển thị checkbox khi add mới địa chỉ */}
        {!isEdit && (
          <Box display="flex" alignItems="center" gap={1} mt={2}>
            <input
              type="checkbox"
              checked={defaultChecked}
              onChange={handleDefaultChange}
              id="default-address"
              style={{
                accentColor: '#1976d2',
                cursor: 'pointer'
              }}
            />
            <label
              htmlFor="default-address"
              style={{
                fontWeight: 500,
                color: '#1976d2',
                cursor: 'pointer'
              }}
            >
              Đặt làm địa chỉ mặc định
            </label>
          </Box>
        )}
        <Box display="flex" gap={2} mt={3}>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={loading || validating}
            startIcon={(loading || validating) && <CircularProgress size={18} />}
            sx={{ minWidth: 120, fontWeight: 600 }}
          >
            {validating ? 'Đang kiểm tra...' : (isEdit ? 'Cập nhật' : 'Lưu')}
          </Button>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              minWidth: 100,
              fontWeight: 600,
              borderColor: "#bdbdbd",
              color: "#757575",
              "&:hover": {
                borderColor: "#9e9e9e",
                backgroundColor: "#f5f5f5"
              }
            }}
          >
            Hủy
          </Button>
        </Box>
      </Box>
    </AnimatedCard>
  );
}

AddressFormSection.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    tinhThanhPho: PropTypes.string,
    quanHuyen: PropTypes.string,
    xaPhuong: PropTypes.string,
    trangThai: PropTypes.string,
    id: PropTypes.number,
  }),
  isEdit: PropTypes.bool,
};

// Là nút thêm địa chỉ
const AddAddressButton = styled(Button)(({ theme }) => ({
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', // gap-2
  height: '2.25rem', // h-9
  padding: '0 0.75rem', // px-3
  borderRadius: '0.375rem', // calc(var(--radius) - 2px)
  backgroundColor: 'hsl(210, 100%, 47%)', // bg-primary
  color: 'hsl(0, 0%, 100%)', // text-primary-foreground
  fontSize: '0.875rem', // text-sm
  fontWeight: 500, // font-medium
  textTransform: 'none',
  whiteSpace: 'nowrap', // whitespace-nowrap
  transition: 'color 0.15s, box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1)', // transition-colors
  cursor: 'pointer',
  border: '0',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: 'hsl(210, 100%, 47%)', // giữ nguyên background
    boxShadow: '0 0 0 4px rgba(37, 99, 235, 0.15)', // chỉ đổ bóng nhẹ bên trong
    // Không có hiệu ứng nổi lên/phồng lên
    filter: 'none',
    transform: 'none',
  }
}));

const API_BASE_URL = "http://localhost:8080";

// Là dialog quản lý địa chỉ
function AddressDialog({ customerId, open, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  //
  const [confirmDelete, setConfirmDelete] = useState(null);
  // Id địa chỉ đc chọn làm default : khi xóa đị chỉ mặc định. 
  const [selectDefaultId, setSelectDefaultId] = useState(null);
  // Lưu địa chỉ đang đc chỉnh sửa
  const [editAddress, setEditAddress] = useState(null);
  // Trạng thái mở dialog thêm địa chỉ
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  // Trạng thái mở dialog chỉnh sửa
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  // Trạng thái mở dialog thêm/chỉnh sửa địa chỉ
  const [formSectionOpen, setFormSectionOpen] = useState(false);
  // Trạng thái chỉnh sửa địa chỉ
  const [formSectionEdit, setFormSectionEdit] = useState(false);
  // Dữ liệu địa chỉ đang đc chỉnh sửa
  const [formSectionData, setFormSectionData] = useState(null);

  // Thêm state lưu thông tin khách hàng
  const [customerInfo, setCustomerInfo] = useState(null);
  // D.sách địa chỉ của khách hàng
  const [addresses, setAddresses] = useState([]);

  // ✅ State cho confirm dialog
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: null, // 'setDefault', 'delete', 'deleteDefault'
    title: '',
    message: '',
    confirmText: '',
    cancelText: '',
    confirmColor: 'primary',
    addressId: null,
    addressData: null
  });

  useEffect(() => {
    if (open && customerId) initialize();
  }, [open, customerId]); // ✅ Thêm dependencies

  // Fetch thông tin khách hàng (trong đó có d.sách địa chỉ)
  const initialize = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch: customer data, customer address list
      const response = await axios.get(`${API_BASE_URL}/khachHang/${customerId}`);
      const customerRes = response?.data?.data;
      setCustomerInfo(customerRes);
      setAddresses(sortAddressesWithDefaultFirst(customerRes?.diaChis || []));
    } catch (e) {
      console.log("Error fetching customer: ", e);
      toast.error("Không thể tải thông tin khách hàng hoặc danh sách địa chỉ.");
    } finally {
      setLoading(false);
    }
  };

  // sort addresses with default status first
  const sortAddressesWithDefaultFirst = (addresses) => {
    return addresses.sort((a, b) => {
      if (a.trangThai === 'DEFAULT' && b.trangThai !== 'DEFAULT') return -1;
      if (a.trangThai !== 'DEFAULT' && b.trangThai === 'DEFAULT') return 1;
      return 0;
    });
  };

  // Fetch customer address list again (after adding/deleting/editing an address)
  const fetchAddressesCustomer = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch: customer address list + sort addresses with default status first
      const res = await axios.get(`${API_BASE_URL}/khachHang/${customerId}/diaChis`);
      setAddresses(sortAddressesWithDefaultFirst(res.data.data || []));
    } catch (e) {
      console.log("Error fetching addresses: ", e);
      toast.error("Không thể tải danh sách địa chỉ của khách hàng.");
    } finally {
      setLoading(false);
    }
  };

  // Handle event when click to set default status
  const handleSetDefault = async (addressId) => {
    try {
      // ✅ Sử dụng endpoint mới để thiết lập địa chỉ mặc định
      await axios.patch(`${API_BASE_URL}/khachHang/${customerId}/diaChi/${addressId}/setDefault`);
      toast.success("Thiết lập địa chỉ mặc định thành công!");
      fetchAddressesCustomer();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Không thể thiết lập địa chỉ mặc định.";
      toast.error(errorMessage);
    }
  };

  // ✅ Hàm mở confirm dialog cho thiết lập mặc định
  const openSetDefaultConfirm = (address) => {
    setConfirmDialog({
      open: true,
      type: 'setDefault',
      title: "Xác nhận thiết lập địa chỉ mặc định",
      message: `Bạn có chắc chắn muốn thiết lập địa chỉ "${address.tinhThanhPho}, ${address.quanHuyen}, ${address.xaPhuong}" làm địa chỉ mặc định? Địa chỉ mặc định hiện tại sẽ được chuyển thành địa chỉ phụ.`,
      confirmText: "Thiết lập mặc định",
      cancelText: "Hủy bỏ",
      confirmColor: "primary",
      addressId: address.id,
      addressData: address
    });
  };

  // ✅ Hàm mở confirm dialog cho xóa địa chỉ
  const openDeleteConfirm = (address) => {
    if (addresses.length === 1) {
      // Nếu chỉ có 1 địa chỉ, xóa trực tiếp
      setConfirmDialog({
        open: true,
        type: 'delete',
        title: "Xác nhận xóa địa chỉ",
        message: `Bạn có chắc chắn muốn xóa địa chỉ "${address.tinhThanhPho}, ${address.quanHuyen}, ${address.xaPhuong}"? Đây là địa chỉ duy nhất của khách hàng.`,
        confirmText: "Xóa địa chỉ",
        cancelText: "Hủy bỏ",
        confirmColor: "error",
        addressId: address.id,
        addressData: address
      });
    } else if (address.trangThai === "DEFAULT") {
      // Nếu là địa chỉ mặc định và còn địa chỉ khác, yêu cầu chọn địa chỉ mới
      setConfirmDelete({ addressId: address.id, isDefault: true });
    } else {
      // Địa chỉ thường, xóa trực tiếp
      setConfirmDialog({
        open: true,
        type: 'delete',
        title: "Xác nhận xóa địa chỉ",
        message: `Bạn có chắc chắn muốn xóa địa chỉ "${address.tinhThanhPho}, ${address.quanHuyen}, ${address.xaPhuong}"?`,
        confirmText: "Xóa địa chỉ",
        cancelText: "Hủy bỏ",
        confirmColor: "error",
        addressId: address.id,
        addressData: address
      });
    }
  };

  // ✅ Hàm thực thi khi click vào button trong confirm dialog
  const handleConfirmAction = () => {
    const { type, addressId } = confirmDialog;
    switch (type) {
      case 'setDefault':
        closeConfirmDialog();
        handleSetDefault(addressId);
        break;
      case 'delete':
        closeConfirmDialog();
        doDelete(addressId);
        break;
      default:
        closeConfirmDialog();
    }
  };

  // ✅ Hàm đóng confirm dialog
  const closeConfirmDialog = () => {
    setConfirmDialog(prev => ({ ...prev, open: false }));
  };

  // Là hàm chỉnh sửa địa chỉ
  const handleEdit = (address) => {
    setFormSectionOpen(true);//open -> true: mở dialog thêm/chỉnh sửa địa chỉ
    setFormSectionEdit(true);//edit -> true: chỉnh sửa địa chỉ
    setFormSectionData(address);//data: dữ liệu địa chỉ đang đc chỉnh sửa
  };
  // Gửi api chỉnh sửa địa chỉ
  const handleEditAddress = async (data) => {
    try {
      await axios.patch(`${API_BASE_URL}/khachHang/${customerId}/diaChi/${data.id}`, data);
      toast.success("Cập nhật địa chỉ thành công!");
      fetchAddressesCustomer();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Không thể cập nhật địa chỉ.";
      toast.error(errorMessage);
    }
  };

  // Gửi api xóa địa chỉ
  const doDelete = async (addressId, newDefaultId) => {
    try {
      // Nếu có địa chỉ mới để set làm mặc định, thực hiện trước
      if (newDefaultId) {
        await axios.patch(`${API_BASE_URL}/khachHang/${customerId}/diaChi/${newDefaultId}/setDefault`);
      }

      // ✅ Sử dụng endpoint mới để xóa địa chỉ
      await axios.delete(`${API_BASE_URL}/khachHang/${customerId}/diaChi/${addressId}`);
      setConfirmDelete(null);
      setSelectDefaultId(null); // ✅ Reset selectDefaultId
      toast.success("Xóa địa chỉ thành công!");
      fetchAddressesCustomer();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Không thể xóa địa chỉ.";
      toast.error(errorMessage);
      setConfirmDelete(null);
      setSelectDefaultId(null); // ✅ Reset selectDefaultId khi có lỗi
    }
  };

  // Gửi api thêm địa chỉ
  const handleAddAddress = async (data) => {
    try {
      await axios.post(`${API_BASE_URL}/khachHang/${customerId}/diaChi`, data);
      toast.success("Thêm địa chỉ thành công!");
      fetchAddressesCustomer();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Không thể thêm địa chỉ.";
      toast.error(errorMessage);
    }
  };

  // Bắt hàm mở dialog thêm địa chỉ
  const handleAddClick = () => {
    setFormSectionOpen(true);
    setFormSectionEdit(false);
    setFormSectionData(null);
  };

  // Là hàm đóng dialog thêm/chỉnh sửa địa chỉ
  const handleFormClose = () => {
    setFormSectionOpen(false);
    setFormSectionEdit(false);
    setFormSectionData(null);
    setAddDialogOpen(false);
    setEditDialogOpen(false);
  };

  // Là phần body của dialog
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" sx={{ fontFamily: FONT_FAMILY, fontSize: BASE_FONT_SIZE }}>
        {/* Container phần tiêu đề */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: '1rem',
            gap: '0.375rem', // space-y-1.5
            textAlign: { xs: 'center', sm: 'left' }, // text-center sm:text-left
            fontFamily: 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
            color: 'hsl(222.2, 84%, 4.9%)', // --foreground
          }}
        >
          <Typography
            variant="h2"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '1.25rem',  // kích thước văn bản
              fontWeight: 600,  // độ đậm
              letterSpacing: '-0.025em', // khoảng cách giữa các chữ cái
              color: 'hsl(222.2, 84%, 4.9%)', // --foreground
              fontFamily: 'ui-sans-serif, system-ui, sans-serif', // font chữ
            }}
          >
            <MapPin
              size={20} // 1.25rem: kích thước icon : width + height.
              color="hsl(210, 100%, 47%)" // --primary: Màu đường viền icon (vì fill= "none"). 
              strokeWidth={2} // Độ dày đường viền
              strokeLinecap="round" // Độ bo của đường viền
              strokeLinejoin="round" // Độ bo của đường viền
              fill="none" // Không tô màu phần trong icon, chỉ giữ lại phần viền (outline). 
              style={{ marginRight: '0.5rem' }} // Khoảng cách bên phải với văn bản
            />
            Danh sách địa chỉ của {customerInfo?.tenKhachHang} (Mã KH: {customerInfo?.maKhachHang})
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton
              onClick={onClose}
              aria-label="Đóng"
              sx={{
                width: 28, height: 28, padding: '2px',
                opacity: 0.7,
                transition: 'opacity 0.2s, box-shadow 0.2s, border-color 0.2s',
                border: '2px solid transparent',
                borderRadius: '8px', boxShadow: 'none',
                '&:hover': {
                  opacity: 1,
                },
                '&:focus-visible, &:active': {
                  borderColor: '#2563eb',
                  boxShadow: '0 0 0 0px #2563eb', outline: 'none',
                  opacity: 1, backgroundColor: '#f8fafc',
                },
              }}
              tabIndex={0}  // Sẽ focus khi nhấn tab.
            >
              <X size={15} color="#2563eb" />
            </IconButton>
          </Box>
        </Box>
        {/* Container: SL địa chỉ và nút thêm địa chỉ */}
        <Box
          sx={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', mb: 2, fontFamily: 'ui-sans-serif, system-ui, sans-serif',
            color: 'hsl(222.2, 84%, 4.9%)', // --foreground
          }}
        >
          {/* Tiêu đề + Số lượng địa chỉ */}
          <Typography
            variant="h3"
            sx={{
              fontFamily: 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
              fontWeight: 500, fontSize: '1.125rem',
              lineHeight: '1.75rem', color: 'hsl(222.2, 84%, 4.9%)', margin: 0,
            }}
          >
            Địa chỉ ({addresses.length}/5)
          </Typography>
          {/* nút thêm địa chỉ */}
          <AddAddressButton
            onClick={handleAddClick}  // TODO
            startIcon={<Plus size={16} />}
            disabled={addresses.length >= 5}
          >
            Thêm địa chỉ
          </AddAddressButton>
        </Box>
        {/* Danh sách địa chỉ */}
        {/* Loading */}
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={120}>
            <CircularProgress color="primary" size={28} />
            <Typography ml={2} color={SOFT_PRIMARY} fontSize={15}>Đang tải...</Typography>
          </Box>
        ) : error ? (
          // Là lỗi
          <Typography color="error">{error}</Typography>
        ) : addresses.length === 0 ? (
          // Là danh sách địa chỉ trống: không có địa chỉ nào
          <AnimatedCard elevation={0} className="fade-in" sx={{ border: `2px dashed ${SOFT_PRIMARY}`, background: SOFT_BG, p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <PlaceIcon sx={{ fontSize: 48, color: SOFT_PRIMARY, mb: 2 }} />
            <Typography color="text.secondary" fontSize={16} textAlign="center">Chưa có địa chỉ nào. Nhấn &quot;Thêm địa chỉ&quot; để bắt đầu.</Typography>
          </AnimatedCard>
        ) : (
          // Là danh sách địa chỉ
          <Box display="flex" flexDirection="column" gap={1.5} mt={1}>
            {addresses.map((address, idx) => (
              <AnimatedCard
                key={address.id} elevation={address.trangThai === 'DEFAULT' ? 3 : 0} className="fade-in"
                sx={{
                  border: address.trangThai === 'DEFAULT' ? `1.5px solid #16a34a` : `1.5px solid #e2e8f0`,
                  background: address.trangThai === 'DEFAULT' ? '#f0fdf4' : '#fff',
                }}
              >
                {/* Tiêu đề địa chỉ: số thứ tự + mặc định + nút thao tác */}
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
                  {/* Số thứ tự + mặc định */}
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography fontWeight={700} fontSize={13.5} color={address.trangThai === 'DEFAULT' ? '#16a34a' : '#333'}>
                      Địa chỉ {idx + 1}
                    </Typography>
                    {/* Icon mặc định */}
                    {address.trangThai === 'DEFAULT' && (
                      <GreenBadge
                        icon={<StarIcon sx={{ fontSize: 14, color: '#16a34a', mr: 0.5 }} />}
                        label="Mặc định" color="primary" size="small" sx={{ ml: 1 }}
                      />
                    )}
                  </Box>
                  {/* Nút thao tác */}
                  <Box display="flex" alignItems="center" gap={1.5}>
                    {address.trangThai !== 'DEFAULT' && (
                      <Tooltip title="Đặt làm mặc định">
                        <span>
                          <SmallActionIconButton
                            edge="end" color="primary" aria-label="Đặt làm mặc định"
                            onClick={() => openSetDefaultConfirm(address)} // ✅ Sử dụng confirm dialog
                            className="set-default"
                          >
                            <StarBorderIcon sx={{ fontSize: 17 }} />
                          </SmallActionIconButton>
                        </span>
                      </Tooltip>
                    )}
                    <Tooltip title="Chỉnh sửa">
                      <SmallActionIconButton
                        edge="end" aria-label="Chỉnh sửa" className="edit"
                        onClick={() => handleEdit(address)} // TODO
                      >
                        <EditOutlinedIcon sx={{ fontSize: 17 }} />
                      </SmallActionIconButton>
                    </Tooltip>
                    <Tooltip title="Xóa địa chỉ">
                      <SmallActionIconButton
                        edge="end" color="error" aria-label="Xóa" className="delete"
                        onClick={() => openDeleteConfirm(address)} // ✅ Sử dụng confirm dialog
                      >
                        <DeleteIcon sx={{ fontSize: 17 }} />
                      </SmallActionIconButton>
                    </Tooltip>
                  </Box>
                </Box>
                {/* Nội dung địa chỉ */}
                <Typography fontWeight={600} fontSize={15.5} color="#333">
                  {address.tinhThanhPho}, {address.quanHuyen}, {address.xaPhuong}
                </Typography>
              </AnimatedCard>
            ))}
          </Box>
        )}
        {/* Là phần form thêm/chỉnh sửa địa chỉ */}
        <AddressFormSection
          open={formSectionOpen}
          onClose={handleFormClose}
          onSubmit={formSectionEdit ? handleEditAddress : handleAddAddress}
          initialData={formSectionData}
          isEdit={formSectionEdit}
        />
      </DialogContent>
      {/* Dialog xác nhận xóa địa chỉ mặc định và các phần khác giữ nguyên */}
      {confirmDelete && confirmDelete.isDefault && addresses.length > 1 && (
        <Dialog open onClose={() => setConfirmDelete(null)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ color: '#d32f2f', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            <DeleteIcon sx={{ fontSize: 24 }} />
            Xác nhận xóa địa chỉ mặc định
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 2, color: '#666' }}>
                Bạn đang xóa địa chỉ mặc định. Vui lòng chọn một địa chỉ khác làm địa chỉ mặc định trước khi xóa.
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#d32f2f', mb: 1 }}>
                Địa chỉ sẽ bị xóa:
              </Typography>
              <Paper sx={{ p: 2, bgcolor: '#fff3e0', border: '1px solid #ffb74d', borderRadius: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {addresses.find(a => a.id === confirmDelete.addressId)?.tinhThanhPho}, {addresses.find(a => a.id === confirmDelete.addressId)?.quanHuyen}, {addresses.find(a => a.id === confirmDelete.addressId)?.xaPhuong}
                </Typography>
              </Paper>
            </Box>

            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1976d2', mb: 2 }}>
              Chọn địa chỉ mới làm mặc định:
            </Typography>

            <Box sx={{ maxHeight: 250, overflowY: 'auto' }}>
              {addresses.filter(a => a.id !== confirmDelete.addressId).map((address, index) => (
                <Paper
                  key={address.id}
                  sx={{
                    p: 1.5,
                    mb: 1,
                    cursor: 'pointer',
                    border: selectDefaultId === address.id ? '2px solid #1976d2' : '1px solid #e0e0e0',
                    bgcolor: selectDefaultId === address.id ? '#e3f2fd' : '#fff',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: '#1976d2',
                      bgcolor: selectDefaultId === address.id ? '#e3f2fd' : '#f5f5f5'
                    }
                  }}
                  onClick={() => setSelectDefaultId(address.id)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
                        Địa chỉ {index + 1}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666', mt: 0.5, fontSize: '0.875rem' }}>
                        {address.tinhThanhPho}, {address.quanHuyen}, {address.xaPhuong}
                      </Typography>
                    </Box>
                    {selectDefaultId === address.id && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 1 }}>
                        <StarIcon sx={{ fontSize: 18, color: '#1976d2' }} />
                        <Typography variant="caption" sx={{ color: '#1976d2', fontWeight: 600, fontSize: '0.75rem' }}>
                          Mặc định
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>
              ))}
            </Box>

            {!selectDefaultId && (
              <Typography variant="caption" sx={{ color: '#d32f2f', mt: 1, display: 'block' }}>
                ⚠️ Vui lòng chọn một địa chỉ làm mặc định
              </Typography>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button
              onClick={() => {
                setConfirmDelete(null);
                setSelectDefaultId(null);
              }}
              variant="outlined"
              sx={{
                minWidth: 80,
                fontWeight: 600,
                borderColor: "#bdbdbd",
                color: "#757575",
                "&:hover": {
                  borderColor: "#9e9e9e",
                  backgroundColor: "#f5f5f5"
                }
              }}
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={() => doDelete(confirmDelete.addressId, selectDefaultId)}
              disabled={!selectDefaultId}
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              sx={{ minWidth: 160, fontWeight: 600 }}
            >
              Xóa & Thiết lập mặc định
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {/* Dialog xác nhận xóa địa chỉ không mặc định hoặc chỉ có 1 địa chỉ */}
      {confirmDelete && !confirmDelete.isDefault && (
        <Dialog open onClose={() => setConfirmDelete(null)}>
          <DialogTitle>Xác nhận xóa địa chỉ</DialogTitle>
          <DialogContent>
            <Typography>Bạn có chắc chắn muốn xóa địa chỉ này?</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setConfirmDelete(null)}
              variant="outlined"
              sx={{
                fontWeight: 600,
                borderColor: "#bdbdbd",
                color: "#757575",
                "&:hover": {
                  borderColor: "#9e9e9e",
                  backgroundColor: "#f5f5f5"
                }
              }}
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={() => doDelete(confirmDelete.addressId)}
              color="error"
              variant="contained"
              sx={{ fontWeight: 600 }}
            >
              Xóa
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {/* ✅ Confirm Dialog cho thiết lập mặc định và xóa địa chỉ */}
      {confirmDialog.open && (
        <Dialog open onClose={closeConfirmDialog} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ color: confirmDialog.confirmColor === 'error' ? '#d32f2f' : '#1976d2', fontWeight: 600 }}>
            {confirmDialog.title}
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
              {confirmDialog.message}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button
              onClick={closeConfirmDialog}
              variant="outlined"
              sx={{
                minWidth: 100,
                fontWeight: 600,
                borderColor: "#bdbdbd",
                color: "#757575",
                "&:hover": {
                  borderColor: "#9e9e9e",
                  backgroundColor: "#f5f5f5"
                }
              }}
            >
              {confirmDialog.cancelText}
            </Button>
            <Button
              onClick={handleConfirmAction}
              variant="contained"
              color={confirmDialog.confirmColor}
              sx={{ minWidth: 120, fontWeight: 600 }}
            >
              {confirmDialog.confirmText}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Dialog>
  );
}

AddressDialog.propTypes = {
  customerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddressDialog; 