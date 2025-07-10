package com.example.datn.Controller;

import com.example.datn.Config.ResponseHelper;
import com.example.datn.DTO.ApiResponse;
import com.example.datn.DTO.ThongKeDTO;
import com.example.datn.DTO.ThongKeSPBanChayDTO;
import com.example.datn.Entity.ChiTietSanPham;
import com.example.datn.Service.ThongKeService;
import com.example.datn.VO.ThongKeVoSearch;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/thong_ke")
public class ThongKeController {
    @Autowired
    private ThongKeService thongKeService;

    @GetMapping("")
    public ResponseEntity<ApiResponse<Map<String, ThongKeDTO>>> getThongKe() {
       return ResponseHelper.success("", thongKeService.getThongKe());
    }

    @PostMapping("")
    public ResponseEntity<ApiResponse<Page<ThongKeSPBanChayDTO>>> addThongKe(
            @RequestBody ThongKeVoSearch thongKeVoSearch,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseHelper.success("", thongKeService.getThongKeSpBanChayByQuery(thongKeVoSearch, page, size));
    }
}
