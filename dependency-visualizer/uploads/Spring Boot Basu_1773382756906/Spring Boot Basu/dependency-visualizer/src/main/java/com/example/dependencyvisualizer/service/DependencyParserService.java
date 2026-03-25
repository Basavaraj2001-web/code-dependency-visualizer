package com.example.dependencyvisualizer.service;

import com.example.dependencyvisualizer.model.Dependency;
import com.example.dependencyvisualizer.model.Project;
import com.example.dependencyvisualizer.model.SourceFile;
import com.example.dependencyvisualizer.repository.DependencyRepository;
import com.example.dependencyvisualizer.repository.FileRepository;
import com.example.dependencyvisualizer.util.DependencyParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DependencyParserService {

    @Autowired
    private FileRepository fileRepository;

    @Autowired
    private DependencyRepository dependencyRepository;

    @Autowired
    private DependencyParser dependencyParser;

    @Transactional
    public void parseAndSaveDependencies(Project project, List<String> javaFilePaths) {
        // First pass: create SourceFile entities and map them by fully qualified name
        Map<String, SourceFile> fileMap = new HashMap<>();
        Map<String, List<String>> fileImports = new HashMap<>();

        for (String filePath : javaFilePaths) {
            SourceFile sourceFile = new SourceFile();
            sourceFile.setProject(project);
            sourceFile.setFilePath(filePath);
            sourceFile.setFileName(new File(filePath).getName());
            
            fileRepository.save(sourceFile);

            DependencyParser.ParseResult result = dependencyParser.parse(filePath);
            String className = sourceFile.getFileName().replace(".java", "");
            String fqcn = result.packageName != null ? result.packageName + "." + className : className;
            
            fileMap.put(fqcn, sourceFile);
            fileImports.put(fqcn, result.imports);
        }

        // Second pass: resolve dependencies based on imports
        for (Map.Entry<String, List<String>> entry : fileImports.entrySet()) {
            String sourceFqcn = entry.getKey();
            SourceFile sourceEntity = fileMap.get(sourceFqcn);
            
            for (String importedClass : entry.getValue()) {
                // If there is a wildcard import like com.example.*, this simple matching might need enhancement
                // For exact class imports:
                if (fileMap.containsKey(importedClass)) {
                    SourceFile targetEntity = fileMap.get(importedClass);
                    
                    Dependency dependency = new Dependency();
                    dependency.setSourceFile(sourceEntity);
                    dependency.setTargetFile(targetEntity);
                    dependency.setDependencyType("IMPORT");
                    
                    dependencyRepository.save(dependency);
                } else {
                    // It can be a JDK import or a third party import. We could optionally track external dependencies.
                    // But here we focus on internal dependencies.
                    // We can also try simple name matching if they are in the same package, but the user requested regex for import statements.
                }
            }
            
            // Note: Same-package dependencies that don't require an 'import' statement won't be caught by exactly matching imports!
            // To capture them, we would need a full AST parser like JavaParser. However, based on the requirements: 
            // "detect dependencies between files by parsing import statements", this implements exactly what's requested.
        }
    }
}
