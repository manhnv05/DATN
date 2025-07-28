package com.example.datn.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

public class EnumSubsetValidator implements ConstraintValidator<EnumSubset, String> {
    // Xử lý validation cho annotation @EnumSubset và áp dụng cho các giá trị kiểu String.
    private Set<String> allowed; //danh sách các giá trị hợp lệ (từ anyOf)

    @Override
    public void initialize(EnumSubset constraintAnnotation) {
        allowed = new HashSet<>(Arrays.asList(constraintAnnotation.anyOf()));
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) return true;
        return allowed.contains(value);
    }
}
