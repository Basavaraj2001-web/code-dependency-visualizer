package com.example.dependencyvisualizer.service;

import com.example.dependencyvisualizer.model.Dependency;
import com.example.dependencyvisualizer.repository.DependencyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class CircularDependencyService {

    private final DependencyRepository dependencyRepository;

    public Map<String, Object> detectCycles(Long projectId) {
        log.info("Detecting circular dependencies for project layout: {}", projectId);
        List<Dependency> dependencies = dependencyRepository.findByProjectId(projectId);
        
        // Build adjacency list
        Map<String, List<String>> graph = new HashMap<>();
        for (Dependency dep : dependencies) {
            String source = dep.getSourceFile().getFileName();
            String target = dep.getTargetFile().getFileName();
            
            graph.putIfAbsent(source, new ArrayList<>());
            graph.get(source).add(target);
            graph.putIfAbsent(target, new ArrayList<>()); // ensure nodes with no outgoing edges exist
        }

        List<List<String>> cycles = new ArrayList<>();
        Map<String, Integer> state = new HashMap<>(); // 0: unvisited, 1: visiting, 2: visited
        Map<String, String> parent = new HashMap<>();
        
        for (String node : graph.keySet()) {
            state.put(node, 0);
        }

        for (String node : graph.keySet()) {
            if (state.get(node) == 0) {
                dfs(node, graph, state, parent, cycles);
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("cycles", cycles);
        log.info("Finished detecting circular dependencies, found {} cycles.", cycles.size());
        return result;
    }

    private void dfs(String node, Map<String, List<String>> graph, 
                     Map<String, Integer> state, Map<String, String> parent, 
                     List<List<String>> cycles) {
        state.put(node, 1); // Mark as visiting

        for (String neighbor : graph.get(node)) {
            if (state.get(neighbor) == 0) {
                parent.put(neighbor, node);
                dfs(neighbor, graph, state, parent, cycles);
            } else if (state.get(neighbor) == 1) {
                // Cycle detected
                List<String> cycle = new ArrayList<>();
                String curr = node;
                cycle.add(neighbor);
                while (!curr.equals(neighbor)) {
                    cycle.add(curr);
                    curr = parent.get(curr);
                }
                cycle.add(neighbor);
                Collections.reverse(cycle); // Start from the beginning of the cycle
                cycles.add(cycle);
            }
        }

        state.put(node, 2); // Mark as visited
    }
}
