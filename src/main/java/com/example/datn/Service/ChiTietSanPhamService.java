package com.example.datn.Service;

import com.example.datn.DTO.ChiTietSanPhamDTO;
import com.example.datn.DTO.ChiTietSanPhamDotGIamGIaDTO;
import com.example.datn.Entity.ChatLieu;
import com.example.datn.Entity.ChiTietSanPham;
import com.example.datn.Entity.DotGiamGia;
import com.example.datn.Entity.ThuongHieu;
import com.example.datn.Repository.*;
import com.example.datn.VO.ChiTietSanPhamBanHangTaiQuayVO;
import com.example.datn.VO.ChiTietSanPhamQueryVO;
import com.example.datn.VO.ChiTietSanPhamUpdateVO;
import com.example.datn.VO.ChiTietSanPhamVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import jakarta.validation.Valid;

import java.math.BigDecimal;
import java.util.*;
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

    @Autowired
    private ChiTietDotGiamGiaRepository chiTietDotGiamGiaRepository;

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

    public List<ChiTietSanPhamDotGIamGIaDTO> getChiTietSanPhamCoDGG() {
        List<ChiTietSanPham> chiTietSanPhamList = chiTietSanPhamRepository.getChiTietSanPhamTrangThai();
        List<ChiTietSanPhamDotGIamGIaDTO> chiTietSanPhamDotGIamGIaDTOS = new ArrayList<>();

        for (ChiTietSanPham c : chiTietSanPhamList) {
            ChiTietSanPhamDotGIamGIaDTO ctsp = new ChiTietSanPhamDotGIamGIaDTO();

            // BƯỚC 1: Lấy về danh sách đối tượng DotGiamGia, không phải List<Integer>
            // (Giả sử bạn đã đổi tên phương thức repository cho rõ nghĩa)
            List<DotGiamGia> activeDiscounts = chiTietDotGiamGiaRepository.getDotGiamGiaByIdChiTietSanPham(c.getId());

            // BƯỚC 2: Dùng Stream để tìm đợt giảm giá tốt nhất (có phanTramGiam cao nhất)
            Optional<DotGiamGia> bestDiscountOptional = activeDiscounts.stream()
                    .max(Comparator.comparing(DotGiamGia::getPhanTramGiamGia));

            int pggLonNhat = 0;
            Integer idDGG = null; // Dùng Integer để có thể là null

            // BƯỚC 3: Nếu tìm thấy đợt giảm giá, lấy thông tin từ đó
            if (bestDiscountOptional.isPresent()) {
                DotGiamGia bestDiscount = bestDiscountOptional.get();
                pggLonNhat = bestDiscount.getPhanTramGiamGia();
                idDGG = bestDiscount.getId(); // Lấy ID ở đây!
            }

            // BƯỚC 4: Set giá trị cho DTO
            ctsp.setIdDotGiamGia(idDGG); // <-- SET ID ĐỢT GIẢM GIÁ
            ctsp.setIdChiTietSanPham(c.getId());
            ctsp.setTenSanPham(c.getSanPham().getTenSanPham());
            ctsp.setMaSanPham(c.getMaSanPhamChiTiet());
            ctsp.setThuongHieu(c.getThuongHieu().getTenThuongHieu());
            ctsp.setSoLuongTonKho(c.getSoLuong());
            ctsp.setChatLieu(c.getChatLieu().getTenChatLieu());
            ctsp.setMauSac(c.getMauSac().getTenMauSac());
            ctsp.setKichThuoc(c.getKichThuoc().getTenKichCo());
            ctsp.setCoAo(c.getCoAo().getTenCoAo());
            ctsp.setTayAo(c.getTayAo().getTenTayAo());
            ctsp.setGia(c.getGia());
            ctsp.setPhanTramGiam(pggLonNhat);

            // Tính giá sau khi giảm
            BigDecimal originalPrice = BigDecimal.valueOf(c.getGia());
            BigDecimal discountAmount = originalPrice.multiply(BigDecimal.valueOf(pggLonNhat)).divide(BigDecimal.valueOf(100));
            ctsp.setGiaTienSauKhiGiam(originalPrice.subtract(discountAmount).intValue());


            chiTietSanPhamDotGIamGIaDTOS.add(ctsp);
        }

        return chiTietSanPhamDotGIamGIaDTOS;
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
    public List<ChiTietSanPhamBanHangTaiQuayVO>  getChiTietSanPhamBanHangTaiQuay() {
        List<ChiTietSanPhamBanHangTaiQuayVO> list = chiTietSanPhamRepository.findChiTietSanPhamBanHangTaiQuay();
        if (list.isEmpty()) {
            throw new NoSuchElementException("Không tìm thấy chi tiết sản phẩm bán hàng tại quầy");
        }
        return list;
    }
    }