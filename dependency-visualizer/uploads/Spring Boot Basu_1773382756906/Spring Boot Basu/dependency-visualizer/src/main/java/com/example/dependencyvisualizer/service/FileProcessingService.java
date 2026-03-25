package com.example.dependencyvisualizer.service;

import com.example.dependencyvisualizer.model.Project;
import com.example.dependencyvisualizer.repository.ProjectRepository;
import com.example.dependencyvisualizer.util.ZipExtractor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FileProcessingService {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ZipExtractor zipExtractor;

    @Autowired
    private DependencyParserService dependencyParserService;

    @Transactional
    public Project processProjectZip(MultipartFile file) throws IOException {
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

        // 3. Identify source files (focus on .java files)
        List<String> javaFiles = extractedFiles.stream()
                .filter(path -> path.endsWith(".java"))
                .collect(Collectors.toList());

        // 4. Call DependencyParserService
        dependencyParserService.parseAndSaveDependencies(project, javaFiles);

        return project;
    }
}
