package com.example.dependencyvisualizer.controller;

import com.example.dependencyvisualizer.dto.response.ApiResponse;
import com.example.dependencyvisualizer.service.CircularDependencyService;
import com.example.dependencyvisualizer.service.GraphService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/projects/{id}")
@RequiredArgsConstructor
public class DependencyController {

    private final GraphService graphService;
    private final CircularDependencyService circularDependencyService;

    @GetMapping("/dependencies")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDependencies(@PathVariable("id") Long id) {
        return ResponseEntity.ok(ApiResponse.success("Fetched dependencies", graphService.getProjectGraph(id)));
    }

    @GetMapping("/graph")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getGraph(@PathVariable("id") Long id) {
        // graph and dependencies essentially return the same structural info for rendering
        return ResponseEntity.ok(ApiResponse.success("Fetched graph", graphService.getProjectGraph(id)));
    }

    @GetMapping("/cycles")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCycles(@PathVariable("id") Long id) {
        return ResponseEntity.ok(ApiResponse.success("Fetched cycles", circularDependencyService.detectCycles(id)));
    }
}
