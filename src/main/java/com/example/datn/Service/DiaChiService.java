package com.example.datn.Service;

import com.example.datn.DTO.address.AddressResponse;
import com.example.datn.Entity.DiaChi;
import com.example.datn.Entity.KhachHang;
import com.example.datn.Repository.DiaChiRepository;
import com.example.datn.Repository.KhachHangRepository;
import com.example.datn.VO.address.AddressCreateRequest;
import com.example.datn.VO.address.AddressUpdateRequest;
import com.example.datn.exception.AppException;
import com.example.datn.exception.ErrorCode;
import com.example.datn.mapper.address.AddressMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class DiaChiService {
    Logger logger = LoggerFactory.getLogger(DiaChiService.class);
    DiaChiRepository addressRepository;
    KhachHangRepository customerRepository;
    AddressMapper addressMapper;

    @Transactional
    public AddressResponse update(Integer customerId, AddressUpdateRequest addressUpdateRequest) {
        logger.debug("addressUpdateRequest: {}", addressUpdateRequest);
        
        // Kiểm tra khách hàng tồn tại
        KhachHang existingCustomer = customerRepository.findById(customerId)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        
        // Kiểm tra địa chỉ tồn tại và thuộc về khách hàng
        DiaChi existingAddress = addressRepository.findById(addressUpdateRequest.getId())
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        
        if (!existingAddress.getKhachHang().getId().equals(customerId)) {
            throw new AppException(ErrorCode.RESOURCE_NOT_FOUND);
        }

        // Nếu đang set làm mặc định, reset tất cả địa chỉ khác
        Optional.ofNullable(addressUpdateRequest.getTrangThai())
                .filter("DEFAULT"::equals)
                .ifPresent(s -> updateAllAddressStatusToNullByCustomerId(customerId));
        
        addressMapper.updateDiaChiFromAddressUpdateRequest(addressUpdateRequest, existingAddress);
        addressRepository.save(existingAddress);
        return addressMapper.toAddressResponse(existingAddress);
    }

    @Transactional
    public AddressResponse save(Integer customerId, AddressCreateRequest addressCreateRequest) {
        // Kiểm tra khách hàng tồn tại
        KhachHang existingCustomer = customerRepository.findById(customerId)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        
        // Kiểm tra số lượng địa chỉ tối đa (5 địa chỉ)
        List<DiaChi> existingAddresses = addressRepository.getDiaChiByKhachHang_Id(customerId);
        if (existingAddresses.size() >= 5) {
            throw new AppException(ErrorCode.VALIDATION_ERROR);
        }
        
        // Nếu đang set làm mặc định, reset tất cả địa chỉ khác
        Optional.ofNullable(addressCreateRequest.getTrangThai())
                .filter("DEFAULT"::equals)
                .ifPresent(s -> updateAllAddressStatusToNullByCustomerId(customerId));

        DiaChi address = addressMapper.toAddress(addressCreateRequest);
        address.setKhachHang(existingCustomer);
        addressRepository.save(address);
        return addressMapper.toAddressResponse(address);
    }

    public List<AddressResponse> getAddressesByCustomerId(Integer customerId) {
        KhachHang customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        List<DiaChi> addresses = customer.getDiaChis();
        return addressMapper.toAddressResponseList(addresses);
    }

    @Transactional
    public void delete( Integer addressId) {
        DiaChi address = addressRepository.findById(addressId)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
         addressRepository.delete(address);
    }

    @Transactional
    public AddressResponse setDefaultAddress(Integer customerId, Integer addressId) {
        DiaChi addressExists = addressRepository.findById(addressId)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        // Reset tất cả địa chỉ về null
        updateAllAddressStatusToNullByCustomerId(customerId);
        // Set địa chỉ được chọn làm mặc định
        addressExists.setTrangThai("DEFAULT");
        addressRepository.save(addressExists);
        return addressMapper.toAddressResponse(addressExists);
    }

    private void updateAllAddressStatusToNullByCustomerId(Integer customerId) {
        List<DiaChi> addresses = addressRepository.getDiaChiByKhachHang_Id(customerId);
        if (addresses != null && !addresses.isEmpty()) {
            addresses.forEach(address -> address.setTrangThai(null));
            addressRepository.saveAll(addresses);
        }
    }
}