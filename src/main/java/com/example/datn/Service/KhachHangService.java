package com.example.datn.Service;

import com.example.datn.DTO.KhachHangDTO;
import com.example.datn.Entity.KhachHang;
import com.example.datn.Repository.KhachHangRepository;
import com.example.datn.VO.KhachHangQueryVO;
import com.example.datn.VO.KhachHangUpdateVO;
import com.example.datn.VO.KhachHangVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
public class KhachHangService {

    @Autowired
    private KhachHangRepository khachHangRepository;

    public Integer save(KhachHangVO vO) {
        KhachHang bean = new KhachHang();
        BeanUtils.copyProperties(vO, bean);
        bean = khachHangRepository.save(bean);
        return bean.getId();
    }

    public void delete(Integer id) {
        khachHangRepository.deleteById(id);
    }

    public void update(Integer id, KhachHangUpdateVO vO) {
        KhachHang bean = requireOne(id);
        BeanUtils.copyProperties(vO, bean);
        khachHangRepository.save(bean);
    }

    public KhachHangDTO getById(Integer id) {
        KhachHang original = requireOne(id);
        return toDTO(original);
    }

    public Page<KhachHangDTO> query(KhachHangQueryVO vO) {
        throw new UnsupportedOperationException();
    }

    private KhachHangDTO toDTO(KhachHang original) {
        KhachHangDTO bean = new KhachHangDTO();
        BeanUtils.copyProperties(original, bean);
        return bean;
    }

    private KhachHang requireOne(Integer id) {
        return khachHangRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Resource not found: " + id));
    }
}
