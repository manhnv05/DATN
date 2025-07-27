package com.example.datn.VO.address;

import com.example.datn.enums.TrangThai;
import com.example.datn.validator.EnumSubset;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@ToString
public class AddressCreateRequest {
    @NotBlank(message = "Tỉnh/Thành phố không được để trống")
    @Size(max = 100, message = "Tỉnh/Thành phố tối đa 100 ký tự")
    @Schema(description = "Tỉnh/Thành phố", example = "Hà Nội")
    String tinhThanhPho;

    @NotBlank(message = "Quán/Huyện không được để trống")
    @Size(max = 100, message = "Quán/Huyện tối đa 100 ký tự")
    @Schema(description = "Quận/Huyện", example = "Cầu Giấy")
    String quanHuyen;

    @NotBlank(message = "Xã/Phường không được để trống")
    @Size(max = 100, message = "Xã/Phường tối đa 100 ký tự")
    @Schema(description = "Xã/Phường", example = "Dịch Vọng")
    String xaPhuong;

    @EnumSubset(enumClass = TrangThai.class, anyOf = {"DEFAULT"}, message = "Giá trị trạng thái không hợp lệ, vui lòng F5 lại trang")
    @Schema(description = "Trạng thái địa chỉ (chỉ nhận giá trị DEFAULT)", example = "DEFAULT")
    String trangThai;
}
