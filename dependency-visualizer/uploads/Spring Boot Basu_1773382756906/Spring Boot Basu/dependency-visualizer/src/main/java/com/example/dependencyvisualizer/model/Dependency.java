package com.example.dependencyvisualizer.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "dependencies")
@Getter
@Setter
public class Dependency {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_file_id", nullable = false)
    private SourceFile sourceFile;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_file_id", nullable = false)
    private SourceFile targetFile;

    private String dependencyType; // e.g., "IMPORT"
}
