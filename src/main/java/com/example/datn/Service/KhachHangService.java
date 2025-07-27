package com.example.datn.Service;

import com.example.datn.DTO.customer.CustomerDetailResponse;
import com.example.datn.DTO.customer.CustomerDuplicateCheckResponse;
import com.example.datn.DTO.customer.CustomerFilterResponse;
import com.example.datn.DTO.customer.CustomerListResponse;
import com.example.datn.DTO.customer.CustomerResponse;
import com.example.datn.DTO.page.PaginationInfoResponse;
import com.example.datn.Entity.DiaChi;
import com.example.datn.Entity.KhachHang;
import com.example.datn.Repository.KhachHangRepository;
import com.example.datn.VO.address.AddressCreateRequest;
import com.example.datn.VO.customer.CustomerCreateRequest;
import com.example.datn.VO.customer.CustomerDuplicateCheckRequest;
import com.example.datn.VO.customer.CustomerFilterRequest;
import com.example.datn.VO.customer.CustomerUpdateRequest;
import com.example.datn.VO.page.PageReq;
import com.example.datn.exception.AppException;
import com.example.datn.exception.ErrorCode;
import com.example.datn.mapper.address.AddressMapper;
import com.example.datn.mapper.customer.CustomerMapper;
import com.example.datn.utils.FilterCriteriaMapper;
import com.example.datn.utils.GenericSpecificationBuilder;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class KhachHangService {

    Logger logger = LoggerFactory.getLogger(KhachHangService.class);
    KhachHangRepository customerRepository;
    GenericSpecificationBuilder<KhachHang> specificationBuilder;
    CustomerMapper customerMapper;
    AddressMapper addressMapper;

    @Transactional
    public CustomerResponse update(Integer id, CustomerUpdateRequest customerCreateRequest) {
        KhachHang existingCustomer = customerRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));

        customerMapper.updateKhachHangFromCustomerUpdateRequest(customerCreateRequest, existingCustomer);
        logger.info("Updating existing customer: {}", existingCustomer);
        return customerMapper.toCustomerResponse(existingCustomer, addressMapper);
    }

    @Transactional
    public CustomerResponse save(CustomerCreateRequest customerCreateRequest , AddressCreateRequest addressCreateRequest) {
        KhachHang customer = customerMapper.toKhachHang(customerCreateRequest);
        //TODO: Cẩn set MK cho KH k? logic nghiệp vụ.
        customer.setMaKhachHang(generateCustomerCode());
        customer.setTrangThai("ACTIVE");

        DiaChi address = addressMapper.toAddress(addressCreateRequest);
        address.setKhachHang(customer);
        address.setTrangThai("DEFAULT");
        customer.setDiaChis(List.of(address));

        KhachHang savedCustomer = customerRepository.save(customer);
        logger.info("Address after save: {}", savedCustomer.getDiaChis()); // Log để kiểm tra

        //TODO:  customerResponse dưới để log ra thôi, sau thì xóa đi.
        CustomerResponse customerResponse = customerMapper.toCustomerResponse(customer, addressMapper);
        logger.info("customerResponse saved: {}", customerResponse);
        return customerMapper.toCustomerResponse(customer, addressMapper);
    }

    public CustomerDetailResponse getById(Integer id) {
        KhachHang customer = customerRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        logger.info("Customer found: {}", customer);
        return customerMapper.toCustomerDetailResponse(customer, addressMapper);
    }

    public CustomerListResponse getFilteredCustomer(CustomerFilterRequest param, PageReq pageReq) {
        Specification<KhachHang> spec = specificationBuilder
                .buildSpecification(param, FilterCriteriaMapper.forCustomer());

        String sortField = pageReq.getSortBy();
        if ("hoVaTen".equalsIgnoreCase(sortField)) {
            sortField = "tenKhachHang";
        }
        Sort sort = Sort.by(pageReq.getSortDir().equalsIgnoreCase("asc") ?
                Sort.Direction.ASC : Sort.Direction.DESC, sortField);

        PageRequest pageable = PageRequest.of(pageReq.getPageNo() - 1, pageReq.getPageSize(), sort);
        Page<KhachHang> page = customerRepository.findAll(spec, pageable);

        logger.info("page: {}", page.getContent());

        PaginationInfoResponse paginationResponse = convertToPaginationInfoResponse(page, pageReq);
        List<CustomerResponse> customerResponses = customerMapper.toCustomerResponseList(page.getContent(), addressMapper);
        CustomerFilterResponse filterResponse = customerMapper.toCustomerFilterResponse(param);

        // Build EmployeeListResponse
        return CustomerListResponse.builder()
                .customers(customerResponses)
                .pagination(paginationResponse)
                .filter(filterResponse)
                .build();
    }

    public String generateCustomerCode() {
        long count = customerRepository.count() + 1; // Tăng thêm 1 để lấy mã cho nhân viên mới
        if (count < 10) {
            return String.format("CUS-0%d", count);
        } else {
            return String.format("CUS-%d", count);
        }
    }
    private PaginationInfoResponse convertToPaginationInfoResponse(Page<KhachHang> page, PageReq pageReq) {
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

    /**
     * Kiểm tra trùng lặp thông tin khách hàng
     * @param request Thông tin cần kiểm tra
     * @return Kết quả kiểm tra trùng lặp
     */
    public CustomerDuplicateCheckResponse checkDuplicate(CustomerDuplicateCheckRequest request) {
        Integer id = request.getId();
        boolean emailDuplicate = (id == null)
            ? customerRepository.existsByEmail(request.getEmail())
            : customerRepository.existsByEmailAndIdNot(request.getEmail(), id);
        boolean phoneDuplicate = (id == null)
            ? customerRepository.existsBySdt(request.getSdt())
            : customerRepository.existsBySdtAndIdNot(request.getSdt(), id);
        
        // Tạo danh sách các trường bị trùng lặp
        List<String> duplicateFields = new ArrayList<>();
        if (emailDuplicate) duplicateFields.add("email");
        if (phoneDuplicate) duplicateFields.add("sdt");
        
        // Tạo thông báo lỗi
        String message = "";
        if (!duplicateFields.isEmpty()) {   
            if (duplicateFields.size() == 1) {  // Nếu có 1 trường bị trùng lặp thì:
                String field = duplicateFields.get(0);
                switch (field) {
                    case "email":
                        message = "Email đã tồn tại trong hệ thống";
                        break;
                    case "sdt":
                        message = "Số điện thoại đã tồn tại trong hệ thống";
                        break;
                }
            } else {    // Nếu có nhiều trường bị trùng lặp thì:
                message = "Các trường sau đã tồn tại trong hệ thống: " + String.join(", ", duplicateFields);
            }
        }
        
        // Tạo thông tin chi tiết
        CustomerDuplicateCheckResponse.DuplicateInfo duplicateInfo = CustomerDuplicateCheckResponse.DuplicateInfo.builder()
                .emailDuplicate(emailDuplicate)
                .phoneDuplicate(phoneDuplicate)
                .message(message)
                .build();
        
        // Trả về kết quả
        return CustomerDuplicateCheckResponse.builder()
                .hasDuplicate(!duplicateFields.isEmpty())
                .duplicateFields(duplicateFields)
                .duplicateInfo(duplicateInfo)
                .build();
    }
}
