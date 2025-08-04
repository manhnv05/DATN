package com.example.datn.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
@RequestMapping("/xuatXu")
public class XuatXuController {

    @GetMapping("/quocGia")
    public List<String> getAllCountryNames() {
        String url = "https://api.first.org/data/v1/countries";
        RestTemplate restTemplate = new RestTemplate();
        List<String> result = new ArrayList<>();
        try {
            Map response = restTemplate.getForObject(url, Map.class);
            if (response != null && response.containsKey("data")) {
                Map<String, Map> data = (Map<String, Map>) response.get("data");
                for (Map.Entry<String, Map> entry : data.entrySet()) {
                    Object countryName = entry.getValue().get("country");
                    if (countryName != null) {
                        result.add(countryName.toString());
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        Collections.sort(result);
        return result;
    }
}