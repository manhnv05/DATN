package com.example.datn.mapper;

import com.example.datn.dto.HoaDonChiTietDTO;
import com.example.datn.entity.HoaDonChiTiet;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE // Bỏ qua các trường null từ nguồn
)
public interface HoaDonChiTietMapper {
    HoaDonChiTietDTO toDTO(HoaDonChiTietDTO hoaDonChiTietDTO);
    List<HoaDonChiTietDTO> toDtoList(List<HoaDonChiTiet> entities);
}
