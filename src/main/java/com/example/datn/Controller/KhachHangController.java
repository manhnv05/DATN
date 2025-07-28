package com.example.datn.Controller;

import com.example.datn.DTO.ResponseData;
import com.example.datn.DTO.address.AddressResponse;
import com.example.datn.DTO.customer.CustomerDetailResponse;
import com.example.datn.DTO.customer.CustomerDuplicateCheckResponse;
import com.example.datn.DTO.customer.CustomerListResponse;
import com.example.datn.DTO.customer.CustomerResponse;
import com.example.datn.Service.DiaChiService;
import com.example.datn.Service.KhachHangService;
import com.example.datn.VO.address.AddressCreateRequest;
import com.example.datn.VO.address.AddressUpdateRequest;
import com.example.datn.VO.customer.CustomerCreateRequest;
import com.example.datn.VO.customer.CustomerDuplicateCheckRequest;
import com.example.datn.VO.customer.CustomerFilterRequest;
import com.example.datn.VO.customer.CustomerUpdateRequest;
import com.example.datn.VO.page.PageReq;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Validated
@RestController
@RequestMapping("/khachHang")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class KhachHangController {
    KhachHangService khachHangService;
    DiaChiService diaChiService;
    static final Logger logger = LoggerFactory.getLogger(KhachHangController.class);

    @PatchMapping("/{customerId}/diaChi/{id}")
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

    @PostMapping("/{customerId}/diaChi")
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

    @GetMapping("/{id}/diaChis")
    public ResponseData<List<AddressResponse>> getAddressesByCustomerId(@PathVariable Integer id) {
        return new ResponseData<>(
                HttpStatus.OK.value(),
                "Query addresses by customerId successful",
                diaChiService.getAddressesByCustomerId(id)
        );
    }

    @PatchMapping("/{customerId}/diaChi/{addressId}/setDefault")
    public ResponseData<AddressResponse> setDefaultAddress(
            @PathVariable @Min(value = 1, message = "Id khách hàng không hợp lệ") Integer customerId,
            @PathVariable @Min(value = 1, message = "Id địa chỉ không hợp lệ") Integer addressId
    ) {
        logger.info("Setting default address for customerId: {}, addressId: {}", customerId, addressId);
        return new ResponseData<>(
                HttpStatus.OK.value(),
                "Set default address successfully",
                diaChiService.setDefaultAddress(customerId, addressId)
        );
    }

    // ✅ Thêm endpoint để xóa địa chỉ
    @DeleteMapping("/{customerId}/diaChi/{addressId}")
    public ResponseData<Void> deleteAddress(
            @PathVariable @Min(value = 1, message = "Id địa chỉ không hợp lệ") Integer addressId
    ) {
        logger.info("Deleting address for , addressId: {}",  addressId);
        diaChiService.delete( addressId);
        return new ResponseData<>(
                HttpStatus.OK.value(),
                "Deleted address successfully",
                null
        );
    }

    //------------------- Customer Management ------------------
    @PatchMapping("/{id}")
    public ResponseData<CustomerResponse> update(
            @PathVariable @Min(value = 1, message = "Id khách hàng không hợp lệ") Integer id,
            @Valid @RequestBody CustomerUpdateRequest customerUpdateRequest
    ) {
        return new ResponseData<>(
                HttpStatus.OK.value(),
                "Updated customer successfully",
                khachHangService.update(id, customerUpdateRequest)
        );
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseData<CustomerResponse> addCustomer(
            @Valid @RequestPart("customerCreateRequest") CustomerCreateRequest customerCreateRequest,
            @Valid @RequestPart("addressCreateRequest") AddressCreateRequest addressCreateRequest
    ) {
        return new ResponseData<>(
                HttpStatus.CREATED.value(),
                "Added customer successfully",
                khachHangService.save(customerCreateRequest, addressCreateRequest)
        );
    }

    @PostMapping("/check-duplicate")
    public ResponseData<CustomerDuplicateCheckResponse> checkDuplicate(
            @Valid @RequestBody CustomerDuplicateCheckRequest request
    ) {
        CustomerDuplicateCheckResponse response = khachHangService.checkDuplicate(request);
        String message = response.isHasDuplicate()
                ? "Phát hiện thông tin trùng lặp"
                : "Thông tin không bị trùng lặp";

        return new ResponseData<>(
                HttpStatus.OK.value(),
                message,
                response
        );
    }

    @GetMapping("/{id}")
    public ResponseData<CustomerDetailResponse> getById(
            @PathVariable @Min(value = 1, message = "Id khách hàng không hợp lệ") Integer id
    ) {
        return new ResponseData<>(
                HttpStatus.OK.value(),
                "Query customer by ID: " + id + " successful",
                khachHangService.getById(id)
        );
    }

    @GetMapping
    public ResponseData<CustomerListResponse> query(
            @Valid @ModelAttribute PageReq pageReq,
            @Valid @ModelAttribute CustomerFilterRequest customerFilterRequest
    ) {
        return new ResponseData<>(
                HttpStatus.OK.value(),
                "Query successful",
                khachHangService.getFilteredCustomer(customerFilterRequest, pageReq)
        );
    }


}