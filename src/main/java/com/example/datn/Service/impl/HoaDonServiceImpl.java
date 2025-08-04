package com.example.datn.Service.impl;
import java.math.BigDecimal;
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
import java.text.Normalizer;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;
import java.math.RoundingMode;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.itextpdf.text.Image;
import java.awt.image.BufferedImage;
import javax.imageio.ImageIO;

import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.stream.Stream;
import com.example.datn.DTO.HoaDonPdfResult;

import static java.util.Locale.filter;

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
    DotGiamGiaRepository dotGiamGiaRepository;

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
    private Image createQrCode(String data, int size) throws Exception {
        QRCodeWriter writer = new QRCodeWriter();
        BitMatrix bitMatrix = writer.encode(data, BarcodeFormat.QR_CODE, size, size);
        BufferedImage bufferedImage = MatrixToImageWriter.toBufferedImage(bitMatrix);

        // Chuyển BufferedImage thành Image của iText
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(bufferedImage, "png", baos);
        return Image.getInstance(baos.toByteArray());
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
            PdfPTable headerTable = new PdfPTable(2); // Bảng có 2 cột
            headerTable.setWidthPercentage(100);
            headerTable.setWidths(new float[]{1, 4}); // Cột QR chiếm 1 phần, cột thông tin chiếm 4 phần
            headerTable.setSpacingAfter(20f); // Tạo khoảng cách với phần "HÓA ĐƠN BÁN HÀNG" bên dưới

// Cột 1 (Trái): Chứa mã QR
            PdfPCell qrCell = new PdfPCell();
            Image qrImage = createQrCode(hoaDon.getMaHoaDon(), 80); // Tạo QR kích thước 80x80 pixels
            qrCell.addElement(qrImage);
            qrCell.setBorder(Rectangle.NO_BORDER); // Xóa viền ô
            headerTable.addCell(qrCell);

// Cột 2 (Phải): Chứa thông tin cửa hàng
            PdfPCell shopInfoCell = new PdfPCell();
// Bỏ căn giữa để chữ căn trái tự nhiên
            title2.setAlignment(Element.ALIGN_LEFT);
            sdt.setAlignment(Element.ALIGN_LEFT);
            email.setAlignment(Element.ALIGN_LEFT);
            diaChi.setAlignment(Element.ALIGN_LEFT);
// Thêm các dòng thông tin vào ô bên phải
            shopInfoCell.addElement(title2);
            shopInfoCell.addElement(sdt);
            shopInfoCell.addElement(email);
            shopInfoCell.addElement(diaChi);
            shopInfoCell.setBorder(Rectangle.NO_BORDER); // Xóa viền ô
            headerTable.addCell(shopInfoCell);

// Thêm bảng header vừa tạo vào văn bản
            document.add(headerTable);

// Căn giữa cho tiêu đề "DANH SÁCH SẢN PHẨM"
            titleDSSP.setAlignment(Element.ALIGN_CENTER);
            // Tiêu đề
            Paragraph title = new Paragraph("HÓA ĐƠN BÁN HÀNG", fontTitle);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph(" ", font));

            // Thông tin hóa đơn
// Bảng 2 cột: Trái là thông tin khách hàng, phải là thông tin đơn hàng
            PdfPTable bangThongTin = new PdfPTable(2);
            bangThongTin.setWidthPercentage(100);
            bangThongTin.setWidths(new int[]{1, 1}); // Chia đều 2 cột

            PdfPCell oThongTinKhach = new PdfPCell();
            oThongTinKhach.setBorder(Rectangle.NO_BORDER);
            StringBuilder noiDungKhachHang = new StringBuilder();

            if (hoaDon.getKhachHang() != null) {
                noiDungKhachHang.append("Khách hàng: ").append(hoaDon.getKhachHang().getTenKhachHang()).append("\n");
                noiDungKhachHang.append("SĐT: ").append(hoaDon.getKhachHang().getSdt()).append("\n");
                noiDungKhachHang.append("Email: ").append(hoaDon.getKhachHang().getEmail()).append("\n");
                noiDungKhachHang.append("Địa chỉ: ").append(hoaDon.getDiaChi()).append("\n");
            } else {
                noiDungKhachHang.append("Khách hàng: \n");
                noiDungKhachHang.append("SĐT: \n");
                noiDungKhachHang.append("Email: \n");
                noiDungKhachHang.append("Địa chỉ: \n");
            }

            oThongTinKhach.addElement(new Paragraph(noiDungKhachHang.toString(), font));

            PdfPCell oThongTinHoaDon = new PdfPCell();
            oThongTinHoaDon.setBorder(Rectangle.NO_BORDER);
            StringBuilder noiDungHoaDon = new StringBuilder();

            noiDungHoaDon.append("Mã HĐ: ").append(hoaDon.getMaHoaDon()).append("\n");
            noiDungHoaDon.append("Ngày tạo: ").append(hoaDon.getNgayTao()).append("\n");
            noiDungHoaDon.append("Tổng tiền: ").append(hoaDon.getTongTien()).append(" VND");

            oThongTinHoaDon.addElement(new Paragraph(noiDungHoaDon.toString(), font));

            bangThongTin.addCell(oThongTinKhach);
            bangThongTin.addCell(oThongTinHoaDon);
            document.add(bangThongTin);
            document.add(new Paragraph(" ", font));

            // Bảng chi tiết
            PdfPTable table = new PdfPTable(3);
            table.setWidthPercentage(100);
            table.setWidths(new int[]{4, 2, 2});
            document.add(titleDSSP);
            document.add(new Paragraph(" ", font));
            // Header bảng
            Stream.of("Sản phẩm", "Số lượng" , "Thành tiền")
                    .forEach(headerTitle -> {
                        PdfPCell header = new PdfPCell();
                        header.setPhrase(new Phrase(headerTitle, font));
                        header.setHorizontalAlignment(Element.ALIGN_CENTER);
                        header.setBackgroundColor(BaseColor.LIGHT_GRAY);
                        table.addCell(header);
                    });

            // Dòng dữ liệu
            for (HoaDonChiTiet cthd : hoaDon.getHoaDonChiTietList()) {
                table.addCell(new Phrase(cthd.getSanPhamChiTiet().getSanPham().getTenSanPham() + "-" + cthd.getSanPhamChiTiet().getKichThuoc().getTenKichCo() + "-" + cthd.getSanPhamChiTiet().getMauSac().getTenMauSac() , font));
                table.addCell(new Phrase(String.valueOf(cthd.getSoLuong()), font));
                table.addCell(new Phrase(String.valueOf(cthd.getThanhTien()), font));
            }

            PdfPTable table2 = new PdfPTable(2); // 2 cột
            table2.setWidthPercentage(100);

            // Tạo cột trái
            Font fontLeft = new Font(baseFont, 12);
            PdfPCell leftCell2 = new PdfPCell(new Phrase("Tổng tiền hàng:", fontLeft));
            leftCell2.setBorder(Rectangle.NO_BORDER);
            table2.addCell(leftCell2);

            Font fontRight = new Font(baseFont, 12, Font.BOLD);
            PdfPCell rightCell2 = new PdfPCell(new Phrase(hoaDon.getTongTienBanDau() + " VNĐ", fontRight));
            rightCell2.setHorizontalAlignment(Element.ALIGN_RIGHT);
            rightCell2.setBorder(Rectangle.NO_BORDER);
            table2.addCell(rightCell2);

            table2.addCell(createLeftCell("Giảm giá:", fontLeft));
            if(hoaDon.getPhieuGiamGia() != null) {
                table2.addCell(createRightCell(hoaDon.getTongTienBanDau() - hoaDon.getTongTien() + " VND", fontRight));
            }
            else {
                table2.addCell(createRightCell("0 VNĐ", fontRight));
            }
            table2.addCell(createLeftCell("Phí giao hàng:", fontLeft));
            table2.addCell(createRightCell(hoaDon.getPhiVanChuyen() + " VND", fontRight));
            table2.addCell(createLeftCell("Tổng tiền cần thanh toán:", fontLeft));
            table2.addCell(createRightCell(hoaDon.getTongHoaDon() + " VND", fontRight));

            document.add(table);
            document.add(new Paragraph(" ", font));
            document.add(table2);
            document.close();

        } catch (DocumentException | IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi tạo PDF hóa đơn: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException(e);
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
    public TongTienHoaDonDto getThongTinGiamGiaByHoaDonId(Integer idHoaDon) {
        HoaDon hoaDon = hoaDonRepository.findById(idHoaDon)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        PhieuGiamGia phieuGiamGia = hoaDon.getPhieuGiamGia();
        TongTienHoaDonDto tongTienHoaDonDto = new TongTienHoaDonDto();


        if (phieuGiamGia != null) {

            tongTienHoaDonDto.setPhieuGiamGia(phieuGiamGia.getMaPhieuGiamGia());
            tongTienHoaDonDto.setGiamGia(hoaDon.getTongTienBanDau() - hoaDon.getTongTien());
        } else {

            tongTienHoaDonDto.setPhieuGiamGia(null);
            tongTienHoaDonDto.setGiamGia(0);
        }

        tongTienHoaDonDto.setTongTien(hoaDon.getTongTien());
        tongTienHoaDonDto.setPhiVanChuyen(hoaDon.getPhiVanChuyen());
        tongTienHoaDonDto.setTongTienHang(hoaDon.getTongTienBanDau());
        tongTienHoaDonDto.setTongHoaDon(hoaDon.getTongHoaDon());
        return tongTienHoaDonDto;
    }

    @Override
    public int tinhGiaCuoiCung(ChiTietSanPham spct) {
        int giaGoc= spct.getGia();
        List<DotGiamGia> dotGiamGiaList= dotGiamGiaRepository.findAll();
        Optional<DotGiamGia> dotGiamGiaOptional = dotGiamGiaList.stream().filter(dotGiamGia -> dotGiamGia.getTrangThai()==1
        && !LocalDateTime.now().isBefore(dotGiamGia.getNgayBatDau()) &&
                        !LocalDateTime.now().isAfter(dotGiamGia.getNgayKetThuc()))
                .findFirst();
    if (dotGiamGiaOptional.isPresent()) {
        DotGiamGia dotGiamGia = dotGiamGiaOptional.get();
        DotGiamGia dgg = dotGiamGiaOptional.get();
        Integer phanTramGiam = dotGiamGia.getPhanTramGiamGia();
        Integer giaSauGiam = (int) Math.round(giaGoc * (1 - phanTramGiam / 100.0));
        return giaSauGiam;
    }
        return giaGoc;
    }

    @Override
    public String capNhatKhachHangVaoHoaDon(CapNhatKhachRequestVO capNhatKhachRequest) {
        HoaDon hoaDon = hoaDonRepository.findById(capNhatKhachRequest.getIdHoaDon())
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        if (capNhatKhachRequest.getIdKhachHang() != null) {
            KhachHang  khachHang = khachHangRepository.findById(capNhatKhachRequest.getIdKhachHang())
                    .orElseThrow(() -> new AppException(ErrorCode.CUSTOMER_NOT_FOUND));
            hoaDon.setKhachHang(khachHang);

        }else {
            hoaDon.setKhachHang(null);
        }
        hoaDonRepository.save(hoaDon);
        return "Cập nhật khách hàng thành công!";
    }



    @Override
    public CapNhatTrangThaiDTO capNhatTrangThaiHoaDon(Integer idHoaDon, TrangThai trangThaiMoi, String ghiChu, String nguoiThucHien) {
        HoaDon hoaDon = hoaDonRepository.findById(idHoaDon)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        TrangThai trangThaiCu = hoaDon.getTrangThai();


        if (trangThaiCu == trangThaiMoi) {
            throw new AppException(ErrorCode.NO_STATUS_CHANGE);
        }

//
//        if (!trangThaiMoi.canTransitionTo(trangThaiCu)) {
//            throw new AppException(ErrorCode.INVALID_STATUS_TRANSITION);
//        }
//        if (trangThaiMoi == TrangThai.CHO_GIAO_HANG && trangThaiCu == TrangThai.CHO_XAC_NHAN) {
//            // Khi xác nhận đơn và chuẩn bị giao -> TRỪ KHO
//            capNhatSoLuongSanPhamTrongKho(hoaDon, true);
//        } else if (trangThaiMoi == TrangThai.HUY) {
//            // Khi hủy đơn -> CỘNG TRẢ KHO
//            // Chỉ cộng trả lại nếu trạng thái trước đó là đã trừ kho (ví dụ: đang chờ giao)
//            if (trangThaiCu == TrangThai.CHO_XAC_NHAN || trangThaiCu == TrangThai.CHO_GIAO_HANG || trangThaiCu == TrangThai.DANG_VAN_CHUYEN) {
//                capNhatSoLuongSanPhamTrongKho(hoaDon, false); // false = cộng lại
//            }
//        }

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
    private String normalize(String input) {
        if (input == null) return "";
        return Normalizer.normalize(input, Normalizer.Form.NFC).trim().toLowerCase(new Locale("vi", "VN"));
    }
    @Override
    public CapNhatTrangThaiDTO chuyenTrangThaiTiepTheo(Integer idHoaDon, String ghiChu, String nguoiThucHien) {
        HoaDon hoaDon = hoaDonRepository.findById(idHoaDon)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        List<TrangThai> listTrangThai;
        String loaiHoaDon = normalize(hoaDon.getLoaiHoaDon());
        if (loaiHoaDon.contains("tại quầy")) {
            listTrangThai = Arrays.asList(
                    TrangThai.TAO_DON_HANG,
                    TrangThai.DA_XAC_NHAN,
                    TrangThai.CHO_GIAO_HANG,
                    TrangThai.DANG_VAN_CHUYEN,
                    TrangThai.HOAN_THANH
            );
        } else {
            listTrangThai = Arrays.asList(
                    TrangThai.TAO_DON_HANG,
                    TrangThai.CHO_XAC_NHAN,
                    TrangThai.CHO_GIAO_HANG,
                    TrangThai.DANG_VAN_CHUYEN,
                    TrangThai.HOAN_THANH
            );
        }
        TrangThai trangThaiCu = hoaDon.getTrangThai();
        int currentIndex = listTrangThai.indexOf(trangThaiCu);

        if (currentIndex == -1 || currentIndex >= listTrangThai.size() - 1) {
            throw new AppException(ErrorCode.INVALID_STATUS_TRANSITION);
        }

        TrangThai trangThaiMoi = listTrangThai.get(currentIndex + 1);

        return capNhatTrangThaiHoaDon(idHoaDon, trangThaiMoi, ghiChu, nguoiThucHien);
    }

    @Override
    public CapNhatTrangThaiDTO huyHoaDon(Integer idHoaDon, String ghiChu, String nguoiThucHien) {
        HoaDon hoaDon = hoaDonRepository.findById(idHoaDon)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        TrangThai trangThaiCu = hoaDon.getTrangThai();


        if (trangThaiCu == TrangThai.HUY) {
            throw new AppException(ErrorCode.ORDER_HAS_BEEN_CANCELLED);
        }



        if (!TrangThai.HUY.canTransitionTo(trangThaiCu)) {
            throw new AppException(ErrorCode.INVALID_STATUS_TRANSITION);
        }


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
        hoaDon.setPhiVanChuyen(request.getPhiVanChuyen());
         Integer tongTien=    hoaDon.getTongTien();
        Integer phiVanChuyen= request.getPhiVanChuyen();
        hoaDon.setTongHoaDon(tongTien+phiVanChuyen);
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
    public String tangSoLuongSanPhamChiTiet(Integer idSanPhamChiTiet, Integer soLuong) {
        if (idSanPhamChiTiet == null || idSanPhamChiTiet <= 0) {
            throw new AppException(ErrorCode.PRODUCT_NOT_FOUND);
        }
        ChiTietSanPham chiTietSanPham = chiTietSanPhamRepository.findById(idSanPhamChiTiet)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        if (soLuong == null || soLuong <= 0) {
            throw new AppException(ErrorCode.INVALID_QUANTITY);
        }

        int soLuongHienTai = chiTietSanPham.getSoLuong();
        chiTietSanPham.setSoLuong(soLuongHienTai + soLuong);
        chiTietSanPhamRepository.save(chiTietSanPham);

        return "Cập nhật số lượng sản phẩm thành công";
    }

    @Override
    public String giamSoLuongSanPhamChiTiet(Integer idSanPhamChiTiet, Integer soLuong) {
        if (idSanPhamChiTiet == null || idSanPhamChiTiet <= 0) {
            throw new AppException(ErrorCode.PRODUCT_NOT_FOUND);
        }
        ChiTietSanPham chiTietSanPham = chiTietSanPhamRepository.findById(idSanPhamChiTiet)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        if (soLuong == null || soLuong <= 0) {
            throw new AppException(ErrorCode.INVALID_QUANTITY);
        }

        int soLuongHienTai = chiTietSanPham.getSoLuong();
        chiTietSanPham.setSoLuong(soLuongHienTai - soLuong);
        chiTietSanPhamRepository.save(chiTietSanPham);

        return "Cập nhật số lượng sản phẩm thành công";
    }

    @Override
    @Transactional
    public HoaDonDTO updateHoaDon(HoaDonRequestUpdateVO request) {
        // 1. Tìm hóa đơn trong DB hoặc ném lỗi nếu không tìm thấy
        HoaDon hoaDon = hoaDonRepository.findById(request.getIdHoaDon())
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        // 2. [LOGIC MỚI] Xóa và tạo lại danh sách chi tiết hóa đơn từ request
        if (request.getDanhSachSanPham() != null) {
            // Xóa toàn bộ chi tiết hóa đơn cũ để đảm bảo không bị trùng lặp hay sai giá
            hoaDon.getHoaDonChiTietList().clear();

            // Lặp qua danh sách sản phẩm từ request để tạo lại chi tiết hóa đơn
            for (HoaDonRequestUpdateVO.SanPhamCapNhatVO sanPhamMoi : request.getDanhSachSanPham()) {
                ChiTietSanPham spct = chiTietSanPhamRepository.findById(sanPhamMoi.getId())
                        .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

                HoaDonChiTiet chiTietMoi = new HoaDonChiTiet();
                chiTietMoi.setHoaDon(hoaDon);
                chiTietMoi.setSanPhamChiTiet(spct);
                chiTietMoi.setSoLuong(sanPhamMoi.getSoLuong());

                // Quan trọng: Set giá từ request, KHÔNG tính toán lại!
                chiTietMoi.setGia(sanPhamMoi.getDonGia().intValue());

                // Tính thành tiền dựa trên giá từ request
                BigDecimal thanhTien = BigDecimal.valueOf(sanPhamMoi.getDonGia())
                        .multiply(BigDecimal.valueOf(sanPhamMoi.getSoLuong()));
                int tienInt = thanhTien.intValue();
                chiTietMoi.setThanhTien(tienInt);

                // Thêm chi tiết mới vào hóa đơn
                hoaDon.getHoaDonChiTietList().add(chiTietMoi);
            }
        }

        // 3. Cập nhật các thông tin chung của hóa đơn từ request
        HoaDonUpdateMapper.INSTANCE.updateHoaDon(hoaDon, request);

        // Cập nhật Nhân viên
        if (request.getNhanVien() != null && !request.getNhanVien().isEmpty()) {
            NhanVien nhanVien = nhanVienRepository.findById(Integer.parseInt(request.getNhanVien()))
                    .orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));
            hoaDon.setNhanVien(nhanVien);
        } else {
            // Mặc định cho một nhân viên nào đó nếu cần
            NhanVien nhanVien = nhanVienRepository.findById(1).orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));
            hoaDon.setNhanVien(nhanVien);
        }

        // Cập nhật Khách hàng (xử lý an toàn cho khách lẻ)
        if (request.getKhachHang() != null && !request.getKhachHang().trim().isEmpty()) {
            try {
                Integer idKhachHang = Integer.parseInt(request.getKhachHang());
                KhachHang khachHang = khachHangRepository.findById(idKhachHang).orElse(null);
                hoaDon.setKhachHang(khachHang);
            } catch (NumberFormatException e) {
                hoaDon.setKhachHang(null); // Gán là khách lẻ nếu ID không hợp lệ
            }
        } else {
            hoaDon.setKhachHang(null); // Khách lẻ
        }

        // 4. Tính toán lại giá trị hóa đơn
        int tongTienBanDau = hoaDon.getHoaDonChiTietList().stream()
                .mapToInt(HoaDonChiTiet::getThanhTien)
                .sum();
        hoaDon.setTongTienBanDau(tongTienBanDau);
        hoaDon.setTongTien(tongTienBanDau); // Gán tạm, sẽ cập nhật lại sau khi có giảm giá

        // 5. Áp dụng phiếu giảm giá (sử dụng BigDecimal để chính xác)
        if (StringUtils.isNotEmpty(request.getPhieuGiamGia())) {
            PhieuGiamGia pgg = phieuGiamGiaRepository.findById(Integer.valueOf(request.getPhieuGiamGia())).orElse(null);
            hoaDon.setPhieuGiamGia(pgg);
            if (pgg != null) {
                BigDecimal tongTienGocBD = BigDecimal.valueOf(tongTienBanDau);
                BigDecimal soTienDuocGiam = BigDecimal.ZERO;

                if (pgg.getPhamTramGiamGia() != null && pgg.getPhamTramGiamGia().compareTo(BigDecimal.ZERO) > 0) {
                    // Giảm theo phần trăm
                    soTienDuocGiam = tongTienGocBD.multiply(pgg.getPhamTramGiamGia()).divide(BigDecimal.valueOf(100));
                    if (pgg.getGiamToiDa() != null && soTienDuocGiam.compareTo(pgg.getGiamToiDa()) > 0) {
                        soTienDuocGiam = pgg.getGiamToiDa();
                    }
                } else if (pgg.getSoTienGiam() != null) {
                    // Giảm theo số tiền cố định
                    soTienDuocGiam = pgg.getGiamToiDa();
                }
                BigDecimal tongTienCuoiCung = tongTienGocBD.subtract(soTienDuocGiam);
                hoaDon.setTongTien(tongTienCuoiCung.intValue());
            }
        } else {
            hoaDon.setPhieuGiamGia(null);
        }
        // 6. Tính tổng hóa đơn cuối cùng (bao gồm phí vận chuyển)
        // Giả sử mapper đã set `phiVanChuyen` vào `hoaDon`
        Integer phiVanChuyen = (hoaDon.getPhiVanChuyen() != null) ? hoaDon.getPhiVanChuyen() : 0;
        hoaDon.setTongHoaDon(hoaDon.getTongTien() + phiVanChuyen);

        // 7. Cập nhật trạng thái hóa đơn dựa trên thanh toán và loại đơn
        Integer tongTienDaTraRaw = chiTietThanhToanRepository.sumSoTienThanhToanByIdHoaDon(hoaDon.getId());
        int tongTienDaTra = (tongTienDaTraRaw != null) ? tongTienDaTraRaw : 0;

        boolean laDonGiaoHang = StringUtils.isNotEmpty(request.getDiaChi());

        if (!laDonGiaoHang) { // Đơn tại quầy
            if (tongTienDaTra >= hoaDon.getTongTien()) {
                hoaDon.setTrangThai(TrangThai.HOAN_THANH);
            } else {
                // Với đơn tại quầy, nếu bấm lưu/thanh toán thì phải trả đủ tiền
                // Bạn có thể giữ hoặc bỏ Exception này tùy nghiệp vụ
                throw new AppException(ErrorCode.NOT_YET_PAID);
            }
        } else { // Đơn giao hàng
            // Với đơn giao hàng, có thể chưa thanh toán hết (COD)
            if (tongTienDaTra >= hoaDon.getTongTien()) {
                hoaDon.setTrangThai(TrangThai.HOAN_THANH);
            } else {
                hoaDon.setTrangThai(TrangThai.DA_XAC_NHAN); // hoặc trạng thái phù hợp khác
            }
            hoaDon.setNgayGiaoDuKien(LocalDate.now().plusDays(3).atStartOfDay());
        }

        // 8. Lưu hóa đơn vào DB
        HoaDon hoaDonDaLuu = hoaDonRepository.save(hoaDon);

        // 9. Ghi nhận lịch sử hoạt động
        String nguoiThucHienCapNhat = "Hệ thống"; // Hoặc lấy từ security context
        String noiDungLichSu;
        switch (hoaDonDaLuu.getTrangThai()) {
            case HOAN_THANH:
                noiDungLichSu = "Hóa đơn đã được thanh toán và hoàn thành.";
                break;
            case DA_XAC_NHAN:
                noiDungLichSu = "Đơn hàng đã được xác nhận và đang chờ giao.";
                break;
            case HUY:
                noiDungLichSu = "Hóa đơn đã bị hủy.";
                break;
            default:
                noiDungLichSu = "Hóa đơn được cập nhật trạng thái thành: " + hoaDonDaLuu.getTrangThai().name();
                break;
        }
        lichSuHoaDonService.ghiNhanLichSuHoaDon(
                hoaDonDaLuu,
                noiDungLichSu,
                nguoiThucHienCapNhat,
                request.getGhiChu(),
                hoaDonDaLuu.getTrangThai()
        );

        // 10. Trả về DTO cho client
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






