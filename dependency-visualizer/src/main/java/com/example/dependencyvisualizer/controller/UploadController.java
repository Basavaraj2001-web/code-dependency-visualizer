package com.example.dependencyvisualizer.controller;

import com.example.dependencyvisualizer.dto.response.ApiResponse;
import com.example.dependencyvisualizer.model.Project;
import com.example.dependencyvisualizer.service.FileProcessingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class UploadController {

    private final FileProcessingService fileProcessingService;

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<Map<String, Object>>> uploadProject(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty() || file.getOriginalFilename() == null || !file.getOriginalFilename().endsWith(".zip")) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Please upload a valid ZIP file."));
        }

        try {
            Project project = fileProcessingService.processProjectZip(file);
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("projectId", project.getId());
            responseData.put("projectName", project.getName());
            
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Project uploaded and processed successfully.", responseData));
        } catch (Exception e) {
            log.error("Error processing file", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error processing file: " + e.getMessage()));
        }
    }
}
