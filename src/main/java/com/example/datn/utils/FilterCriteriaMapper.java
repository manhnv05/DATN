package com.example.datn.utils;

import lombok.Getter;
/**
 * Dùng để ánh xạ tên trường filter từ DTO sang tên trường trong entity,
 * hỗ trợ tạo Predicate trong Specification.
 * 📌 Ví dụ:
 * - DTO: `filterByEmployeeName`
 * - Entity: `employeeName`
 * → Dùng `mapper.getNameField()` lấy tên trường entity tương ứng (`employeeName`)
 */
public record FilterCriteriaMapper(@Getter String nameField, @Getter String genderField, @Getter String statusField,
                                   @Getter String phoneNumberField, @Getter String birthDateField) {
    public static FilterCriteriaMapper forEmployee() {
        return new FilterCriteriaMapper("hoVaTen", "gioiTinh", "trangThai", "soDienThoai", "ngaySinh");
    }
    public static FilterCriteriaMapper forCustomer() {
        return new FilterCriteriaMapper("tenKhachHang", "gioiTinh", "trangThai", "sdt", "ngaySinh");
    }
}