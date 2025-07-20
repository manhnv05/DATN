package com.example.datn.Service.impl;

import com.example.datn.DTO.*;
import com.example.datn.VO.*;
import com.example.datn.mapper.HoaDonChiTietMapper;
import com.example.datn.mapper.HoaDonUpdateMapper;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.BaseFont;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
//import com.example.datn.dto.response.*;
import com.example.datn.Entity.*;
import com.example.datn.enums.TrangThai;
import com.example.datn.exception.AppException;
import com.example.datn.exception.ErrorCode;
import com.example.datn.mapper.HoaDonMapper;
import com.example.datn.Repository.*;
import com.example.datn.Service.HoaDonService;
import com.example.datn.Service.LichSuHoaDonService;
import com.example.datn.specification.HoaDonSpecification;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;
import java.math.RoundingMode;

import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.stream.Stream;
import com.example.datn.DTO.HoaDonPdfResult;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class HoaDonServiceImpl implements HoaDonService {
    HoaDonRepository hoaDonRepository;
    HoaDonChiTietRepository hoaDonChiTietRepository;
    ChiTietSanPhamRepository chiTietSanPhamRepository;
    KhachHangRepository khachHangRepository;
    NhanVienRepository nhanVienRepository;
    HoaDonMapper hoaDonMapper;
    LichSuHoaDonService lichSuHoaDonService;
    HoaDonChiTietMapper hoaDonChiTietMapper;
    private final PhieuGiamGiaRepository phieuGiamGiaRepository;
    ChiTietThanhToanRepository chiTietThanhToanRepository;
    HinhThucThanhToanRepository hinhThucThanhToanRepository;

//    @Override
//    @Transactional
//    public HoaDonDTO taoHoaDon(HoaDonCreateVO request) {
//
//        for (HoaDonChiTietVO hoaDonChiTietRequest : request.getHoaDonChiTiet()) {
//            Integer idSanPhamChiTiet = hoaDonChiTietRequest.getId();
//            Integer soLuongYeuCau = hoaDonChiTietRequest.getSoLuong();
//            ChiTietSanPham chiTietSanPham = chiTietSanPhamRepository.findById(idSanPhamChiTiet)
//                    .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
//            if (chiTietSanPham.getSoLuong() < soLuongYeuCau) {
//                throw new AppException(ErrorCode.INSUFFICIENT_QUANTITY);
//            }
//        } // Hết vòng lặp kiểm tra ban đầu
//        NhanVien nhanVienDuocGanVaoHoaDon = null;
//        HoaDon hoaDon = new HoaDon();
//
//        if (request.getIdNhanVien() != null) {
//            nhanVienDuocGanVaoHoaDon = nhanVienRepository.findById(request.getIdNhanVien())
//                    .orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));
//            hoaDon.setNhanVien(nhanVienDuocGanVaoHoaDon);
//        }
//
//        String nguoiThucHienKhoiTao;
//        if (nhanVienDuocGanVaoHoaDon != null) {
//            nguoiThucHienKhoiTao = nhanVienDuocGanVaoHoaDon.getHoVaTen();
//        } else if (request.getIdKhachHang() != null) {
//            KhachHang khachHang = khachHangRepository.findById(request.getIdKhachHang())
//                    .orElseThrow(() -> new AppException(ErrorCode.CUSTOMER_NOT_FOUND));
//            hoaDon.setKhachHang(khachHang);
//            nguoiThucHienKhoiTao = khachHang.getTenKhachHang();
//        } else {
//            nguoiThucHienKhoiTao = "Hệ thống/Khách lẻ";
//        }
//
//        if (request.getIdKhachHang() != null) {
//            KhachHang khachHang = khachHangRepository.findById(request.getIdKhachHang())
//                    .orElseThrow(() -> new AppException(ErrorCode.CUSTOMER_NOT_FOUND));
//            hoaDon.setKhachHang(khachHang);
//            // Kiểm tra loại hóa đơn
//            if ("Tại quầy".equals(request.getLoaiHoaDon())) {
//                hoaDon.setLoaiHoaDon("Tại quầy");
//                // Kiểm tra nếu chọn giao hàng khi thanh toán tại quầy
//                if (request.getDiaChi() != null && !request.getDiaChi().isEmpty()) {
//                    // Chọn giao hàng: Chuyển trạng thái thành "Chờ xác nhận"
//                    hoaDon.setTrangThai(TrangThai.TAO_DON_HANG);
//                    hoaDon.setPhiVanChuyen(30000);
//                    hoaDon.setSdt(request.getSdt());
//                    hoaDon.setDiaChi(request.getDiaChi());
//                    hoaDon.setNgayTao(LocalDateTime.now());
//                    hoaDon.setTenKhachHang(khachHang.getTenKhachHang());
//                    hoaDon.setNgayGiaoDuKien(LocalDateTime.now().plusDays(3));
//                } else {
//                    // Thanh toán ngay tại quầy
//                    hoaDon.setNgayTao(LocalDateTime.now());
//                    hoaDon.setTrangThai(TrangThai.HOAN_THANH);
//                    hoaDon.setTenKhachHang(khachHang.getTenKhachHang());
//                    hoaDon.setPhiVanChuyen(30000);
//                    hoaDon.setSdt(khachHang.getSdt());
//                    hoaDon.setDiaChi(null);
//                }
//            } else { // Bán online
//                hoaDon.setLoaiHoaDon("online");
//                hoaDon.setPhiVanChuyen(30000);
//                hoaDon.setTrangThai(TrangThai.TAO_DON_HANG);
//                hoaDon.setTenKhachHang(khachHang.getTenKhachHang());
//                hoaDon.setSdt(request.getSdt());
//                hoaDon.setDiaChi(request.getDiaChi());
//                hoaDon.setNgayTao(LocalDateTime.now());
//                hoaDon.setNgayGiaoDuKien(LocalDateTime.now().plusDays(3));
//            }
//        } else {
//            // Không có idKhachHang: Khách lẻ, mặc định bán tại quầy
//            hoaDon.setLoaiHoaDon("Tại quầy");
//            hoaDon.setNgayTao(LocalDateTime.now());
//            hoaDon.setPhiVanChuyen(0);
//            hoaDon.setTrangThai(TrangThai.HOAN_THANH);
//            hoaDon.setTenKhachHang("Khách lẻ"); // Không lưu thông tin khách
//            hoaDon.setSdt(null);
//            hoaDon.setDiaChi(null);
//        }
//        // Khởi tạo các trường tổng tiền bằng 0.0 trước khi lưu lần đầu
//        hoaDon.setTongTienBanDau(0);
//        hoaDon.setTongTien(0);
//        hoaDon.setTongHoaDon(0);
//        hoaDonRepository.save(hoaDon);
//
//        String formattedId = String.format("%05d", hoaDon.getId());
//        String maHoaDon = "HD-" + formattedId;
//        lichSuHoaDonService.ghiNhanLichSuHoaDon(
//                hoaDon,
//                "Hóa đơn được tạo với trạng thái: " + hoaDon.getTrangThai().getDisplayName(),
//                nguoiThucHienKhoiTao, // Người thực hiện được xác định ở trên
//                "Tạo hóa đơn ban đầu",
//                hoaDon.getTrangThai()
//        );
//        Integer calculatedTongTienBanDau = 0;
//
//        for (HoaDonChiTietVO hoaDonChiTiet : request.getHoaDonChiTiet()) {
//            Integer idSanPhamChiTiet = hoaDonChiTiet.getId();
//            Integer soLuongYeuCau = hoaDonChiTiet.getSoLuong();
//
//            ChiTietSanPham chiTietSanPham = chiTietSanPhamRepository.findById(idSanPhamChiTiet)
//                    .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
//
//            HoaDonChiTiet newHoaDonChiTiet = new HoaDonChiTiet();
//            newHoaDonChiTiet.setHoaDon(hoaDon);
//            newHoaDonChiTiet.setSanPhamChiTiet(chiTietSanPham);
//            newHoaDonChiTiet.setGia(chiTietSanPham.getGia());
//            newHoaDonChiTiet.setSoLuong(soLuongYeuCau);
//            Integer thanhTien =  soLuongYeuCau * chiTietSanPham.getGia();
//            newHoaDonChiTiet.setThanhTien(thanhTien);
//            hoaDonChiTietRepository.save(newHoaDonChiTiet);
//            calculatedTongTienBanDau += thanhTien;
//
//            // Cập nhật lại số lượng tồn kho của sản phẩm
//            chiTietSanPham.setSoLuong(chiTietSanPham.getSoLuong() - soLuongYeuCau);
//            chiTietSanPhamRepository.save(chiTietSanPham);
//        }
//        hoaDon.setTongTienBanDau(calculatedTongTienBanDau); // Tổng tiền của tất cả sản phẩm
//        hoaDon.setTongTien(calculatedTongTienBanDau); // Tổng sau giảm giá (chưa có logic giảm giá nên bằng ban đầu)
//
//        // Tổng hóa đơn cuối cùng = Tổng tiền sau giảm giá + Phí vận chuyển
//        hoaDon.setTongHoaDon(hoaDon.getTongTien() + hoaDon.getPhiVanChuyen());
//        hoaDon.setGhiChu(request.getGhiChu());
//        hoaDon.setMaHoaDon(maHoaDon);
//        hoaDonRepository.save(hoaDon); // Lưu lại HoaDon với các tổng tiền đã cập nhật
//
//        HoaDonDTO hoaDonResponse = hoaDonMapper.toHoaDonResponse(hoaDon);
//
//        hoaDonResponse.setDanhSachChiTiet(
//                hoaDonChiTietRepository.findAllByHoaDon_Id(hoaDon.getId()).stream()
//                        .map(hoaDonChiTiet -> {
//                            HoaDonChiTietDTO chiTietResponse = new HoaDonChiTietDTO();
//                            chiTietResponse.setId(hoaDonChiTiet.getId());
//                            if (hoaDonChiTiet.getSanPhamChiTiet() != null) {
//                                chiTietResponse.setMaSanPhamChiTiet(hoaDonChiTiet.getSanPhamChiTiet().getMaSanPhamChiTiet());
//                            }
//                            chiTietResponse.setSoLuong(hoaDonChiTiet.getSoLuong());
//                            chiTietResponse.setGia(hoaDonChiTiet.getGia());
//                            chiTietResponse.setThanhTien(hoaDonChiTiet.getThanhTien());
//                            chiTietResponse.setGhiChu(hoaDonChiTiet.getGhiChu());
//                            chiTietResponse.setTrangThai(hoaDonChiTiet.getTrangThai());
//                            return chiTietResponse;
//                        }).collect(Collectors.toList()));
//
//        return hoaDonResponse;
//
//    }

    @Override
    @Transactional
    public List<HoaDonChiTietDTO> updateDanhSachSanPhamChiTiet(Integer idHoaDon, List<CapNhatSanPhamChiTietDonHangVO> danhSachCapNhatSanPham) {
        //Lấy hóa dơn cần cập nhật
        HoaDon hoaDon = hoaDonRepository.findById(idHoaDon)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
//        if (hoaDon.getTrangThai() != TrangThai.TAO_DON_HANG&& hoaDon.getTrangThai() != TrangThai.CHO_XAC_NHAN) {
//            throw new AppException(ErrorCode.INVALID_STATUS);
//        }
        Map<Integer,HoaDonChiTiet> chiTietHoaDonMap = hoaDonChiTietRepository.findByHoaDon(hoaDon)
                .stream().collect(Collectors.toMap(HoaDonChiTiet::getId, chiTiet -> chiTiet));
        List<HoaDonChiTiet> updatedChiTietList = new ArrayList<>();
        Set<Integer> cacSanPhamDaXuLy= new HashSet<>();
        for (CapNhatSanPhamChiTietDonHangVO  capNhatSanPhamChiTietDonHangVO:danhSachCapNhatSanPham){
            Integer idSanPhamChiTiet = capNhatSanPhamChiTietDonHangVO.getId();
            Integer soLuongYeuCau = capNhatSanPhamChiTietDonHangVO.getSoLuong();
            if(idSanPhamChiTiet==null|| soLuongYeuCau==null || soLuongYeuCau<=0){
                throw new AppException(ErrorCode.INSUFFICIENT_QUANTITY);
            }
            if(soLuongYeuCau==0){
                continue;
            }
            cacSanPhamDaXuLy.add(idSanPhamChiTiet);
            ChiTietSanPham chiTietSanPham = chiTietSanPhamRepository.findById(idSanPhamChiTiet)
                    .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
            int soLuongTonKhoVatLy=chiTietSanPham.getSoLuong();
            int soLuongDangCoTrongHoaDon = hoaDonChiTietRepository.getSoLuongDangCho(idSanPhamChiTiet);
            int soLuongCoTheBan = soLuongTonKhoVatLy - soLuongDangCoTrongHoaDon;
            int soLuongDaCoTrongGioHang= chiTietHoaDonMap.get(idSanPhamChiTiet) != null ? chiTietHoaDonMap.get(idSanPhamChiTiet).getSoLuong() : 0;
            int soLuongChenhLech= soLuongYeuCau - soLuongDaCoTrongGioHang;
            if (soLuongChenhLech>soLuongCoTheBan){
                throw new AppException(ErrorCode.INSUFFICIENT_QUANTITY);
            }
            //Cái này kiểm tra xem sản phẩm có trong chi tiết hóa đơn chưa có rồi thì cập nhật, nếu chưa có thì tạo mới
            HoaDonChiTiet hoaDonChiTiet = chiTietHoaDonMap.getOrDefault(idSanPhamChiTiet, new HoaDonChiTiet());
            hoaDonChiTiet.setHoaDon(hoaDon);
            hoaDonChiTiet.setSoLuong(soLuongYeuCau);
            hoaDonChiTiet.setGia(chiTietSanPham.getGia());
            hoaDonChiTiet.setSanPhamChiTiet(chiTietSanPham);
            hoaDonChiTiet.setThanhTien(hoaDonChiTiet.getGia()* soLuongYeuCau);
            updatedChiTietList.add(hoaDonChiTiet);
            List<HoaDonChiTiet> danhSachCanXoa = chiTietHoaDonMap.values().stream()
                    .filter(ct -> !cacSanPhamDaXuLy.contains(ct.getSanPhamChiTiet().getId()))
                    .collect(Collectors.toList());
            if (!danhSachCanXoa.isEmpty()) {
                hoaDonChiTietRepository.deleteAllInBatch(danhSachCanXoa);
            }
            if (!updatedChiTietList.isEmpty()) {
                hoaDonChiTietRepository.saveAll(updatedChiTietList);
            }

        }
        List<HoaDonChiTiet> chiTietCuoiCung = hoaDonChiTietRepository.findAllByHoaDon_Id(idHoaDon);

        return hoaDonChiTietMapper.toDtoList(chiTietCuoiCung);
    }
    private void recalculateHoaDonTotals(HoaDon hoaDon, List<HoaDonChiTiet> chiTietList) {
        int tongTien = chiTietList.stream()
                .mapToInt(HoaDonChiTiet::getThanhTien)
                .sum();
        hoaDon.setTongTien(tongTien);
    }
    public static String generateShortRandomMaHoaDonUUID() {
        // Lấy một phần của UUID, ví dụ 8 ký tự đầu
        return "HD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        // Ví dụ: HD-A1B2C3D4
    }
    @Override
    public HoaDonChoDTO taoHoaDonCho(HoaDonChoRequestVO request) {
        NhanVien nhanVienDuocGanVaoHoaDon = null;
        HoaDon hoaDon = new HoaDon();
        hoaDon.setNhanVien(nhanVienDuocGanVaoHoaDon);
        hoaDon.setNgayTao(LocalDateTime.now());
       hoaDon.setTrangThai(TrangThai.valueOf("TAO_DON_HANG"));
        hoaDon.setTongTien(0);
        hoaDon.setTongTienBanDau(0);
        hoaDon.setPhiVanChuyen(0);
        hoaDon.setTongHoaDon(0); // Nếu bạn sử dụng trường này
        hoaDon.setGhiChu(null);
        hoaDon.setSdt(null);
        hoaDon.setDiaChi(null);
        hoaDon.setNgayGiaoDuKien(null);
        hoaDon.setPhieuGiamGia(null);
        hoaDon.setLoaiHoaDon(request.getLoaiHoaDon());
        hoaDon.setMaHoaDon(generateShortRandomMaHoaDonUUID());
     HoaDon saveHoaDon=   hoaDonRepository.save(hoaDon);
        lichSuHoaDonService.ghiNhanLichSuHoaDon(
                hoaDon,
                "Hóa đơn được tạo với trạng thái: " + hoaDon.getTrangThai().getDisplayName(),
                "admin", // Người thực hiện được xác định ở trên
                "Tạo hóa đơn ban đầu",
                hoaDon.getTrangThai()
        );
        return new HoaDonChoDTO(saveHoaDon.getId(),saveHoaDon.getMaHoaDon());
    }

    @Override
    public HoaDonPdfResult hoadonToPDF(String idHoaDon) {
        HoaDon hoaDon = hoaDonRepository.findById(Integer.valueOf(idHoaDon))
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        Document document = new Document();
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, byteArrayOutputStream);
            document.open();


            InputStream fontStream = getClass().getClassLoader().getResourceAsStream("fonts/ARIAL.TTF");
            BaseFont baseFont = BaseFont.createFont(
                    "ARIAL.TTF",
                    BaseFont.IDENTITY_H,
                    BaseFont.EMBEDDED,
                    true,
                    fontStream.readAllBytes(),
                    null
            );
            Font font = new Font(baseFont, 12);
            Font fontTitle = new Font(baseFont, 16, Font.BOLD);
            Paragraph title2 = new Paragraph("Fashion Shop", fontTitle);
            Paragraph titleDSSP = new Paragraph("Danh Sách sản phẩm", fontTitle);
            Paragraph sdt = new Paragraph("Số điện thoại: 0192345544", font);
            Paragraph email = new Paragraph("Email: shop@gmail.com", font);
            Paragraph diaChi = new Paragraph("Địa chỉ: FPT , Phúc diên, Bắc Từ liêm, Hà Nội", font);
            title2.setAlignment(Element.ALIGN_CENTER);
            sdt.setAlignment(Paragraph.ALIGN_CENTER);
            email.setAlignment(Element.ALIGN_CENTER);
            diaChi.setAlignment(Element.ALIGN_CENTER);
            titleDSSP.setAlignment(Element.ALIGN_CENTER);
            document.add(title2);
            document.add(sdt);
            document.add(email);
            document.add(diaChi);
            // Tiêu đề
            Paragraph title = new Paragraph("HÓA ĐƠN BÁN HÀNG", fontTitle);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph(" ", font));

            // Thông tin hóa đơn
            document.add(new Paragraph("Mã HĐ: " + hoaDon.getMaHoaDon(), font));
            document.add(new Paragraph("Ngày tạo: " + hoaDon.getNgayTao(), font));
            if(hoaDon.getKhachHang() != null) {
                document.add(new Paragraph("Khách hàng: " + hoaDon.getKhachHang().getTenKhachHang(), font));
            }
            else {
                document.add(new Paragraph("Khách hàng: " , font));
            }
            document.add(new Paragraph("Tổng tiền: " + hoaDon.getTongTien() + " VND", font));
            document.add(new Paragraph(" ", font));

            // Bảng chi tiết
            PdfPTable table = new PdfPTable(3);
            table.setWidthPercentage(100);
            table.setWidths(new int[]{4, 2, 2});
            document.add(titleDSSP);
            document.add(new Paragraph(" ", font));
            // Header bảng
            Stream.of("Sản phẩm", "Số lượng", "Thành tiền")
                    .forEach(headerTitle -> {
                        PdfPCell header = new PdfPCell();
                        header.setPhrase(new Phrase(headerTitle, font));
                        header.setHorizontalAlignment(Element.ALIGN_CENTER);
                        header.setBackgroundColor(BaseColor.LIGHT_GRAY);
                        table.addCell(header);
                    });

            // Dòng dữ liệu
            for (HoaDonChiTiet cthd : hoaDon.getHoaDonChiTietList()) {
                table.addCell(new Phrase(cthd.getSanPhamChiTiet().getSanPham().getTenSanPham(), font));
                table.addCell(new Phrase(String.valueOf(cthd.getSoLuong()), font));
                table.addCell(new Phrase(String.valueOf(cthd.getThanhTien()), font));
            }

            PdfPTable table2 = new PdfPTable(2); // 2 cột
            table2.setWidthPercentage(100);

            // Tạo cột trái
            Font fontLeft = new Font(baseFont, 12);
            PdfPCell leftCell = new PdfPCell(new Phrase("Tổng tiền hàng:", fontLeft));
            leftCell.setBorder(Rectangle.NO_BORDER);
            table2.addCell(leftCell);

            Font fontRight = new Font(baseFont, 12, Font.BOLD);
            PdfPCell rightCell = new PdfPCell(new Phrase(hoaDon.getTongTien() + " VNĐ", fontRight));
            rightCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            rightCell.setBorder(Rectangle.NO_BORDER);
            table2.addCell(rightCell);

            table2.addCell(createLeftCell("Giảm giá:", fontLeft));
            if(hoaDon.getPhieuGiamGia() != null) {
                if(hoaDon.getPhieuGiamGia().getSoTienGiam().compareTo(BigDecimal.ZERO) != 0) {
                    table2.addCell(createRightCell(hoaDon.getPhieuGiamGia().getSoTienGiam() + " VND", fontRight));
                }
                else {
                    table2.addCell(createRightCell(hoaDon.getPhieuGiamGia().getPhamTramGiamGia() + " %", fontRight));
                }
            }
            else {
                table2.addCell(createRightCell("0 VNĐ", fontRight));
            }
            table2.addCell(createLeftCell("Phí giao hàng:", fontLeft));
            table2.addCell(createRightCell("15000 VND", fontRight));
            table2.addCell(createLeftCell("Tổng tiền cần thanh toán:", fontLeft));
            table2.addCell(createRightCell(hoaDon.getTongTien() + " VND", fontRight));

            document.add(table);
            document.add(new Paragraph(" ", font));
            document.add(table2);
            document.close();

        } catch (DocumentException | IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi tạo PDF hóa đơn: " + e.getMessage());
        }

        return new HoaDonPdfResult(hoaDon.getMaHoaDon(), new ByteArrayInputStream(byteArrayOutputStream.toByteArray()));
    }
    private PdfPCell createLeftCell(String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setHorizontalAlignment(Element.ALIGN_LEFT);
        cell.setBorder(Rectangle.NO_BORDER);
        return cell;
    }

    private PdfPCell createRightCell(String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        cell.setBorder(Rectangle.NO_BORDER);
        return cell;
    }

    @Override
    public void capNhatSoLuongSanPhamTrongKho(HoaDon hoaDon, boolean isDeducting) {
        // Lấy tất cả chi tiết hóa đơn của hóa đơn này
        List<HoaDonChiTiet> chiTietList = hoaDonChiTietRepository.findAllByHoaDon_Id(hoaDon.getId());

        for (HoaDonChiTiet chiTiet : chiTietList) {
            ChiTietSanPham sanPhamCanUpdate = chiTiet.getSanPhamChiTiet();
            int soLuongTrongDon = chiTiet.getSoLuong();

            if (isDeducting) {
                // TRỪ KHỎI KHO: Khi xác nhận/hoàn thành đơn
                int soLuongTonKhoHienTai = sanPhamCanUpdate.getSoLuong();
                if (soLuongTonKhoHienTai < soLuongTrongDon) {
                    // Ném ra lỗi nếu kho không đủ, đây là bước kiểm tra an toàn cuối cùng
                    throw new AppException(ErrorCode.INSUFFICIENT_QUANTITY);
                }
                sanPhamCanUpdate.setSoLuong(soLuongTonKhoHienTai - soLuongTrongDon);
            } else {
                // CỘNG TRẢ VÀO KHO: Khi hủy đơn
                sanPhamCanUpdate.setSoLuong(sanPhamCanUpdate.getSoLuong() + soLuongTrongDon);
            }
            // Lưu lại thông tin sản phẩm đã được cập nhật số lượng
            chiTietSanPhamRepository.save(sanPhamCanUpdate);
        }
    }

    @Override
    public CapNhatTrangThaiDTO capNhatTrangThaiHoaDon(Integer idHoaDon, TrangThai trangThaiMoi, String ghiChu, String nguoiThucHien) {
        HoaDon hoaDon = hoaDonRepository.findById(idHoaDon)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        TrangThai trangThaiCu = hoaDon.getTrangThai();


        if (trangThaiCu == trangThaiMoi) {
            throw new AppException(ErrorCode.NO_STATUS_CHANGE);
        }


        if (!trangThaiMoi.canTransitionFrom(trangThaiCu)) {
            throw new AppException(ErrorCode.INVALID_STATUS_TRANSITION);
        }
        if (trangThaiMoi == TrangThai.CHO_GIAO_HANG && trangThaiCu == TrangThai.CHO_XAC_NHAN) {
            // Khi xác nhận đơn và chuẩn bị giao -> TRỪ KHO
            capNhatSoLuongSanPhamTrongKho(hoaDon, true);
        } else if (trangThaiMoi == TrangThai.HUY) {
            // Khi hủy đơn -> CỘNG TRẢ KHO
            // Chỉ cộng trả lại nếu trạng thái trước đó là đã trừ kho (ví dụ: đang chờ giao)
            if (trangThaiCu == TrangThai.CHO_XAC_NHAN || trangThaiCu == TrangThai.CHO_GIAO_HANG || trangThaiCu == TrangThai.DANG_VAN_CHUYEN) {
                capNhatSoLuongSanPhamTrongKho(hoaDon, false); // false = cộng lại
            }
        }

        // Nên lấy người thực hiện từ ngữ cảnh bảo mật (ví dụ: Spring Security) thay vì giả lập
        String nguoiThucHienThayDoi = nguoiThucHien != null ? nguoiThucHien : hoaDon.getNhanVien().getHoVaTen();

        hoaDon.setTrangThai(trangThaiMoi);
        HoaDon updatedHoaDon = hoaDonRepository.save(hoaDon);

        String noiDungThayDoi = String.format("Trạng thái hóa đơn thay đổi từ '%s' sang '%s'",
                trangThaiCu.getDisplayName(), trangThaiMoi.getDisplayName());


        lichSuHoaDonService.ghiNhanLichSuHoaDon(updatedHoaDon, noiDungThayDoi, nguoiThucHienThayDoi, ghiChu, trangThaiMoi);

        return new CapNhatTrangThaiDTO(
                updatedHoaDon.getId(),
                updatedHoaDon.getTrangThai().name(),
                updatedHoaDon.getTrangThai().getDisplayName(),
                "Cập nhật trạng thái thành công!"
        );
    }

    @Override
    public CapNhatTrangThaiDTO capNhatTrangThaiHoaDonKhiQuayLai(Integer idHoaDon, TrangThai trangThaiMoi, String ghiChu, String nguoiThucHien) {
        HoaDon hoaDon = hoaDonRepository.findById(idHoaDon)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        TrangThai trangThaiCu = hoaDon.getTrangThai();

        if (trangThaiCu == trangThaiMoi) {
            throw new AppException(ErrorCode.NO_STATUS_CHANGE);
        }


        if (!trangThaiCu.canRevertTo(trangThaiMoi)) { // Kiểm tra lùi lại
            throw new AppException(ErrorCode.INVALID_STATUS_TRANSITION);
        }


        String nguoiThucHienThayDoi = nguoiThucHien != null ? nguoiThucHien : hoaDon.getNhanVien().getHoVaTen();

        hoaDon.setTrangThai(trangThaiMoi);
        HoaDon updatedHoaDon = hoaDonRepository.save(hoaDon);

        String noiDungThayDoi = String.format("Trạng thái hóa đơn thay đổi từ '%s' sang '%s'",
                trangThaiCu.getDisplayName(), trangThaiMoi.getDisplayName());

        lichSuHoaDonService.ghiNhanLichSuHoaDon(updatedHoaDon, noiDungThayDoi, nguoiThucHienThayDoi, ghiChu, trangThaiMoi);

        return new CapNhatTrangThaiDTO(
                updatedHoaDon.getId(),
                updatedHoaDon.getTrangThai().name(),
                updatedHoaDon.getTrangThai().getDisplayName(),
                "Cập nhật trạng thái thành công!"
        );
    }

    @Override
    public List<HoaDonHistoryDTO> layLichSuThayDoiTrangThai(String maHoaDon) {
        return lichSuHoaDonService.layLichSuThayDoiTrangThai(maHoaDon);
    }

    @Override
    public HoaDonDTO getHoaDonById(Integer id) {
        HoaDon hoaDon = hoaDonRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        HoaDonDTO hoaDonResponse = hoaDonMapper.toHoaDonResponse(hoaDon);

        hoaDonResponse.setDanhSachChiTiet(
                hoaDonChiTietRepository.findAllByHoaDon_Id(hoaDon.getId()).stream()
                        .map(hoaDonChiTiet -> {
                            HoaDonChiTietDTO chiTietResponse = new HoaDonChiTietDTO();
                            chiTietResponse.setId(hoaDonChiTiet.getId());
                            if (hoaDonChiTiet.getSanPhamChiTiet() != null) {
                                chiTietResponse.setMaSanPhamChiTiet(hoaDonChiTiet.getSanPhamChiTiet().getMaSanPhamChiTiet());
                                chiTietResponse.setTenSanPham(hoaDonChiTiet.getSanPhamChiTiet().getSanPham().getTenSanPham());
                                chiTietResponse.setTenKichThuoc(hoaDonChiTiet.getSanPhamChiTiet().getKichThuoc().getTenKichCo());
                                chiTietResponse.setTenMauSac(hoaDonChiTiet.getSanPhamChiTiet().getMauSac().getTenMauSac());
                            }
                            chiTietResponse.setSoLuong(hoaDonChiTiet.getSoLuong());
                            chiTietResponse.setGia(hoaDonChiTiet.getGia());

                            chiTietResponse.setThanhTien(hoaDonChiTiet.getThanhTien());
                            chiTietResponse.setGhiChu(hoaDonChiTiet.getGhiChu());
                            chiTietResponse.setTrangThai(hoaDonChiTiet.getTrangThai());
                            return chiTietResponse;
                        }).collect(Collectors.toList())
        );

        return hoaDonResponse;
    }

    @Override
    public Page<HoaDonDTO> getFilteredHoaDon( // Đây là phương thức duy nhất để lọc
                                                   TrangThai trangThai,
                                                   String loaiHoaDon,
                                                   LocalDate ngayTaoStart,
                                                   LocalDate ngayTaoEnd,
                                                   String searchTerm,
                                                   Pageable pageable) {


        Sort sortByIdDesc = Sort.by(Sort.Direction.DESC, "id");


        Pageable newPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                sortByIdDesc
        );

        Specification<HoaDon> spec = HoaDonSpecification.filterHoaDon(
                trangThai, loaiHoaDon, ngayTaoStart, ngayTaoEnd, searchTerm
        );


        Page<HoaDon> hoaDonPage = hoaDonRepository.findAll(spec, newPageable);


        return hoaDonPage.map(this::convertToHoaDonResponseWithDetails);
    }

    @Override
    public Map<TrangThai, Long> getStatusCounts() {
        List<CountTrangThaiHoaDon> counts = hoaDonRepository.getCoutnTrangThaiHoaDon();

        return counts.stream()
                .collect(Collectors.toMap(CountTrangThaiHoaDon::getTrangThai, CountTrangThaiHoaDon::getSoLuong));
    }

    @Override
    public CapNhatTrangThaiDTO chuyenTrangThaiTiepTheo(Integer idHoaDon, String ghiChu, String nguoiThucHien) {
        HoaDon hoaDon = hoaDonRepository.findById(idHoaDon)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        TrangThai trangThaiCu = hoaDon.getTrangThai();

        // Định nghĩa trình tự các trạng thái
        List<TrangThai> listTrangThai = Arrays.asList(
                TrangThai.TAO_DON_HANG,
                TrangThai.CHO_XAC_NHAN,
                TrangThai.CHO_GIAO_HANG,
                TrangThai.DANG_VAN_CHUYEN,
                TrangThai.HOAN_THANH
        );

        int currentIndex = listTrangThai.indexOf(trangThaiCu);

        // Nếu trạng thái hiện tại không nằm trong chuỗi tuần tự hoặc đã là cuối chuỗi
        if (currentIndex == -1 || currentIndex >= listTrangThai.size() - 1) {
            throw new AppException(ErrorCode.INVALID_STATUS_TRANSITION); // Hoặc một mã lỗi phù hợp hơn
        }

        TrangThai trangThaiMoi = listTrangThai.get(currentIndex + 1);

        // Gọi lại phương thức cập nhật trạng thái chung
        return capNhatTrangThaiHoaDon(idHoaDon, trangThaiMoi, ghiChu, nguoiThucHien);
    }

    @Override
    public CapNhatTrangThaiDTO huyHoaDon(Integer idHoaDon, String ghiChu, String nguoiThucHien) {
        HoaDon hoaDon = hoaDonRepository.findById(idHoaDon)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        TrangThai trangThaiCu = hoaDon.getTrangThai();

        // Kiểm tra nếu hóa đơn đã bị hủy rồi
        if (trangThaiCu == TrangThai.HUY) { // Giả sử bạn có một enum DA_HUY
            throw new AppException(ErrorCode.ORDER_HAS_BEEN_CANCELLED); // Mã lỗi mới
        }

        // Đảm bảo trạng thái hủy có thể chuyển từ trạng thái hiện tại
        // Rất có thể DA_HUY sẽ được phép chuyển từ nhiều trạng thái khác nhau.
        if (!TrangThai.HUY.canTransitionFrom(trangThaiCu)) {
            throw new AppException(ErrorCode.INVALID_STATUS_TRANSITION); // Mã lỗi mới
        }

        // Gọi lại phương thức cập nhật trạng thái chung để thực hiện việc hủy
        return capNhatTrangThaiHoaDon(idHoaDon, TrangThai.HUY, ghiChu, nguoiThucHien);
    }


    @Override
    public CapNhatTrangThaiDTO quayLaiTrangThaiTruoc(Integer idHoaDon, String ghiChu, String nguoiThucHien) {
        HoaDon hoaDon = hoaDonRepository.findById(idHoaDon)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        TrangThai trangThaiHienTai = hoaDon.getTrangThai();
        HoaDonHistoryDTO lichSuGanNhat = lichSuHoaDonService.layLichSuThayDoiTrangThaiGanNhat(idHoaDon);
        if (lichSuGanNhat==null) {
            throw new AppException(ErrorCode.NO_PREVIOUS_STATUS);
        }
        TrangThai trangThai= TrangThai.valueOf(lichSuGanNhat.getTrangThaiHoaDon());
        TrangThai trangThaiQuayLai = trangThai;


        if (!trangThaiHienTai.canRevertTo(trangThaiQuayLai)) {
            throw new AppException(ErrorCode.INVALID_STATUS_TRANSITION);
        }
        return capNhatTrangThaiHoaDonKhiQuayLai(idHoaDon, trangThaiQuayLai, ghiChu, nguoiThucHien);

    }

    @Override
    public String capNhatThongTinHoaDon(Integer idHoaDon, HoaDonUpdateVO request) {
        HoaDon hoaDon = hoaDonRepository.findById(idHoaDon)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        hoaDon.setSdt(request.getSdt());
        hoaDon.setDiaChi(request.getDiaChi());
        hoaDon.setTenKhachHang(request.getTenKhachHang());
        hoaDon.setGhiChu(request.getGhiChu());
        hoaDonRepository.save(hoaDon);

        return "Cập nhật thong tin đơn hàng thành công";
    }



    @Override
    public List<HoaDonChiTietDTO> findChiTietHoaDon(Integer idHoaDon) {
        if (idHoaDon==null || idHoaDon<=0){
            throw new AppException(ErrorCode.ORDER_NOT_FOUND);
        }
        if (!hoaDonRepository.existsById(idHoaDon)){
            throw new AppException(ErrorCode.ORDER_NOT_FOUND);
        }
        List<HoaDonChiTietView> listHoaDonChiTiet = hoaDonChiTietRepository.findChiTietHoaDon(idHoaDon);
        return listHoaDonChiTiet.stream()
                .map(this::mapViewToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public HoaDonDTO updateHoaDon(HoaDonRequestUpdateVO request) {
        // 1. Tìm hóa đơn hoặc ném lỗi nếu không tìm thấy
        HoaDon hoaDon = hoaDonRepository.findById(request.getIdHoaDon())
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        if (request.getDanhSachSanPham() != null) {
            Map<Integer, Integer> newProductsMap = request.getDanhSachSanPham().stream()
                    .collect(Collectors.toMap(
                            HoaDonRequestUpdateVO.SanPhamCapNhatVO::getId,
                            HoaDonRequestUpdateVO.SanPhamCapNhatVO::getSoLuong,
                            (existingValue, newValue) -> newValue
                    ));

            Iterator<HoaDonChiTiet> iterator = hoaDon.getHoaDonChiTietList().iterator();
            while (iterator.hasNext()) {
                HoaDonChiTiet detail = iterator.next();
                Integer sanPhamChiTietId = detail.getSanPhamChiTiet().getId();

                if (newProductsMap.containsKey(sanPhamChiTietId)) {
                    Integer newQuantity = newProductsMap.get(sanPhamChiTietId);
                    if (newQuantity != null && newQuantity > 0) {
                        detail.setSoLuong(newQuantity);
                        detail.setThanhTien(detail.getGia() * newQuantity);
                    } else {
                        iterator.remove();
                    }
                    newProductsMap.remove(sanPhamChiTietId);
                } else {
                    iterator.remove();
                }
            }

            // === KHỐI CODE BỊ THIẾU ĐÃ ĐƯỢC THÊM LẠI TẠI ĐÂY ===
            // Thêm các sản phẩm hoàn toàn mới (những sản phẩm còn lại trong map)
            newProductsMap.forEach((sanPhamChiTietId, soLuong) -> {
                if (soLuong > 0) {
                    ChiTietSanPham spct = chiTietSanPhamRepository.findById(sanPhamChiTietId)
                            .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
                    HoaDonChiTiet newDetail = new HoaDonChiTiet();
                    newDetail.setHoaDon(hoaDon);
                    newDetail.setSanPhamChiTiet(spct);
                    newDetail.setSoLuong(soLuong);
                    newDetail.setGia(spct.getGia());
                    newDetail.setThanhTien(spct.getGia() * soLuong);
                    hoaDon.getHoaDonChiTietList().add(newDetail);
                }
            });
            // =======================================================
        }

        // 4. Cập nhật thông tin chung của hóa đơn
        HoaDonUpdateMapper.INSTANCE.updateHoaDon(hoaDon, request);

        if (request.getNhanVien()!= null && !request.getNhanVien().isEmpty()) {
            NhanVien nhanVien = nhanVienRepository.findById(Integer.parseInt(request.getNhanVien()))
                    .orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));
            hoaDon.setNhanVien(nhanVien);
        } else {
            NhanVien nhanVien = nhanVienRepository.findById(1).orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));
            hoaDon.setNhanVien(nhanVien);
        }

        Integer idKhachHang = null;
        String idKhachHangStr = request.getKhachHang(); // Lấy ID dạng chuỗi từ request

// Thêm bước kiểm tra quan trọng này
        if (idKhachHangStr != null && !idKhachHangStr.trim().isEmpty()) {
            try {
                idKhachHang = Integer.parseInt(idKhachHangStr);
            } catch (NumberFormatException e) {
                // Có thể ghi log ở đây để biết nếu ai đó gửi ID không phải là số
                System.err.println("ID khách hàng không hợp lệ: " + idKhachHangStr);
            }
        }

// Bây giờ, bạn có thể sử dụng biến 'idKhachHang' một cách an toàn.
// Nếu không có ID hoặc ID không hợp lệ, nó sẽ là null.
        if (idKhachHang != null) {
            KhachHang khachHang = khachHangRepository.findById(idKhachHang).orElse(null);
            hoaDon.setKhachHang(khachHang);
        } else {
            // Xử lý cho trường hợp không có khách hàng (khách vãng lai)
            hoaDon.setKhachHang(null);
        }

        // 5. Tính toán lại toàn bộ giá trị hóa đơn
        // Tính tổng tiền gốc từ danh sách sản phẩm đã được cập nhật
        int tongTienBanDau = hoaDon.getHoaDonChiTietList().stream()
                .mapToInt(ct -> ct.getGia() * ct.getSoLuong())
                .sum();
        hoaDon.setTongTienBanDau(tongTienBanDau);
        hoaDon.setTongTien(tongTienBanDau); // Gán tạm

        // Áp dụng phiếu giảm giá
        if (StringUtils.isNotEmpty(request.getPhieuGiamGia())) {
            PhieuGiamGia pgg = phieuGiamGiaRepository.findById(Integer.valueOf(request.getPhieuGiamGia())).orElse(null);
            hoaDon.setPhieuGiamGia(pgg);
            if (pgg != null) {
                System.out.println("--- DEBUGGING DISCOUNT CALCULATION ---");
                System.out.println("Tổng tiền ban đầu để tính giảm giá: " + tongTienBanDau);
                System.out.println("Voucher % (từ DB): " + pgg.getPhamTramGiamGia());
                System.out.println("Voucher tiền cố định (từ DB): " + pgg.getSoTienGiam());
                System.out.println("Voucher giảm tối đa (từ DB): " + pgg.getGiamToiDa());
                BigDecimal soTienGiam = BigDecimal.ZERO;


                if( pgg.getPhamTramGiamGia() != null){
                    soTienGiam = BigDecimal.valueOf(tongTienBanDau)
                            .multiply(pgg.getPhamTramGiamGia())
                            .divide(BigDecimal.valueOf(100));
                }
                else {
                    soTienGiam = BigDecimal.valueOf(tongTienBanDau).subtract(pgg.getSoTienGiam());
                }
                hoaDon.setTongTien(soTienGiam.intValue());
            }
        } else {
            hoaDon.setPhieuGiamGia(null);
        }


        hoaDon.setTongHoaDon(hoaDon.getTongTien() + hoaDon.getPhiVanChuyen());

       
        Integer tongTienDaTraRaw = chiTietThanhToanRepository.sumSoTienThanhToanByIdHoaDon(hoaDon.getId());
        int tongTienDaTra = (tongTienDaTraRaw != null) ? tongTienDaTraRaw : 0;

        boolean laDonGiaoHang = StringUtils.isNotEmpty(request.getDiaChi());

        if (!laDonGiaoHang) { // Đơn tại quầy
            if (tongTienDaTra >= hoaDon.getTongTien()) {
                hoaDon.setTrangThai(TrangThai.HOAN_THANH);
                capNhatSoLuongSanPhamTrongKho(hoaDon, true);
            } else {
                throw new AppException(ErrorCode.NOT_YET_PAID);
            }
        } else { // Đơn giao hàng
            if (tongTienDaTra >= hoaDon.getTongTien()) {
                hoaDon.setTrangThai(TrangThai.HOAN_THANH);
                capNhatSoLuongSanPhamTrongKho(hoaDon, true);
            }
            else {
                hoaDon.setTrangThai(TrangThai.CHO_XAC_NHAN);
            }
            hoaDon.setNgayGiaoDuKien(LocalDate.now().atStartOfDay().plusDays(3));
        }


        HoaDon hoaDonDaLuu = hoaDonRepository.save(hoaDon);

        String nguoiThucHienCapNhat =  "Hệ thống";


        String noiDungLichSu;
        switch (hoaDonDaLuu.getTrangThai()) {
            case HOAN_THANH:
                noiDungLichSu = "Hóa đơn đã được thanh toán và hoàn thành.";
                break;
            case CHO_XAC_NHAN:
                noiDungLichSu = "Đơn hàng đã được tạo và đang chờ xác nhận.";
                break;
            case HUY:
                noiDungLichSu = "Hóa đơn đã bị hủy.";
                break;
            // Bạn có thể thêm các case khác cho các trạng thái khác
            default:
                // Tin nhắn mặc định nếu không rơi vào các case trên
                noiDungLichSu = "Hóa đơn được cập nhật trạng thái thành: " + hoaDonDaLuu.getTrangThai().name();
                break;
        }

        // Gọi service để ghi nhận lịch sử vào database
        lichSuHoaDonService.ghiNhanLichSuHoaDon(
                hoaDonDaLuu,
                noiDungLichSu,
                nguoiThucHienCapNhat,
                request.getGhiChu(), // Lấy ghi chú từ request gửi lên
                hoaDonDaLuu.getTrangThai()
        );

        return HoaDonUpdateMapper.INSTANCE.toResponseDTO(hoaDonDaLuu);
    }

    // Phương thức helper để chuyển đổi và thêm chi tiết hóa đơn
    private HoaDonDTO convertToHoaDonResponseWithDetails(HoaDon hoaDon) {
        HoaDonDTO response = hoaDonMapper.toHoaDonResponse(hoaDon);

        response.setDanhSachChiTiet(
                hoaDonChiTietRepository.findAllByHoaDon_Id(hoaDon.getId()).stream()
                        .map(hoaDonChiTiet -> {
                            HoaDonChiTietDTO chiTietResponse = new HoaDonChiTietDTO();
                            chiTietResponse.setId(hoaDonChiTiet.getId());
                            if (hoaDonChiTiet.getSanPhamChiTiet() != null) {
                                chiTietResponse.setMaSanPhamChiTiet(hoaDonChiTiet.getSanPhamChiTiet().getMaSanPhamChiTiet());
                            }
                            chiTietResponse.setSoLuong(hoaDonChiTiet.getSoLuong());
                            chiTietResponse.setGia(hoaDonChiTiet.getGia());
                            chiTietResponse.setThanhTien(hoaDonChiTiet.getThanhTien());
                            chiTietResponse.setGhiChu(hoaDonChiTiet.getGhiChu());
                            chiTietResponse.setTrangThai(hoaDonChiTiet.getTrangThai());

                            return chiTietResponse;
                        }).collect(Collectors.toList())
        );
        return response;
    }

    private HoaDonChiTietDTO mapViewToResponse(HoaDonChiTietView view) {
        return HoaDonChiTietDTO.builder()
                .id(view.getId())
                .soLuong(view.getSoLuong())
                .gia(view.getGia())
                .thanhTien(view.getThanhTien())
                .ghiChu(view.getGhiChu())
                .trangThai(view.getTrangThai())
                .maSanPhamChiTiet(view.getMaSanPhamChiTiet())
                .tenSanPham(view.getTenSanPham())
                .tenMauSac(view.getTenMauSac())
                .tenKichThuoc(view.getTenKichThuoc())
                .duongDanAnh(view.getDuongDanAnh())
                .build();
    }

}






