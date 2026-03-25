package com.example.dependencyvisualizer.service;

import com.example.dependencyvisualizer.model.Dependency;
import com.example.dependencyvisualizer.model.SourceFile;
import com.example.dependencyvisualizer.repository.DependencyRepository;
import com.example.dependencyvisualizer.repository.FileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class GraphService {

    @Autowired
    private FileRepository fileRepository;

    @Autowired
    private DependencyRepository dependencyRepository;

    public Map<String, Object> getProjectGraph(Long projectId) {
        List<SourceFile> files = fileRepository.findByProjectId(projectId);
        List<Dependency> dependencies = dependencyRepository.findByProjectId(projectId);

        List<String> nodes = files.stream()
                .map(SourceFile::getFileName)
                .collect(Collectors.toList());

        List<Map<String, String>> edges = new ArrayList<>();
        for (Dependency dep : dependencies) {
            Map<String, String> edge = new HashMap<>();
            edge.put("source", dep.getSourceFile().getFileName());
            edge.put("target", dep.getTargetFile().getFileName());
            edges.add(edge);
        }

        Map<String, Object> graph = new HashMap<>();
        graph.put("nodes", nodes);
        graph.put("edges", edges);

        return graph;
    }
}
