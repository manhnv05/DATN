package com.example.datn.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.textract.TextractClient;
import software.amazon.awssdk.services.textract.model.*;
import software.amazon.awssdk.core.SdkBytes;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class TextractService {

    @Autowired
    private TextractClient textractClient;

    public List<String> extractTextFromImage(byte[] imageBytes) throws IOException {
        Document document = Document.builder()
                .bytes(SdkBytes.fromByteArray(imageBytes))
                .build();

        DetectDocumentTextRequest request = DetectDocumentTextRequest.builder()
                .document(document)
                .build();

        DetectDocumentTextResponse response = textractClient.detectDocumentText(request);

        List<String> results = new ArrayList<>();
        for (Block block : response.blocks()) {
            if ("LINE".equals(block.blockTypeAsString())) {
                results.add(block.text());
            }
        }
        return results;
    }
}