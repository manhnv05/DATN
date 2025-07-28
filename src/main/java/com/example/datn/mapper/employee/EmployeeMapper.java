package com.example.datn.mapper.employee;

import com.example.datn.DTO.employee.EmployeeDetailResponse;
import com.example.datn.DTO.employee.EmployeeFilterResponse;
import com.example.datn.DTO.employee.EmployeeResponse;
import com.example.datn.Entity.NhanVien;
import com.example.datn.VO.employee.EmployeeCreateRequest;
import com.example.datn.VO.employee.EmployeeFilterRequest;
import com.example.datn.VO.employee.EmployeeUpdateRequest;
import org.mapstruct.BeanMapping;
import org.mapstruct.IterableMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring")
public interface EmployeeMapper {

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateNhanVienFromEmployeeUpdateRequest(
            EmployeeUpdateRequest employeeUpdateRequest,
            @MappingTarget NhanVien nhanVien
    );

    NhanVien toNhanVien(EmployeeCreateRequest employeeCreateRequest);

    EmployeeDetailResponse toEmployeeDetailResponse(NhanVien employee);

    @IterableMapping(qualifiedByName = "toEmployeeResponse")
    List<EmployeeResponse> toEmployeeResponseList(List<NhanVien> employees);

    @Named("toEmployeeResponse")
    EmployeeResponse toEmployeeResponse(NhanVien employee);

    EmployeeFilterResponse toEmployeeFilterResponse(EmployeeFilterRequest employeeFilterRequest);
}
