package com.example.datn.service;

import com.example.datn.dto.ChiTietSanPhamDTO;
import com.example.datn.entity.ChatLieu;
import com.example.datn.entity.ChiTietSanPham;
import com.example.datn.entity.ThuongHieu;
import com.example.datn.repository.*;
import com.example.datn.vo.chiTietSanPhamVO.ChiTietSanPhamQueryVO;
import com.example.datn.vo.chiTietSanPhamVO.ChiTietSanPhamUpdateVO;
import com.example.datn.vo.chiTietSanPhamVO.ChiTietSanPhamVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import jakarta.validation.Valid;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@Validated
public class ChiTietSanPhamService {

    @Autowired
    private ChiTietSanPhamRepository chiTietSanPhamRepository;

    @Autowired
    private SanPhamRepository sanPhamRepository;
    @Autowired
    private ChatLieuRepository chatLieuRepository;
    @Autowired
    private ThuongHieuRepository thuongHieuRepository;
    @Autowired
    private MauSacRepository mauSacRepository;
    @Autowired
    private KichThuocRepository kichThuocRepository;
    @Autowired
    private CoAoRepository coAoRepository;
    @Autowired
    private TayAoRepository tayAoRepository;

    public Integer save(@Valid ChiTietSanPhamVO vO) {
        ChiTietSanPham bean = new ChiTietSanPham();
        BeanUtils.copyProperties(vO, bean);

        if (vO.getIdSanPham() != null)
            bean.setSanPham(sanPhamRepository.findById(vO.getIdSanPham()).orElse(null));
        if (vO.getIdChatLieu() != null) {
            ChatLieu chatLieu = chatLieuRepository.findById(vO.getIdChatLieu()).orElse(null);
            bean.setChatLieu(chatLieu);
        }
        if (vO.getIdThuongHieu() != null) {
            ThuongHieu thuongHieu = thuongHieuRepository.findById(vO.getIdThuongHieu()).orElse(null);
            bean.setThuongHieu(thuongHieu);
        }
        if (vO.getIdMauSac() != null)
            bean.setMauSac(mauSacRepository.findById(vO.getIdMauSac()).orElse(null));
        if (vO.getIdKichThuoc() != null)
            bean.setKichThuoc(kichThuocRepository.findById(vO.getIdKichThuoc()).orElse(null));
        if (vO.getIdCoAo() != null)
            bean.setCoAo(coAoRepository.findById(vO.getIdCoAo()).orElse(null));
        if (vO.getIdTayAo() != null)
            bean.setTayAo(tayAoRepository.findById(vO.getIdTayAo()).orElse(null));

        bean = chiTietSanPhamRepository.save(bean);
        return bean.getId();
    }

    public void delete(Integer id) {
        chiTietSanPhamRepository.deleteById(id);
    }

    public void update(Integer id, @Valid ChiTietSanPhamUpdateVO vO) {
        ChiTietSanPham bean = requireOne(id);
        BeanUtils.copyProperties(vO, bean);

        if (vO.getIdSanPham() != null)
            bean.setSanPham(sanPhamRepository.findById(vO.getIdSanPham()).orElse(null));
        if (vO.getIdChatLieu() != null) {
            ChatLieu chatLieu = chatLieuRepository.findById(vO.getIdChatLieu()).orElse(null);
            bean.setChatLieu(chatLieu);
        }
        if (vO.getIdThuongHieu() != null) {
            ThuongHieu thuongHieu = thuongHieuRepository.findById(vO.getIdThuongHieu()).orElse(null);
            bean.setThuongHieu(thuongHieu);
        }
        if (vO.getIdMauSac() != null)
            bean.setMauSac(mauSacRepository.findById(vO.getIdMauSac()).orElse(null));
        if (vO.getIdKichThuoc() != null)
            bean.setKichThuoc(kichThuocRepository.findById(vO.getIdKichThuoc()).orElse(null));
        if (vO.getIdCoAo() != null)
            bean.setCoAo(coAoRepository.findById(vO.getIdCoAo()).orElse(null));
        if (vO.getIdTayAo() != null)
            bean.setTayAo(tayAoRepository.findById(vO.getIdTayAo()).orElse(null));

        chiTietSanPhamRepository.save(bean);
    }

    public ChiTietSanPhamDTO getById(Integer id) {
        ChiTietSanPham original = requireOne(id);
        return toDTO(original);
    }

    public Page<ChiTietSanPhamDTO> query(ChiTietSanPhamQueryVO vO) {
        throw new UnsupportedOperationException();
    }

    public List<ChiTietSanPhamDTO> searchByMaOrMoTa(String keyword) {
        List<ChiTietSanPham> list = chiTietSanPhamRepository
                .findByMaSanPhamChiTietContainingIgnoreCaseOrMoTaContainingIgnoreCase(keyword, keyword);
        return list.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<ChiTietSanPhamDTO> findBySanPhamId(Integer idSanPham) {
        List<ChiTietSanPham> list = chiTietSanPhamRepository.findBySanPhamId(idSanPham);
        return list.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public ChiTietSanPhamDTO findByMaSanPhamChiTiet(String maSanPhamChiTiet) {
        ChiTietSanPham entity = chiTietSanPhamRepository.findByMaSanPhamChiTiet(maSanPhamChiTiet);
        if (entity == null) {
            throw new NoSuchElementException("Không tìm thấy mã sản phẩm chi tiết: " + maSanPhamChiTiet);
        }
        return toDTO(entity);
    }

    public List<String> getAllMaChiTietSanPham() {
        return chiTietSanPhamRepository.findAllMaChiTietSanPham();
    }

    private ChiTietSanPhamDTO toDTO(ChiTietSanPham original) {
        ChiTietSanPhamDTO bean = new ChiTietSanPhamDTO();
        BeanUtils.copyProperties(original, bean);

        if (original.getSanPham() != null) {
            bean.setIdSanPham(original.getSanPham().getId());
            bean.setTenSanPham(original.getSanPham().getTenSanPham());
        }
        if (original.getChatLieu() != null) {
            bean.setIdChatLieu(original.getChatLieu().getId());
            bean.setTenChatLieu(original.getChatLieu().getTenChatLieu());
        }
        if (original.getThuongHieu() != null) {
            bean.setIdThuongHieu(original.getThuongHieu().getId());
            bean.setTenThuongHieu(original.getThuongHieu().getTenThuongHieu());
        }
        if (original.getMauSac() != null) {
            bean.setIdMauSac(original.getMauSac().getId());
            bean.setTenMauSac(original.getMauSac().getTenMauSac());
        }
        if (original.getKichThuoc() != null) {
            bean.setIdKichThuoc(original.getKichThuoc().getId());
            bean.setTenKichThuoc(original.getKichThuoc().getTenKichCo());
        }
        if (original.getCoAo() != null) {
            bean.setIdCoAo(original.getCoAo().getId());
            bean.setTenCoAo(original.getCoAo().getTenCoAo());
        }
        if (original.getTayAo() != null) {
            bean.setIdTayAo(original.getTayAo().getId());
            bean.setTenTayAo(original.getTayAo().getTenTayAo());
        }
        return bean;
    }

    private ChiTietSanPham requireOne(Integer id) {
        return chiTietSanPhamRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Resource not found: " + id));
    }
}