package com.example.datn.mapper;


import com.example.datn.DTO.HoaDonDTO;
import com.example.datn.Entity.HoaDon;
import com.example.datn.VO.HoaDonRequestUpdateVO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

@Mapper
public interface HoaDonUpdateMapper {
    HoaDonUpdateMapper INSTANCE = Mappers.getMapper(HoaDonUpdateMapper.class);

    HoaDonDTO toResponseDTO(HoaDon hoaDon);

    @Mapping(target = "khachHang", ignore = true)
    @Mapping(target = "nhanVien", ignore = true)
    @Mapping(target = "phieuGiamGia", ignore = true)
    void updateHoaDon(@MappingTarget HoaDon hoaDon, HoaDonRequestUpdateVO hoaDonRequestUpdateVO);
}
