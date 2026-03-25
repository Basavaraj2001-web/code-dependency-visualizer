package com.example.dependencyvisualizer.util;

import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class DependencyParser {

    // Regex to match Java import statements: import com.example.MyClass;
    private static final Pattern IMPORT_PATTERN = Pattern.compile("^\\s*import\\s+([\\w.]+)\\s*;\\s*$");
    private static final Pattern PACKAGE_PATTERN = Pattern.compile("^\\s*package\\s+([\\w.]+)\\s*;\\s*$");

    /**
     * Parses a Java source file to extract its package and import dependencies.
     */
    public ParseResult parse(String filePath) {
        String packageName = null;
        List<String> imports = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(new FileReader(filePath))) {
            String line;
            while ((line = reader.readLine()) != null) {
                Matcher pkgMatcher = PACKAGE_PATTERN.matcher(line);
                if (pkgMatcher.matches() && packageName == null) {
                    packageName = pkgMatcher.group(1);
                }

                Matcher importMatcher = IMPORT_PATTERN.matcher(line);
                if (importMatcher.matches()) {
                    imports.add(importMatcher.group(1));
                }
            }
        } catch (IOException e) {
            System.err.println("Error reading file: " + filePath + " - " + e.getMessage());
        }

        return new ParseResult(packageName, imports);
    }

    public static class ParseResult {
        public final String packageName;
        public final List<String> imports;

        public ParseResult(String packageName, List<String> imports) {
            this.packageName = packageName;
            this.imports = imports;
        }
    }
}
