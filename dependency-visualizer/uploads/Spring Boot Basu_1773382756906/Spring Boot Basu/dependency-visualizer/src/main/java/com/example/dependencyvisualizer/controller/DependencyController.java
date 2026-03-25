package com.example.dependencyvisualizer.controller;

import com.example.dependencyvisualizer.service.CircularDependencyService;
import com.example.dependencyvisualizer.service.GraphService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/projects/{id}")
@CrossOrigin(origins = "*") // Allow frontend to call the API
public class DependencyController {

    @Autowired
    private GraphService graphService;

    @Autowired
    private CircularDependencyService circularDependencyService;

    @GetMapping("/dependencies")
    public ResponseEntity<Map<String, Object>> getDependencies(@PathVariable("id") Long id) {
        return ResponseEntity.ok(graphService.getProjectGraph(id));
    }

    @GetMapping("/graph")
    public ResponseEntity<Map<String, Object>> getGraph(@PathVariable("id") Long id) {
        // graph and dependencies essentially return the same structural info for rendering
        return ResponseEntity.ok(graphService.getProjectGraph(id));
    }

    @GetMapping("/cycles")
    public ResponseEntity<Map<String, Object>> getCycles(@PathVariable("id") Long id) {
        return ResponseEntity.ok(circularDependencyService.detectCycles(id));
    }
}
