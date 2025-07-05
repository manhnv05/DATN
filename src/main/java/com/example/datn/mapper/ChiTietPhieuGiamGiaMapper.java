package com.example.datn.mapper;

import com.example.datn.dto.ChiTietPhieuGiamGiaDTO;
import com.example.datn.entity.ChiTietPhieuGiamGia;
import com.example.datn.vo.chiTietPhieuGiamGiaVO.ChiTietPhieuGiamGiaUpdateVO;
import com.example.datn.vo.chiTietPhieuGiamGiaVO.ChiTietPhieuGiamGiaVO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

@Mapper
public interface ChiTietPhieuGiamGiaMapper {
    ChiTietPhieuGiamGiaMapper INSTANCE = Mappers.getMapper(ChiTietPhieuGiamGiaMapper.class);

    @Mapping(target = "phieuGiamGia.id", source = "phieuGiamGia")
    @Mapping(target = "khachHang.id", source = "khachHang")
    ChiTietPhieuGiamGia toPhieuGiamGiaKhachHang(ChiTietPhieuGiamGiaVO request);

    @Mapping(target = "phieuGiamGia.id", source = "phieuGiamGia")
    @Mapping(target = "khachHang.id", source = "khachHang")
    ChiTietPhieuGiamGia toPhieuGiamGiaKhachHangUpdate(ChiTietPhieuGiamGiaUpdateVO request);

    @Mapping(target = "phieuGiamGia.id", source = "phieuGiamGia")
    @Mapping(target = "khachHang.id", source = "khachHang")
    void updatePhieuGiamGiaKhachHang(@MappingTarget ChiTietPhieuGiamGia phieuGiamGiaKH, ChiTietPhieuGiamGiaUpdateVO request);

    ChiTietPhieuGiamGiaDTO toResponse(ChiTietPhieuGiamGia phieuGiamGiaKhachHang);
}
