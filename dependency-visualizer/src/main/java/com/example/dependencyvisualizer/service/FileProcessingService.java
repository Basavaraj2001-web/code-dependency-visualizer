package com.example.dependencyvisualizer.service;

import com.example.dependencyvisualizer.model.Project;
import com.example.dependencyvisualizer.repository.ProjectRepository;
import com.example.dependencyvisualizer.util.ZipExtractor;
import com.example.dependencyvisualizer.exception.FileProcessingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileProcessingService {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    private final ProjectRepository projectRepository;
    private final ZipExtractor zipExtractor;
    private final DependencyParserService dependencyParserService;

    @PostConstruct
    public void init() {
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
            log.info("Created upload directory: {}", dir.getAbsolutePath());
        }
    }

    @Transactional
    public Project processProjectZip(MultipartFile file) {
        log.info("Processing project zip file");
        try {
            String projectName = file.getOriginalFilename() != null ? file.getOriginalFilename().replaceAll("\\.zip$", "") : "Project_" + System.currentTimeMillis();
            
            // 1. Save project metadata
            Project project = new Project();
            project.setName(projectName);
            project.setUploadDate(LocalDateTime.now());
            
            File projectDir = new File(uploadDir, projectName + "_" + System.currentTimeMillis());
            if (!projectDir.exists()) {
                projectDir.mkdirs();
            }
            
            project.setZipPath(projectDir.getAbsolutePath());
            project = projectRepository.save(project);

            // 2. Extract ZIP file
            List<String> extractedFiles = zipExtractor.extract(file.getInputStream(), projectDir.getAbsolutePath());

            // 3. Identify source files (Java and React JS/TS)
            List<String> sourceFiles = extractedFiles.stream()
                    .filter(path -> {
                        String lower = path.toLowerCase();
                        return lower.endsWith(".java") || 
                               lower.endsWith(".js") || 
                               lower.endsWith(".jsx") || 
                               lower.endsWith(".ts") || 
                               lower.endsWith(".tsx");
                    })
                    .collect(Collectors.toList());

            // 4. Call DependencyParserService
            dependencyParserService.parseAndSaveDependencies(project, sourceFiles);

            log.info("Successfully processed project zip file into {} source files", sourceFiles.size());
            return project;
        } catch (IOException e) {
            log.error("Failed to process ZIP file", e);
            throw new FileProcessingException("Failed to extract and process the uploaded zip file", e);
        }
    }
}
