package com.example.datn.Controller;

import com.example.datn.DTO.ResponseData;
import com.example.datn.DTO.employee.EmployeeDetailResponse;
import com.example.datn.DTO.employee.EmployeeDuplicateCheckResponse;
import com.example.datn.DTO.employee.EmployeeListResponse;
import com.example.datn.Service.NhanVienService;
import com.example.datn.VO.employee.EmployeeCreateRequest;
import com.example.datn.VO.employee.EmployeeDuplicateCheckRequest;
import com.example.datn.VO.employee.EmployeeFilterRequest;
import com.example.datn.VO.employee.EmployeeUpdateRequest;
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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/nhanVien")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class NhanVienController {

     NhanVienService nhanVienService;
     static final Logger logger = LoggerFactory.getLogger(NhanVienController.class);

    @PatchMapping("/{id}")
    public ResponseData<EmployeeDetailResponse> update(
            @PathVariable @Min(value = 1, message = "Id nhân viên không hợp lệ") Integer id,
            @Valid @RequestBody EmployeeUpdateRequest employeeUpdateRequest
    ) {
        logger.info("employeeRequest: {}", employeeUpdateRequest);
        return new ResponseData<>(
                HttpStatus.OK.value(),
                "Updated employee successfully",
                this.nhanVienService.update(id, employeeUpdateRequest)
        );
    }

    @PostMapping
    //(consumes = "multipart/form-data")
    //("employee")
    public ResponseData<?> addEmployee(
            @Valid @RequestBody EmployeeCreateRequest employeeCreateRequest
    ) {
        logger.info("employeeRequest: {}", employeeCreateRequest);
        return new ResponseData<>(HttpStatus.CREATED.value(),
                "Added employee successfully",
                this.nhanVienService.save(employeeCreateRequest)
        );
    }

    @GetMapping("/{id}")
    public ResponseData<EmployeeDetailResponse> getById(
            @PathVariable @Min(value = 1, message = "Id nhân viên không hợp lệ") Integer id
    ) {
        return new ResponseData<>(
                HttpStatus.OK.value(),
                "Query employee by ID: " + id + " successful",
                nhanVienService.getById(id)
        );
    }

    @GetMapping
    public ResponseData<EmployeeListResponse> query(
            @Valid @ModelAttribute PageReq pageReq,
            @Valid @ModelAttribute EmployeeFilterRequest param
    ) {
        return new ResponseData<>(
                HttpStatus.OK.value(),
                "Query successful",
                nhanVienService.getFilteredEmployees(param, pageReq)
        );
    }

    @PostMapping("/check-duplicate")
    public ResponseData<EmployeeDuplicateCheckResponse> checkDuplicate(
            @Valid @RequestBody EmployeeDuplicateCheckRequest request
    ) {
        logger.info("Checking duplicate for employee: {}", request);
        EmployeeDuplicateCheckResponse response = nhanVienService.checkDuplicate(request);
        
        String message = response.isHasDuplicate() 
                ? "Phát hiện thông tin trùng lặp" 
                : "Thông tin không bị trùng lặp";
        
        return new ResponseData<>(
                HttpStatus.OK.value(),
                message,
                response
        );
    }
}