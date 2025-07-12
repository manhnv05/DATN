//package com.example.datn.Controller;
//
//import com.example.datn.Service.TextractService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/cccd")
//public class TextractController {
//
//    @Autowired
//    private TextractService textractService;
//
//    @PostMapping("/upload")
//    public ResponseEntity<List<String>> uploadCCCD(@RequestParam("file") MultipartFile file) throws IOException {
//        byte[] imageBytes = file.getBytes();
//        List<String> result = textractService.extractTextFromImage(imageBytes);
//        return ResponseEntity.ok(result);
//    }
//}