package com.example.dependencyvisualizer.repository;

import com.example.dependencyvisualizer.model.Dependency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DependencyRepository extends JpaRepository<Dependency, Long> {
    
    // Find dependencies for all files in a specific project
    @Query("SELECT d FROM Dependency d WHERE d.sourceFile.project.id = :projectId OR d.targetFile.project.id = :projectId")
    List<Dependency> findByProjectId(@Param("projectId") Long projectId);
}
