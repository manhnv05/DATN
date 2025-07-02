package com.example.datn.Service.impl;

import com.example.datn.DTO.CapNhatTrangThaiDTO;
import com.example.datn.DTO.CountTrangThaiHoaDon;
import com.example.datn.DTO.HoaDonChiTietDTO;
import com.example.datn.DTO.HoaDonChiTietView;
import com.example.datn.DTO.HoaDonDTO;
import com.example.datn.DTO.HoaDonHistoryDTO;
import com.example.datn.VO.HoaDonChiTietVO;
import com.example.datn.VO.HoaDonCreateVO;
import com.example.datn.VO.HoaDonUpdateVO;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
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
                .map(this::mapViewToResponse) // Gọi một hàm chuyển đổi riêng
                .collect(Collectors.toList());
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






