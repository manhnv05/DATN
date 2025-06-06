package com.example.datn.Service;

import com.example.datn.DTO.XuatXuDTO;
import com.example.datn.Entity.XuatXu;
import com.example.datn.Repository.XuatXuRepository;
import com.example.datn.VO.XuatXuQueryVO;
import com.example.datn.VO.XuatXuUpdateVO;
import com.example.datn.VO.XuatXuVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
public class XuatXuService {

    @Autowired
    private XuatXuRepository xuatXuRepository;

    public Integer save(XuatXuVO vO) {
        XuatXu bean = new XuatXu();
        BeanUtils.copyProperties(vO, bean);
        bean = xuatXuRepository.save(bean);
        return bean.getId();
    }

    public void delete(Integer id) {
        xuatXuRepository.deleteById(id);
    }

    public void update(Integer id, XuatXuUpdateVO vO) {
        XuatXu bean = requireOne(id);
        BeanUtils.copyProperties(vO, bean);
        xuatXuRepository.save(bean);
    }

    public XuatXuDTO getById(Integer id) {
        XuatXu original = requireOne(id);
        return toDTO(original);
    }

    public Page<XuatXuDTO> query(XuatXuQueryVO vO) {
        throw new UnsupportedOperationException();
    }

    private XuatXuDTO toDTO(XuatXu original) {
        XuatXuDTO bean = new XuatXuDTO();
        BeanUtils.copyProperties(original, bean);
        return bean;
    }

    private XuatXu requireOne(Integer id) {
        return xuatXuRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Resource not found: " + id));
    }
}
