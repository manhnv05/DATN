package com.example.datn.mapper.address;

import com.example.datn.DTO.address.AddressResponse;
import com.example.datn.Entity.DiaChi;
import com.example.datn.VO.address.AddressCreateRequest;
import com.example.datn.VO.address.AddressUpdateRequest;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AddressMapper {

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateDiaChiFromAddressUpdateRequest(
            AddressUpdateRequest addressUpdateRequest,
            @MappingTarget DiaChi diaChi
    );
    DiaChi toAddress(AddressUpdateRequest addressUpdateRequest);
    AddressResponse toAddressResponse(DiaChi diaChi);

    DiaChi toAddress(AddressCreateRequest addressCreateRequest);

    List<AddressResponse> toAddressResponseList(List<DiaChi> diaChis);
}
