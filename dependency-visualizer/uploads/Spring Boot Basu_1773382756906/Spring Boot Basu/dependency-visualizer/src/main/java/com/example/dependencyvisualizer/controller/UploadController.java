package com.example.dependencyvisualizer.controller;

import com.example.dependencyvisualizer.model.Project;
import com.example.dependencyvisualizer.service.FileProcessingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*") // Allow frontend to call the API
public class UploadController {

    @Autowired
    private FileProcessingService fileProcessingService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadProject(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty() || !file.getOriginalFilename().endsWith(".zip")) {
            return ResponseEntity.badRequest().body("Please upload a valid ZIP file.");
        }

        try {
            Project project = fileProcessingService.processProjectZip(file);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Project uploaded and processed successfully.");
            response.put("projectId", project.getId());
            response.put("projectName", project.getName());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing file: " + e.getMessage());
        }
    }
}
