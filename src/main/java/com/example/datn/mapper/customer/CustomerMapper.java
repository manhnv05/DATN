package com.example.datn.mapper.customer;

import com.example.datn.DTO.address.AddressResponse;
import com.example.datn.DTO.customer.CustomerDetailResponse;
import com.example.datn.DTO.customer.CustomerFilterResponse;
import com.example.datn.DTO.customer.CustomerResponse;
import com.example.datn.Entity.DiaChi;
import com.example.datn.Entity.KhachHang;
import com.example.datn.VO.customer.CustomerCreateRequest;
import com.example.datn.VO.customer.CustomerFilterRequest;
import com.example.datn.VO.customer.CustomerUpdateRequest;
import com.example.datn.mapper.address.AddressMapper;
import org.mapstruct.BeanMapping;
import org.mapstruct.Context;
import org.mapstruct.IterableMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring" , uses = AddressMapper.class)
public interface CustomerMapper {


    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "trangThai", source = "trangThai")
    void updateKhachHangFromCustomerUpdateRequest(
            CustomerUpdateRequest customerUpdateRequest,
            @MappingTarget KhachHang khachHang
    );

    KhachHang toKhachHang(CustomerCreateRequest customerCreateRequest);

    @Named("toCustomerResponse")
    @Mapping(target = "diaChiMacDinh", expression = "java(mapToDefaultAddress(khachHang.getDiaChis(), addressMapper))")
    CustomerResponse toCustomerResponse(KhachHang khachHang, @Context AddressMapper addressMapper);

    @IterableMapping(qualifiedByName = "toCustomerResponse")
     List<CustomerResponse> toCustomerResponseList(List<KhachHang> khachHangs, @Context AddressMapper addressMapper);

//    @Named("toCustomerResponseList")
//    default CustomerResponse toCustomerResponseListHelper(KhachHang khachHang, @Context AddressMapper addressMapper) {
//        return toCustomerResponse(khachHang, addressMapper);
//    }

    default AddressResponse mapToDefaultAddress(List<DiaChi> diaChis, AddressMapper addressMapper) {
        if (diaChis == null || diaChis.isEmpty()) {
            return null;
        }
        return diaChis.stream()
                .filter(diaChi -> "DEFAULT".equals(diaChi.getTrangThai()))
                .findFirst()
                .map(addressMapper::toAddressResponse)
                .orElse(null);
    }

    CustomerFilterResponse toCustomerFilterResponse(CustomerFilterRequest customerFilterRequest);

    @Named("toCustomerDetailResponse")
    @Mapping(target = "diaChis", expression = "java(addressMapper.toAddressResponseList(khachHang.getDiaChis()))")
    CustomerDetailResponse toCustomerDetailResponse(KhachHang khachHang, @Context AddressMapper addressMapper);
}
