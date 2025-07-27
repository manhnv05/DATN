package com.example.datn.validator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Documented
@Constraint(validatedBy = EnumSubsetValidator.class)
@Target({ ElementType.FIELD, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
public @interface EnumSubset {

    //Chỉ định lớp Enum mà annotation sẽ validate (ví dụ: Status.class).
    Class<? extends Enum<?>> enumClass();

    //Chỉ định một tập hợp con của các giá trị Enum được phép (dưới dạng chuỗi).
    // anyOf = {"ACTIVE", "INACTIVE"}
    String[] anyOf(); // (2)

    String message() default "must be one of {enumClass} values: {anyOf}";
    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
