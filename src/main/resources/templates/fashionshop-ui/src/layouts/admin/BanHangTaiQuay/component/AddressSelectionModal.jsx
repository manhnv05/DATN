// src/layouts/BanHangTaiQuay/component/AddressSelectionModal.jsx

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SoftTypography from "../../../../components/SoftTypography";
import SoftButton from "../../../../components/SoftButton";
import AddIcon from "@mui/icons-material/Add";
import PropTypes from 'prop-types';

// Component này nhận vào 4 props:
// - open: Trạng thái đóng/mở của modal
// - onClose: Hàm để đóng modal
// - addresses: Mảng danh sách địa chỉ để hiển thị
// - onSelectAddress: Hàm callback khi người dùng nhấn nút "Chọn"
function AddressSelectionModal({ open, onClose, addresses = [], onSelectAddress ,onOpenAddAddressModal }) {
  
  // Hàm xử lý khi nhấn nút chọn một địa chỉ
  const handleSelect = (address) => {
    onSelectAddress(address); // Gọi hàm callback truyền lên component cha
    onClose(); // Đóng modal
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <SoftTypography variant="h5">Chọn địa chỉ giao hàng</SoftTypography>
         
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ display: "table-header-group" }}>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Tỉnh/Thành phố</TableCell>
           <TableCell>Quận/Huyện</TableCell>
                <TableCell>Xã/Phường</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {addresses.length > 0 ? (
                addresses.map((addr, index) => (
                  <TableRow key={addr.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{addr.tinhThanhPho}</TableCell>
                    <TableCell>{addr.quanHuyen}</TableCell>
                    <TableCell>{addr.xaPhuong}</TableCell>
                    <TableCell align="center">
                      <SoftButton 
                        variant="contained" 
                        color="info" 
                        size="small"
                        onClick={() => handleSelect(addr)}
                      >
                        Chọn
                      </SoftButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <SoftTypography variant="body2">
                      Khách hàng này chưa có địa chỉ nào.
                    </SoftTypography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
          <SoftButton

              variant="contained"
              color="info"
              size="small"
              startIcon={<AddIcon />}
              onClick={onOpenAddAddressModal} // Gọi hàm từ component cha
              sx={{ mt: 2 }}
            >
              Thêm địa chỉ mới
            </SoftButton>
      </DialogContent>
    </Dialog>
  );
}
AddressSelectionModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  addresses: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSelectAddress: PropTypes.func.isRequired,
  onOpenAddAddressModal: PropTypes.func.isRequired,
};
export default AddressSelectionModal;