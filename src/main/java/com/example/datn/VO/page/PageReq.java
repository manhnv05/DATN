package com.example.datn.VO.page;


import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.FieldDefaults;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
@ToString
public class PageReq {
    @Min(value = 1, message = "Trang bắt đầu phải từ 1 trở lên")
    @Schema(example = "1")
    Integer pageNo = 1;

    @Min(value = 5, message = "Kích thước trang tối thiểu là 5")
    @Schema(example = "5")
    Integer pageSize = 5;

    @Pattern(
            regexp = "id|hoVaTen|tenKhachHang|ngaySinh",//Do kh sắp xếp theo tenKhachHang. 
            flags = Pattern.Flag.CASE_INSENSITIVE,
            message = "Chỉ được sắp xếp theo: 'id', 'hoVaTen', 'tenKhachHang' hoặc 'ngaySinh'"
    )
    @Schema(example = "id")
    String sortBy = "id";

    @Pattern(
            regexp = "asc|desc",
            flags = Pattern.Flag.CASE_INSENSITIVE,
            message = "Thứ tự sắp xếp phải là 'asc' (tăng dần) hoặc 'desc' (giảm dần)"
    )
    @Schema(example = "desc")
    String sortDir = "desc";
}
