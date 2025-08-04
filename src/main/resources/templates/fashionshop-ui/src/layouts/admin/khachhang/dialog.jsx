import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  CircularProgress,
  MenuItem,
  Tooltip,
  Chip,
  FormControl,
  Select,
  Paper
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import AddIcon from "@mui/icons-material/Add";
import PlaceIcon from "@mui/icons-material/Place";
import CloseIcon from "@mui/icons-material/Close";
import { MapPin, X, Plus } from "lucide-react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import axios from "axios";
import { styled } from "@mui/material/styles";

const SOFT_PRIMARY = "#2563eb";
const SOFT_BG = "#f8fafc";
const SOFT_BORDER = "#e5e7eb";
const SOFT_GREEN = "#22c55e";
const SOFT_BADGE_TEXT = "#fff";
const SOFT_CARD_SHADOW = "0 1px 0 0 #dbeafe";
const API_BASE_URL = "http://localhost:8080";
const provinceAPI = "http://localhost:8080/api/vietnamlabs/province";

const GreenBadge = styled(Chip)(({ theme }) => ({
  background: SOFT_GREEN,
  color: SOFT_BADGE_TEXT,
  fontWeight: 700,
  fontSize: 12,
  height: 22,
  minWidth: 0,
  display: "flex",
  alignItems: "center",
  gap: 4,
  paddingLeft: 6,
  paddingRight: 6,
  ".MuiChip-icon": {
    fontSize: 15,
    marginRight: 3
  }
}));

const SmallActionIconButton = styled(IconButton)(({ theme }) => ({
  border: "none",
  borderRadius: 6,
  background: "none",
  padding: 5,
  fontSize: 18,
  color: theme.palette.action.active,
  marginLeft: 8,
  marginRight: 0,
  transition: "background 0.15s, color 0.15s",
  "&:hover": {
    background: "none",
    color: SOFT_PRIMARY,
    boxShadow: `0 0 0 2px ${SOFT_PRIMARY}33`
  },
  "&:first-of-type": {
    marginLeft: 0
  },
  "&.set-default:hover": {
    color: "#16a34a",
    boxShadow: `0 0 0 2px #16a34a33`
  },
  "&.edit:hover": {
    color: "#f59e0b",
    boxShadow: `0 0 0 2px #f59e0b33`
  },
  "&.delete:hover": {
    color: "#ef4444",
    boxShadow: `0 0 0 2px #ef444433`
  }
}));

const AnimatedCard = styled(Paper)(({ theme }) => ({
  transition: "border-color 0.2s, box-shadow 0.2s",
  boxShadow: "none",
  border: `1.5px solid ${SOFT_BORDER}`,
  background: "#fff",
  borderRadius: 8,
  padding: "14px 18px",
  marginBottom: 10,
  "&.fade-in": {
    animation: "fadeIn 0.5s"
  },
  "&:hover": {
    borderColor: SOFT_PRIMARY,
    boxShadow: SOFT_CARD_SHADOW
  },
  "@keyframes fadeIn": {
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "none" }
  }
}));

const AddAddressButton = styled(Button)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
  height: "2.25rem",
  padding: "0 0.75rem",
  borderRadius: "0.375rem",
  backgroundColor: "hsl(210, 100%, 47%)",
  color: "hsl(0, 0%, 100%)",
  fontSize: "0.875rem",
  fontWeight: 500,
  textTransform: "none",
  whiteSpace: "nowrap",
  transition: "color 0.15s, box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
  cursor: "pointer",
  border: "0",
  boxShadow: "none",
  "&:hover": {
    backgroundColor: "hsl(210, 100%, 47%)",
    boxShadow: "0 0 0 4px rgba(37, 99, 235, 0.15)",
    filter: "none",
    transform: "none"
  }
}));

function AddressFormSection({ open, onClose, onSubmit, initialData, isEdit }) {
  const [form, setForm] = useState({
    tinhThanhPho: "",
    xaPhuong: "",
    trangThai: 0
  });
  const [defaultChecked, setDefaultChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [errorField, setErrorField] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    if (!open) return;
    axios
        .get(provinceAPI)
        .then((res) => {
          setProvinces(res.data?.data || []);
        })
        .catch(() => setProvinces([]));
  }, [open]);

  useEffect(() => {
    if (form.tinhThanhPho) {
      const selected = provinces.find(
          (p) => String(p.id) === String(form.tinhThanhPho)
      );
      setWards(selected && Array.isArray(selected.wards) ? selected.wards : []);
    } else {
      setWards([]);
    }
    setForm((prev) => ({ ...prev, xaPhuong: "" }));
  }, [form.tinhThanhPho, provinces]);

  useEffect(() => {
    if (!open) return;
    if (isEdit && initialData) {
      const prov = provinces.find(
          (p) => p.province === initialData.tinhThanhPho
      );
      const provId = prov ? prov.id : "";
      const ward =
          prov && prov.wards
              ? prov.wards.find((w) => w.name === initialData.xaPhuong)
              : null;
      const wardName = ward ? ward.name : initialData.xaPhuong || "";
      setForm({
        tinhThanhPho: provId,
        xaPhuong: wardName,
        trangThai: initialData.trangThai ?? 0
      });
      setDefaultChecked(initialData.trangThai === 1);
      setWards(prov && prov.wards ? prov.wards : []);
    } else {
      setForm({ tinhThanhPho: "", xaPhuong: "", trangThai: 0 });
      setDefaultChecked(false);
      setWards([]);
    }
    setErrorField("");
  }, [open, isEdit, initialData, provinces]);

  const labelStyle = {
    fontWeight: 600,
    color: "#1769aa",
    mb: 0.5,
    fontSize: 15,
    display: "block"
  };

  const validate = () => {
    if (!form.tinhThanhPho) {
      setErrorField("tinhThanhPho");
      return "Vui lòng chọn tỉnh/thành phố";
    }
    if (!form.xaPhuong) {
      setErrorField("xaPhuong");
      return "Vui lòng chọn xã/phường";
    }
    return null;
  };

  const validateBeforeSubmit = () => {
    const validationError = validate();
    if (validationError) {
      toast.error(validationError);
      return false;
    }
    return true;
  };

  function getProvinceNameById(id) {
    const found = provinces.find((p) => String(p.id) === String(id));
    return found ? found.province : "";
  }
  function getWardNameById(name) {
    const found = wards.find((w) => w.name === name);
    return found ? found.name : name;
  }

  const handleSubmit = async () => {
    setValidating(true);
    try {
      const isValid = validateBeforeSubmit();
      if (!isValid) return;

      setLoading(true);
      const submitData = {
        tinhThanhPho: getProvinceNameById(form.tinhThanhPho),
        xaPhuong: getWardNameById(form.xaPhuong),
        trangThai: isEdit
            ? initialData.trangThai
            : defaultChecked
                ? 1
                : 0
      };

      if (isEdit && initialData?.id) {
        submitData.id = initialData.id;
      }

      await onSubmit(submitData);
      onClose();
    } catch (error) {
      toast.error("Lỗi khi thêm/cập nhật địa chỉ");
    } finally {
      setLoading(false);
      setValidating(false);
    }
  };

  if (!open) return null;

  return (
      <AnimatedCard
          elevation={3}
          className="fade-in"
          sx={{
            mt: 3,
            p: { xs: 2, md: 4 },
            borderRadius: 3,
            background: "#fff",
            border: "1.5px solid",
            borderColor: "primary.main",
            position: "relative"
          }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight={700} fontSize={17}>
            {isEdit ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
          </Typography>
          <SmallActionIconButton onClick={onClose} aria-label="Đóng">
            <CloseIcon sx={{ fontSize: 20 }} />
          </SmallActionIconButton>
        </Box>
        <Box component="form" autoComplete="off">
          <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }} gap={3}>
            <Box>
              <label style={labelStyle}>Tỉnh/Thành phố</label>
              <FormControl
                  fullWidth
                  size="small"
                  sx={{
                    bgcolor: errorField === "tinhThanhPho" ? "#fff8f7" : "#fafdff",
                    borderRadius: 2,
                    border: errorField === "tinhThanhPho" ? "1px solid #d32f2f" : "none"
                  }}
              >
                <Select
                    name="tinhThanhPho"
                    value={form.tinhThanhPho}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, tinhThanhPho: e.target.value, xaPhuong: "" }));
                      setErrorField("");
                    }}
                    displayEmpty
                >
                  <MenuItem value="">
                    <em>Chọn tỉnh/thành phố</em>
                  </MenuItem>
                  {provinces.map((opt) => (
                      <MenuItem key={opt.id} value={opt.id}>
                        {opt.province}
                      </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box>
              <label style={labelStyle}>Xã/Phường</label>
              <FormControl
                  fullWidth
                  size="small"
                  sx={{
                    bgcolor: errorField === "xaPhuong" ? "#fff8f7" : "#fafdff",
                    borderRadius: 2,
                    border: errorField === "xaPhuong" ? "1px solid #d32f2f" : "none"
                  }}
              >
                <Select
                    name="xaPhuong"
                    value={form.xaPhuong}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, xaPhuong: e.target.value }));
                      setErrorField("");
                    }}
                    displayEmpty
                    disabled={!form.tinhThanhPho}
                >
                  <MenuItem value="">
                    <em>Chọn xã/phường</em>
                  </MenuItem>
                  {wards.map((opt) => (
                      <MenuItem key={opt.name} value={opt.name}>
                        {opt.name}
                      </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
          {!isEdit && (
              <Box display="flex" alignItems="center" gap={1} mt={2}>
                <input
                    type="checkbox"
                    checked={defaultChecked}
                    onChange={(e) => setDefaultChecked(e.target.checked)}
                    id="default-address"
                    style={{ accentColor: "#1976d2", cursor: "pointer" }}
                />
                <label
                    htmlFor="default-address"
                    style={{
                      fontWeight: 500,
                      color: "#1976d2",
                      cursor: "pointer"
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
              {validating ? "Đang kiểm tra..." : isEdit ? "Cập nhật" : "Lưu"}
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
    xaPhuong: PropTypes.string,
    trangThai: PropTypes.number,
    id: PropTypes.number
  }),
  isEdit: PropTypes.bool
};

function AddressDialog({ customerId, open, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [selectDefaultId, setSelectDefaultId] = useState(null);
  const [formSectionOpen, setFormSectionOpen] = useState(false);
  const [formSectionEdit, setFormSectionEdit] = useState(false);
  const [formSectionData, setFormSectionData] = useState(null);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: null,
    title: "",
    message: "",
    confirmText: "",
    cancelText: "",
    confirmColor: "primary",
    addressId: null,
    addressData: null
  });

  useEffect(() => {
    if (open && customerId) initialize();
  }, [open, customerId]);

  const initialize = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/khachHang/${customerId}`);
      const customerRes = response?.data?.data || response?.data;
      setCustomerInfo(customerRes);
      setAddresses(sortAddressesWithDefaultFirst(customerRes?.diaChis || []));
    } catch (e) {
      toast.error("Không thể tải thông tin khách hàng hoặc danh sách địa chỉ.");
    } finally {
      setLoading(false);
    }
  };

  const sortAddressesWithDefaultFirst = (addresses) => {
    return addresses.sort((a, b) => {
      if (a.trangThai === 1 && b.trangThai !== 1) return -1;
      if (a.trangThai !== 1 && b.trangThai === 1) return 1;
      return 0;
    });
  };

  const fetchAddressesCustomer = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/khachHang/${customerId}/diaChis`);
      setAddresses(sortAddressesWithDefaultFirst(res.data.data || []));
    } catch (e) {
      toast.error("Không thể tải danh sách địa chỉ của khách hàng.");
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      await axios.patch(`${API_BASE_URL}/khachHang/${customerId}/diaChi/${addressId}/setDefault`);
      toast.success("Thiết lập địa chỉ mặc định thành công!");
      fetchAddressesCustomer();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Không thể thiết lập địa chỉ mặc định.";
      toast.error(errorMessage);
    }
  };

  const openSetDefaultConfirm = (address) => {
    setConfirmDialog({
      open: true,
      type: "setDefault",
      title: "Xác nhận thiết lập địa chỉ mặc định",
      message: `Bạn có chắc chắn muốn thiết lập địa chỉ "${address.tinhThanhPho}, ${address.xaPhuong}" làm địa chỉ mặc định? Địa chỉ mặc định hiện tại sẽ được chuyển thành địa chỉ phụ.`,
      confirmText: "Thiết lập mặc định",
      cancelText: "Hủy bỏ",
      confirmColor: "primary",
      addressId: address.id,
      addressData: address
    });
  };

  const openDeleteConfirm = (address) => {
    if (addresses.length === 1) {
      setConfirmDialog({
        open: true,
        type: "delete",
        title: "Xác nhận xóa địa chỉ",
        message: `Bạn có chắc chắn muốn xóa địa chỉ "${address.tinhThanhPho}, ${address.xaPhuong}"? Đây là địa chỉ duy nhất của khách hàng.`,
        confirmText: "Xóa địa chỉ",
        cancelText: "Hủy bỏ",
        confirmColor: "error",
        addressId: address.id,
        addressData: address
      });
    } else if (address.trangThai === 1) {
      setConfirmDelete({ addressId: address.id, isDefault: true });
    } else {
      setConfirmDialog({
        open: true,
        type: "delete",
        title: "Xác nhận xóa địa chỉ",
        message: `Bạn có chắc chắn muốn xóa địa chỉ "${address.tinhThanhPho}, ${address.xaPhuong}"?`,
        confirmText: "Xóa địa chỉ",
        cancelText: "Hủy bỏ",
        confirmColor: "error",
        addressId: address.id,
        addressData: address
      });
    }
  };

  const handleConfirmAction = () => {
    const { type, addressId } = confirmDialog;
    switch (type) {
      case "setDefault":
        closeConfirmDialog();
        handleSetDefault(addressId);
        break;
      case "delete":
        closeConfirmDialog();
        doDelete(addressId);
        break;
      default:
        closeConfirmDialog();
    }
  };

  const closeConfirmDialog = () => {
    setConfirmDialog((prev) => ({ ...prev, open: false }));
  };

  const handleEdit = (address) => {
    setFormSectionOpen(true);
    setFormSectionEdit(true);
    setFormSectionData(address);
  };

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

  const doDelete = async (addressId, newDefaultId) => {
    try {
      if (newDefaultId) {
        await axios.patch(`${API_BASE_URL}/khachHang/${customerId}/diaChi/${newDefaultId}/setDefault`);
      }
      await axios.delete(`${API_BASE_URL}/khachHang/${customerId}/diaChi/${addressId}`);
      setConfirmDelete(null);
      setSelectDefaultId(null);
      toast.success("Xóa địa chỉ thành công!");
      fetchAddressesCustomer();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Không thể xóa địa chỉ.";
      toast.error(errorMessage);
      setConfirmDelete(null);
      setSelectDefaultId(null);
    }
  };

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

  const handleAddClick = () => {
    setFormSectionOpen(true);
    setFormSectionEdit(false);
    setFormSectionData(null);
  };

  const handleFormClose = () => {
    setFormSectionOpen(false);
    setFormSectionEdit(false);
    setFormSectionData(null);
  };

  return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: "1rem",
                gap: "0.375rem",
                textAlign: { xs: "center", sm: "left" },
                fontFamily:
                    'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
                color: "hsl(222.2, 84%, 4.9%)"
              }}
          >
            <Typography
                variant="h2"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  letterSpacing: "-0.025em",
                  color: "hsl(222.2, 84%, 4.9%)",
                  fontFamily: "ui-sans-serif, system-ui, sans-serif"
                }}
            >
              <MapPin
                  size={20}
                  color="hsl(210, 100%, 47%)"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  style={{ marginRight: "0.5rem" }}
              />
              Danh sách địa chỉ của {customerInfo?.tenKhachHang} (Mã KH: {customerInfo?.maKhachHang})
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <IconButton
                  onClick={onClose}
                  aria-label="Đóng"
                  sx={{
                    width: 28,
                    height: 28,
                    padding: "2px",
                    opacity: 0.7,
                    transition: "opacity 0.2s, box-shadow 0.2s, border-color 0.2s",
                    border: "2px solid transparent",
                    borderRadius: "8px",
                    boxShadow: "none",
                    "&:hover": {
                      opacity: 1
                    },
                    "&:focus-visible, &:active": {
                      borderColor: "#2563eb",
                      boxShadow: "0 0 0 0px #2563eb",
                      outline: "none",
                      opacity: 1,
                      backgroundColor: "#f8fafc"
                    }
                  }}
                  tabIndex={0}
              >
                <X size={15} color="#2563eb" />
              </IconButton>
            </Box>
          </Box>
          <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
                fontFamily: "ui-sans-serif, system-ui, sans-serif",
                color: "hsl(222.2, 84%, 4.9%)"
              }}
          >
            <Typography
                variant="h3"
                sx={{
                  fontFamily:
                      'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
                  fontWeight: 500,
                  fontSize: "1.125rem",
                  lineHeight: "1.75rem",
                  color: "hsl(222.2, 84%, 4.9%)",
                  margin: 0
                }}
            >
              Địa chỉ ({addresses.length}/5)
            </Typography>
            <AddAddressButton
                onClick={handleAddClick}
                startIcon={<Plus size={16} />}
                disabled={addresses.length >= 5}
            >
              Thêm địa chỉ
            </AddAddressButton>
          </Box>
          {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight={120}>
                <CircularProgress color="primary" size={28} />
                <Typography ml={2} color={SOFT_PRIMARY} fontSize={15}>
                  Đang tải...
                </Typography>
              </Box>
          ) : error ? (
              <Typography color="error">{error}</Typography>
          ) : addresses.length === 0 ? (
              <AnimatedCard
                  elevation={0}
                  className="fade-in"
                  sx={{
                    border: `2px dashed ${SOFT_PRIMARY}`,
                    background: SOFT_BG,
                    p: 5,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
              >
                <PlaceIcon sx={{ fontSize: 48, color: SOFT_PRIMARY, mb: 2 }} />
                <Typography color="text.secondary" fontSize={16} textAlign="center">
                  Chưa có địa chỉ nào. Nhấn Thêm địa chỉ để bắt đầu.
                </Typography>
              </AnimatedCard>
          ) : (
              <Box display="flex" flexDirection="column" gap={1.5} mt={1}>
                {addresses.map((address, idx) => (
                    <AnimatedCard
                        key={address.id}
                        elevation={address.trangThai === 1 ? 3 : 0}
                        className="fade-in"
                        sx={{
                          border:
                              address.trangThai === 1
                                  ? `1.5px solid #16a34a`
                                  : `1.5px solid #e2e8f0`,
                          background: address.trangThai === 1 ? "#f0fdf4" : "#fff"
                        }}
                    >
                      <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography
                              fontWeight={700}
                              fontSize={13.5}
                              color={address.trangThai === 1 ? "#16a34a" : "#333"}
                          >
                            Địa chỉ {idx + 1}
                          </Typography>
                          {address.trangThai === 1 && (
                              <GreenBadge
                                  icon={<StarIcon sx={{ fontSize: 14, color: "#16a34a", mr: 0.5 }} />}
                                  label="Mặc định"
                                  color="primary"
                                  size="small"
                                  sx={{ ml: 1 }}
                              />
                          )}
                        </Box>
                        <Box display="flex" alignItems="center" gap={1.5}>
                          {address.trangThai !== 1 && (
                              <Tooltip title="Đặt làm mặc định">
                        <span>
                          <SmallActionIconButton
                              edge="end"
                              color="primary"
                              aria-label="Đặt làm mặc định"
                              onClick={() => openSetDefaultConfirm(address)}
                              className="set-default"
                          >
                            <StarBorderIcon sx={{ fontSize: 17 }} />
                          </SmallActionIconButton>
                        </span>
                              </Tooltip>
                          )}
                          <Tooltip title="Chỉnh sửa">
                            <SmallActionIconButton
                                edge="end"
                                aria-label="Chỉnh sửa"
                                className="edit"
                                onClick={() => handleEdit(address)}
                            >
                              <EditOutlinedIcon sx={{ fontSize: 17 }} />
                            </SmallActionIconButton>
                          </Tooltip>
                          <Tooltip title="Xóa địa chỉ">
                            <SmallActionIconButton
                                edge="end"
                                color="error"
                                aria-label="Xóa"
                                className="delete"
                                onClick={() => openDeleteConfirm(address)}
                            >
                              <DeleteIcon sx={{ fontSize: 17 }} />
                            </SmallActionIconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                      <Typography fontWeight={600} fontSize={15.5} color="#333">
                        {address.tinhThanhPho}, {address.xaPhuong}
                      </Typography>
                    </AnimatedCard>
                ))}
              </Box>
          )}
          <AddressFormSection
              open={formSectionOpen}
              onClose={handleFormClose}
              onSubmit={formSectionEdit ? handleEditAddress : handleAddAddress}
              initialData={formSectionData}
              isEdit={formSectionEdit}
          />
        </DialogContent>
        {confirmDelete && confirmDelete.isDefault && addresses.length > 1 && (
            <Dialog open onClose={() => setConfirmDelete(null)} maxWidth="sm" fullWidth>
              <DialogTitle
                  sx={{
                    color: "#d32f2f",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 1
                  }}
              >
                <DeleteIcon sx={{ fontSize: 24 }} />
                Xác nhận xóa địa chỉ mặc định
              </DialogTitle>
              <DialogContent>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" sx={{ mb: 2, color: "#666" }}>
                    Bạn đang xóa địa chỉ mặc định. Vui lòng chọn một địa chỉ khác làm địa chỉ mặc định trước khi xóa.
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#d32f2f", mb: 1 }}>
                    Địa chỉ sẽ bị xóa:
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: "#fff3e0", border: "1px solid #ffb74d", borderRadius: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {addresses.find((a) => a.id === confirmDelete.addressId)?.tinhThanhPho},{" "}
                      {addresses.find((a) => a.id === confirmDelete.addressId)?.xaPhuong}
                    </Typography>
                  </Paper>
                </Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#1976d2", mb: 2 }}>
                  Chọn địa chỉ mới làm mặc định:
                </Typography>
                <Box sx={{ maxHeight: 250, overflowY: "auto" }}>
                  {addresses
                      .filter((a) => a.id !== confirmDelete.addressId)
                      .map((address, index) => (
                          <Paper
                              key={address.id}
                              sx={{
                                p: 1.5,
                                mb: 1,
                                cursor: "pointer",
                                border: selectDefaultId === address.id ? "2px solid #1976d2" : "1px solid #e0e0e0",
                                bgcolor: selectDefaultId === address.id ? "#e3f2fd" : "#fff",
                                transition: "all 0.2s",
                                "&:hover": {
                                  borderColor: "#1976d2",
                                  bgcolor: selectDefaultId === address.id ? "#e3f2fd" : "#f5f5f5"
                                }
                              }}
                              onClick={() => setSelectDefaultId(address.id)}
                          >
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: "#333" }}>
                                  Địa chỉ {index + 1}
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#666", mt: 0.5, fontSize: "0.875rem" }}>
                                  {address.tinhThanhPho}, {address.xaPhuong}
                                </Typography>
                              </Box>
                              {selectDefaultId === address.id && (
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, ml: 1 }}>
                                    <StarIcon sx={{ fontSize: 18, color: "#1976d2" }} />
                                    <Typography
                                        variant="caption"
                                        sx={{ color: "#1976d2", fontWeight: 600, fontSize: "0.75rem" }}
                                    >
                                      Mặc định
                                    </Typography>
                                  </Box>
                              )}
                            </Box>
                          </Paper>
                      ))}
                </Box>
                {!selectDefaultId && (
                    <Typography variant="caption" sx={{ color: "#d32f2f", mt: 1, display: "block" }}>
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
        {confirmDialog.open && (
            <Dialog open onClose={closeConfirmDialog} maxWidth="sm" fullWidth>
              <DialogTitle
                  sx={{
                    color: confirmDialog.confirmColor === "error" ? "#d32f2f" : "#1976d2",
                    fontWeight: 600
                  }}
              >
                {confirmDialog.title}
              </DialogTitle>
              <DialogContent>
                <Typography sx={{ whiteSpace: "pre-line", lineHeight: 1.6 }}>
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
  onClose: PropTypes.func.isRequired
};

export default AddressDialog;