package com.example.datn.specification;

import jakarta.persistence.criteria.Predicate;
import com.example.datn.entity.HoaDon;
import com.example.datn.enums.TrangThai;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

public class HoaDonSpecification {

public static Specification<HoaDon> filterHoaDon(
        TrangThai trangThai,
        String loaiHoaDon,
        LocalDate ngayTaoStart,
        LocalDate ngayTaoEnd,
        String searchTerm // Thêm tham số tìm kiếm chung
) {
    return (root, query, criteriaBuilder) -> {
        List<Predicate> predicates = new ArrayList<>();

        // 1. Áp dụng các bộ lọc cụ thể (trạng thái, loại hóa đơn, ngày)
        if (trangThai != null) {
            predicates.add(criteriaBuilder.equal(root.get("trangThai"), trangThai));
        }
        if (loaiHoaDon != null && !loaiHoaDon.isEmpty()) {
            predicates.add(criteriaBuilder.equal(root.get("loaiHoaDon"), loaiHoaDon));
        }
        if (ngayTaoStart != null) {
            LocalDateTime startOfDay = ngayTaoStart.atStartOfDay(); // Chuyển LocalDate thành LocalDateTime (00:00:00)
            predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("ngayTao"), startOfDay));
        }

        // Xử lý ngày kết thúc: đến 23:59:59.999... của ngày được chọn
        if (ngayTaoEnd != null) {
            LocalDateTime endOfDay = ngayTaoEnd.atTime(LocalTime.MAX); // Chuyển LocalDate thành LocalDateTime (23:59:59.999...)
            predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("ngayTao"), endOfDay));
        }

        // 2. Áp dụng tìm kiếm đa trường từ searchTerm
        if (searchTerm != null && !searchTerm.isEmpty()) {
            String likeSearchTerm = "%" + searchTerm.toLowerCase() + "%"; // Chuyển về chữ thường để tìm kiếm không phân biệt hoa thường

            Predicate searchPredicate = criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("maHoaDon")), likeSearchTerm), // Tìm theo mã hóa đơn
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("tenKhachHang")), likeSearchTerm), // Tìm theo tên khách hàng
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("sdt")), likeSearchTerm) // Tìm theo số điện thoại
                    // Thêm các trường khác nếu muốn tìm kiếm trên nhiều trường hơn
            );
            predicates.add(searchPredicate);
        }

        // Kết hợp tất cả các predicates với toán tử AND
        return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
    };
}
}
