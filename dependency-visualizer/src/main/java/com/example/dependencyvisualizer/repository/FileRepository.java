package com.example.dependencyvisualizer.repository;

import com.example.dependencyvisualizer.model.SourceFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileRepository extends JpaRepository<SourceFile, Long> {
    List<SourceFile> findByProjectId(Long projectId);

    @jakarta.transaction.Transactional
    void deleteByProjectId(Long projectId);
}
