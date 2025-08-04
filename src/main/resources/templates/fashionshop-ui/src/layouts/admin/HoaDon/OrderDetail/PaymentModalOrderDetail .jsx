import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Alert,
  IconButton,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from "react-toastify";

// --- Các hàm tiện ích ---
const formatCurrency = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) return '0 VND';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

const parseCurrency = (formattedAmount) => {
  if (typeof formattedAmount !== 'string') return 0;
  return Number(formattedAmount.replace(/[^\d]/g, ''));
};

const PaymentModalOrderDetail = ({ isOpen, onClose, onSubmit, orderId, totalAmount }) => {
  const [tienKhachDua, setTienKhachDua] = useState('');
  const [tienThua, setTienThua] = useState(0);
  const [phuongThuc, setPhuongThuc] = useState('Chuyển khoản');
  const [maGiaoDich, setMaGiaoDich] = useState('');
  const [ghiChu, setGhiChu] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
const [validationErrors, setValidationErrors] = useState({});
  useEffect(() => {
    const amountGiven = parseCurrency(tienKhachDua);
    setTienThua(amountGiven > totalAmount ? amountGiven - totalAmount : 0);
  }, [tienKhachDua, totalAmount]);

  useEffect(() => {
    if (isOpen) {
      setTienKhachDua('');
      setTienThua(0);
      setPhuongThuc('Chuyển khoản');
      setMaGiaoDich('');
      setGhiChu('');
      setError('');
      setIsSubmitting(false);
    }
  }, [isOpen]);
  
  const handleTienKhachDuaChange = (e) => {
    const rawValue = e.target.value.replace(/[^\d]/g, '');
    const numberValue = Number(rawValue);
    setTienKhachDua(isNaN(numberValue) ? '' : new Intl.NumberFormat('vi-VN').format(numberValue));
  };

const validateForm = () => {
    const newErrors = {};

    if (!tienKhachDua.trim()) {
      newErrors.tienKhachDua = 'Vui lòng nhập số tiền khách đưa.';
    } else if (parseCurrency(tienKhachDua) < totalAmount) {
      newErrors.tienKhachDua = 'Số tiền không đủ để thanh toán.';
    }

    if (phuongThuc === 'Chuyển khoản' && !maGiaoDich.trim()) {
      newErrors.maGiaoDich = 'Vui lòng nhập mã giao dịch.';
    }

    setValidationErrors(newErrors);
    // Trả về true nếu không có lỗi, false nếu có lỗi
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
     if (!validateForm()) {
      return; // Dừng lại nếu form không hợp lệ
    }
   
  toast.success("Xác nhận thanh toán thành công!");
    setIsSubmitting(true);
    setError('');
 const hinhThucThanhToanId = phuongThuc === 'Tiền mặt' ? 1 : 2;
    const paymentData = {
      idHoaDon: orderId, 
    
      // 2. Gửi ID của hình thức thanh toán thay vì tên
      idHinhThucThanhToan: hinhThucThanhToanId,
      soTienThanhToan: totalAmount,
      tienKhachDua: parseCurrency(tienKhachDua),
      maGiaoDich: maGiaoDich || null,
      ghiChu: ghiChu || null,
    };

    try {
      
      const response = await fetch(`http://localhost:8080/chiTietThanhToan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Thanh toán thất bại.');
      }
      
      const result = await response.json();
      onSubmit(result);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        Xác nhận thanh toán
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent dividers>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <TextField label="Tổng tiền" value={formatCurrency(totalAmount)} fullWidth margin="normal" InputProps={{ readOnly: true }} />
          <TextField label="Tiền khách đưa" value={tienKhachDua} onChange={handleTienKhachDuaChange} fullWidth margin="normal" placeholder="0" autoFocus 
           error={!!validationErrors.tienKhachDua}
           helperText={validationErrors.tienKhachDua} />
          <TextField label="Tiền thừa" value={formatCurrency(tienThua)} fullWidth margin="normal" InputProps={{ readOnly: true }} />
          
          <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend">Phương thức thanh toán</FormLabel>
            <RadioGroup row value={phuongThuc} onChange={(e) => setPhuongThuc(e.target.value)}>
              <FormControlLabel value="Chuyển khoản" control={<Radio />} label="Chuyển khoản" />
              <FormControlLabel value="Tiền mặt" control={<Radio />} label="Tiền mặt" />
            </RadioGroup>
          </FormControl>

          {phuongThuc === 'Chuyển khoản' && (
            <TextField label="Mã giao dịch" value={maGiaoDich} onChange={(e) => setMaGiaoDich(e.target.value)} fullWidth margin="normal"  error={!!validationErrors.maGiaoDich}
              helperText={validationErrors.maGiaoDich}/>
          )}

          <TextField label="Ghi chú" value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} fullWidth margin="normal" multiline rows={3} />
        </DialogContent>
        <DialogActions sx={{ p: '16px 24px' }}>
          <Button onClick={onClose}variant="outlined" size="small"
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
                    }}>Đóng</Button>
          <Button type="submit" variant="outlined"
                    size="small"
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
                    }} disabled={isSubmitting}>
            {isSubmitting ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

PaymentModalOrderDetail.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  orderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  totalAmount: PropTypes.number.isRequired,
};

export default PaymentModalOrderDetail;