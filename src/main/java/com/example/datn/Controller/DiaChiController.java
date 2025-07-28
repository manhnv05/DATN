package com.example.datn.Controller;
//
import com.example.datn.DTO.DiaChiDTO;
import com.example.datn.DTO.ResponseData;
import com.example.datn.DTO.address.AddressResponse;
import com.example.datn.Service.DiaChiService;
import com.example.datn.VO.address.AddressCreateRequest;
import com.example.datn.VO.address.AddressUpdateRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/diaChi")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class DiaChiController {
    static final Logger logger = LoggerFactory.getLogger(DiaChiController.class);
    DiaChiService diaChiService;
    @PatchMapping("/{customerId}")
    public ResponseData<AddressResponse> updateAddress(
            @PathVariable @Min(value = 1, message = "Id khách hàng không hợp lệ") Integer customerId,
            @Valid @RequestBody AddressUpdateRequest addressUpdateRequest
    ) {
        logger.info("addressUpdateRequest: {}", addressUpdateRequest);
        return new ResponseData<>(
                HttpStatus.OK.value(),
                "Updated address successfully",
                diaChiService.update(customerId, addressUpdateRequest)
        );
    }

    @PostMapping("/{customerId}")
    public ResponseData<AddressResponse> addAddress(
            @PathVariable @Min(value = 1, message = "Id khách hàng không hợp lệ") Integer customerId,
            @Valid @RequestBody AddressCreateRequest addressCreateRequest
    ) {
        logger.info("addressCreateRequest: {}", addressCreateRequest);
        return new ResponseData<>(
                HttpStatus.CREATED.value(),
                "Added address successfully",
                diaChiService.save(customerId, addressCreateRequest)
        );
    }
    @GetMapping("/get-all-dia-chi-by-khach-hang/{idKhachHang}")
    public List<DiaChiDTO> getDiaChiByKhachHang(@PathVariable Integer idKhachHang) {
        return diaChiService.getAllDiaChiByIdKhachHang(idKhachHang);
    }
}