package com.example.datn.VO;

import com.example.datn.enums.Gender;
import com.example.datn.enums.TrangThai;
import com.example.datn.validator.EnumSubset;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public abstract class AbstractFilterRequest {
    @EnumSubset(enumClass = Gender.class, anyOf = {"MALE", "FEMALE"})
    @Schema(example = "MALE")
    String filterByGender;
    @EnumSubset(enumClass = TrangThai.class, anyOf = {"ACTIVE", "INACTIVE"})
    @Schema(example = "ACTIVE")
    String filterByStatus;

    @Schema(example = "0356789123")
    String filterByPhoneNumber;
    //    @Min(value = 18, message = "Tuổi tối thiểu phải lớn hơn hoặc bằng 18")
    @Schema(example = "18")
    Integer minAge;
    //    @Max(value = 150, message = "Tuổi tối đa không được vượt quá 150")
    @Schema(example = "150")
    Integer maxAge;

    public abstract String getFilterByName();
}

