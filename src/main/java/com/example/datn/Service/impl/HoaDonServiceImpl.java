package com.example.datn.Service.impl;

import com.example.datn.DTO.*;
import com.example.datn.VO.*;
import com.example.datn.mapper.HoaDonChiTietMapper;
import com.example.datn.mapper.HoaDonUpdateMapper;
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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

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

    @Override
    @Transactional
    public HoaDonDTO taoHoaDon(HoaDonCreateVO request) {

        for (HoaDonChiTietVO hoaDonChiTietRequest : request.getHoaDonChiTiet()) {
            Integer idSanPhamChiTiet = hoaDonChiTietRequest.getId();
            Integer soLuongYeuCau = hoaDonChiTietRequest.getSoLuong();
            ChiTietSanPham chiTietSanPham = chiTietSanPhamRepository.findById(idSanPhamChiTiet)
                    .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
            if (chiTietSanPham.getSoLuong() < soLuongYeuCau) {
                throw new AppException(ErrorCode.INSUFFICIENT_QUANTITY);
            }
        } // Hết vòng lặp kiểm tra ban đầu
        NhanVien nhanVienDuocGanVaoHoaDon = null;
        HoaDon hoaDon = new HoaDon();

        if (request.getIdNhanVien() != null) {
            nhanVienDuocGanVaoHoaDon = nhanVienRepository.findById(request.getIdNhanVien())
                    .orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));
            hoaDon.setNhanVien(nhanVienDuocGanVaoHoaDon);
        }

        String nguoiThucHienKhoiTao;
        if (nhanVienDuocGanVaoHoaDon != null) {
            nguoiThucHienKhoiTao = nhanVienDuocGanVaoHoaDon.getHoVaTen();
        } else if (request.getIdKhachHang() != null) {
            KhachHang khachHang = khachHangRepository.findById(request.getIdKhachHang())
                    .orElseThrow(() -> new AppException(ErrorCode.CUSTOMER_NOT_FOUND));
            hoaDon.setKhachHang(khachHang);
            nguoiThucHienKhoiTao = khachHang.getTenKhachHang();
        } else {
            nguoiThucHienKhoiTao = "Hệ thống/Khách lẻ";
        }

        if (request.getIdKhachHang() != null) {
            KhachHang khachHang = khachHangRepository.findById(request.getIdKhachHang())
                    .orElseThrow(() -> new AppException(ErrorCode.CUSTOMER_NOT_FOUND));
            hoaDon.setKhachHang(khachHang);
            // Kiểm tra loại hóa đơn
            if ("Tại quầy".equals(request.getLoaiHoaDon())) {
                hoaDon.setLoaiHoaDon("Tại quầy");
                // Kiểm tra nếu chọn giao hàng khi thanh toán tại quầy
                if (request.getDiaChi() != null && !request.getDiaChi().isEmpty()) {
                    // Chọn giao hàng: Chuyển trạng thái thành "Chờ xác nhận"
                    hoaDon.setTrangThai(TrangThai.TAO_DON_HANG);
                    hoaDon.setPhiVanChuyen(30000);
                    hoaDon.setSdt(request.getSdt());
                    hoaDon.setDiaChi(request.getDiaChi());
                    hoaDon.setNgayTao(LocalDateTime.now());
                    hoaDon.setTenKhachHang(khachHang.getTenKhachHang());
                    hoaDon.setNgayGiaoDuKien(LocalDateTime.now().plusDays(3));
                } else {
                    // Thanh toán ngay tại quầy
                    hoaDon.setNgayTao(LocalDateTime.now());
                    hoaDon.setTrangThai(TrangThai.HOAN_THANH);
                    hoaDon.setTenKhachHang(khachHang.getTenKhachHang());
                    hoaDon.setPhiVanChuyen(30000);
                    hoaDon.setSdt(khachHang.getSdt());
                    hoaDon.setDiaChi(null);
                }
            } else { // Bán online
                hoaDon.setLoaiHoaDon("online");
                hoaDon.setPhiVanChuyen(30000);
                hoaDon.setTrangThai(TrangThai.TAO_DON_HANG);
                hoaDon.setTenKhachHang(khachHang.getTenKhachHang());
                hoaDon.setSdt(request.getSdt());
                hoaDon.setDiaChi(request.getDiaChi());
                hoaDon.setNgayTao(LocalDateTime.now());
                hoaDon.setNgayGiaoDuKien(LocalDateTime.now().plusDays(3));
            }
        } else {
            // Không có idKhachHang: Khách lẻ, mặc định bán tại quầy
            hoaDon.setLoaiHoaDon("Tại quầy");
            hoaDon.setNgayTao(LocalDateTime.now());
            hoaDon.setPhiVanChuyen(0);
            hoaDon.setTrangThai(TrangThai.HOAN_THANH);
            hoaDon.setTenKhachHang("Khách lẻ"); // Không lưu thông tin khách
            hoaDon.setSdt(null);
            hoaDon.setDiaChi(null);
        }
        // Khởi tạo các trường tổng tiền bằng 0.0 trước khi lưu lần đầu
        hoaDon.setTongTienBanDau(0);
        hoaDon.setTongTien(0);
        hoaDon.setTongHoaDon(0);
        hoaDonRepository.save(hoaDon);

        String formattedId = String.format("%05d", hoaDon.getId());
        String maHoaDon = "HD-" + formattedId;
        lichSuHoaDonService.ghiNhanLichSuHoaDon(
                hoaDon,
                "Hóa đơn được tạo với trạng thái: " + hoaDon.getTrangThai().getDisplayName(),
                nguoiThucHienKhoiTao, // Người thực hiện được xác định ở trên
                "Tạo hóa đơn ban đầu",
                hoaDon.getTrangThai()
        );
        Integer calculatedTongTienBanDau = 0;

        for (HoaDonChiTietVO hoaDonChiTiet : request.getHoaDonChiTiet()) {
            Integer idSanPhamChiTiet = hoaDonChiTiet.getId();
            Integer soLuongYeuCau = hoaDonChiTiet.getSoLuong();

            ChiTietSanPham chiTietSanPham = chiTietSanPhamRepository.findById(idSanPhamChiTiet)
                    .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

            HoaDonChiTiet newHoaDonChiTiet = new HoaDonChiTiet();
            newHoaDonChiTiet.setHoaDon(hoaDon);
            newHoaDonChiTiet.setSanPhamChiTiet(chiTietSanPham);
            newHoaDonChiTiet.setGia(chiTietSanPham.getGia());
            newHoaDonChiTiet.setSoLuong(soLuongYeuCau);
            Integer thanhTien =  soLuongYeuCau * chiTietSanPham.getGia();
            newHoaDonChiTiet.setThanhTien(thanhTien);
            hoaDonChiTietRepository.save(newHoaDonChiTiet);
            calculatedTongTienBanDau += thanhTien;

            // Cập nhật lại số lượng tồn kho của sản phẩm
            chiTietSanPham.setSoLuong(chiTietSanPham.getSoLuong() - soLuongYeuCau);
            chiTietSanPhamRepository.save(chiTietSanPham);
        }
        hoaDon.setTongTienBanDau(calculatedTongTienBanDau); // Tổng tiền của tất cả sản phẩm
        hoaDon.setTongTien(calculatedTongTienBanDau); // Tổng sau giảm giá (chưa có logic giảm giá nên bằng ban đầu)

        // Tổng hóa đơn cuối cùng = Tổng tiền sau giảm giá + Phí vận chuyển
        hoaDon.setTongHoaDon(hoaDon.getTongTien() + hoaDon.getPhiVanChuyen());
        hoaDon.setGhiChu(request.getGhiChu());
        hoaDon.setMaHoaDon(maHoaDon);
        hoaDonRepository.save(hoaDon); // Lưu lại HoaDon với các tổng tiền đã cập nhật

        HoaDonDTO hoaDonResponse = hoaDonMapper.toHoaDonResponse(hoaDon);

        hoaDonResponse.setDanhSachChiTiet(
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
                        }).collect(Collectors.toList()));

        return hoaDonResponse;

    }

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
    public CapNhatTrangThaiDTO capNhatTrangThaiHoaDon(Integer idHoaDon, TrangThai trangThaiMoi, String ghiChu, String nguoiThucHien) {
        HoaDon hoaDon = hoaDonRepository.findById(idHoaDon)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        TrangThai trangThaiCu = hoaDon.getTrangThai();

        // Kiểm tra nếu trạng thái không thay đổi
        if (trangThaiCu == trangThaiMoi) {
            throw new AppException(ErrorCode.NO_STATUS_CHANGE);
        }

        // Kiểm tra tính hợp lệ của việc chuyển đổi trạng thái
        // Đảm bảo TrangThai enum của bạn có logic canTransitionFrom mạnh mẽ để kiểm soát các chuyển đổi hợp lệ.
        if (!trangThaiMoi.canTransitionFrom(trangThaiCu)) {
            throw new AppException(ErrorCode.INVALID_STATUS_TRANSITION);
        }

        // --- ĐIỀU CHỈNH LOGIC XÁC ĐỊNH NGƯỜI THỰC HIỆN CẬP NHẬT TRẠNG THÁI ---
        // Nên lấy người thực hiện từ ngữ cảnh bảo mật (ví dụ: Spring Security) thay vì giả lập
        String nguoiThucHienThayDoi = nguoiThucHien != null ? nguoiThucHien : hoaDon.getNhanVien().getHoVaTen();

        hoaDon.setTrangThai(trangThaiMoi);
        HoaDon updatedHoaDon = hoaDonRepository.save(hoaDon);

        String noiDungThayDoi = String.format("Trạng thái hóa đơn thay đổi từ '%s' sang '%s'",
                trangThaiCu.getDisplayName(), trangThaiMoi.getDisplayName());

        // Ghi nhận lịch sử
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

        // Kiểm tra LÙI TRẠNG THÁI ở đây
        if (!trangThaiCu.canRevertTo(trangThaiMoi)) { // Kiểm tra lùi lại
            throw new AppException(ErrorCode.INVALID_STATUS_TRANSITION);
        }

        // ... (logic cập nhật và ghi lịch sử giống hệt phương thức trên) ...
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

        // 2. Tạo một đối tượng Pageable MỚI
        // Lấy thông tin trang và kích thước từ pageable gốc
        // và kết hợp với đối tượng sort mới của bạn
        Pageable newPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                sortByIdDesc
        );
        // 1. Tạo Specification dựa trên tất cả các tham số lọc
        Specification<HoaDon> spec = HoaDonSpecification.filterHoaDon(
                trangThai, loaiHoaDon, ngayTaoStart, ngayTaoEnd, searchTerm
        );

        // 2. Thực hiện truy vấn với Specification
        Page<HoaDon> hoaDonPage = hoaDonRepository.findAll(spec, newPageable);

        // 3. Map kết quả sang DTO và xử lý danh sách chi tiết (CHỈ MỘT LẦN)
        return hoaDonPage.map(this::convertToHoaDonResponseWithDetails); // Sử dụng một phương thức helper
    }

    @Override
    public Map<TrangThai, Long> getStatusCounts() {
        List<CountTrangThaiHoaDon> counts = hoaDonRepository.getCoutnTrangThaiHoaDon();
        // Chuyển List<StatusCountDTO> thành Map<String, Long>
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
    public HoaDonDTO updateHoaDon(HoaDonRequestUpdateVO hoaDonRequestUpdateVO) {
        // 1. Tìm hóa đơn hoặc ném lỗi nếu không tìm thấy
        HoaDon hoaDon = hoaDonRepository.findById(hoaDonRequestUpdateVO.getIdHoaDon())
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));


        HoaDonUpdateMapper.INSTANCE.updateHoaDon(hoaDon, hoaDonRequestUpdateVO);

        // 3. Cập nhật Khách Hàng (An toàn với kiểm tra null/rỗng)
        if (StringUtils.isNotEmpty(hoaDonRequestUpdateVO.getKhachHang())) {
            hoaDon.setKhachHang(khachHangRepository
                    .findById(Integer.valueOf(hoaDonRequestUpdateVO.getKhachHang())).orElse(null));
        } else {
            hoaDon.setKhachHang(null); // Đặt là null nếu không được cung cấp hoặc rỗng
        }
        NhanVien nhanVienThucHien = null; // Biến để lưu nhân viên cho việc ghi lịch sử
        if (StringUtils.isNotEmpty(hoaDonRequestUpdateVO.getNhanVien())) {
            nhanVienThucHien = nhanVienRepository
                    .findById(Integer.valueOf(hoaDonRequestUpdateVO.getNhanVien())).orElse(null);
            hoaDon.setNhanVien(nhanVienThucHien);
        } else {
            hoaDon.setNhanVien(null);
        }
        // 4. Cập nhật Nhân Viên (An toàn với kiểm tra null/rỗng)
        if (StringUtils.isNotEmpty(hoaDonRequestUpdateVO.getNhanVien())) {
            hoaDon.setNhanVien(nhanVienRepository
                    .findById(Integer.valueOf(hoaDonRequestUpdateVO.getNhanVien())).orElse(null));
        } else {
            hoaDon.setNhanVien(null);
        }

        // 5. Cập nhật Phiếu Giảm Giá (Đã sửa lỗi logic: Giả sử có getPhieuGiamGia() trong VO)
        // Nếu bạn muốn lấy ID phiếu giảm giá từ một trường khác, hãy điều chỉnh ở đây.
        if (StringUtils.isNotEmpty(hoaDonRequestUpdateVO.getPhieuGiamGia())) {
            hoaDon.setPhieuGiamGia(phieuGiamGiaRepository
                    .findById(Integer.valueOf(hoaDonRequestUpdateVO.getPhieuGiamGia())).orElse(null));
        } else {
            hoaDon.setPhieuGiamGia(null);
        }



        // 1. Tính tổng số tiền đã thanh toán. Đây là nguồn thông tin duy nhất để quyết định.
//    (Giả định hàm sumSoTienThanhToanByIdHoaDon trả về 0 nếu không có bản ghi nào)
        Integer tongTienDaTra = chiTietThanhToanRepository.sumSoTienThanhToanByIdHoaDon(hoaDon.getId());

// 2. Kiểm tra xem có bất kỳ chi tiết thanh toán nào được tạo ra không.
        if (tongTienDaTra > 0) {
            // KỊCH BẢN 1: CÓ THANH TOÁN -> Đây là giao dịch "Thanh toán ngay".

            // Kiểm tra xem số tiền thanh toán đã đủ so với tổng giá trị hóa đơn chưa.
            boolean daThanhToanDu = (tongTienDaTra.compareTo(hoaDon.getTongTien()) >= 0);

            if (daThanhToanDu) {
                // Nếu đủ tiền, đơn hàng hoàn thành.
                hoaDon.setTrangThai(TrangThai.HOAN_THANH);
            } else {
                // Nếu có thanh toán nhưng không đủ tiền -> Đây là một lỗi.
                // Không cho phép lưu và báo lỗi cho người dùng.
                throw new AppException(ErrorCode.NOT_YET_PAID);
            }
        } else {
            // KỊCH BẢN 2: KHÔNG CÓ THANH TOÁN (tổng tiền trả là 0).
            // -> Đây được coi là giao dịch "Thanh toán sau" (ví dụ: COD).
            hoaDon.setTrangThai(TrangThai.CHO_XAC_NHAN);
        }

// 3. Xử lý các thông tin phụ liên quan đến giao hàng
        boolean laDonGiaoHang = StringUtils.isNotEmpty(hoaDonRequestUpdateVO.getDiaChi());
        if (laDonGiaoHang && hoaDon.getTrangThai() == TrangThai.CHO_XAC_NHAN) {
            // Chỉ đặt ngày giao dự kiến khi là đơn giao hàng và đang ở trạng thái chờ xác nhận
            LocalDateTime ngayHienTai = LocalDate.now().atStartOfDay();
            LocalDateTime ngayGiaoDuKien = ngayHienTai.plusDays(3);
            hoaDon.setNgayGiaoDuKien(ngayGiaoDuKien);
        }

        String nguoiThucHienCapNhat;
        if (nhanVienThucHien != null) {
            nguoiThucHienCapNhat = nhanVienThucHien.getHoVaTen();
        } else {
            nguoiThucHienCapNhat = "Hệ thống";
        }
        HoaDon hoaDonDaLuu = hoaDonRepository.save(hoaDon);
        // b. Tạo nội dung cho lịch sử
        String ghiChuLichSu = "Hóa đơn đã được cập nhật.";
        // Bạn có thể làm cho nó chi tiết hơn, ví dụ: "Cập nhật trạng thái thành: " + hoaDonDaLuu.getTrangThai().getDisplayName()

        // c. Gọi service để ghi nhận lịch sử
        lichSuHoaDonService.ghiNhanLichSuHoaDon(
                hoaDonDaLuu,
                ghiChuLichSu,
                nguoiThucHienCapNhat,
                "Cập nhật thông tin hóa đơn",
                hoaDonDaLuu.getTrangThai()
        );
        // 7. Lưu hóa đơn đã cập nhật vào cơ sở dữ liệu và chuyển đổi sang DTO để trả về
        return HoaDonUpdateMapper.INSTANCE.toResponseDTO((hoaDonRepository.save(hoaDon)));
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






