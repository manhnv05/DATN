package com.example.datn.DTO.employee;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.sql.Date;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@SuperBuilder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EmployeeResponse {
    Integer id;
    String hinhAnh;
    String maNhanVien;
    String hoVaTen; String email;
    String soDienThoai;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    Date ngaySinh;
    String gioiTinh;
    String vaiTro;
    String diaChi;
    String trangThai;
}
