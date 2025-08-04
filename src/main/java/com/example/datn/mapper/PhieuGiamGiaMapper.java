package com.example.datn.mapper;

import com.example.datn.dto.PhieuGiamGiaDTO;
import com.example.datn.entity.PhieuGiamGia;
import com.example.datn.vo.phieuGiamGiaVO.PhieuGiamGiaVO;
import com.example.datn.vo.phieuGiamGiaVO.PhieuGiamGiaVOUpdate;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

@Mapper
public interface PhieuGiamGiaMapper {
    PhieuGiamGiaMapper INSTANCE = Mappers.getMapper(PhieuGiamGiaMapper.class);

    PhieuGiamGia toPhieuGiamGia(PhieuGiamGiaVO request);

    void updatePhieuGiamGia(@MappingTarget PhieuGiamGia phieuGiamGia, PhieuGiamGiaVOUpdate request);

    PhieuGiamGiaDTO toResponse(PhieuGiamGia phieuGiamGia);
}
