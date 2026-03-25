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
    @Query("SELECT d FROM Dependency d WHERE d.sourceFile.id IN (SELECT s.id FROM SourceFile s WHERE s.project.id = :projectId) OR d.targetFile.id IN (SELECT s.id FROM SourceFile s WHERE s.project.id = :projectId)")
    List<Dependency> findByProjectId(@Param("projectId") Long projectId);

    @jakarta.transaction.Transactional
    @org.springframework.data.jpa.repository.Modifying
    @Query("DELETE FROM Dependency d WHERE d.sourceFile.id IN (SELECT s.id FROM SourceFile s WHERE s.project.id = :projectId) OR d.targetFile.id IN (SELECT s.id FROM SourceFile s WHERE s.project.id = :projectId)")
    void deleteByProjectId(@Param("projectId") Long projectId);
}
