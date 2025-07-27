package com.example.datn.DTO.employee;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmployeeDuplicateCheckResponse {
    
    @Schema(description = "Có trùng lặp hay không")
    boolean hasDuplicate;
    
    @Schema(description = "Danh sách các trường bị trùng lặp")
    List<String> duplicateFields;
    
    @Schema(description = "Thông tin chi tiết về trùng lặp")
    DuplicateInfo duplicateInfo;
    
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class DuplicateInfo {
        @Schema(description = "Email có bị trùng không")
        boolean emailDuplicate;
        
        @Schema(description = "Số điện thoại có bị trùng không")
        boolean phoneDuplicate;
        
        @Schema(description = "CCCD có bị trùng không")
        boolean cccdDuplicate;
        
        @Schema(description = "Thông báo lỗi cụ thể")
        String message;
    }
} 