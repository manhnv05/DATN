package com.example.datn.vo.phieuGiamGiaVO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SendMailRequestData {
    PhieuGiamGiaVO phieuGiamGiaVO;

    List<String> emails;
}
