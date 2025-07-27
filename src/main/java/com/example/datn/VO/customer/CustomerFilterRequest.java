package com.example.datn.VO.customer;

import com.example.datn.VO.AbstractFilterRequest;
import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
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
public class CustomerFilterRequest extends AbstractFilterRequest {
    @Size(max = 50, message = "Tên khách hàng không được vượt quá 50 ký tự")
    @Schema(example = "Nguyễn Văn A")
    String filterByCustomerName;
    @Override
    public String getFilterByName() {
        return filterByCustomerName;
    }
}
