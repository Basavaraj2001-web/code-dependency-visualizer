package com.example.dependencyvisualizer.controller;

import com.example.dependencyvisualizer.dto.response.ApiResponse;
import com.example.dependencyvisualizer.exception.ResourceNotFoundException;
import com.example.dependencyvisualizer.model.Project;
import com.example.dependencyvisualizer.repository.DependencyRepository;
import com.example.dependencyvisualizer.repository.FileRepository;
import com.example.dependencyvisualizer.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectRepository projectRepository;
    private final FileRepository fileRepository;
    private final DependencyRepository dependencyRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Project>>> getAllProjects() {
        return ResponseEntity.ok(ApiResponse.success("Fetched all projects", projectRepository.findAll()));
    }

    @GetMapping("/{id}/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProjectStats(@PathVariable("id") Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        
        long fileCount = fileRepository.findByProjectId(id).size();
        long depCount = dependencyRepository.findByProjectId(id).size();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("id", project.getId());
        stats.put("name", project.getName());
        stats.put("uploadDate", project.getUploadDate());
        stats.put("totalFiles", fileCount);
        stats.put("totalDependencies", depCount);
        
        return ResponseEntity.ok(ApiResponse.success("Fetched project stats", stats));
    }

    @DeleteMapping("/{id}")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<ApiResponse<Void>> deleteProject(@PathVariable("id") Long id) {
        if (!projectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Project not found with id: " + id);
        }
        
        // Delete dependencies first (foreign key constraints)
        dependencyRepository.deleteByProjectId(id);
        
        // Delete source files
        fileRepository.deleteByProjectId(id);
        
        // Delete project
        projectRepository.deleteById(id);
        
        return ResponseEntity.ok(ApiResponse.success("Project deleted successfully", null));
    }
}
