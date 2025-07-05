package com.example.datn.mapper;

import com.example.datn.dto.HoaDonHistoryDTO;
import com.example.datn.entity.LichSuHoaDon;
import com.example.datn.enums.TrangThai;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Mapper(componentModel = "spring")
public interface LichSuHoaDonMapper {
    @Mapping(target = "thoiGian", source = "thoiGianThayDoi")
    @Mapping(target = "nguoiChinhSua", source = "nguoiThucHien")
    @Mapping(target = "trangThaiHoaDon", source = "trangThaiMoiHoaDon", qualifiedByName = "mapTrangThaiDisplayName")
    @Mapping(target = "ghiChu", source = "ghiChu")

    HoaDonHistoryDTO toHoaDonHistoryResponse(LichSuHoaDon entity);

    default Timestamp toTimestamp(LocalDateTime localDateTime) {
        return localDateTime == null ? null : Timestamp.valueOf(localDateTime);
    }

    // Chuyển đổi từ Timestamp sang LocalDateTime (có thể bạn sẽ cần cho các mapping ngược lại)
    default LocalDateTime toLocalDateTime(Timestamp timestamp) {
        return timestamp == null ? null : timestamp.toLocalDateTime();
    }
    @Named("mapTrangThaiDisplayName")
    default String mapTrangThaiDisplayName(String trangThaiName) {
        if (trangThaiName == null) {
            return null;
        }
        try {

            return TrangThai.valueOf(trangThaiName).getDisplayName();
        } catch (IllegalArgumentException e) {

            System.err.println("Invalid TrangThai name found in DB for history: " + trangThaiName);
            return trangThaiName;
        }
    }
}
