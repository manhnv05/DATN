package com.example.datn.VO;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CapNhatSanPhamChiTietDonHangVO {
    // Đây là ID của chi_tiet_san_pham (id_san_pham_chi_tiet)
    private Integer id;

    // Số lượng mong muốn của sản phẩm chi tiết này trong giỏ hàng
    private Integer soLuong;

}
