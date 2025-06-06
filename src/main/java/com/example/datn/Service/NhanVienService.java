package com.example.datn.Service;

import com.example.datn.DTO.NhanVienDTO;
import com.example.datn.Entity.NhanVien;
import com.example.datn.Repository.NhanVienRepository;
import com.example.datn.VO.NhanVienQueryVO;
import com.example.datn.VO.NhanVienUpdateVO;
import com.example.datn.VO.NhanVienVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
public class NhanVienService {

    @Autowired
    private NhanVienRepository nhanVienRepository;

    public Integer save(NhanVienVO vO) {
        NhanVien bean = new NhanVien();
        BeanUtils.copyProperties(vO, bean);
        bean = nhanVienRepository.save(bean);
        return bean.getId();
    }

    public void delete(Integer id) {
        nhanVienRepository.deleteById(id);
    }

    public void update(Integer id, NhanVienUpdateVO vO) {
        NhanVien bean = requireOne(id);
        BeanUtils.copyProperties(vO, bean);
        nhanVienRepository.save(bean);
    }

    public NhanVienDTO getById(Integer id) {
        NhanVien original = requireOne(id);
        return toDTO(original);
    }

    public Page<NhanVienDTO> query(NhanVienQueryVO vO) {
        throw new UnsupportedOperationException();
    }

    private NhanVienDTO toDTO(NhanVien original) {
        NhanVienDTO bean = new NhanVienDTO();
        BeanUtils.copyProperties(original, bean);
        return bean;
    }

    private NhanVien requireOne(Integer id) {
        return nhanVienRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Resource not found: " + id));
    }
}
