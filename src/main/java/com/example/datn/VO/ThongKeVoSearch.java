package com.example.datn.VO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ThongKeVoSearch {
    private int boLocNgayTuanThangNam;

    private LocalDateTime tuNgay;

    private LocalDateTime denNgay;
}
