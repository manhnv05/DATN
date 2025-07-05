package com.example.datn.Controller;

import com.example.datn.DTO.ApiResponse;
import com.example.datn.DTO.CapNhatTrangThaiDTO;
import com.example.datn.DTO.HoaDonChiTietDTO;
import com.example.datn.DTO.HoaDonDTO;
import com.example.datn.DTO.HoaDonHistoryDTO;
import com.example.datn.VO.HoaDonCreateVO;
import com.example.datn.VO.HoaDonUpdateStatusVO;
import com.example.datn.VO.HoaDonUpdateVO;
import com.example.datn.VO.LichSuVO;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import com.example.datn.enums.TrangThai;
import com.example.datn.Service.HoaDonService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000" +
        "")
@RestController
@RequestMapping("/api/hoa-don")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class HoaDonController {
    HoaDonService hoaDonService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<HoaDonDTO>> createHoaDon(@RequestBody @Valid HoaDonCreateVO request) {
        HoaDonDTO hoaDonResponse = hoaDonService.taoHoaDon(request);

        ApiResponse<HoaDonDTO> response = ApiResponse.<HoaDonDTO>builder()
                .code(1000)
                .message("Hóa đơn đã được tạo thành công")
                .data(hoaDonResponse)
                .build();

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public HoaDonDTO getHoaDonDetails(@PathVariable Integer id) {
        return hoaDonService.getHoaDonById(id);
    }

    @GetMapping("/lich-su/{maHoaDon}")
    public List<HoaDonHistoryDTO> getHoaDonHistory(@PathVariable("maHoaDon") String maHoaDon) {
        return hoaDonService.layLichSuThayDoiTrangThai(maHoaDon);
    }

    @PutMapping("/trang-thai/{id}")
    public CapNhatTrangThaiDTO updateHoaDonStatus(@PathVariable Integer id, @RequestBody @Validated HoaDonUpdateStatusVO request) {
        // Tham số 'nguoiThucHien' này sẽ được Service tự quyết định dựa trên HoaDon.getNhanVien()
        String nguoiThucHienPlaceholder = "Nhân viên A"; // Giá trị giả lập
        return hoaDonService.capNhatTrangThaiHoaDon(id, request.getTrangThaiMoi(), request.getGhiChu(), nguoiThucHienPlaceholder);
    }

    @GetMapping
    public ApiResponse<Page<HoaDonDTO>> getAllHoaDon(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) TrangThai trangThai,
            @RequestParam(required = false) String loaiHoaDon,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngayTaoStart,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngayTaoEnd,
            @RequestParam(required = false) String searchTerm) { // Thêm searchTerm vào đây

        Pageable pageable = PageRequest.of(page, size);
        Page<HoaDonDTO> hoaDonPage = hoaDonService.getFilteredHoaDon(
                trangThai, loaiHoaDon, ngayTaoStart, ngayTaoEnd,
                searchTerm,
                pageable
        );

        return ApiResponse.<Page<HoaDonDTO>>builder()
                .code(HttpStatus.OK.value())
                .message("Lấy danh sách hóa đơn thành công")
                .data(hoaDonPage)
                .build();
    }

    @GetMapping("/status-counts")
    public ResponseEntity<ApiResponse<Map<TrangThai, Long>>> getStatusCounts() {
        Map<TrangThai, Long> counts = hoaDonService.getStatusCounts();
        ApiResponse<Map<TrangThai, Long>> response = ApiResponse.<Map<TrangThai, Long>>builder()
                .code(1000)
                .message("Hóa đơn đã được tạo thành công")
                .data(counts)
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PutMapping("/chuyen-trang-thai-tiep-theo/{id}") // Changed to PUT mapping
    public ResponseEntity<CapNhatTrangThaiDTO> chuyenTrangThaiTiepTheo(
            @PathVariable("id") Integer idHoaDon,
            @RequestBody LichSuVO request) {

        CapNhatTrangThaiDTO response = hoaDonService.chuyenTrangThaiTiepTheo(
                idHoaDon,
                request.getGhiChu(),
                request.getNguoiThucHien()
        );
        return ResponseEntity.ok(response);
    }

    @PutMapping("/chuyen-trang-thai-quay-lai/{id}") // Changed to PUT mapping
    public ResponseEntity<CapNhatTrangThaiDTO> chuyenTrangThaiQuayLai(
            @RequestBody LichSuVO request,
            @PathVariable ("id") Integer id) {
        CapNhatTrangThaiDTO response = hoaDonService.quayLaiTrangThaiTruoc(
                id,
                request.getGhiChu(),
                request.getNguoiThucHien());
        return ResponseEntity.ok(response);
    };




    @PutMapping("/chuyen-trang-thai-huy/{id}") // Changed to PUT mapping
    public ResponseEntity<CapNhatTrangThaiDTO> chuyenTrangThaiHuy(
            @PathVariable("id") Integer idHoaDon,
            @RequestBody LichSuVO request) {

        CapNhatTrangThaiDTO response = hoaDonService.huyHoaDon(
                idHoaDon,
                request.getGhiChu(),
                request.getNguoiThucHien()
        );
        return ResponseEntity.ok(response);
    }

    @PutMapping("/cap-nhat-thong-tin/{id}")
    public ResponseEntity<ApiResponse<Void>> updateHoaDonInfo(
            @PathVariable Integer id,
            @RequestBody @Valid HoaDonUpdateVO request) {

        // Gọi service. Nếu service ném AppException, nó sẽ được GlobalExceptionHandler xử lý
        String successMessage = hoaDonService.capNhatThongTinHoaDon(id, request);

        // Nếu service trả về thành công, xây dựng ApiResponse thành công
        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .code(1000) // Code thành công của bạn
                .message(successMessage) // Lấy thông báo từ service
                .build();
        return new ResponseEntity<>(apiResponse, HttpStatus.OK); // Trả về 200 OK
    }
    @GetMapping("/{idHoaDon}/san-pham")
    public ResponseEntity<ApiResponse<List<HoaDonChiTietDTO>>> getHoaDonChiTietResponse(@PathVariable Integer idHoaDon) {
        List<HoaDonChiTietDTO> hoaDonChiTietResponseList = hoaDonService.findChiTietHoaDon(idHoaDon);

        ApiResponse<List<HoaDonChiTietDTO>> apiResponse= ApiResponse.<List<HoaDonChiTietDTO>>builder()
                .code(1000)
                .message("Lấy danh sách sản phẩm của hóa đơn thành công")
                .data(hoaDonChiTietResponseList)
                .build();
        return ResponseEntity.ok(apiResponse);

    }
}
