package com.example.datn.Service;

import com.example.datn.DTO.employee.EmployeeDetailResponse;
import com.example.datn.DTO.employee.EmployeeDuplicateCheckResponse;
import com.example.datn.DTO.employee.EmployeeFilterResponse;
import com.example.datn.DTO.employee.EmployeeListResponse;
import com.example.datn.DTO.employee.EmployeeResponse;
import com.example.datn.DTO.page.PaginationInfoResponse;
import com.example.datn.Entity.NhanVien;
import com.example.datn.Repository.NhanVienRepository;
import com.example.datn.Service.impl.EmailService;
import com.example.datn.VO.employee.EmployeeCreateRequest;
import com.example.datn.VO.employee.EmployeeDuplicateCheckRequest;
import com.example.datn.VO.employee.EmployeeFilterRequest;
import com.example.datn.VO.employee.EmployeeUpdateRequest;
import com.example.datn.VO.page.PageReq;
import com.example.datn.exception.AppException;
import com.example.datn.exception.ErrorCode;
import com.example.datn.mapper.employee.EmployeeMapper;
import com.example.datn.utils.FilterCriteriaMapper;
import com.example.datn.utils.GenericSpecificationBuilder;
import com.example.datn.utils.PasswordGenerator;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class NhanVienService {
    Logger logger = LoggerFactory.getLogger(NhanVienService.class);
    NhanVienRepository employeeRepository;
    GenericSpecificationBuilder<NhanVien> specificationBuilder;
    EmployeeMapper employeeMapper;
    PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
    EmailService emailService;

    @Transactional
    public EmployeeDetailResponse update(Integer id, EmployeeUpdateRequest employeeUpdateRequest) {

        NhanVien existingEmployee = employeeRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        employeeMapper.updateNhanVienFromEmployeeUpdateRequest(employeeUpdateRequest, existingEmployee);
        //TODO: image? email? (liên quan bảo mật).
        logger.debug("Updating existingEmployee: {}", existingEmployee);
        return employeeMapper.toEmployeeDetailResponse(existingEmployee);
    }

    @Transactional
    public EmployeeDetailResponse save(EmployeeCreateRequest employeeCreateRequest) {
        logger.info("employeeCreateRequest: {}", employeeCreateRequest);
        NhanVien employee = employeeMapper.toNhanVien(employeeCreateRequest);

        //Generate Password
        String generatedPassword = PasswordGenerator.generatePassword();

        employee.setMaNhanVien(generateEmployeeCode());
        employee.setMatKhau(passwordEncoder.encode(generatedPassword));
        emailService.sendEmailToEmp(employee, generatedPassword);

        employee.setTrangThai("ACTIVE");

        //TODO: Xác định xem image lưu kiểu gì?

        logger.debug("Saving employee: {}", employee);
        employeeRepository.save(employee);
        return employeeMapper.toEmployeeDetailResponse(employee);
    }

    public EmployeeDetailResponse getById(Integer id) {
        NhanVien employee = employeeRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        logger.debug("Employee found: {}", employee);
        return employeeMapper.toEmployeeDetailResponse(employee);
    }

    //Build Specification + Pageable : Query --> Data --> Convert to Response
    public EmployeeListResponse getFilteredEmployees(EmployeeFilterRequest param, PageReq pageReq) {
        logger.info("param: {}, pageReq: {}", param, pageReq);
        Specification<NhanVien> spec = specificationBuilder.buildSpecification(param, FilterCriteriaMapper.forEmployee());

        Sort sort = Sort.by(pageReq.getSortDir().equalsIgnoreCase("asc") ?
                Sort.Direction.ASC : Sort.Direction.DESC, pageReq.getSortBy());
        PageRequest pageable = PageRequest.of(pageReq.getPageNo() - 1, pageReq.getPageSize(), sort);
        Page<NhanVien> page = employeeRepository.findAll(spec, pageable);

        logger.debug("page: {}", page.getContent());

        PaginationInfoResponse paginationResponse = convertToPaginationInfoResponse(page, pageReq);
        List<EmployeeResponse> customerResponses = employeeMapper.toEmployeeResponseList(page.getContent());
        EmployeeFilterResponse filterResponse = employeeMapper.toEmployeeFilterResponse(param);

        // Build EmployeeListResponse
        return EmployeeListResponse.builder()
                .employees(customerResponses)
                .pagination(paginationResponse)
                .filter(filterResponse)
                .build();
    }

    private PaginationInfoResponse convertToPaginationInfoResponse(Page<NhanVien> page, PageReq pageReq) {
        if (page == null || pageReq == null) return PaginationInfoResponse.builder().build();
        return PaginationInfoResponse.builder()
                .pageNo(page.getNumber() + 1)
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .sortBy(pageReq.getSortBy())
                .sortDir(pageReq.getSortDir())
                .build();
    }

    public String generateEmployeeCode() {
        long count = employeeRepository.count() + 1; // Tăng thêm 1 để lấy mã cho nhân viên mới
        if (count < 10) {
            return String.format("EMP-0%d", count);
        } else {
            return String.format("EMP-%d", count);
        }
    }

    /**
     * Kiểm tra trùng lặp thông tin nhân viên
     * @param request Thông tin cần kiểm tra
     * @return Kết quả kiểm tra trùng lặp
     */
    public EmployeeDuplicateCheckResponse checkDuplicate(EmployeeDuplicateCheckRequest request) {
        Integer id = request.getId();
        boolean emailDuplicate = (id == null)
            ? employeeRepository.existsByEmail(request.getEmail())
            : employeeRepository.existsByEmailAndIdNot(request.getEmail(), id);
        boolean phoneDuplicate = (id == null)
            ? employeeRepository.existsBySoDienThoai(request.getSoDienThoai())
            : employeeRepository.existsBySoDienThoaiAndIdNot(request.getSoDienThoai(), id);
        boolean cccdDuplicate = (id == null)
            ? employeeRepository.existsByCanCuocCongDan(request.getCanCuocCongDan())
            : employeeRepository.existsByCanCuocCongDanAndIdNot(request.getCanCuocCongDan(), id);
        
        // Tạo danh sách các trường bị trùng lặp
        List<String> duplicateFields = new ArrayList<>();
        if (emailDuplicate) duplicateFields.add("email");
        if (phoneDuplicate) duplicateFields.add("soDienThoai");
        if (cccdDuplicate) duplicateFields.add("canCuocCongDan");
        
        // Tạo thông báo lỗi
        String message = "";
        if (!duplicateFields.isEmpty()) {   
            if (duplicateFields.size() == 1) {  // Nếu có 1 trường bị trùng lặp thì:
                String field = duplicateFields.get(0);
                switch (field) {
                    case "email":
                        message = "Email đã tồn tại trong hệ thống";
                        break;
                    case "soDienThoai":
                        message = "Số điện thoại đã tồn tại trong hệ thống";
                        break;
                    case "canCuocCongDan":
                        message = "Căn cước công dân đã tồn tại trong hệ thống";
                        break;
                }
            } else {    // Nếu có nhiều trường bị trùng lặp thì:
                message = "Các trường sau đã tồn tại trong hệ thống: " + String.join(", ", duplicateFields);
            }
        }
        
        // Tạo thông tin chi tiết
        EmployeeDuplicateCheckResponse.DuplicateInfo duplicateInfo = EmployeeDuplicateCheckResponse.DuplicateInfo.builder()
                .emailDuplicate(emailDuplicate)
                .phoneDuplicate(phoneDuplicate)
                .cccdDuplicate(cccdDuplicate)
                .message(message)
                .build();
        
        // Trả về kết quả
        return EmployeeDuplicateCheckResponse.builder()
                .hasDuplicate(!duplicateFields.isEmpty())
                .duplicateFields(duplicateFields)
                .duplicateInfo(duplicateInfo)
                .build();
    }
}
