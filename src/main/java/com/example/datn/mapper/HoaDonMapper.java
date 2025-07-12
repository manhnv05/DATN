package com.example.datn.mapper;

import com.example.datn.DTO.HoaDonDTO;
import com.example.datn.Entity.HoaDon;
import com.example.datn.VO.HoaDonCreateVO;
import com.example.datn.VO.HoaDonRequestUpdateVO;
import org.mapstruct.*;

@Mapper(
        componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface HoaDonMapper {

    // Phương thức ánh xạ từ Request DTO sang Entity
    // Các trường set thủ công trong service nên được bỏ qua ở đây
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "khachHang", ignore = true)
    @Mapping(target = "nhanVien", ignore = true)
    @Mapping(target = "trangThai", ignore = true)
    @Mapping(target = "ngayTao", ignore = true)
    @Mapping(target = "ngayGiaoDuKien", ignore = true)
    @Mapping(target = "phiVanChuyen", ignore = true)
    @Mapping(target = "tongTien", ignore = true)
    @Mapping(target = "tongTienBanDau", ignore = true)
    @Mapping(target = "tongHoaDon", ignore = true)
    @Mapping(target = "tenKhachHang", ignore = true) // Cần ignore nếu bạn set thủ công tên khách lẻ trong service
    HoaDon toHoaDon(HoaDonCreateVO request);


    // Phương thức ánh xạ từ Entity HoaDon đã lưu sang Response DTO
    // Đảm bảo ánh xạ đầy đủ tất cả các trường bạn muốn hiển thị trong HoaDonResponse
    @Mapping(source = "id", target = "id")
    @Mapping(source = "ngayTao", target = "ngayTao")
    @Mapping(source = "ngayGiaoDuKien", target = "ngayGiaoDuKien")
    @Mapping(source = "loaiHoaDon", target = "loaiHoaDon")
    @Mapping(source = "sdt", target = "sdt")
    @Mapping(source = "diaChi", target = "diaChi")
    @Mapping(source = "ghiChu", target = "ghiChu")
    @Mapping(source = "trangThai", target = "trangThai")
    @Mapping(source = "tongTien", target = "tongTien")
    @Mapping(source = "tongTienBanDau", target = "tongTienBanDau")
    @Mapping(source = "phiVanChuyen", target = "phiVanChuyen")
    @Mapping(source = "tongHoaDon", target = "tongHoaDon")
    @Mapping(source = "maHoaDon", target = "maHoaDon")



    // Map tenKhachHang: Nếu có thực thể khách hàng, lấy tên từ đó. Nếu không (khách lẻ), lấy từ trường tenKhachHang trực tiếp của HoaDon Entity.
    @Mapping(target = "tenKhachHang", expression = "java(hoaDon.getKhachHang() != null ? hoaDon.getTenKhachHang() : \"Khách lẻ\")")
    // Map tenNhanVien: Nếu có thực thể nhân viên, lấy tên từ đó. Nếu không, trả về null.
    @Mapping(target = "tenNhanVien", expression = "java(hoaDon.getNhanVien() != null ? hoaDon.getNhanVien().getHoVaTen() : null)")
    HoaDonDTO toHoaDonResponse(HoaDon hoaDon);


}
