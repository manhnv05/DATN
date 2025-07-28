package com.example.datn.DTO.customer;

import com.example.datn.DTO.address.AddressResponse;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

import java.util.Date;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@SuperBuilder
@ToString
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CustomerDetailResponse {
    Integer id;
    String hinhAnh;
    String maKhachHang;
    String tenKhachHang;
    String email;
    String sdt;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    Date ngaySinh;
    String gioiTinh;
    List<AddressResponse> diaChis;
    String trangThai;
} 