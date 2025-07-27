package com.example.datn.DTO.employee;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EmployeeFilterResponse {
    String filterByEmployeeName;
    String filterByGender;
    String filterByStatus;
    String filterByPhoneNumber;
    Integer minAge;
    Integer maxAge;
}