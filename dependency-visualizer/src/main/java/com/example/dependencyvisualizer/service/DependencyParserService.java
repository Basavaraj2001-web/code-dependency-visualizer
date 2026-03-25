package com.example.dependencyvisualizer.service;

import com.example.dependencyvisualizer.model.Dependency;
import com.example.dependencyvisualizer.model.Project;
import com.example.dependencyvisualizer.model.SourceFile;
import com.example.dependencyvisualizer.repository.DependencyRepository;
import com.example.dependencyvisualizer.repository.FileRepository;
import com.example.dependencyvisualizer.util.DependencyParser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class DependencyParserService {

    private final FileRepository fileRepository;
    private final DependencyRepository dependencyRepository;
    private final DependencyParser dependencyParser;

    @Transactional
    public void parseAndSaveDependencies(Project project, List<String> sourceFilePaths) {
        log.info("Starting dependency parsing for project: {}", project.getName());
        // First pass: create SourceFile entities and build mappings
        Map<String, SourceFile> javaFileMap = new HashMap<>(); // Maps FQCN -> SourceFile
        Map<String, SourceFile> jsFileMap = new HashMap<>();   // Maps JS fileName -> SourceFile
        
        Map<SourceFile, List<String>> fileToImports = new HashMap<>();

        for (String filePath : sourceFilePaths) {
            SourceFile sourceFile = new SourceFile();
            sourceFile.setProject(project);
            sourceFile.setFilePath(filePath);
            sourceFile.setFileName(new File(filePath).getName());
            
            fileRepository.save(sourceFile);

            String fileNameStr = sourceFile.getFileName();
            DependencyParser.ParseResult result = dependencyParser.parse(filePath, fileNameStr);
            
            if (fileNameStr.toLowerCase().endsWith(".java")) {
                String className = fileNameStr.replace(".java", "");
                String fqcn = result.packageName != null ? result.packageName + "." + className : className;
                javaFileMap.put(fqcn, sourceFile);
            } else {
                // JS/TS: we store mapping by just the filename without extension to match easy local imports
                String baseJsName = fileNameStr.replaceAll("\\.(js|jsx|ts|tsx)$", "");
                jsFileMap.put(baseJsName, sourceFile);
            }
            
            fileToImports.put(sourceFile, result.imports);
        }

        // Second pass: resolve dependencies
        for (Map.Entry<SourceFile, List<String>> entry : fileToImports.entrySet()) {
            SourceFile sourceEntity = entry.getKey();
            String sourceName = sourceEntity.getFileName().toLowerCase();
            boolean isJava = sourceName.endsWith(".java");
            
            for (String importStatement : entry.getValue()) {
                SourceFile targetEntity = null;
                
                if (isJava) {
                    targetEntity = javaFileMap.get(importStatement);
                } else {
                    // For JS, imports might be like './Component', '../utils/helper', 'react'
                    // We extract the last part of the path to try matching the filename
                    String[] parts = importStatement.split("/");
                    String finalPart = parts[parts.length - 1]; // e.g. "helper"
                    targetEntity = jsFileMap.get(finalPart);
                }
                
                if (targetEntity != null) {
                    Dependency dependency = new Dependency();
                    dependency.setSourceFile(sourceEntity);
                    dependency.setTargetFile(targetEntity);
                    dependency.setDependencyType("IMPORT");
                    
                    dependencyRepository.save(dependency);
                }
            }
        }
        log.info("Finished dependency parsing for project: {}", project.getName());
    }
}
