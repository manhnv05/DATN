package com.example.datn.Service;

import com.example.datn.DTO.ChiTietSanPhamDTO;
import com.example.datn.Entity.ChiTietSanPham;
import com.example.datn.Repository.ChiTietSanPhamRepository;
import com.example.datn.VO.ChiTietSanPhamQueryVO;
import com.example.datn.VO.ChiTietSanPhamUpdateVO;
import com.example.datn.VO.ChiTietSanPhamVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
public class ChiTietSanPhamService {

    @Autowired
    private ChiTietSanPhamRepository chiTietSanPhamRepository;

    public Integer save(ChiTietSanPhamVO vO) {
        ChiTietSanPham bean = new ChiTietSanPham();
        BeanUtils.copyProperties(vO, bean);
        bean = chiTietSanPhamRepository.save(bean);
        return bean.getId();
    }

    public void delete(Integer id) {
        chiTietSanPhamRepository.deleteById(id);
    }

    public void update(Integer id, ChiTietSanPhamUpdateVO vO) {
        ChiTietSanPham bean = requireOne(id);
        BeanUtils.copyProperties(vO, bean);
        chiTietSanPhamRepository.save(bean);
    }

    public ChiTietSanPhamDTO getById(Integer id) {
        ChiTietSanPham original = requireOne(id);
        return toDTO(original);
    }

    public Page<ChiTietSanPhamDTO> query(ChiTietSanPhamQueryVO vO) {
        throw new UnsupportedOperationException();
    }

    private ChiTietSanPhamDTO toDTO(ChiTietSanPham original) {
        ChiTietSanPhamDTO bean = new ChiTietSanPhamDTO();
        BeanUtils.copyProperties(original, bean);
        return bean;
    }

    private ChiTietSanPham requireOne(Integer id) {
        return chiTietSanPhamRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Resource not found: " + id));
    }
}
