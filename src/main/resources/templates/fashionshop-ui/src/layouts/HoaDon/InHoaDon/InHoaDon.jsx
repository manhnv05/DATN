// src/layouts/HoaDon/OrderDetail/InHoaDon.jsx

import React from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Divider
} from '@mui/material';
import PropTypes from 'prop-types';

const InHoaDon = React.forwardRef(({ orderData }, ref) => {
    // Log để debug khi nào InHoaDon được render và nhận dữ liệu
    console.log('InHoaDon component rendering. Received orderData:', orderData);

    // === Đảm bảo dữ liệu tồn tại trước khi render chi tiết ===
    // Nếu orderData là null/undefined hoặc không có products, trả về thông báo
    if (!orderData || !orderData.products || orderData.products.length === 0) {
        console.log("InHoaDon: Không có dữ liệu hóa đơn hoặc danh sách sản phẩm rỗng.");
        return (
            <Box ref={ref} sx={{ p: 4 }}> {/* Vẫn gắn ref để đảm bảo có phần tử DOM */}
                <Typography variant="h6" align="center" sx={{ p: 4 }}>Không có dữ liệu hóa đơn để in.</Typography>
            </Box>
        );
    }

    // Cập nhật tên biến để khớp với dữ liệu đã transform
    const qrCodeData = `Invoice ID: ${orderData.maHoaDon}, Total: ${orderData.totalAmount}`;

    return (
        <Box ref={ref} sx={{ p: 4, fontFamily: 'Arial, sans-serif' }}> {/* Gắn ref vào Box ngoài cùng */}
            {/* HEADER */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                {/* Thông tin shop - giả định bạn có biến cho nó, ví dụ: shopInfo */}
                <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Tên Cửa Hàng Của Bạn</Typography>
                    <Typography variant="body2">Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM</Typography>
                    <Typography variant="body2">Điện thoại: 0123.456.789</Typography>
                    <Typography variant="body2">Email: info@cuahang.com</Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1, color: '#d32f2f' }}>HÓA ĐƠN BÁN HÀNG</Typography>
                    <Typography variant="body2">Mã hóa đơn: <strong>{orderData.maHoaDon || 'N/A'}</strong></Typography>
                    <Typography variant="body2">Ngày tạo: <strong>{new Date(orderData.ngayTao).toLocaleDateString('vi-VN')}</strong></Typography>
                </Box>
            </Box>

            <Divider sx={{ my: 2, borderColor: '#ccc' }} />

            {/* THÔNG TIN KHÁCH HÀNG */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>Thông tin khách hàng:</Typography>
                {/* Cập nhật tên prop để khớp với transformedData */}
                <Typography variant="body2">Tên khách hàng: <strong>{orderData.customerName || 'N/A'}</strong></Typography>
                <Typography variant="body2">Số điện thoại: <strong>{orderData.phoneNumber || 'N/A'}</strong></Typography>
                <Typography variant="body2">Địa chỉ nhận hàng: <strong>{orderData.diaChi || 'N/A'}</strong></Typography>
                {orderData.ghiChu && <Typography variant="body2">Ghi chú: <em>{orderData.ghiChu}</em></Typography>}
            </Box>

            {/* DANH SÁCH SẢN PHẨM */}
            <TableContainer component={Paper} sx={{ mb: 3, border: '1px solid #eee' }}>
                <Table size="small" sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                            <TableCell sx={{ fontWeight: 'bold' }}>Tên sản phẩm</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Mã SP</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Số lượng</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Đơn giá (VNĐ)</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Thành tiền (VNĐ)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* Sử dụng orderData.products thay vì orderData.danhSachChiTiet */}
                        {orderData.products.map((item) => (
                            <TableRow key={item.id}>
                                {/* Cập nhật tên prop để khớp với transformedData */}
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.maSanPhamChiTiet}</TableCell>
                                <TableCell align="right">{item.quantity}</TableCell>
                                <TableCell align="right">{(item.price || 0).toLocaleString("vi-VN")}</TableCell>
                                <TableCell align="right">{(item.price * item.quantity || 0).toLocaleString("vi-VN")}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* TỔNG KẾT */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Box sx={{ textAlign: 'right', width: '280px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body1">Tổng tiền hàng:</Typography>
                        {/* Sử dụng totalItemsPrice thay vì tongTien */}
                        <Typography variant="body1">{(orderData.totalItemsPrice || 0).toLocaleString("vi-VN")} VND</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body1">Phí vận chuyển:</Typography>
                        <Typography variant="body1">{(orderData.shippingFee || 0).toLocaleString("vi-VN")} VND</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body1">Giảm giá:</Typography>
                        <Typography variant="body1">{(orderData.totalDiscount || 0).toLocaleString("vi-VN")} VND</Typography>
                    </Box>
                    <Divider sx={{ my: 1, borderColor: '#ccc' }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Tổng cộng:</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                            {(orderData.totalAmount || 0).toLocaleString("vi-VN")} VND
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* CHỮ KÝ VÀ QR CODE */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 5 }}>
                <Box sx={{ textAlign: 'center', width: '45%' }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 4 }}>Chữ ký khách hàng</Typography>
                    <Typography variant="body2">(Ký, ghi rõ họ tên)</Typography>
                </Box>
                <Box sx={{ textAlign: 'center', width: '45%' }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 4 }}>Chữ ký nhân viên</Typography>
                    <Typography variant="body2">({orderData.StaffName || 'N/A'})</Typography>
                </Box>
            </Box>

            {/* FOOTER */}
            <Box sx={{ mt: 5, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>Cảm ơn quý khách đã tin tưởng và sử dụng dịch vụ của chúng tôi!</Typography>
            </Box>
        </Box>
    );
});

// === Cập nhật PropTypes để khớp với transformedData ===
InHoaDon.displayName = 'InHoaDon';
InHoaDon.propTypes = {
    orderData: PropTypes.shape({
        id: PropTypes.string, // Thêm id nếu cần
        maHoaDon: PropTypes.string.isRequired,
        customerName: PropTypes.string, // Cập nhật từ tenKhachHang
        phoneNumber: PropTypes.string, // Cập nhật từ sdt
        type: PropTypes.string,
        receiverName: PropTypes.string,
        status: PropTypes.string,
        ngayTao: PropTypes.string.isRequired,
        diaChi: PropTypes.string,
        StaffName: PropTypes.string, // Cập nhật từ tenNhanVien
        ghiChu: PropTypes.string, // Thêm ghiChu nếu nó có trong orderData
        products: PropTypes.arrayOf( // Cập nhật từ danhSachChiTiet thành products
            PropTypes.shape({
                id: PropTypes.number.isRequired,
                name: PropTypes.string.isRequired, // Cập nhật từ tenSanPham
                maSanPhamChiTiet: PropTypes.string.isRequired,
                quantity: PropTypes.number.isRequired,
                price: PropTypes.number.isRequired, // Cập nhật từ gia
                // thanhTien không còn trong transformedData.products
            })
        ).isRequired,
        // Cập nhật tên prop để khớp với transformedData
        totalItemsPrice: PropTypes.number.isRequired, // Thay cho tongTienBanDau
        totalDiscount: PropTypes.number, // Thay cho tongGiaGiam
        shippingFee: PropTypes.number, // Thay cho phiVanChuyen
        totalAmount: PropTypes.number.isRequired, // Thay cho tongHoaDon
        payments: PropTypes.array, // Thêm nếu cần, không dùng trong InHoaDon này
        trangThaiGoc: PropTypes.string,
    }).isRequired,
};

export default InHoaDon;